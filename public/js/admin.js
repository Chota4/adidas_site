// In-memory product storage
let products = [];

// DOM Elements
const addProductForm = document.getElementById('addProductForm');
const editProductForm = document.getElementById('editProductForm');
const productTableBody = document.getElementById('productTableBody');
const editModal = document.getElementById('editModal');
const closeModal = document.querySelector('.close');

// Event Listeners
addProductForm.addEventListener('submit', handleAddProduct);
editProductForm.addEventListener('submit', handleEditProduct);
closeModal.addEventListener('click', () => editModal.style.display = 'none');

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === editModal) {
        editModal.style.display = 'none';
    }
});

// Add Product
function handleAddProduct(e) {
    e.preventDefault();
    
    const product = {
        id: Date.now(),
        image: document.getElementById('image').value,
        name: document.getElementById('name').value,
        price: document.getElementById('price').value,
        description: document.getElementById('description').value
    };

    products.push(product);
    renderProducts();
    addProductForm.reset();
    showAlert('Product added successfully!', 'success');
}

// Edit Product
function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById('editId').value = product.id;
    document.getElementById('editImage').value = product.image;
    document.getElementById('editName').value = product.name;
    document.getElementById('editPrice').value = product.price;
    document.getElementById('editDescription').value = product.description;

    editModal.style.display = 'block';
}

function handleEditProduct(e) {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('editId').value);
    const productIndex = products.findIndex(p => p.id === id);
    
    if (productIndex === -1) return;

    products[productIndex] = {
        id,
        image: document.getElementById('editImage').value,
        name: document.getElementById('editName').value,
        price: document.getElementById('editPrice').value,
        description: document.getElementById('editDescription').value
    };

    renderProducts();
    editModal.style.display = 'none';
    showAlert('Product updated successfully!', 'success');
}

// Delete Product
function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    products = products.filter(p => p.id !== id);
    renderProducts();
    showAlert('Product deleted successfully!', 'success');
}

// Render Products
function renderProducts() {
    productTableBody.innerHTML = products.map(product => `
        <tr data-id="${product.id}">
            <td><img src="${product.image}" alt="${product.name}" class="table-img"></td>
            <td>${product.name}</td>
            <td>$${product.price}</td>
            <td>${product.description}</td>
            <td>
                <button class="action-btn edit" onclick="editProduct(${product.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteProduct(${product.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Show Alert
function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Initialize with sample data
products = [
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

// Initial render
renderProducts(); 