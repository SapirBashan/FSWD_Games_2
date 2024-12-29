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
    // also in local storage
    // Get the current word index from local storage or set a new one if not set
    let currentWordIndex = window.localStorage.getItem("currentWordIndex");
    console.log({ currentWordIndex });

    // If no word index is stored, pick a random word and store it in local storage
    if (currentWordIndex === null) {
        currentWordIndex = Math.floor(Math.random() * words.length);
        window.localStorage.setItem("currentWordIndex", currentWordIndex);
    } else {
        currentWordIndex = Number(currentWordIndex); // Convert to a number
    }

    let currentWord = words[currentWordIndex];
    console.log({ currentWord });

    let guessedWordCount = 0;
    let availableSpace = 1;
    let guessedWords = [[]];

  
    //clearAllLocalStorage();
    initLocalStorage();
    initHelpModal();
    initStatsModal();
    createSquares();
    addKeyboardClicks();
    loadLocalStorage();

    function clearAllLocalStorage() {
        window.localStorage.clear();
        console.log("All local storage data has been cleared.");
    }
  
    function initLocalStorage() {
      const storedCurrentWordIndex =
        window.localStorage.getItem("currentWordIndex");
      if (!storedCurrentWordIndex) {
        window.localStorage.setItem("currentWordIndex", currentWordIndex);
      } else {
        currentWordIndex = Number(storedCurrentWordIndex);
        currentWord = words[currentWordIndex];
      }
    }
  
    function loadLocalStorage() {
        currentWordIndex =
          Number(window.localStorage.getItem("currentWordIndex")) ||
          currentWordIndex;
        guessedWordCount =
          Number(window.localStorage.getItem("guessedWordCount")) ||
          guessedWordCount;
        availableSpace =
          Number(window.localStorage.getItem("availableSpace")) || availableSpace;
        guessedWords =
          JSON.parse(window.localStorage.getItem("guessedWords")) || guessedWords;
      
        currentWord = words[currentWordIndex];
      
        const storedBoardContainer = window.localStorage.getItem("boardContainer");
        if (storedBoardContainer) {
          document.getElementById("board-container").innerHTML =
            storedBoardContainer;
        }
      
        const storedKeyboardContainer =
          window.localStorage.getItem("keyboardContainer");
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
      
    function resetGameState() {
      window.localStorage.removeItem("guessedWordCount");
      window.localStorage.removeItem("guessedWords");
      window.localStorage.removeItem("keyboardContainer");
      window.localStorage.removeItem("boardContainer");
      window.localStorage.removeItem("availableSpace");
    }
  
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
  
    function preserveGameState() {
      window.localStorage.setItem("guessedWords", JSON.stringify(guessedWords));
  
      const keyboardContainer = document.getElementById("keyboard-container");
      window.localStorage.setItem(
        "keyboardContainer",
        keyboardContainer.innerHTML
      );
  
      const boardContainer = document.getElementById("board-container");
      window.localStorage.setItem("boardContainer", boardContainer.innerHTML);
    }
  
    function getCurrentWordArr() {
      const numberOfGuessedWords = guessedWords.length;
      return guessedWords[numberOfGuessedWords - 1];
    }
  
    function updateGuessedLetters(letter) {
      const currentWordArr = getCurrentWordArr();
  
      if (currentWordArr && currentWordArr.length < 5) {
        currentWordArr.push(letter);
  
        const availableSpaceEl = document.getElementById(availableSpace);
  
        availableSpaceEl.textContent = letter;
        availableSpace = availableSpace + 1;
      }
    }
  
    function updateTotalGames() {
      const totalGames = window.localStorage.getItem("totalGames") || 0;
      window.localStorage.setItem("totalGames", Number(totalGames) + 1);
    }
  
    function showResult() {
      const finalResultEl = document.getElementById("final-score");
      finalResultEl.textContent = "Wordle 1 - You win!";
  
      const totalWins = window.localStorage.getItem("totalWins") || 0;
      window.localStorage.setItem("totalWins", Number(totalWins) + 1);
  
      const currentStreak = window.localStorage.getItem("currentStreak") || 0;
      window.localStorage.setItem("currentStreak", Number(currentStreak) + 1);
    }
  
    function showLosingResult() {
      const finalResultEl = document.getElementById("final-score");
      finalResultEl.textContent = `Wordle 1 - Unsuccessful Today!`;
  
      window.localStorage.setItem("currentStreak", 0);
    }
  
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
  
    function getIndicesOfLetter(letter, arr) {
      const indices = [];
      let idx = arr.indexOf(letter);
      while (idx != -1) {
        indices.push(idx);
        idx = arr.indexOf(letter, idx + 1);
      }
      return indices;
    }
  
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
      window.localStorage.setItem("currentWordIndex", Math.floor(Math.random() * words.length));
    }
  
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
        window.localStorage.setItem("guessedWordCount", guessedWordCount);
      
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
  
    function updateStatsModal() {
      const currentStreak = window.localStorage.getItem("currentStreak");
      const totalWins = window.localStorage.getItem("totalWins");
      const totalGames = window.localStorage.getItem("totalGames");
  
      document.getElementById("total-played").textContent = totalGames;
      document.getElementById("total-wins").textContent = totalWins;
      document.getElementById("current-streak").textContent = currentStreak;
  
      const winPct = Math.round((totalWins / totalGames) * 100) || 0;
      document.getElementById("win-pct").textContent = winPct;
    }
  
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