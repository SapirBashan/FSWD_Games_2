// --------------------------- configuration and utils ------------------------------
// Extend the base functionality of JavaScript
Array.prototype.last = function () {
    return this[this.length - 1];
};

// A sinus function that acceps degrees instead of radians
Math.sinus = function (degree) {
  return Math.sin((degree / 180) * Math.PI);
};

// Game data
let phase = "waiting"; // waiting | stretching | turning | walking | transitioning | falling
let lastTimestamp; // The timestamp of the previous requestAnimationFrame cycle

let heroX; // Changes when moving forward
let heroY; // Only changes when falling
let sceneOffset; // Moves the whole game

let platforms = [];
let sticks = [];

// Todo: Save high score to localStorage (?)

let score = 0;

// Configuration
const canvasWidth = 375;
const canvasHeight = 375;
const platformHeight = 100;
const heroDistanceFromEdge = 10; // While waiting
const paddingX = 100; // The waiting position of the hero in from the original canvas size
const perfectAreaSize = 10;

// The background moves slower than the hero
const backgroundSpeedMultiplier = 0.2;

const hill1BaseHeight = 130;
const hill1Amplitude = 10;
const hill1Stretch = 1;
const hill2BaseHeight = 100;
const hill2Amplitude = 20;
const hill2Stretch = 0.5;


let stretchingSpeed = 4; // Milliseconds it takes to draw a pixel
let turningSpeed = 4; // Milliseconds it takes to turn a degree
let walkingSpeed = 4; // Milliseconds it takes to walk a pixel
const transitioningSpeed = 2;
const fallingSpeed = 2;

const heroWidth = 17; // 24
const heroHeight = 30; // 40

const canvas = document.getElementById("game");
canvas.width = window.innerWidth; // Make the Canvas full screen
canvas.height = window.innerHeight;

let drawHero = drawHero2;

const ctx = canvas.getContext("2d");

const introductionElement = document.getElementById("introduction");
const perfectElement = document.getElementById("perfect");
const heroButton1 = document.getElementById("hero1");
const heroButton2 = document.getElementById("hero2");
const scoreElement = document.getElementById("score");

if(getUserData(localStorage.getItem('currentUser'), 'stickHeroHighScore') < 5 || getUserData(localStorage.getItem('currentUser'), 'stickHeroHighScore') == undefined){
  heroButton1.style.background = "grey";
}


// --------------------------- Game logic -------------------------------------
// Initialize layout
resetGame();

// Resets game variables and layouts but does not start the game (game starts on keypress)
// Modify the `resetGame` function to show the high score
function resetGame() {
  // Reset game variables
  phase = "waiting";
  lastTimestamp = undefined;
  sceneOffset = 0;
  score = 0;

  // // Show the high score
  // const username = localStorage.getItem('currentUser');
  // const highScore = username ? getUserData(username, 'stickHeroHighScore') || 0 : 0;
  // scoreElement.innerText = `Score: ${score} | High Score: ${highScore}`;

  introductionElement.style.opacity = 1;
  perfectElement.style.opacity = 0;
  heroButton1.style.display = "none";
  heroButton2.style.display = "none";

  // Reset platforms and sticks
  platforms = [{ x: 50, w: 50 }];
  generatePlatform();
  generatePlatform();
  generatePlatform();
  generatePlatform();
  generatePlatform();
  generatePlatform();

  sticks = [{ x: platforms[0].x + platforms[0].w, length: 0, rotation: 0 }];
  heroX = platforms[0].x + platforms[0].w - heroDistanceFromEdge;
  heroY = 0;
  draw();
}


function generatePlatform() {

  const minimumGap = 40;
  const maximumGap = 200;
  const minimumWidth = 20;
  const maximumWidth = 100;

  // X coordinate of the right edge of the furthest platform
  const lastPlatform = platforms[platforms.length - 1];
  let furthestX = lastPlatform.x + lastPlatform.w;

  const x =
    furthestX +
    minimumGap +
    Math.floor(Math.random() * (maximumGap - minimumGap));
  const w =
    minimumWidth + Math.floor(Math.random() * (maximumWidth - minimumWidth));

  platforms.push({ x, w });
}

resetGame();

