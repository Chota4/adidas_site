const TwoFactorService = require('../services/twoFactorService');

/**
 * Middleware to check if 2FA is required
 */
function requireTwoFactor(req, res, next) {
    // If user is already fully authenticated, proceed
    if (req.session.user && !req.session.requiresTwoFactor) {
        return next();
    }

    // If user has entered credentials but not completed 2FA
    if (req.session.pendingUser) {
        return res.redirect('/auth/2fa');
    }

    // Otherwise, redirect to login
    res.redirect('/auth/login');
}

/**
 * Middleware to check if 2FA is pending
 */
function checkTwoFactorPending(req, res, next) {
    if (!req.session.pendingUser) {
        return res.redirect('/auth/login');
    }
    next();
}

/**
 * Middleware to prevent access to 2FA page if not needed
 */
function preventTwoFactorAccess(req, res, next) {
    if (!req.session.pendingUser) {
        return res.redirect('/auth/login');
    }
    next();
}

/**
 * Middleware to handle 2FA verification
 */
async function verifyTwoFactor(req, res, next) {
    const { code } = req.body;
    const userId = req.session.pendingUser.id;

    const result = await TwoFactorService.verifyCode(userId, code);

    if (result.valid) {
        // Create full session
        req.session.user = req.session.pendingUser;
        delete req.session.pendingUser;
        delete req.session.requiresTwoFactor;

        // Set success message
        req.flash('success', 'Two-factor authentication successful');
        
        // Redirect to intended page or dashboard
        const redirectTo = req.session.redirectTo || '/';
        delete req.session.redirectTo;
        return res.redirect(redirectTo);
    }

    // Set error message and redirect back to 2FA page
    req.flash('error', result.message);
    res.redirect('/auth/2fa');
}

module.exports = {
    requireTwoFactor,
    checkTwoFactorPending,
    preventTwoFactorAccess,
    verifyTwoFactor
}; 