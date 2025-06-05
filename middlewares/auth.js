// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/login');
};

// Admin role middleware
const isAdmin = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    res.redirect('/user');
};

// User role middleware
const isUser = (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === 'user') {
        return next();
    }
    res.redirect('/login');
};

// Optional: JWT Authentication middleware
const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.redirect('/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.redirect('/login');
    }
};

// Role-based access control middleware
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        if (roles.includes(req.session.user.role)) {
            return next();
        }

        if (req.session.user.role === 'user') {
            return res.redirect('/user');
        }

        res.redirect('/login');
    };
};

module.exports = {
    isAuthenticated,
    isAdmin,
    isUser,
    authenticateJWT,
    checkRole
}; 