// The main game loop that runs the game logic and draws the game
function animate(timestamp) {
  if (!lastTimestamp) {
    lastTimestamp = timestamp;
    window.requestAnimationFrame(animate);
    return;
  }

  switch (phase) {
    case "waiting":
      return; // Stop the loop
    case "stretching": {
      sticks.last().length += (timestamp - lastTimestamp) / stretchingSpeed;
      break;
    }
    case "turning": {
      sticks.last().rotation += (timestamp - lastTimestamp) / turningSpeed;

      if (sticks.last().rotation > 90) {
        sticks.last().rotation = 90;

        const [nextPlatform, perfectHit] = thePlatformTheStickHits();
        if (nextPlatform) {
          // Increase score
          score += perfectHit ? 2 : 1;
          scoreElement.innerText = score;
          
          // Increase speed
          turningSpeed = turningSpeed - speedUp(score);
          walkingSpeed = walkingSpeed - speedUp(score);
          stretchingSpeed = stretchingSpeed - speedUp(score);
          

          if (perfectHit) {
            perfectElement.style.opacity = 1;
            setTimeout(() => (perfectElement.style.opacity = 0), 1000);
          }

          generatePlatform();
        }

        phase = "walking";
      }
      break;
    }
    case "walking": {
      heroX += (timestamp - lastTimestamp) / walkingSpeed;

      const [nextPlatform] = thePlatformTheStickHits();
      if (nextPlatform) {
        // If hero will reach another platform then limit it's position at it's edge
        const maxHeroX = nextPlatform.x + nextPlatform.w - heroDistanceFromEdge;
        if (heroX > maxHeroX) {
          heroX = maxHeroX;
          phase = "transitioning";
        }
      } else {
        // If hero won't reach another platform then limit it's position at the end of the pole
        const maxHeroX = sticks.last().x + sticks.last().length + heroWidth;
        if (heroX > maxHeroX) {
          heroX = maxHeroX;
          phase = "falling";
        }
      }
      break;
    }
    case "transitioning": {
      sceneOffset += (timestamp - lastTimestamp) / transitioningSpeed;

      const [nextPlatform] = thePlatformTheStickHits();
      if (sceneOffset > nextPlatform.x + nextPlatform.w - paddingX) {
        // Add the next step
        sticks.push({
          x: nextPlatform.x + nextPlatform.w,
          length: 0,
          rotation: 0
        });
        phase = "waiting";
      }
      break;
    }
    case "falling": {
      if (sticks.last().rotation < 180)
        sticks.last().rotation += (timestamp - lastTimestamp) / turningSpeed;

      heroY += (timestamp - lastTimestamp) / fallingSpeed;
      const maxHeroY =
        platformHeight + 100 + (window.innerHeight - canvasHeight) / 2;
      if (heroY > maxHeroY) {
        heroButton1.style.display = "block";
        heroButton2.style.display = "block";
        updateHighScore(score);
        if(score >= 5){
          heroButton1.style.background = "rgb(127, 142, 242)";
        }
        return;
      }
      turningSpeed = 4;
      walkingSpeed = 4;
      stretchingSpeed = 4;
      break;
    }
    default:
      throw Error("Wrong phase");
  }

  draw();
  window.requestAnimationFrame(animate);

  lastTimestamp = timestamp;
}

// If space was pressed restart the game
window.addEventListener("keydown", function (event) {
  if (event.key == " ") {
    event.preventDefault();
    resetGame();
    return;
  }
});

// change from stage waiting to stretching when the mouse is clicked or touched
function startStretching() {
  if (phase == "waiting") {
    lastTimestamp = undefined;
    introductionElement.style.opacity = 0;
    phase = "stretching";
    window.requestAnimationFrame(animate);
  }
}

window.addEventListener("mousedown", startStretching);
window.addEventListener("touchstart", startStretching);

function stopStretching() {
  if (phase == "stretching") {
    phase = "turning";
  }
}

window.addEventListener("mouseup", stopStretching);
window.addEventListener("touchend", stopStretching);

window.addEventListener("resize", function (event) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
});

// Start the game loop (it will stop itself when the game is over)
window.requestAnimationFrame(animate);

// Speed up the game as the score increases
function speedUp(score) {
  //return Math.log(score + 1) * 0.1;  // Gradually increasing speed
  //no speed up
  return 0;
}

// Returns the platform the stick hit (if it didn't hit any stick then return undefined)
function thePlatformTheStickHits() {
  if (sticks.last().rotation != 90)
    throw Error(`Stick is ${sticks.last().rotation}°`);
  const stickFarX = sticks.last().x + sticks.last().length;

  const platformTheStickHits = platforms.find(
    (platform) => platform.x < stickFarX && stickFarX < platform.x + platform.w
  );

  // If the stick hits the perfect area
  if (
    platformTheStickHits &&
    platformTheStickHits.x + platformTheStickHits.w / 2 - perfectAreaSize / 2 <
      stickFarX &&
    stickFarX <
      platformTheStickHits.x + platformTheStickHits.w / 2 + perfectAreaSize / 2
  )
    return [platformTheStickHits, true];
  
  return [platformTheStickHits, false];
}

