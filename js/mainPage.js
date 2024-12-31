function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}

function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(`${name}=`)) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}

function greetUser() {
    let fromIndex = localStorage.getItem('indexToMain');
    if(fromIndex == 'true'){
        const username = getCookie(localStorage.getItem('currentUser'));
    
        if (username) {
            showInlineMessage(`Welcome back, ${username}!`);
        } else {
            const newUser = localStorage.getItem('currentUser');
            setCookie(newUser, newUser, 7); // Save for 7 days
            showInlineMessage(`Nice to meet you, ${newUser}!`);
        }
        localStorage.setItem('indexToMain', 'false');
    }
    
}

function showInlineMessage(message) {
    // Create inline message container
    const messageContainer = document.createElement('div');
    messageContainer.textContent = message;
    messageContainer.style.position = 'fixed';
    messageContainer.style.top = '200px';
    messageContainer.style.left = '50%';
    messageContainer.style.transform = 'translateX(-50%)';
    messageContainer.style.backgroundColor = '#333';
    messageContainer.style.color = 'white';
    messageContainer.style.padding = '10px 20px';
    messageContainer.style.borderRadius = '5px';
    messageContainer.style.fontSize = '16px';
    messageContainer.style.zIndex = '1000';

    // Append the message to the body
    document.body.appendChild(messageContainer);

    // Remove the message after 3 seconds
    setTimeout(() => {
        document.body.removeChild(messageContainer);
    }, 3000); 
}
