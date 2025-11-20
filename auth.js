const API_BASE_URL = 'http://localhost:3000/api';

// Check if user is already logged in
window.addEventListener('DOMContentLoaded', function() {
    const user = sessionStorage.getItem('user');
    if (user) {
        window.location.href = 'index.html';
    }
    
    // Setup form listeners
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
});

function showLogin() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('signupForm').style.display = 'none';
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    document.querySelectorAll('.tab-btn')[1].classList.remove('active');
}

function showSignup() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';
    document.querySelectorAll('.tab-btn')[0].classList.remove('active');
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
}

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('login_username').value.trim();
    const password = document.getElementById('login_password').value;
    
    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Store user info in session storage
            sessionStorage.setItem('user', JSON.stringify(data.user));
            alert('Login successful! Welcome ' + data.user.full_name);
            window.location.href = 'index.html';
        } else {
            alert('Login failed: ' + data.error);
        }
    } catch (error) {
        alert('Error during login: ' + error.message);
    }
}

async function handleSignup(e) {
    e.preventDefault();
    
    const full_name = document.getElementById('signup_fullname').value.trim();
    const username = document.getElementById('signup_username').value.trim();
    const email = document.getElementById('signup_email').value.trim();
    const phone = document.getElementById('signup_phone').value.trim();
    const password = document.getElementById('signup_password').value;
    const confirm_password = document.getElementById('signup_confirm_password').value;
    
    if (!full_name || !username || !email || !password) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (password !== confirm_password) {
        alert('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password, full_name, phone })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Registration successful! Please login with your credentials');
            document.getElementById('signupForm').reset();
            showLogin();
        } else {
            alert('Registration failed: ' + data.error);
        }
    } catch (error) {
        alert('Error during registration: ' + error.message);
    }
}
