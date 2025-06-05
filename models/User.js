const bcrypt = require('bcryptjs');
const { config } = require('../config/config');

class User {
    constructor({ id, username, email, password, role = 'user' }) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.role = role;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // Static method to create a new user
    static async create(userData) {
        try {
            // Hash password
            const hashedPassword = await bcrypt.hash(
                userData.password,
                config.security.bcryptRounds
            );

            // Create new user instance
            return new User({
                ...userData,
                password: hashedPassword
            });
        } catch (error) {
            throw new Error('Error creating user: ' + error.message);
        }
    }

    // Method to verify password
    async verifyPassword(password) {
        try {
            return await bcrypt.compare(password, this.password);
        } catch (error) {
            throw new Error('Error verifying password: ' + error.message);
        }
    }

    // Method to update user data
    async update(updateData) {
        try {
            // If password is being updated, hash it
            if (updateData.password) {
                updateData.password = await bcrypt.hash(
                    updateData.password,
                    config.security.bcryptRounds
                );
            }

            // Update user properties
            Object.assign(this, updateData);
            this.updatedAt = new Date();

            return this;
        } catch (error) {
            throw new Error('Error updating user: ' + error.message);
        }
    }

    // Method to get public user data (without sensitive information)
    toPublicJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            role: this.role,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    // Static method to find user by email (for database integration)
    static async findByEmail(email) {
        // This is a stub for database integration
        // In a real implementation, this would query the database
        throw new Error('Database integration required');
    }

    // Static method to find user by ID (for database integration)
    static async findById(id) {
        // This is a stub for database integration
        // In a real implementation, this would query the database
        throw new Error('Database integration required');
    }
}

// Example MongoDB Schema (for future reference)
/*
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, {
    timestamps: true
});

// Add methods to schema
userSchema.methods.verifyPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.toPublicJSON = function() {
    return {
        id: this._id,
        username: this.username,
        email: this.email,
        role: this.role,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    };
};

module.exports = mongoose.model('User', userSchema);
*/

module.exports = User; 