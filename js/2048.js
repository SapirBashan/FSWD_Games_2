document.addEventListener('DOMContentLoaded', () => {
  const gridDisplay = document.querySelector('.grid');
  const scoreDisplay = document.getElementById('score');
  const resultDisplay = document.getElementById('result');
  const tileDisplay = document.getElementById('tile');
  const targetTileDisplay = document.getElementById('target-tile');
  const difficultySelect = document.getElementById('difficulty');

  let squares = [];
  const width = 4;
  let score = 0;
  let targetTile = 2048;
  let spawnValue = 4;
  let username = localStorage.getItem('currentUser');
  let key = 'top_score';
  let wins_key = 'wins';

  let userWins = getUserData(username, wins_key) || 0;
  let userScore = getUserData(username, key) || 0;

  setUserData(username, wins_key, userWins);
  setUserData(username, key, userScore);

  // Set difficulty levels
  function setDifficulty(level) {
    if (level === 'easy') {
      targetTile = 512;
      spawnValue = 2;
    } else if (level === 'medium') {
      targetTile = 1024;
      spawnValue = 4;
    } else if (level === 'hard') {
      targetTile = 2048;
      spawnValue = 4;
    }
    tileDisplay.textContent = targetTile;
    targetTileDisplay.textContent = targetTile;
    resetGame();
  }

  // Reset the game board
  function resetGame() {
    difficultySelect.disabled = false;
    resultDisplay.innerHTML = `Combine the numbers and aim for the <b id="target-tile">${targetTile}</b> tile!`;
    document.addEventListener('keyup', control);
    gridDisplay.innerHTML = '';
    squares = [];
    score = 0;
    scoreDisplay.textContent = score;
    createBoard();
  }

  // Create the game board
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div');
      square.innerHTML = 0;
      gridDisplay.appendChild(square);
      squares.push(square);
    }
    generate();
    generate();
  }

  // Generate a new number
  function generate() {
    const randomNumber = Math.floor(Math.random() * squares.length);
    if (squares[randomNumber].innerHTML == 0) {
      squares[randomNumber].innerHTML = spawnValue;
      applyColors(); // Apply colors when a new tile is generated
      checkForGameOver();
    } else {
      generate();
    }
  }

  // Apply colors to tiles based on their values
  function applyColors() {
    squares.forEach(square => {
      const value = parseInt(square.innerHTML);
      if (value === 0) {
        square.style.backgroundColor = '#afa192'; 
      } else if (value === 2) {
        square.style.backgroundColor = '#eee4da'; 
      } else if (value === 4) {
        square.style.backgroundColor = '#ede0c8'; 
      } else if (value === 8) {
        square.style.backgroundColor = '#f2b179'; 
      } else if (value === 16) {
        square.style.backgroundColor = '#ffcea4'; 
      } else if (value === 32) {
        square.style.backgroundColor = '#e8c064'; 
      } else if (value === 64) {
        square.style.backgroundColor = '#ffab6e'; 
      } else if (value === 128) {
        square.style.backgroundColor = '#fd9982'; 
      } else if (value === 256) {
        square.style.backgroundColor = '#ead79c'; 
      } else if (value === 512) {
        square.style.backgroundColor = '#76daff'; 
      } else if (value === 1024) {
        square.style.backgroundColor = '#beeaa5'; 
      } else if (value === 2048) {
        square.style.backgroundColor = '#d7d4f0'; 
      }
    });
  }

  // Move tiles to the right
  function moveRight() {
    for (let i = 0; i < width * width; i += width) {
      let row = [
        parseInt(squares[i].innerHTML),
        parseInt(squares[i + 1].innerHTML),
        parseInt(squares[i + 2].innerHTML),
        parseInt(squares[i + 3].innerHTML),
      ];
      let filteredRow = row.filter(num => num);
      let missing = width - filteredRow.length;
      let zeros = Array(missing).fill(0);
      let newRow = zeros.concat(filteredRow);

      for (let j = 0; j < width; j++) {
        squares[i + j].innerHTML = newRow[j];
      }
    }
    applyColors(); 
  }

  // Move tiles to the left
  function moveLeft() {
    for (let i = 0; i < width * width; i += width) {
      let row = [
        parseInt(squares[i].innerHTML),
        parseInt(squares[i + 1].innerHTML),
        parseInt(squares[i + 2].innerHTML),
        parseInt(squares[i + 3].innerHTML),
      ];
      let filteredRow = row.filter(num => num);
      let missing = width - filteredRow.length;
      let zeros = Array(missing).fill(0);
      let newRow = filteredRow.concat(zeros);

      for (let j = 0; j < width; j++) {
        squares[i + j].innerHTML = newRow[j];
      }
    }
    applyColors(); 
  }

  // Move tiles upwards
  function moveUp() {
    for (let i = 0; i < width; i++) {
      let column = [
        parseInt(squares[i].innerHTML),
        parseInt(squares[i + width].innerHTML),
        parseInt(squares[i + width * 2].innerHTML),
        parseInt(squares[i + width * 3].innerHTML),
      ];
      let filteredColumn = column.filter(num => num);
      let missing = width - filteredColumn.length;
      let zeros = Array(missing).fill(0);
      let newColumn = filteredColumn.concat(zeros);

      for (let j = 0; j < width; j++) {
        squares[i + width * j].innerHTML = newColumn[j];
      }
    }
    applyColors(); 
  }

  // Move tiles downwards
  function moveDown() {
    for (let i = 0; i < width; i++) {
      let column = [
        parseInt(squares[i].innerHTML),
        parseInt(squares[i + width].innerHTML),
        parseInt(squares[i + width * 2].innerHTML),
        parseInt(squares[i + width * 3].innerHTML),
      ];
      let filteredColumn = column.filter(num => num);
      let missing = width - filteredColumn.length;
      let zeros = Array(missing).fill(0);
      let newColumn = zeros.concat(filteredColumn);

      for (let j = 0; j < width; j++) {
        squares[i + width * j].innerHTML = newColumn[j];
      }
    }
    applyColors(); 
  }

  function combineColumns() {
    for (let i = 0; i < width * width - 1; i++) {
      if (squares[i].innerHTML === squares[i + 1].innerHTML && i % width !== width - 1) {
        let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML);
        squares[i].innerHTML = combinedTotal;
        squares[i + 1].innerHTML = 0;
        score += combinedTotal;
        scoreDisplay.textContent = score;
      }
    }
    applyColors(); 
    checkForWin();
  }

  function combineRows() {
    for (let i = 0; i < width * (width - 1); i++) {
      if (squares[i].innerHTML === squares[i + width].innerHTML) {
        let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + width].innerHTML);
        squares[i].innerHTML = combinedTotal;
        squares[i + width].innerHTML = 0;
        score += combinedTotal;
        scoreDisplay.textContent = score;
      }
    }
    applyColors(); 
    checkForWin();
  }

  // Check for win
  function checkForWin() {
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].innerHTML == targetTile) {
        resultDisplay.innerHTML = 'You WON!';
        document.removeEventListener('keyup', control);
        difficultySelect.disabled = true;
        if (score > getUserData(username, key))
          setUserData(username, key, score);
        wins = getUserData(username, wins_key) + 1;
        setUserData(username, wins_key, wins);
        setTimeout(() => setDifficulty(difficultySelect.value), 3000);
      }
    }
  }

  // Check for game over
  function checkForGameOver() {
    let zeros = 0;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].innerHTML == 0) {
        zeros++;
      }
    }
    if (zeros === 0) {
      resultDisplay.innerHTML = 'Game Over!';
      document.removeEventListener('keyup', control);
      difficultySelect.disabled = true;
      if (score > getUserData(username, key))
        setUserData(username, key, score);
      setTimeout(() => setDifficulty(difficultySelect.value), 3000);
    }
  }

  // Handle key controls
  function control(e) {
    if (e.key === 'ArrowRight') {
      moveRight();
      combineColumns();
      moveRight();
    } else if (e.key === 'ArrowLeft') {
      moveLeft();
      combineColumns();
      moveLeft();
    } else if (e.key === 'ArrowUp') {
      moveUp();
      combineRows();
      moveUp();
    } else if (e.key === 'ArrowDown') {
      moveDown();
      combineRows();
      moveDown();
    }
    generate();
  }

  // Listen for difficulty changes
  difficultySelect.addEventListener('change', (e) => {
    setDifficulty(e.target.value);
  });

  // Initialize the game with the default difficulty
  setDifficulty(difficultySelect.value);


  // Function to set data for a specific user
  function setUserData(username, key, value) {
    const userData = JSON.parse(localStorage.getItem(username)) || {};
    userData[key] = value;
    localStorage.setItem(username, JSON.stringify(userData));
    console.log(`Data set for user "${username}":`, key, value);
  }

  function getUserData(username, key) {
    const userData = JSON.parse(localStorage.getItem(username)) || {};
    return userData[key];
  }

    // Function to extract the top 3 users by a specific key (e.g., "wins")
  function getTopUsersByScore(scoreKey, topN = 3) {
    let users = [];

    // Iterate over all entries in localStorage
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);

        // Skip non-user keys (if there are other non-user keys in storage)
        try {
            let userData = JSON.parse(localStorage.getItem(key));

            // Check if the key contains valid user data and the scoreKey exists
            if (userData && userData[scoreKey] !== undefined) {
                users.push({ username: key, score: userData[scoreKey] });
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
  // Get the top 3 users
  const topUsers = getTopUsersByScore("wins", 3);

  // Display results in the table
  const tableBody = document.querySelector("#topUsersTable tbody");
  topUsers.forEach((user, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `<td>${index + 1}</td><td>${user.username}</td><td>${user.score}</td>`;
      tableBody.appendChild(row);
  });
});


