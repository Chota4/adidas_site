require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const { isAuthenticated, isAdmin, isUser, checkRole } = require('./middlewares/auth');
const config = require('./config/config');

// Import routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

// Import middleware
const twoFactorMiddleware = require('./middlewares/twoFactorMiddleware');

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');
app.use(expressLayouts);

// Middleware
app.use(cors(config.middleware.cors));
app.use(express.json(config.middleware.bodyParser.json));
app.use(express.urlencoded(config.middleware.bodyParser.urlencoded));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(session(config.session));
app.use(flash());

// Global middleware - must be after session and flash
app.use(require('./middlewares/globals'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Global variables middleware
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.messages = {
        error: req.flash('error'),
        success: req.flash('success')
    };
    next();
});

// Sample product data for frontend demo
const sampleProducts = [
    {
        id: 1,
        image: '/images/product1.jpg',
        name: 'Ultraboost 22',
        price: '180',
        description: 'Premium running shoes with responsive Boost midsole and Primeknit+ upper for ultimate comfort and energy return'
    },
    {
        id: 2,
        image: '/images/product2.jpg',
        name: 'Tiro Track Jacket',
        price: '85',
        description: 'Classic soccer-inspired jacket with modern fit, featuring moisture-wicking AEROREADY technology and signature 3-Stripes design'
    },
    {
        id: 3,
        image: '/images/product3.jpg',
        name: 'Adilette Slides',
        price: '35',
        description: 'Comfortable slides with cloudfoam cushioning, perfect for post-workout recovery or casual everyday wear'
    },
    {
        id: 4,
        image: '/images/product4.jpg',
        name: 'Forum Low',
        price: '100',
        description: 'Iconic basketball sneakers reimagined with premium leather, featuring the classic Forum design and modern comfort technology'
    },
    {
        id: 5,
        image: '/images/product5.jpg',
        name: 'Terrex Free Hiker',
        price: '160',
        description: 'Trail running shoes with Continental™ rubber outsole for superior grip, Boost midsole for energy return, and waterproof GORE-TEX® membrane'
    },
    {
        id: 6,
        image: '/images/product6.jpg',
        name: 'Primegreen T-Shirt',
        price: '45',
        description: 'Sustainable performance t-shirt made with recycled materials, featuring moisture-wicking AEROREADY technology and a modern athletic fit'
    }
];

// Routes
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

// Frontend routes
app.get('/', (req, res) => {
    res.render('index', { 
        title: 'Home',
        layout: 'layouts/main'
    });
});

app.get('/user', isAuthenticated, (req, res) => {
    res.render('user', { 
        title: 'User Dashboard',
        layout: 'layouts/main'
    });
});

app.get('/admin', [isAuthenticated, isAdmin], (req, res) => {
    res.render('admin', { 
        title: 'Admin Dashboard',
        layout: 'layouts/main'
    });
});

// Error handling middleware
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    // Set locals, only providing error in development
    res.locals.error = err;
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV === 'development' ? err : {};

    // Log error for debugging
    console.error(err.stack);

    // Render error page
    res.status(err.status || 500);
    res.render('error', {
        title: `${err.status || 500} Error`,
        message: err.message,
        error: process.env.NODE_ENV === 'development' ? err : {},
        layout: 'layouts/main'
    });
});

// Start server
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const ENV = process.env.NODE_ENV || 'development';

// Create a colorful startup message
const startupMessage = `
🚀 Server is running!
----------------------------------------
🌐 URL: http://${HOST}:${PORT}
⚡ Environment: ${ENV}
⏰ Started at: ${new Date().toLocaleString()}
----------------------------------------
`;

app.listen(PORT, () => {
    console.log(startupMessage);
});

module.exports = app;