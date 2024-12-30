// Function to get user data from localStorage
function getUserData(username, key) {
    const userData = JSON.parse(localStorage.getItem(username)) || {};
    return userData[key];
  }
  
  // Function to update the profile page with user data
function loadUserProfile() {
    const username = localStorage.getItem('currentUser');
    const userEmail = localStorage.getItem('email');
    const userPassword = localStorage.getItem('password');

    // Game achievements
    const stickHeroHighScore = getUserData(username, 'stickHeroHighScore');
    const topScore = getUserData(username, 'top_score');
    const wins = getUserData(username, 'wins');
    const totalGames = getUserData(username, 'totalGames');
    const totalWins = getUserData(username, 'totalWins');

    // Update profile info on the page
    document.getElementById('username').textContent = username || 'Unknown User';

    document.getElementById('stickHeroHighScore').textContent = stickHeroHighScore || '0';
    document.getElementById('topScore').textContent = topScore || '0';
    document.getElementById('wins').textContent = wins || '0';
    document.getElementById('totalGames').textContent = totalGames || '0';
    document.getElementById('totalWins').textContent = totalWins || '0';

    // Handle profile picture (using a default if none is found)
    const profilePic = localStorage.getItem(username + '_profilePic');
    const profilePicElement = document.getElementById('profile-pic');

    if (profilePic) {
        profilePicElement.src = profilePic;
    }
  
    // Handle profile picture upload
    document.getElementById('upload-btn').addEventListener('click', () => {
      const newProfilePic = prompt('Enter the URL of your new profile picture:');
      if (newProfilePic) {
        localStorage.setItem(username + '_profilePic', newProfilePic);
        profilePicElement.src = newProfilePic;
      }
    });
  }
  
  // Initialize the page when loaded
  window.onload = loadUserProfile;