// Form validation and handling for authentication
document.addEventListener('DOMContentLoaded', () => {
    // Get all forms
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');

    // Validation patterns
    const patterns = {
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
        username: /^[a-zA-Z0-9_]{3,20}$/
    };

    // Error messages
    const errorMessages = {
        email: 'Please enter a valid email address',
        password: 'Password must be at least 6 characters long and contain both letters and numbers',
        username: 'Username must be 3-20 characters long and contain only letters, numbers, and underscores',
        required: 'This field is required'
    };

    // Show error message
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message') || document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(errorDiv);
        }
        
        input.classList.add('error');
    }

    // Clear error message
    function clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        input.classList.remove('error');
    }

    // Validate input
    function validateInput(input, pattern) {
        const value = input.value.trim();
        
        if (!value) {
            showError(input, errorMessages.required);
            return false;
        }

        if (pattern && !pattern.test(value)) {
            showError(input, errorMessages[input.name]);
            return false;
        }

        clearError(input);
        return true;
    }

    // Handle signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const username = signupForm.querySelector('[name="username"]');
            const email = signupForm.querySelector('[name="email"]');
            const password = signupForm.querySelector('[name="password"]');
            
            // Validate all fields
            const isUsernameValid = validateInput(username, patterns.username);
            const isEmailValid = validateInput(email, patterns.email);
            const isPasswordValid = validateInput(password, patterns.password);
            
            if (isUsernameValid && isEmailValid && isPasswordValid) {
                try {
                    const response = await fetch('/auth/signup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            username: username.value,
                            email: email.value,
                            password: password.value
                        })
                    });

                    const data = await response.json();
                    
                    if (response.ok) {
                        window.location.href = '/auth/login';
                    } else {
                        showError(email, data.error || 'Registration failed');
                    }
                } catch (error) {
                    console.error('Signup error:', error);
                    showError(email, 'An error occurred. Please try again.');
                }
            }
        });
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = loginForm.querySelector('[name="email"]');
            const password = loginForm.querySelector('[name="password"]');
            
            // Validate fields
            const isEmailValid = validateInput(email, patterns.email);
            const isPasswordValid = validateInput(password);
            
            if (isEmailValid && isPasswordValid) {
                try {
                    const response = await fetch('/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: email.value,
                            password: password.value
                        })
                    });

                    const data = await response.json();
                    
                    if (response.ok) {
                        window.location.href = data.redirect || '/';
                    } else {
                        showError(email, data.error || 'Invalid credentials');
                    }
                } catch (error) {
                    console.error('Login error:', error);
                    showError(email, 'An error occurred. Please try again.');
                }
            }
        });
    }

    // Handle forgot password form submission
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = forgotPasswordForm.querySelector('[name="email"]');
            
            // Validate email
            const isEmailValid = validateInput(email, patterns.email);
            
            if (isEmailValid) {
                try {
                    const response = await fetch('/auth/forgot-password', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: email.value
                        })
                    });

                    const data = await response.json();
                    
                    if (response.ok) {
                        // Show success message
                        const successDiv = document.createElement('div');
                        successDiv.className = 'success-message';
                        successDiv.textContent = data.message || 'Password reset instructions sent to your email';
                        forgotPasswordForm.appendChild(successDiv);
                        
                        // Clear form
                        forgotPasswordForm.reset();
                    } else {
                        showError(email, data.error || 'Failed to process request');
                    }
                } catch (error) {
                    console.error('Forgot password error:', error);
                    showError(email, 'An error occurred. Please try again.');
                }
            }
        });
    }

    // Real-time validation
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => {
            if (patterns[input.name]) {
                validateInput(input, patterns[input.name]);
            }
        });
    });
}); 