const bcrypt = require('bcryptjs');

class PasswordService {
    /**
     * Hash a password using bcrypt
     * @param {string} password - The plain text password to hash
     * @returns {Promise<string>} The hashed password
     */
    static async hashPassword(password) {
        try {
            const salt = await bcrypt.genSalt(10);
            return await bcrypt.hash(password, salt);
        } catch (error) {
            throw new Error('Error hashing password: ' + error.message);
        }
    }

    /**
     * Compare a plain text password with a hashed password
     * @param {string} password - The plain text password to compare
     * @param {string} hashedPassword - The hashed password to compare against
     * @returns {Promise<boolean>} True if passwords match, false otherwise
     */
    static async comparePassword(password, hashedPassword) {
        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (error) {
            throw new Error('Error comparing passwords: ' + error.message);
        }
    }

    /**
     * Generate a random password
     * @param {number} length - The length of the password (default: 12)
     * @returns {string} A random password
     */
    static generateRandomPassword(length = 12) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
        let password = '';
        
        // Ensure at least one of each character type
        password += charset.match(/[A-Z]/)[0]; // Uppercase
        password += charset.match(/[a-z]/)[0]; // Lowercase
        password += charset.match(/[0-9]/)[0]; // Number
        password += charset.match(/[!@#$%^&*()_+]/)[0]; // Special character
        
        // Fill the rest randomly
        for (let i = password.length; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            password += charset[randomIndex];
        }
        
        // Shuffle the password
        return password.split('').sort(() => Math.random() - 0.5).join('');
    }

    /**
     * Validate password strength
     * @param {string} password - The password to validate
     * @returns {Object} Validation result with isValid and message
     */
    static validatePasswordStrength(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

        const errors = [];
        
        if (password.length < minLength) {
            errors.push(`Password must be at least ${minLength} characters long`);
        }
        if (!hasUpperCase) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!hasLowerCase) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!hasNumbers) {
            errors.push('Password must contain at least one number');
        }
        if (!hasSpecialChar) {
            errors.push('Password must contain at least one special character');
        }

        return {
            isValid: errors.length === 0,
            message: errors.length > 0 ? errors.join('. ') : 'Password is strong'
        };
    }
}

module.exports = PasswordService; 