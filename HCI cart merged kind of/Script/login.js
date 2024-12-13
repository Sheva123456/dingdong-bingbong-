// Sign Up Button Logic
const signUpButton = document.getElementById('signUpButton');
const signInButton = document.getElementById('signInButton');
const signInForm = document.getElementById('signIn');
const signUpForm = document.getElementById('signup');
const logobtn = document.getElementById('logobtn')


logobtn.addEventListener('click', function () {
    window.location.href='Home.html'
});

signUpButton.addEventListener('click', function () {
    signInForm.style.display = "none";
    signUpForm.style.display = "block";
});

signInButton.addEventListener('click', function () {
    signInForm.style.display = "block";
    signUpForm.style.display = "none";
});

function showMessage(message, divId) {
    var messageDiv = document.getElementById(divId);
    messageDiv.style.display = 'block';
    messageDiv.innerHTML = message;
    messageDiv.style.opacity = 1;
    setTimeout(function () {
        messageDiv.style.opacity = 0;
    }, 5000);
}

// Sign Up Logic
const signUp = document.getElementById('submitSignUp');
signUp.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('rEmail').value;
    const password = document.getElementById('rPassword').value;
    const firstName = document.getElementById('fName').value;
    const lastName = document.getElementById('lName').value;

    if (password.length < 6) {
        showMessage('Password must be at least 6 characters.', 'signUpMessage');
        return;
    }

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user.email === email);

    if (userExists) {
        showMessage('Email Address Already Exists !!!', 'signUpMessage');
        return;
    }

    const userData = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: password,
        accountdisc: 0,
        accountwaste:0, 
        cart: [],
        history: [],

    };

    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));

    showMessage('Account Created Successfully', 'signUpMessage');
    window.location.href = 'Login.html';
});

// Sign In Logic
const signIn = document.getElementById('SignIn'); // Corrected selector
signIn.addEventListener('click', (event) => {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    let users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        showMessage('Login successful', 'signInMessage');
        localStorage.setItem('loggedInUserId', email);
        window.location.href = 'Home.html';
        localStorage.setItem('current-user',JSON.stringify(user)); 
        localStorage.setItem('logged-in', 'true');
    } else {
        showMessage('Incorrect Email or Password', 'signInMessage');
    }
});

// Sign Out Logic
const signOut = document.getElementById('signout');
signOut.addEventListener('click', (event) => {
    localStorage.removeItem('loggedInUserId');
    localStorage.removeItem('current-user');
    
    localStorage.setItem('logged-in', 'false');
    window.location.href = 'Home.html';

});

const rsignOut = document.getElementById('rsignout');
rsignOut.addEventListener('click', (event) => {
    localStorage.removeItem('loggedInUserId');
    localStorage.removeItem('current-user');
    
    localStorage.setItem('logged-in', 'false');
    window.location.href = 'Home.html';
});


// Check Login Status on Page Load
const loggedInUserId = localStorage.getItem('loggedInUserId');
if (loggedInUserId) {
    console.log('User is logged in:', loggedInUserId);
    
} else {
    console.log('No user logged in');
}

let users = JSON.parse(localStorage.getItem('users')) || [];

// Map over each user and ensure cart, history, and other properties are initialized correctly
users = users.map(user => ({
    ...user,
    cart: Array.isArray(user.cart) ? user.cart : [],
    history: Array.isArray(user.history) ? user.history : [],
    accountdisc: user.accountdisc || 0,  // If accountdisc is not defined, set it to 0
    accountwaste: user.accountwaste || 0  // If accountwaste is not defined, set it to 0
}));

// Save the updated users array back to localStorage
localStorage.setItem('users', JSON.stringify(users));