heroButton1.addEventListener("click", function (event) {
  event.preventDefault();
  // if the users high score is less than 10 send a message to the user that the hero is locked
  if (getUserData(localStorage.getItem('currentUser'), 'stickHeroHighScore') < 5 || getUserData(localStorage.getItem('currentUser'), 'stickHeroHighScore') == undefined) {
    alert("You need to score at least 5 points to unlock this hero");
  } else {
     drawHero = drawHero1;
    }
  
  resetGame();
  heroButton1.style.display = "none";
});

heroButton2.addEventListener("click", function (event) {
  event.preventDefault();
  drawHero = drawHero2;
  resetGame();
  heroButton2.style.display = "none";
});


//--------------------- Drawing functions --------------------------------
function draw() {
  ctx.save();
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  if (drawHero == drawHero1) {
        drawBackground("#FAA307","#FFBA08","#6A040F","#D00000");
    }
    else if (drawHero == drawHero2) {
        drawBackground("#48CAE4","#ADE8F4","#023E8A","#03045E");
  }

  // Center main canvas area to the middle of the screen
  ctx.translate(
    (window.innerWidth - canvasWidth) / 2 - sceneOffset,
    (window.innerHeight - canvasHeight) / 2
  );

  // Draw scene
  drawPlatforms();
  if (drawHero == drawHero1) {
    drawHero1();
  } else if (drawHero == drawHero2) {
    drawHero2();
  }
  drawSticks();

  // Restore transformation
  ctx.restore();
}

// this function draws the platforms the differns from the funciton generatePlatform is
// that it draws the perfect area on the platform if the hero did not yet reach the platform 
// and the perfect area is not yet reached 
function drawPlatforms() {
  platforms.forEach(({ x, w }) => {
    // Draw platform
    ctx.fillStyle = "black";
    ctx.fillRect(
      x,
      canvasHeight - platformHeight,
      w,
      platformHeight + (window.innerHeight - canvasHeight) / 2
    );

    // Draw perfect area only if hero did not yet reach the platform
    if (sticks.last().x < x) {
      ctx.fillStyle = "red";
      ctx.fillRect(
        x + w / 2 - perfectAreaSize / 2,
        canvasHeight - platformHeight,
        perfectAreaSize,
        perfectAreaSize
      );
    }
  });
}

function drawHero1() {
  ctx.save();
  ctx.fillStyle = "black";
  ctx.translate(
    heroX - heroWidth / 2,
    heroY + canvasHeight - platformHeight - heroHeight / 2
  );

  // Body
  drawRoundedRect(
    -heroWidth / 2,
    -heroHeight / 2,
    heroWidth,
    heroHeight - 4,
    5
  );

  // Legs
  const legDistance = 5;
  ctx.beginPath();
  ctx.arc(legDistance, 11.5, 3, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-legDistance, 11.5, 3, 0, Math.PI * 2, false);
  ctx.fill();

  // Eye
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.arc(5, -7, 3, 0, Math.PI * 2, false);
  ctx.fill();

  // Band
  ctx.fillStyle = "red";
  ctx.fillRect(-heroWidth / 2 - 1, -12, heroWidth + 2, 4.5);
  ctx.beginPath();
  ctx.moveTo(-9, -14.5);
  ctx.lineTo(-17, -18.5);
  ctx.lineTo(-14, -8.5);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-10, -10.5);
  ctx.lineTo(-15, -3.5);
  ctx.lineTo(-5, -7);
  ctx.fill();

  ctx.restore();
}

function drawHero2() {
  ctx.save();
  ctx.fillStyle = "#09152B";
  ctx.translate(
    heroX - heroWidth / 2,
    heroY + canvasHeight - platformHeight - heroHeight / 2
  );

  // Body
  drawRoundedRect(
    -heroWidth / 2,
    -heroHeight / 2,
    heroWidth,
    heroHeight - 4,
    5
  );

  // Legs
  const legDistance = 5;
  ctx.beginPath();
  ctx.arc(legDistance, 11.5, 3, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-legDistance, 11.5, 3, 0, Math.PI * 2, false);
  ctx.fill();

  // Eye
  ctx.beginPath();
  ctx.fillStyle = "white";
  ctx.arc(5, -7, 3, 0, Math.PI * 2, false);
  ctx.fill();

  // Band
  ctx.fillStyle = "blue";
  ctx.fillRect(-heroWidth / 2 - 1, -12, heroWidth + 2, 4.5);
  ctx.beginPath();
  ctx.moveTo(-9, -14.5);
  ctx.lineTo(-17, -18.5);
  ctx.lineTo(-14, -8.5);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-10, -10.5);
  ctx.lineTo(-15, -3.5);
  ctx.lineTo(-5, -7);
  ctx.fill();

  ctx.restore();
}

