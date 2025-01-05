## This is a game platform built with Java Script HTML and CSS
---

## Login and Registration System

### Overview

The login and registration system enables secure user authentication and onboarding.

### Key Features

1. **Login Page:**
    - Validates user credentials using `localStorage`.
    - Tracks login attempts and blocks users after 6 failed attempts.
    - Redirects authenticated users to the home page.
2. **Registration Page:**
    - Collects and stores user data securely in `localStorage`.
    - Ensures unique usernames and matching passwords.
    - Redirects successful registrations to the login page.

### Technologies

- **Frontend:** HTML, CSS, JavaScript.
- **Storage:** `localStorage` for lightweight data handling.
- **Logic:** Client-side validation and user state management.

---
![alt text](../FSWD_Games_2/images/image.png) 

## Home Page and Header

### Overview

The **Home Page** serves as the central hub, offering access to three games and additional features like a profile view and logout. It includes a reusable **Header** for seamless navigation.

### Key Features

1. **Home Page:**
    - Displays links to games: **2048**, **Wordle**, and **Stick Hero** (with one placeholder for a future game).
    - **Dynamic Greeting:** Welcomes users using cookies and `localStorage`, ensuring a personalized experience.
    - Uses **images and buttons** for an interactive interface.
2. **Header:**
    - Contains links to **Home**, **Profile**, and **Logout**.
    - Styled for consistency and uses hover effects for better UX.

### Technologies

- **Frontend:** HTML, CSS (custom styles with hover effects).
- **Logic:**
    - Cookies store short-term user preferences.
    - `localStorage` handles user session state.
- **Dynamic Components:** JavaScript functions like `greetUser()` ensure tailored messages based on user actions.

![alt text](../FSWD_Games_2/images/image-2.png)
---

## 2048 Game Online

### Main Features

- **Objective:** Combine numbers to reach the target tile (default: 2048).
- **Difficulty Levels:** Choose between Easy (512), Medium (1024), or Hard (2048).

### Gameplay

- **Board:** A 4x4 grid where tiles spawn with values 2 or 4.
- **Controls:** Use arrow keys to slide and merge tiles.
- **Win Condition:** Reach the target tile.
- **Game Over:** No moves left.

### Scoring and Leaderboard

- **Score:** Updated after each merge.
- **Leaderboard:** Tracks top 3 players by total wins, displayed in a table.

### User Data Storage

- **Local Storage:** Tracks individual user scores and wins.

### User Controls

- **Reset Game:** Changes difficulty and restarts the board.
- **Personal Stats:** Saves best score and total wins per user.

### Code Highlights

- **Dynamic Styling:** Tile colors change based on values.
- **Persistent Data:** Scores and wins saved per user in `localStorage`.
- **Customizable Difficulty:** Adjusts target tile and spawn values.

![alt text](../FSWD_Games_2/images/image-3.png)
---

## Wordle Game

### Project Overview

Wordle is a fun and interactive word-guessing game designed to challenge your vocabulary and strategic thinking. Inspired by the popular online version, this full-stack implementation allows users to play Wordle with features like persistent state management using local storage and engaging animations.

### Features

- **Local Storage Persistence:** Save game progress across page refreshes.
- **Animated Tiles:** Flip-in animations provide visual feedback for each guessed letter.
- **Multiple Game Modes:** Supports different levels of difficulty with varying word lengths.
- **User Stats:** Track wins, total games played, and personal game history.
- **Technologies:** JavaScript (DOM manipulation, local storage, event handling).

![alt text](../FSWD_Games_2/images/image-4.png)
---

## Stick Hero Game

### Technologies Used

- **HTML5 Canvas:** For rendering the game visuals and animations.
- **JavaScript:** To implement game logic, event handling, and interactions.
- **Math Functions:** Custom functions like `Math.sinus` to handle sinusoidal movements and rotations.
- **DOM Manipulation:** To manage game elements and user interface updates.

### Logic

- **Game Phases:** The game progresses through phases like 'waiting', 'stretching', 'turning', 'walking', 'transitioning', and 'falling'.
- **Platforms & Sticks:** Platforms are dynamically generated and sticks are used for hero interactions.
- **Scoring:** The game increments scores based on perfect hits and overall gameplay progress.
- **User Data Management:** High scores are stored and managed using `localStorage` for a personalized gaming experience.

![alt text](../FSWD_Games_2/images/image-5.png)
---

## User Profile Page

This page displays user achievements and profile details by retrieving data from `localStorage`.

### Features

- Displays user-specific data (username, game achievements, profile picture).
- Allows uploading a new profile picture via a button.

### Functionality

- **Load User Data:** Fetches user data from `localStorage` and updates the profile page.
- **Profile Picture Upload:** Enables users to update their profile picture with a new URL.

![alt text](../FSWD_Games_2/images/image-6.png)

### Full Website Readme

#### Summary:

This project is a full-stack web application designed to provide a seamless user experience for managing personal profiles and engaging with various games (2048, Wordle, Stick Hero). It utilizes modern front-end and back-end technologies to handle user data, game achievements, and profile customization.

#### Collaborators:

*   **Spir Bashan** -- link to GitHub profile
*   **Yuval Yefet** -- link to GitHub profile
