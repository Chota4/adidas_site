// Form validation
document.addEventListener('DOMContentLoaded', function() {
    // Get all forms with validation
    const forms = document.querySelectorAll('.needs-validation');

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    // Password strength meter
    const passwordInput = document.querySelector('input[type="password"]');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            updatePasswordStrengthMeter(strength);
        });
    }

    // Product image preview
    const imageInput = document.querySelector('input[type="file"]');
    if (imageInput) {
        imageInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.querySelector('#imagePreview');
                    if (preview) {
                        preview.src = e.target.result;
                        preview.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Delete confirmation
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!confirm('Are you sure you want to delete this item?')) {
                e.preventDefault();
            }
        });
    });
});

// Calculate password strength
function calculatePasswordStrength(password) {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Character type checks
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return Math.min(strength, 5);
}

// Update password strength meter
function updatePasswordStrengthMeter(strength) {
    const meter = document.querySelector('#passwordStrength');
    if (!meter) return;

    const strengthText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthClass = ['danger', 'warning', 'info', 'primary', 'success'];
    
    meter.style.width = `${(strength / 5) * 100}%`;
    meter.className = `progress-bar bg-${strengthClass[strength - 1]}`;
    meter.textContent = strengthText[strength - 1];
}

// Flash message auto-dismiss
const flashMessages = document.querySelectorAll('.alert');
flashMessages.forEach(message => {
    setTimeout(() => {
        message.classList.remove('show');
        setTimeout(() => message.remove(), 150);
    }, 5000);
});

// Mobile menu toggle
const menuToggle = document.querySelector('.navbar-toggler');
if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        document.querySelector('.navbar-collapse').classList.toggle('show');
    });
}

// Product search
const searchInput = document.querySelector('#productSearch');
if (searchInput) {
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const products = document.querySelectorAll('.product-card');
        
        products.forEach(product => {
            const title = product.querySelector('.product-title').textContent.toLowerCase();
            const description = product.querySelector('.product-description').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || description.includes(searchTerm)) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    });
} 