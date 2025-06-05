// Product management functionality
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    const productForm = document.getElementById('productForm');
    const productList = document.getElementById('productList');
    const addProductBtn = document.getElementById('addProductBtn');
    const editModal = document.getElementById('editModal');
    const closeModalBtn = document.querySelector('.close-modal');

    // Validation patterns
    const patterns = {
        name: /^[a-zA-Z0-9\s-]{3,50}$/,
        price: /^\d+(\.\d{1,2})?$/,
        description: /^.{10,500}$/
    };

    // Error messages
    const errorMessages = {
        name: 'Product name must be 3-50 characters long and contain only letters, numbers, spaces, and hyphens',
        price: 'Price must be a valid number with up to 2 decimal places',
        description: 'Description must be 10-500 characters long',
        required: 'This field is required'
    };

    // Show error message
    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message') || document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(errorDiv);
        }
        
        input.classList.add('error');
    }

    // Clear error message
    function clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorDiv = formGroup.querySelector('.error-message');
        if (errorDiv) {
            errorDiv.remove();
        }
        input.classList.remove('error');
    }

    // Validate input
    function validateInput(input, pattern) {
        const value = input.value.trim();
        
        if (!value) {
            showError(input, errorMessages.required);
            return false;
        }

        if (pattern && !pattern.test(value)) {
            showError(input, errorMessages[input.name]);
            return false;
        }

        clearError(input);
        return true;
    }

    // Show success message
    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.textContent = message;
        document.body.insertBefore(successDiv, document.body.firstChild);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    // Show error alert
    function showAlert(message, type = 'error') {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.textContent = message;
        document.body.insertBefore(alertDiv, document.body.firstChild);
        
        setTimeout(() => {
            alertDiv.remove();
        }, 3000);
    }

    // Confirm delete
    function confirmDelete(productId, productName) {
        return new Promise((resolve) => {
            const confirmDiv = document.createElement('div');
            confirmDiv.className = 'confirm-dialog';
            confirmDiv.innerHTML = `
                <div class="confirm-content">
                    <h3>Confirm Delete</h3>
                    <p>Are you sure you want to delete "${productName}"?</p>
                    <div class="confirm-buttons">
                        <button class="btn btn-danger" id="confirmDelete">Delete</button>
                        <button class="btn btn-secondary" id="cancelDelete">Cancel</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(confirmDiv);
            
            document.getElementById('confirmDelete').addEventListener('click', () => {
                confirmDiv.remove();
                resolve(true);
            });
            
            document.getElementById('cancelDelete').addEventListener('click', () => {
                confirmDiv.remove();
                resolve(false);
            });
        });
    }

    // Add product
    async function addProduct(productData) {
        try {
            const response = await fetch('/admin/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            const data = await response.json();
            
            if (response.ok) {
                showSuccess('Product added successfully');
                return data.product;
            } else {
                throw new Error(data.error || 'Failed to add product');
            }
        } catch (error) {
            showAlert(error.message);
            throw error;
        }
    }

    // Update product
    async function updateProduct(productId, productData) {
        try {
            const response = await fetch(`/admin/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });

            const data = await response.json();
            
            if (response.ok) {
                showSuccess('Product updated successfully');
                return data.product;
            } else {
                throw new Error(data.error || 'Failed to update product');
            }
        } catch (error) {
            showAlert(error.message);
            throw error;
        }
    }

    // Delete product
    async function deleteProduct(productId) {
        try {
            const response = await fetch(`/admin/products/${productId}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            
            if (response.ok) {
                showSuccess('Product deleted successfully');
                return data.product;
            } else {
                throw new Error(data.error || 'Failed to delete product');
            }
        } catch (error) {
            showAlert(error.message);
            throw error;
        }
    }

    // Handle form submission
    if (productForm) {
        productForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = productForm.querySelector('[name="name"]');
            const price = productForm.querySelector('[name="price"]');
            const description = productForm.querySelector('[name="description"]');
            const image = productForm.querySelector('[name="image"]');
            
            // Validate all fields
            const isNameValid = validateInput(name, patterns.name);
            const isPriceValid = validateInput(price, patterns.price);
            const isDescriptionValid = validateInput(description, patterns.description);
            
            if (isNameValid && isPriceValid && isDescriptionValid) {
                const productData = {
                    name: name.value,
                    price: price.value,
                    description: description.value,
                    image: image.value || '/images/default-product.jpg'
                };

                try {
                    const productId = productForm.dataset.productId;
                    let result;

                    if (productId) {
                        result = await updateProduct(productId, productData);
                    } else {
                        result = await addProduct(productData);
                    }

                    // Update UI
                    if (result) {
                        productForm.reset();
                        if (productId) {
                            editModal.style.display = 'none';
                        }
                        // Refresh product list or update specific product
                        location.reload();
                    }
                } catch (error) {
                    console.error('Form submission error:', error);
                }
            }
        });
    }

    // Handle delete buttons
    if (productList) {
        productList.addEventListener('click', async (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const productId = e.target.dataset.productId;
                const productName = e.target.dataset.productName;
                
                const confirmed = await confirmDelete(productId, productName);
                
                if (confirmed) {
                    try {
                        await deleteProduct(productId);
                        // Remove product from UI
                        e.target.closest('.product-item').remove();
                    } catch (error) {
                        console.error('Delete error:', error);
                    }
                }
            }
        });
    }

    // Handle edit buttons
    if (productList) {
        productList.addEventListener('click', (e) => {
            if (e.target.classList.contains('edit-btn')) {
                const productId = e.target.dataset.productId;
                const productName = e.target.dataset.productName;
                const productPrice = e.target.dataset.productPrice;
                const productDescription = e.target.dataset.productDescription;
                const productImage = e.target.dataset.productImage;
                
                // Populate form
                const form = document.getElementById('productForm');
                form.dataset.productId = productId;
                form.querySelector('[name="name"]').value = productName;
                form.querySelector('[name="price"]').value = productPrice;
                form.querySelector('[name="description"]').value = productDescription;
                form.querySelector('[name="image"]').value = productImage;
                
                // Show modal
                editModal.style.display = 'block';
            }
        });
    }

    // Close modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            editModal.style.display = 'none';
            productForm.reset();
            delete productForm.dataset.productId;
        });
    }

    // Real-time validation
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => {
            if (patterns[input.name]) {
                validateInput(input, patterns[input.name]);
            }
        });
    });
}); 