class Product {
    constructor({ id, name, price, description, image }) {
        this.id = id;
        this.name = name;
        this.price = parseFloat(price);
        this.description = description;
        this.image = image;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // Static method to create a new product
    static create(productData) {
        try {
            // Validate required fields
            if (!productData.name || !productData.price || !productData.description) {
                throw new Error('Name, price, and description are required');
            }

            // Validate price
            const price = parseFloat(productData.price);
            if (isNaN(price) || price <= 0) {
                throw new Error('Price must be a positive number');
            }

            // Create new product instance
            return new Product({
                ...productData,
                price
            });
        } catch (error) {
            throw new Error('Error creating product: ' + error.message);
        }
    }

    // Method to update product data
    update(updateData) {
        try {
            // Validate price if being updated
            if (updateData.price) {
                const price = parseFloat(updateData.price);
                if (isNaN(price) || price <= 0) {
                    throw new Error('Price must be a positive number');
                }
                updateData.price = price;
            }

            // Update product properties
            Object.assign(this, updateData);
            this.updatedAt = new Date();

            return this;
        } catch (error) {
            throw new Error('Error updating product: ' + error.message);
        }
    }

    // Method to get product data
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            description: this.description,
            image: this.image,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    // Static method to find product by ID (for database integration)
    static async findById(id) {
        // This is a stub for database integration
        // In a real implementation, this would query the database
        throw new Error('Database integration required');
    }

    // Static method to find all products (for database integration)
    static async findAll() {
        // This is a stub for database integration
        // In a real implementation, this would query the database
        throw new Error('Database integration required');
    }
}

// Example MongoDB Schema (for future reference)
/*
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Add methods to schema
productSchema.methods.toJSON = function() {
    return {
        id: this._id,
        name: this.name,
        price: this.price,
        description: this.description,
        image: this.image,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    };
};

module.exports = mongoose.model('Product', productSchema);
*/

// Example Sequelize Model (for future reference)
/*
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Product extends Model {}

Product.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: 0
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Product',
    timestamps: true
});

module.exports = Product;
*/

module.exports = Product; 