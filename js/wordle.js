const words = [
    "apple", "about", "above", "actor", "acute", "admit", "adult", "after",
    "again", "agent", "agree", "ahead", "alarm", "album", "alert", "alike",
    "alive", "allow", "alone", "along", "alter", "among", "angel", "angle",
    "angry", "apart", "apple", "apply", "arena", "argue", "arise", "armed",
    "array", "arrow", "aside", "asset", "audio", "audit", "avoid", "award",
    "aware", "badge", "basic", "basis", "beach", "beard", "beast", "begin",
    "bench", "berry", "birth", "black", "blade", "blame", "blast", "blend",
    "bless", "blind", "block", "blood", "board", "boost", "bound", "brain",
    "brand", "bread", "break", "breed", "brief", "bring", "broad", "brown",
    "build", "burst", "buyer", "cable", "calm", "camel", "canal", "candy",
    "carry", "catch", "cause", "chain", "chair", "chalk", "chaos", "charm",
    "chart", "chase", "cheap", "check", "cheek", "chess", "chief", "child",
    "china", "claim", "class", "clean", "clear", "clerk", "click", "clock",
    "close", "cloud", "coach", "coast", "color", "count", "cover", "crack",
    "craft", "crash", "cream", "crime", "cross", "crowd", "crown", "curve",
    "daily", "dance", "dealt", "death", "debut", "delay", "depth", "dirty",
    "donor", "draft", "drama", "dream", "drink", "drive", "earth", "eight",
    "enemy", "enjoy", "enter", "entry", "equal", "error", "event", "every",
    "exact", "exist", "extra", "faith", "false", "fault", "favor", "field",
    "fight", "final", "first", "flash", "fleet", "floor", "fluid", "focus",
    "force", "forth", "found", "frame", "fresh", "front", "fruit", "glass",
    "globe", "grand", "grant", "grass", "great", "green", "group", "guard",
    "guess", "guide", "happy", "heart", "heavy", "hello", "hobby", "house",
    "human", "image", "imply", "index", "inner", "input", "issue", "joint",
    "judge", "juice", "layer", "learn", "lease", "level", "light", "limit",
    "liver", "local", "logic", "loose", "lover", "lucky", "magic", "major",
    "maker", "march", "match", "maybe", "mayor", "media", "metal", "minor",
    "model", "money", "month", "moral", "motor", "mount", "mouse", "mouth",
    "movie", "music", "naked", "nerve", "never", "newly", "night", "noise",
    "north", "notch", "novel", "nurse", "ocean", "offer", "often", "onion",
    "orbit", "order", "other", "outer", "owner", "panel", "paper", "party",
    "peace", "phase", "phone", "photo", "piano", "piece", "pilot", "place",
    "plain", "plane", "plant", "plate", "point", "pound", "power", "price",
    "pride", "prime", "print", "prize", "proof", "proud", "queen", "quick",
    "quiet", "raise", "reach", "react", "ready", "refer", "relax", "reply",
    "river", "rough", "round", "route", "royal", "rural", "scale", "scene",
    "scope", "score", "sense", "serve", "seven", "shape", "share", "sharp",
    "sheet", "shift", "shine", "shock", "shoot", "short", "sight", "skill",
    "smart", "smile", "smoke", "solid", "solve", "sorry", "sound", "space",
    "spare", "speak", "speed", "spend", "spice", "split", "sport", "staff",
    "stage", "stake", "stand", "start", "state", "steam", "steel", "stick",
    "stone", "store", "storm", "story", "style", "sugar", "suite", "sunny",
    "super", "sweet", "table", "taken", "taste", "teach", "thank", "theme",
    "there", "thick", "thing", "think", "third", "those", "three", "throw",
    "tight", "today", "topic", "total", "touch", "tough", "tower", "trace",
    "track", "trade", "train", "treat", "trend", "trial", "tribe", "trick",
    "trust", "truth", "twice", "uncle", "under", "union", "unite", "upper",
    "urban", "usual", "valid", "value", "video", "virus", "visit", "vital",
    "voice", "waste", "watch", "water", "wheel", "where", "which", "while",
    "white", "whole", "woman", "world", "worry", "worth", "would", "write",
    "wrong", "yield", "young", "youth"
  ];


  document.addEventListener("DOMContentLoaded", () => {
    let username = localStorage.getItem('currentUser');
    
    let randomNumber = Math.floor(Math.random() * words.length);
    let currentWordIndex = Number(getUserData(username, "currentWordIndex"))  || randomNumber;

    if (currentWordIndex === randomNumber) {
      setUserData(username, "currentWordIndex", currentWordIndex);
    }

    let currentWord = words[currentWordIndex];
    console.log({ currentWord });

    let guessedWordCount = 0;
    let availableSpace = 1;
    let guessedWords = [[]];

    
    initLocalStorage();
    initHelpModal();
    initStatsModal();
    createSquares();
    addKeyboardClicks();
    loadLocalStorage();
    
    /* ------------------------ local storage handaling -------------------------------- */
    // Function to set data for a specific user
    function setUserData(username, key, value) {
      const userData = JSON.parse(localStorage.getItem(username)) || {};
      userData[key] = value;
      localStorage.setItem(username, JSON.stringify(userData));
    }

    function getUserData(username, key) {
      const userData = JSON.parse(localStorage.getItem(username)) || {};
      return userData[key];
    }

    function removeUserData(username, key) {
      const userData = JSON.parse(localStorage.getItem(username)) || {};
      delete userData[key];
      localStorage.setItem(username, JSON.stringify(userData));
    }


    // Initializes local storage with current word index.
    function initLocalStorage() {
        const storedCurrentWordIndex =
        getUserData(username, "currentWordIndex");
        if (!storedCurrentWordIndex) {
           setUserData(username, "currentWordIndex", currentWordIndex);
        } else {
            currentWordIndex = Number(storedCurrentWordIndex);
            currentWord = words[currentWordIndex];
        }
    }
  
    function loadLocalStorage() {
        currentWordIndex =
        Number(getUserData(username, "currentWordIndex")) ||
        currentWordIndex;
        guessedWordCount =
        Number(getUserData(username, "guessedWordCount")) ||
        guessedWordCount;
        availableSpace =
        Number(getUserData(username, "availableSpace")) || availableSpace;
        guessedWords =
        JSON.parse(getUserData(username, "guessedWords")) || guessedWords;
        
        currentWord = words[currentWordIndex];
        
        const storedBoardContainer = getUserData(username, "boardContainer");
        if (storedBoardContainer) {
            document.getElementById("board-container").innerHTML =
            storedBoardContainer;
        }
        
        const storedKeyboardContainer =
        getUserData(username, "keyboardContainer");
        if (storedKeyboardContainer) {
            document.getElementById("keyboard-container").innerHTML =
            storedKeyboardContainer;
            addKeyboardClicks();
        }
      
        // Calculate the available space based on guessedWords
        if (guessedWords.length > 0) {
          const filledSquares = guessedWords
          .map((word) => word.length)
          .reduce((a, b) => a + b, 0);
          availableSpace = filledSquares + 1;
        }
    }
    
    // Preserves the current game state to local storage.
    function preserveGameState() {
      setUserData(username, "guessedWords", JSON.stringify(guessedWords));
  
      const keyboardContainer = document.getElementById("keyboard-container");
      setUserData(username, 
        "keyboardContainer",
        keyboardContainer.innerHTML
      );
  
      const boardContainer = document.getElementById("board-container");
      setUserData(username, "boardContainer", boardContainer.innerHTML);
    }

    // Resets the game state in local storage.
    function resetGameState() {
      removeUserData(username, "guessedWordCount");
      removeUserData(username, "guessedWords");
      removeUserData(username, "keyboardContainer");
      removeUserData(username, "boardContainer");
      removeUserData(username, "availableSpace");
    }
  
    /* ------------------------ game logic -------------------------------- */
    function getCurrentWordArr() {
      const numberOfGuessedWords = guessedWords.length;
      return guessedWords[numberOfGuessedWords - 1];
    }
  
    // Updates the guessed letters with the provided letter.
    function updateGuessedLetters(letter) {
      const currentWordArr = getCurrentWordArr();
  
      if (currentWordArr && currentWordArr.length < 5) {
        currentWordArr.push(letter);
  
        const availableSpaceEl = document.getElementById(availableSpace);
  
        availableSpaceEl.textContent = letter;
        availableSpace = availableSpace + 1;
      }
    }
  
    // Updates the total number of games played.
    function updateTotalGames() {
      const totalGames = getUserData(username, "totalGames") || 0;
      setUserData(username, "totalGames", Number(totalGames) + 1);
    }

    // Gets the indices of a letter in an array.
    function getIndicesOfLetter(letter, arr) {
        const indices = [];
        let idx = arr.indexOf(letter);
        while (idx != -1) {
          indices.push(idx);
          idx = arr.indexOf(letter, idx + 1);
        }
        return indices;
    }

    // Gets the CSS class for a tile based on the letter and its position.
    function getTileClass(letter, index, currentWordArr) {
        const isCorrectLetter = currentWord
          .toUpperCase()
          .includes(letter.toUpperCase());
    
        if (!isCorrectLetter) {
          return "incorrect-letter";
        }
    
        const letterInThatPosition = currentWord.charAt(index);
        const isCorrectPosition =
          letter.toLowerCase() === letterInThatPosition.toLowerCase();
    
        if (isCorrectPosition) {
          return "correct-letter-in-place";
        }
    
        const isGuessedMoreThanOnce =
          currentWordArr.filter((l) => l === letter).length > 1;
    
        if (!isGuessedMoreThanOnce) {
          return "correct-letter";
        }
    
        const existsMoreThanOnce =
          currentWord.split("").filter((l) => l === letter).length > 1;
    
        // is guessed more than once and exists more than once
        if (existsMoreThanOnce) {
          return "correct-letter";
        }
    
        const hasBeenGuessedAlready = currentWordArr.indexOf(letter) < index;
    
        const indices = getIndicesOfLetter(letter, currentWord.split(""));
        const otherIndices = indices.filter((i) => i !== index);
        const isGuessedCorrectlyLater = otherIndices.some(
          (i) => i > index && currentWordArr[i] === letter
        );
    
        if (!hasBeenGuessedAlready && !isGuessedCorrectlyLater) {
          return "correct-letter";
        }
    
        return "incorrect-letter";
    }
    
    function updateWordIndex() {
        console.log({ currentWordIndex });
        setUserData(username, "currentWordIndex", Math.floor(Math.random() * words.length));
    }
    
    // Handles the submission of a guessed word when pressed enter.
    async function handleSubmitWord() {
          const currentWordArr = getCurrentWordArr();
          const guessedWord = currentWordArr.join("");
        
          if (guessedWord.length !== 5) {
            return;
          }
        
          const firstLetterId = guessedWordCount * 5 + 1;
          const interval = 200;
        
          currentWordArr.forEach((letter, index) => {
            setTimeout(() => {
              const tileClass = getTileClass(letter, index, currentWordArr);
              if (tileClass) {
                const letterId = firstLetterId + index;
                const letterEl = document.getElementById(letterId);
                letterEl.classList.add("animate__flipInX");
                letterEl.classList.add(tileClass);
        
                const keyboardEl = document.querySelector(`[data-key=${letter}]`);
                keyboardEl.classList.add(tileClass);
              }
        
              if (index === 4) {
                preserveGameState();
              }
            }, index * interval);
          });
        
          guessedWordCount += 1;
          setUserData(username, "guessedWordCount", guessedWordCount);
        
          if (guessedWord === currentWord) {
            setTimeout(() => {
              const okSelected = window.confirm("Well done!");
              if (okSelected) {
                clearBoard();
                showResult();
                updateWordIndex();
                updateTotalGames();
                resetGameState();
              }
              return;
            }, 1200);
          }
        
          if (guessedWords.length === 6 && guessedWord !== currentWord) {
            setTimeout(() => {
              const okSelected = window.confirm(
                `Sorry, you have no more guesses! The word is "${currentWord.toUpperCase()}".`
              );
              if (okSelected) {
                clearBoard();
                showLosingResult();
                updateWordIndex();
                updateTotalGames();
                resetGameState();
              }
              return;
            }, 1200);
          }
        
          guessedWords.push([]);
    }

    // Handles the deletion of a letter when pressed delete.
     function handleDelete() {
      const currentWordArr = getCurrentWordArr();
  
      if (!currentWordArr.length) {
        return;
      }
  
      currentWordArr.pop();
  
      guessedWords[guessedWords.length - 1] = currentWordArr;
  
      const lastLetterEl = document.getElementById(availableSpace - 1);
  
      lastLetterEl.innerHTML = "";
      availableSpace = availableSpace - 1;
    }

    /* ------------------------ game ui -------------------------------- */
    function createSquares() {
        const gameBoard = document.getElementById("board");
    
        for (let i = 0; i < 30; i++) {
          let square = document.createElement("div");
          square.classList.add("animate__animated");
          square.classList.add("square");
          square.setAttribute("id", i + 1);
          gameBoard.appendChild(square);
        }
    }

    // Shows the result of the game.
    function showResult() {
      const finalResultEl = document.getElementById("final-score");
      finalResultEl.textContent = "Wordle 1 - You win!";
  
      const totalWins = getUserData(username, "totalWins") || 0;
      setUserData(username, "totalWins", Number(totalWins) + 1);
    }

    // Shows the result of the game when the user loses.
    function showLosingResult() {
      const finalResultEl = document.getElementById("final-score");
      finalResultEl.textContent = `Wordle 1 - Unsuccessful Today!`;
    }
    
    // Clears the game board.
    function clearBoard() {
      for (let i = 0; i < 30; i++) {
        let square = document.getElementById(i + 1);
        square.textContent = "";
      }
  
      const keys = document.getElementsByClassName("keyboard-button");
  
      for (var key of keys) {
        key.disabled = true;
      }
    }
    
    // Adds click events to the keyboard buttons.
    function addKeyboardClicks() {
      const keys = document.querySelectorAll(".keyboard-row button");
      for (let i = 0; i < keys.length; i++) {
        keys[i].addEventListener("click", ({ target }) => {
          const key = target.getAttribute("data-key");
  
          if (key === "enter") {
            handleSubmitWord();
            return;
          }
  
          if (key === "del") {
            handleDelete();
            return;
          }
  
          updateGuessedLetters(key);
        });
      }
    }
     
    // Initializes the help modal.
    function initHelpModal() {
      const modal = document.getElementById("help-modal");
  
      // Get the button that opens the modal
      const btn = document.getElementById("help");
  
      // Get the <span> element that closes the modal
      const span = document.getElementById("close-help");
  
      // When the user clicks on the button, open the modal
      btn.addEventListener("click", function () {
        modal.style.display = "block";
      });
  
      // When the user clicks on <span> (x), close the modal
      span.addEventListener("click", function () {
        modal.style.display = "none";
      });
  
      // When the user clicks anywhere outside of the modal, close it
      window.addEventListener("click", function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      });
    }
     
    //  Updates the stats modal with the latest stats.
    function updateStatsModal() {
      const totalWins = getUserData(username, "totalWins");
      const totalGames = getUserData(username,"totalGames");
  
      document.getElementById("total-played").textContent = totalGames;
      document.getElementById("total-wins").textContent = totalWins;
  
      const winPct = Math.round((totalWins / totalGames) * 100) || 0;
      document.getElementById("win-pct").textContent = winPct;
    }
  
    // Initializes the stats modal.
    function initStatsModal() { 
      const modal = document.getElementById("stats-modal");
  
      // Get the button that opens the modal
      const btn = document.getElementById("stats");
  
      // Get the <span> element that closes the modal
      const span = document.getElementById("close-stats");
  
      // When the user clicks on the button, open the modal
      btn.addEventListener("click", function () {
        updateStatsModal();
        modal.style.display = "block";
      });
  
      // When the user clicks on <span> (x), close the modal
      span.addEventListener("click", function () {
        modal.style.display = "none";
      });
  
      // When the user clicks anywhere outside of the modal, close it
      window.addEventListener("click", function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      });
    }
  });