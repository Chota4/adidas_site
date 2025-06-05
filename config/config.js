require('dotenv').config();
const path = require('path');

// Default configuration
const defaults = {
    port: 3000,
    env: 'development',
    session: {
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            httpOnly: true,
            sameSite: 'strict'
        }
    }
};

// Environment-specific configuration
const config = {
    // Server configuration
    port: process.env.PORT || defaults.port,
    env: process.env.NODE_ENV || defaults.env,
    
    // Session configuration
    session: {
        secret: process.env.SESSION_SECRET || defaults.session.secret,
        resave: defaults.session.resave,
        saveUninitialized: defaults.session.saveUninitialized,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            maxAge: defaults.session.cookie.maxAge,
            httpOnly: defaults.session.cookie.httpOnly,
            sameSite: defaults.session.cookie.sameSite
        }
    },

    // File upload configuration
    upload: {
        maxFileSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
        uploadDir: path.join(__dirname, '../public/uploads')
    },

    // Security configuration
    security: {
        bcryptRounds: 10,
        jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret',
        jwtExpiration: '24h'
    },

    // Database configuration
    database: {
        mongodb: {
            uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/adidas_site',
            options: {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        },
        sequelize: {
            dialect: 'mysql',
            host: process.env.DB_HOST || 'localhost',
            username: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'adidas_site',
            logging: false
        }
    }
};

// Middleware configuration
const middleware = {
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },
    static: {
        directory: path.join(__dirname, '../public'),
        options: {
            maxAge: '1d',
            etag: true
        }
    },
    bodyParser: {
        json: { limit: '1mb' },
        urlencoded: { extended: true, limit: '1mb' }
    }
};

// Export configuration
module.exports = config;
module.exports.middleware = middleware; 