// this function draws a rounded rectangle with the given parameters
// the roun
function drawRoundedRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.lineTo(x + width - radius, y + height);
  ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
  ctx.lineTo(x + width, y + radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.lineTo(x + radius, y);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.fill();
}

function drawSticks() {
  sticks.forEach((stick) => {
    ctx.save();

    // Move the anchor point to the start of the stick and rotate
    ctx.translate(stick.x, canvasHeight - platformHeight);
    ctx.rotate((Math.PI / 180) * stick.rotation);

    // Draw stick
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -stick.length);
    ctx.stroke();

    // Restore transformations
    ctx.restore();
  });
}

function drawBackground(color1,color2,color3,color4) {
  // Draw sky
  var gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
  gradient.addColorStop(0, color1);
  gradient.addColorStop(1, color2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  // Draw hills
  drawHill(hill1BaseHeight, hill1Amplitude, hill1Stretch, color3);
  drawHill(hill2BaseHeight, hill2Amplitude, hill2Stretch, color4);

}

// A hill is a shape under a stretched out sinus wave
function drawHill(baseHeight, amplitude, stretch, color) {
  ctx.beginPath();
  ctx.moveTo(0, window.innerHeight);
  ctx.lineTo(0, getHillY(0, baseHeight, amplitude, stretch));
  for (let i = 0; i < window.innerWidth; i++) {
    ctx.lineTo(i, getHillY(i, baseHeight, amplitude, stretch));
  }
  ctx.lineTo(window.innerWidth, window.innerHeight);
  ctx.fillStyle = color;
  ctx.fill();
}

function getHillY(windowX, baseHeight, amplitude, stretch) {
  const sineBaseY = window.innerHeight - baseHeight;
  return (
    Math.sinus((sceneOffset * backgroundSpeedMultiplier + windowX) * stretch) *
      amplitude +
    sineBaseY
  );
}
// -------------------------- User data in local storage -------------------------

// Function to set user data
function setUserData(username, key, value) {
  const userData = JSON.parse(localStorage.getItem(username)) || {};
  userData[key] = value;
  localStorage.setItem(username, JSON.stringify(userData));
}

// Function to get user data
function getUserData(username, key) {
  const userData = JSON.parse(localStorage.getItem(username)) || {};
  return userData[key];
}

// Function to update high score
function updateHighScore(currentScore) {
  const username = localStorage.getItem('currentUser');
  if (!username) return; // Ensure a user is logged in

  const highScore = getUserData(username, 'stickHeroHighScore') || 0;
  if (currentScore > highScore) {
    setUserData(username, 'stickHeroHighScore', currentScore);
    console.log(`New high score for ${username}: ${currentScore}`);
  }
  updateTopScoresTable();
}

// Function to get top 3 users by high score
function getTopUsersByHighScore(topN = 3) {
  let users = [];

  // Iterate over all entries in localStorage
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);

    // Skip non-user keys (if there are other non-user keys in storage)
    try {
      let userData = JSON.parse(localStorage.getItem(key));

      // Check if the key contains valid user data and the high score exists
      if (userData && userData['stickHeroHighScore'] !== undefined) {
        users.push({ username: key, score: userData['stickHeroHighScore'] });
      }
    } catch (e) {
      console.warn(`Skipping invalid key: ${key}`);
    }
  }

  // Sort users by score in descending order
  users.sort((a, b) => b.score - a.score);

  // Return the top N users
  return users.slice(0, topN);
}

// Function to update the table with top 3 high scores
function updateTopScoresTable() {
  const topUsers = getTopUsersByHighScore();

  const tableBody = document.querySelector("#topUsersTable tbody");
  tableBody.innerHTML = ""; // Clear current table

  topUsers.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${index + 1}</td><td>${user.username}</td><td>${user.score}</td>`;
    tableBody.appendChild(row);
  });
}

// -------------------------- End of User data functions -------------------------

// Call updateTopScoresTable when the page loads to populate the top scores table
document.addEventListener('DOMContentLoaded', () => {
  updateTopScoresTable();
});
