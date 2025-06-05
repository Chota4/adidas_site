const bcrypt = require('bcryptjs');
const User = require('../models/User');
const PasswordService = require('../services/passwordService');
const TwoFactorService = require('../services/twoFactorService');
const SessionService = require('../services/sessionService');

// In-memory user storage
const users = [];

// Helper function to find user by email
const findUserByEmail = (email) => {
    return users.find(user => user.email === email);
};

class AuthController {
    // Show signup form
    getSignup(req, res) {
        res.render('auth/signup', {
            title: 'Sign Up',
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });
    }

    // Handle user registration
    async postSignup(req, res) {
        try {
            const { username, email, password, role = 'user' } = req.body;

            // Input validation
            if (!username || !email || !password) {
                req.flash('error', 'All fields are required');
                return res.redirect('/auth/signup');
            }

            // Email format validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                req.flash('error', 'Invalid email format');
                return res.redirect('/auth/signup');
            }

            // Password strength validation
            if (password.length < 6) {
                req.flash('error', 'Password must be at least 6 characters long');
                return res.redirect('/auth/signup');
            }

            // Check if user already exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                req.flash('error', 'Email already registered');
                return res.redirect('/auth/signup');
            }

            // Create new user
            const user = await User.create({
                username,
                email,
                password,
                role
            });

            req.flash('success', 'Registration successful! Please login.');
            res.redirect('/auth/login');
        } catch (error) {
            console.error('Signup error:', error);
            req.flash('error', 'Registration failed. Please try again.');
            res.redirect('/auth/signup');
        }
    }

    // Show login form
    getLogin(req, res) {
        res.render('auth/login', {
            title: 'Login',
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });
    }

    // Handle user login
    async postLogin(req, res) {
        try {
            const { email, password } = req.body;

            // Find user
            const user = await User.findByEmail(email);
            if (!user) {
                req.flash('error', 'Invalid credentials');
                return res.redirect('/auth/login');
            }

            // Verify password
            const isValidPassword = await user.verifyPassword(password);
            if (!isValidPassword) {
                req.flash('error', 'Invalid credentials');
                return res.redirect('/auth/login');
            }

            // Generate 2FA code
            const twoFactorData = TwoFactorService.createCode(user.id, user.email);

            // Store user data in session (not fully authenticated yet)
            req.session.pendingUser = {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role
            };
            req.session.requiresTwoFactor = true;

            // Redirect to 2FA page
            res.render('auth/2fa', {
                title: 'Two-Factor Authentication',
                messages: {
                    error: req.flash('error'),
                    success: req.flash('success')
                },
                code: twoFactorData.code // For demo purposes only
            });
        } catch (error) {
            console.error('Login error:', error);
            req.flash('error', 'Login failed. Please try again.');
            res.redirect('/auth/login');
        }
    }

    // Handle user logout
    async logout(req, res) {
        try {
            await SessionService.destroySession(req);
            res.redirect('/');
        } catch (error) {
            console.error('Logout error:', error);
            res.redirect('/');
        }
    }

    // Show forgot password form
    getForgotPassword(req, res) {
        res.render('auth/forgot-password', {
            title: 'Forgot Password',
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });
    }

    // Handle password reset request
    async postForgotPassword(req, res) {
        try {
            const { email } = req.body;

            // Check if user exists
            const user = await User.findByEmail(email);
            if (!user) {
                req.flash('error', 'No account found with that email');
                return res.redirect('/auth/forgot-password');
            }

            // Simulate sending reset email
            req.flash('success', 'If an account exists with that email, you will receive a password reset link.');
            res.redirect('/auth/login');
        } catch (error) {
            console.error('Forgot password error:', error);
            req.flash('error', 'An error occurred. Please try again.');
            res.redirect('/auth/forgot-password');
        }
    }

    // Render 2FA form
    getTwoFactor(req, res) {
        if (!req.session.pendingUser) {
            return res.redirect('/auth/login');
        }

        res.render('auth/2fa', {
            title: 'Two-Factor Authentication',
            messages: {
                error: req.flash('error'),
                success: req.flash('success')
            }
        });
    }

    // Handle 2FA verification
    async verifyTwoFactor(req, res) {
        try {
            const { code } = req.body;
            const userId = req.session.pendingUser.id;

            const result = await TwoFactorService.verifyCode(userId, code);

            if (result.valid) {
                // Create full session
                req.session.user = req.session.pendingUser;
                delete req.session.pendingUser;
                delete req.session.requiresTwoFactor;

                req.flash('success', 'Login successful');
                res.redirect('/');
            } else {
                req.flash('error', result.message);
                res.redirect('/auth/2fa');
            }
        } catch (error) {
            console.error('2FA verification error:', error);
            req.flash('error', 'An error occurred during verification');
            res.redirect('/auth/2fa');
        }
    }
}

module.exports = new AuthController(); 