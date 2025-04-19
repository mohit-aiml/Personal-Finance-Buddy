const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const logoutButton = document.getElementById('logout-button');

// Toggle forms
showSignup.addEventListener('click', () => {
  loginForm.classList.add('hidden');
  signupForm.classList.remove('hidden');
});

showLogin.addEventListener('click', () => {
  signupForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
});

// Signup: Save user credentials in localStorage (demo only)
signupForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value.trim().toLowerCase();
  const password = document.getElementById('signup-password').value;

  if (localStorage.getItem('user_' + email)) {
    alert('User already exists!');
  } else {
    localStorage.setItem('user_' + email, password);
    alert('Signup successful! Please login.');
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
  }
});

// Login: Verify credentials and redirect
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('login-email').value.trim().toLowerCase();
  const password = document.getElementById('login-password').value;

  const storedPassword = localStorage.getItem('user_' + email);
  if (storedPassword && storedPassword === password) {
    localStorage.setItem('loggedInUser', email); // Mark user as logged in
    window.location.href = 'dashboard.html'; // Redirect to dashboard
  } else {
    alert('Invalid email or password!');
  }
});

// Logout functionality
logoutButton.addEventListener('click', () => {
  localStorage.removeItem('loggedInUser');
  authSection.classList.remove('hidden');
  dashboardSection.classList.add('hidden');
});
