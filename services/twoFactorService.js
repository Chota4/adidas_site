const crypto = require('crypto');

class TwoFactorService {
    // In-memory store for 2FA codes
    static codes = new Map();

    /**
     * Generate a 6-digit 2FA code
     * @returns {string} 6-digit code
     */
    static generateCode() {
        // Generate a random 6-digit number
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        return code;
    }

    /**
     * Create a 2FA code for a user
     * @param {string} userId - User ID
     * @param {string} email - User's email
     * @returns {Object} 2FA data
     */
    static createCode(userId, email) {
        const code = this.generateCode();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        const twoFactorData = {
            code,
            userId,
            email,
            expiresAt,
            attempts: 0
        };

        // Store the code
        this.codes.set(userId, twoFactorData);

        // For demo purposes, we'll just return the code
        // In production, this would be sent via email
        return {
            code,
            expiresAt
        };
    }

    /**
     * Verify a 2FA code
     * @param {string} userId - User ID
     * @param {string} code - Code to verify
     * @returns {Object} Verification result
     */
    static verifyCode(userId, code) {
        const twoFactorData = this.codes.get(userId);

        if (!twoFactorData) {
            return {
                valid: false,
                message: 'No 2FA code found for this user'
            };
        }

        // Check if code has expired
        if (new Date() > twoFactorData.expiresAt) {
            this.codes.delete(userId);
            return {
                valid: false,
                message: '2FA code has expired'
            };
        }

        // Check if too many attempts
        if (twoFactorData.attempts >= 3) {
            this.codes.delete(userId);
            return {
                valid: false,
                message: 'Too many failed attempts'
            };
        }

        // Verify code
        if (twoFactorData.code !== code) {
            twoFactorData.attempts++;
            return {
                valid: false,
                message: 'Invalid 2FA code'
            };
        }

        // Code is valid, clean up
        this.codes.delete(userId);

        return {
            valid: true,
            message: '2FA code verified successfully'
        };
    }

    /**
     * Check if user has a pending 2FA verification
     * @param {string} userId - User ID
     * @returns {boolean} True if 2FA is pending
     */
    static hasPendingVerification(userId) {
        return this.codes.has(userId);
    }

    /**
     * Clean up expired codes
     */
    static cleanupExpiredCodes() {
        const now = new Date();
        for (const [userId, data] of this.codes.entries()) {
            if (now > data.expiresAt) {
                this.codes.delete(userId);
            }
        }
    }

    /**
     * Get remaining time for a 2FA code
     * @param {string} userId - User ID
     * @returns {number|null} Remaining time in seconds or null if no code exists
     */
    static getRemainingTime(userId) {
        const data = this.codes.get(userId);
        if (!data) return null;

        const remaining = Math.max(0, Math.floor((data.expiresAt - new Date()) / 1000));
        return remaining;
    }
}

// Clean up expired codes every minute
setInterval(() => {
    TwoFactorService.cleanupExpiredCodes();
}, 60 * 1000);

module.exports = TwoFactorService; 