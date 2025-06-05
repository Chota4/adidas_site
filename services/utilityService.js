class UtilityService {
    /**
     * Format a date to a readable string
     * @param {Date|string} date - Date to format
     * @param {string} format - Format string (default: 'YYYY-MM-DD HH:mm:ss')
     * @returns {string} Formatted date string
     */
    static formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
        const d = new Date(date);
        
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    }

    /**
     * Format a price with currency symbol
     * @param {number} price - Price to format
     * @param {string} currency - Currency code (default: 'USD')
     * @returns {string} Formatted price string
     */
    static formatPrice(price, currency = 'USD') {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        });
        return formatter.format(price);
    }

    /**
     * Generate a random string
     * @param {number} length - Length of the string
     * @returns {string} Random string
     */
    static generateRandomString(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {boolean} True if email is valid
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Sanitize HTML string
     * @param {string} html - HTML string to sanitize
     * @returns {string} Sanitized HTML string
     */
    static sanitizeHTML(html) {
        return html
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    /**
     * Truncate text with ellipsis
     * @param {string} text - Text to truncate
     * @param {number} maxLength - Maximum length
     * @returns {string} Truncated text
     */
    static truncateText(text, maxLength = 100) {
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    }

    /**
     * Generate pagination data
     * @param {number} totalItems - Total number of items
     * @param {number} currentPage - Current page number
     * @param {number} itemsPerPage - Items per page
     * @returns {Object} Pagination data
     */
    static generatePagination(totalItems, currentPage = 1, itemsPerPage = 10) {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        return {
            currentPage,
            totalPages,
            itemsPerPage,
            totalItems,
            startPage,
            endPage,
            hasPreviousPage: currentPage > 1,
            hasNextPage: currentPage < totalPages,
            pages: Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i)
        };
    }

    /**
     * Generate a slug from a string
     * @param {string} text - Text to convert to slug
     * @returns {string} Slug string
     */
    static generateSlug(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    /**
     * Deep clone an object
     * @param {Object} obj - Object to clone
     * @returns {Object} Cloned object
     */
    static deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    /**
     * Debounce a function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle a function
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
    static throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

module.exports = UtilityService; 