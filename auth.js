const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const signImg = document.getElementById('signImg');
const loginImg = document.getElementById('loginImg');

function always(){
  signImg.classList.add('hidden');
}
always();

// Toggle forms
showSignup.addEventListener('click', () => {
  loginForm.classList.add('hidden');
  signupForm.classList.remove('hidden');
  signImg.classList.remove('hidden');
  loginImg.classList.add('hidden');
});

showLogin.addEventListener('click', () => {
  signupForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
  signImg.classList.add('hidden');
  loginImg.classList.remove('hidden');

});

// Signup: Save user credentials in localStorage (demo only)

signupForm.addEventListener('submit', e => {
  e.preventDefault();

  // Get input values
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('signup-email').value.trim().toLowerCase();
  const password = document.getElementById('signup-password').value;

  // Check if user already exists
  if (localStorage.getItem('user_' + email)) {
    alert('User already exists!');
  } else {
    // Create a user object to store username and password
    const user = {
      username: username,
      password: password
    };

    // Store the user object in localStorage as a JSON string
    localStorage.setItem('user_' + email, JSON.stringify(user));

    alert('Signup successful! Please login.');

    // Hide signup form and show login form
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  }
});


// Login: Verify credentials and redirect

loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;

  // Retrieve the user object from localStorage
  const storedUser = localStorage.getItem('user_' + email);

  if (storedUser) {
    // Parse the stored user object
    const user = JSON.parse(storedUser);

    // Check if the password matches
    if (user.password === password) {
      localStorage.setItem('loggedInUser', email); // Mark user as logged in
      window.location.href = 'dashboard.html'; // Redirect to dashboard
    } else {
      alert('Invalid email or password!');
    }
  } else {
    alert('Invalid email or password!');
  }
});


const storedUser = JSON.parse(localStorage.getItem('user_' + email));
console.log(storedUser.username, storedUser.password);