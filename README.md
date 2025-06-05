# Adidas Website

A full-featured e-commerce website built with Node.js, Express, and EJS.

## Features

- User authentication with 2FA support
- Role-based access control (User/Admin)
- Product management (CRUD operations)
- Session management
- Flash messages for user feedback
- Responsive design
- Form validation
- Security features (password hashing, session protection)

## Project Structure

```
adidas_site/
├── config/             # Configuration files
├── controllers/        # Route controllers
├── middleware/         # Custom middleware
├── models/            # Data models
├── public/            # Static files (CSS, JS, images)
├── routes/            # Route definitions
├── services/          # Utility services
├── views/             # EJS templates
│   ├── auth/          # Authentication views
│   ├── layouts/       # Layout templates
│   └── partials/      # Reusable view components
├── app.js             # Application entry point
└── package.json       # Project dependencies
```

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd adidas_site
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
SESSION_SECRET=your-secret-key
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm start`: Start the production server
- `npm run dev`: Start the development server with nodemon
- `npm test`: Run tests (if configured)

## Authentication Flow

1. User registration
2. Email verification (optional)
3. Login with email/password
4. Two-factor authentication (if enabled)
5. Session management

## API Endpoints

### Authentication
- POST /auth/signup - Register new user
- POST /auth/login - User login
- GET /auth/logout - User logout
- POST /auth/forgot-password - Request password reset
- POST /auth/2fa - Two-factor authentication

### Products
- GET /products - List all products
- GET /products/:id - Get product details
- POST /products - Create new product (admin only)
- PUT /products/:id - Update product (admin only)
- DELETE /products/:id - Delete product (admin only)

## Security Features

- Password hashing with bcrypt
- Session management with express-session
- CSRF protection
- XSS prevention
- Rate limiting
- Input validation
- Secure headers

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.