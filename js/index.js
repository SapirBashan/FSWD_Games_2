const users = JSON.parse(localStorage.getItem('users')) || {};
const blockedUsers = JSON.parse(localStorage.getItem('blockedUsers')) || {};
const loginAttempts = JSON.parse(localStorage.getItem('loginAttempts')) || {};

function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Check if user is blocked
    if (blockedUsers[username]) {
        alert('You are permanently blocked.');
        return false;
    }

    // Check if user exists and password matches
    if (users[username] && users[username].password === password) {
        localStorage.setItem('currentUser', username);
        localStorage.setItem('indexToMain', 'true');
        loginAttempts[username] = 0; // Reset the counter on successful login
        localStorage.setItem('loginAttempts', JSON.stringify(loginAttempts));
        window.location.href = 'html/mainPage.html';
        return false;
    } else {
        loginAttempts[username] = (loginAttempts[username] || 0) + 1;
        localStorage.setItem('loginAttempts', JSON.stringify(loginAttempts));

        if (loginAttempts[username] < 3) {
            alert('Invalid username or password.');
        } else if (loginAttempts[username] >= 3 && loginAttempts[username] < 6) {
            alert('Too many attempts. You will soon be blocked.');
        } else {
            alert('You are permanently blocked.');
            blockedUsers[username] = true;
            localStorage.setItem('blockedUsers', JSON.stringify(blockedUsers));
            document.getElementById('username').disabled = true;
        }
        return false;
    }
}