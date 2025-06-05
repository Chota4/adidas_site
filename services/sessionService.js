const { v4: uuidv4 } = require('uuid');

class SessionService {
    /**
     * Create a new session for a user
     * @param {Object} req - Express request object
     * @param {Object} user - User object
     * @returns {Object} Session data
     */
    static createSession(req, user) {
        try {
            // Create session data
            const sessionData = {
                id: uuidv4(),
                userId: user.id,
                username: user.username,
                role: user.role,
                createdAt: new Date(),
                lastActivity: new Date()
            };

            // Store in session
            req.session.user = sessionData;
            
            return sessionData;
        } catch (error) {
            throw new Error('Error creating session: ' + error.message);
        }
    }

    /**
     * Destroy a user's session
     * @param {Object} req - Express request object
     * @returns {Promise<void>}
     */
    static async destroySession(req) {
        return new Promise((resolve, reject) => {
            req.session.destroy((err) => {
                if (err) {
                    reject(new Error('Error destroying session: ' + err.message));
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * Update session's last activity timestamp
     * @param {Object} req - Express request object
     */
    static updateLastActivity(req) {
        if (req.session.user) {
            req.session.user.lastActivity = new Date();
        }
    }

    /**
     * Check if session is expired
     * @param {Object} session - Session object
     * @param {number} maxAge - Maximum session age in milliseconds
     * @returns {boolean} True if session is expired
     */
    static isSessionExpired(session, maxAge = 24 * 60 * 60 * 1000) { // Default: 24 hours
        if (!session || !session.user || !session.user.lastActivity) {
            return true;
        }

        const lastActivity = new Date(session.user.lastActivity);
        const now = new Date();
        return (now - lastActivity) > maxAge;
    }

    /**
     * Get current user from session
     * @param {Object} req - Express request object
     * @returns {Object|null} User data or null if not logged in
     */
    static getCurrentUser(req) {
        return req.session.user || null;
    }

    /**
     * Check if user is authenticated
     * @param {Object} req - Express request object
     * @returns {boolean} True if user is authenticated
     */
    static isAuthenticated(req) {
        return !!req.session.user;
    }

    /**
     * Check if user has admin role
     * @param {Object} req - Express request object
     * @returns {boolean} True if user is admin
     */
    static isAdmin(req) {
        return req.session.user && req.session.user.role === 'admin';
    }

    /**
     * Require authentication middleware
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next function
     */
    static requireAuth(req, res, next) {
        if (!this.isAuthenticated(req)) {
            return res.status(401).json({ error: 'Authentication required' });
        }
        next();
    }

    /**
     * Require admin role middleware
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next function
     */
    static requireAdmin(req, res, next) {
        if (!this.isAdmin(req)) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        next();
    }

    /**
     * Session activity middleware
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next function
     */
    static sessionActivity(req, res, next) {
        this.updateLastActivity(req);
        next();
    }
}

module.exports = SessionService; 