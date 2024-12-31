// Load users from localStorage or initialize empty object
const users = JSON.parse(localStorage.getItem('users')) || {};

function handleRegistration() {
    const fullname = document.getElementById('fullname').value;
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Check if passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return false;
    }

    // Check if username already exists
    if (users[username]) {
        alert('Username already exists.');
        return false;
    }

    // Save new user to localStorage
    users[username] = { fullname, email, password };
    registerUser(username);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Registration successful!');
    // Redirect to the login page
    setTimeout(() => {
        window.location.href = "./index.html";
    }, 500);

    return false;
}

// Function to register a new user and create their local storage space
function registerUser(username) {
    if (!localStorage.getItem(username)) {
        localStorage.setItem(username, JSON.stringify({}));
        console.log(`User "${username}" registered and storage initialized.`);
    } else {
        console.log(`User "${username}" already exists.`);
    }
}
