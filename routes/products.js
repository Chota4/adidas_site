const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middlewares/auth');

// In-memory product storage
const products = [
    {
        id: 1,
        name: 'Ultraboost 22',
        price: 180,
        description: 'Premium running shoes with responsive Boost midsole',
        image: '/images/product1.jpg'
    },
    {
        id: 2,
        name: 'Tiro Track Jacket',
        price: 85,
        description: 'Classic soccer-inspired jacket with modern fit',
        image: '/images/product2.jpg'
    }
];

// GET /user - User dashboard
router.get('/user', isAuthenticated, (req, res) => {
    res.render('user', {
        products,
        user: req.session.user
    });
});

// GET /admin - Admin dashboard
router.get('/admin', isAdmin, (req, res) => {
    res.render('admin', {
        products,
        user: req.session.user
    });
});

// POST /admin/products - Add new product (admin only)
router.post('/admin/products', isAdmin, (req, res) => {
    try {
        const { name, price, description, image } = req.body;

        // Input validation
        if (!name || !price || !description) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Create new product
        const newProduct = {
            id: products.length + 1,
            name,
            price: parseFloat(price),
            description,
            image: image || '/images/default-product.jpg'
        };

        products.push(newProduct);

        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add product' });
    }
});

// PUT /admin/products/:id - Update product (admin only)
router.put('/admin/products/:id', isAdmin, (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description, image } = req.body;

        // Find product
        const productIndex = products.findIndex(p => p.id === parseInt(id));
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Update product
        products[productIndex] = {
            ...products[productIndex],
            name: name || products[productIndex].name,
            price: price ? parseFloat(price) : products[productIndex].price,
            description: description || products[productIndex].description,
            image: image || products[productIndex].image
        };

        res.json(products[productIndex]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// DELETE /admin/products/:id - Delete product (admin only)
router.delete('/admin/products/:id', isAdmin, (req, res) => {
    try {
        const { id } = req.params;

        // Find product
        const productIndex = products.findIndex(p => p.id === parseInt(id));
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Remove product
        const deletedProduct = products.splice(productIndex, 1)[0];

        res.json(deletedProduct);
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

module.exports = router; 