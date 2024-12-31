// Load users from localStorage or initialize empty object
const users = JSON.parse(localStorage.getItem('users')) || {};

function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check if user exists and password matches
    if (users[username] && users[username].password === password) {
        localStorage.setItem('currentUser', username);
        localStorage.setItem('indexToMain', 'true');
        window.location.href = './mainPage.html';
        return false;
    } else {
        alert('Invalid username or password.');
        return false;
    }
}