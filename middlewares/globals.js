/**
 * Global middleware for setting up common variables and functions
 * that will be available in all routes and views
 */

module.exports = (req, res, next) => {
    // User authentication state
    res.locals.user = req.session.user || null;
    res.locals.isAuthenticated = !!req.session.user;
    res.locals.isAdmin = req.session.user?.role === 'admin';
    res.locals.isUser = req.session.user?.role === 'user';

    // Flash messages
    res.locals.messages = {
        error: req.flash('error'),
        success: req.flash('success'),
        info: req.flash('info'),
        warning: req.flash('warning')
    };

    // Current path for navigation highlighting
    res.locals.currentPath = req.path;

    // Helper functions for views
    res.locals.helpers = {
        // Format currency
        formatCurrency: (amount) => {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            }).format(amount);
        },

        // Format date
        formatDate: (date) => {
            return new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },

        // Check if current path matches
        isActive: (path) => {
            return req.path === path ? 'active' : '';
        },

        // Truncate text
        truncate: (text, length = 100) => {
            if (text.length <= length) return text;
            return text.substring(0, length) + '...';
        }
    };

    // Error handling
    res.locals.handleError = (error) => {
        console.error(error);
        req.flash('error', error.message || 'An error occurred');
        return res.redirect('back');
    };

    // Success handling
    res.locals.handleSuccess = (message) => {
        req.flash('success', message);
        return res.redirect('back');
    };

    // CSRF token (if using csurf)
    if (req.csrfToken) {
        res.locals.csrfToken = req.csrfToken();
    }

    // Environment variables that are safe to expose to views
    res.locals.env = {
        NODE_ENV: process.env.NODE_ENV,
        APP_NAME: 'Adidas Site',
        APP_VERSION: '1.0.0'
    };

    // Debug information (only in development)
    if (process.env.NODE_ENV === 'development') {
        res.locals.debug = {
            session: req.session,
            cookies: req.cookies,
            headers: req.headers
        };
    }

    next();
}; 