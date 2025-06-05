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

// Product Controller
const productController = {
    // Show user dashboard with products
    getUserDashboard: (req, res) => {
        res.render('user', {
            products,
            user: req.session.user
        });
    },

    // Show admin dashboard with products
    getAdminDashboard: (req, res) => {
        res.render('admin', {
            products,
            user: req.session.user
        });
    },

    // Add new product (admin only)
    addProduct: (req, res) => {
        try {
            const { name, price, description, image } = req.body;

            // Input validation
            if (!name || !price || !description) {
                return res.status(400).json({
                    success: false,
                    error: 'All fields are required'
                });
            }

            // Price validation
            const numericPrice = parseFloat(price);
            if (isNaN(numericPrice) || numericPrice <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Price must be a positive number'
                });
            }

            // Create new product
            const newProduct = {
                id: products.length + 1,
                name,
                price: numericPrice,
                description,
                image: image || '/images/default-product.jpg'
            };

            products.push(newProduct);

            res.status(201).json({
                success: true,
                product: newProduct
            });
        } catch (error) {
            console.error('Add product error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to add product'
            });
        }
    },

    // Update product (admin only)
    updateProduct: (req, res) => {
        try {
            const { id } = req.params;
            const { name, price, description, image } = req.body;

            // Find product
            const productIndex = products.findIndex(p => p.id === parseInt(id));
            if (productIndex === -1) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }

            // Price validation if provided
            if (price) {
                const numericPrice = parseFloat(price);
                if (isNaN(numericPrice) || numericPrice <= 0) {
                    return res.status(400).json({
                        success: false,
                        error: 'Price must be a positive number'
                    });
                }
            }

            // Update product
            products[productIndex] = {
                ...products[productIndex],
                name: name || products[productIndex].name,
                price: price ? parseFloat(price) : products[productIndex].price,
                description: description || products[productIndex].description,
                image: image || products[productIndex].image
            };

            res.json({
                success: true,
                product: products[productIndex]
            });
        } catch (error) {
            console.error('Update product error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to update product'
            });
        }
    },

    // Delete product (admin only)
    deleteProduct: (req, res) => {
        try {
            const { id } = req.params;

            // Find product
            const productIndex = products.findIndex(p => p.id === parseInt(id));
            if (productIndex === -1) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }

            // Remove product
            const deletedProduct = products.splice(productIndex, 1)[0];

            res.json({
                success: true,
                product: deletedProduct
            });
        } catch (error) {
            console.error('Delete product error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to delete product'
            });
        }
    },

    // Get all products
    getAllProducts: (req, res) => {
        res.json({
            success: true,
            products
        });
    },

    // Get single product
    getProduct: (req, res) => {
        try {
            const { id } = req.params;

            const product = products.find(p => p.id === parseInt(id));
            if (!product) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found'
                });
            }

            res.json({
                success: true,
                product
            });
        } catch (error) {
            console.error('Get product error:', error);
            res.status(500).json({
                success: false,
                error: 'Failed to get product'
            });
        }
    }
};

module.exports = productController; 