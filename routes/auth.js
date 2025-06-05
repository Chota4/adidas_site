const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { preventTwoFactorAccess } = require('../middlewares/twoFactorMiddleware');

// Auth routes
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);

// 2FA routes
router.get('/2fa', preventTwoFactorAccess, authController.getTwoFactor);
router.post('/2fa/verify', preventTwoFactorAccess, authController.verifyTwoFactor);

// Signup routes
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

// Password reset routes
router.get('/forgot-password', authController.getForgotPassword);
router.post('/forgot-password', authController.postForgotPassword);

module.exports = router; 