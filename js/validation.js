/**
 * Validation Module - Form validation utilities
 */
const Validation = (function() {
    /**
     * Validate the event form data
     * @param {Object} formData - Form data object
     * @returns {Object} Validation result with isValid and errors
     */
    function validateForm(formData) {
        const errors = {};

        // Title validation (required)
        if (!formData.title || formData.title.trim() === '') {
            errors.title = 'Title is required';
        } else if (formData.title.length > 100) {
            errors.title = 'Title must be 100 characters or less';
        }

        // Date validation (required)
        if (!formData.date) {
            errors.date = 'Date is required';
        } else if (!isValidDate(formData.date)) {
            errors.date = 'Please enter a valid date';
        }

        // Time validation (optional, but if endTime provided, must be after startTime)
        if (formData.startTime && formData.endTime) {
            if (!isValidTimeRange(formData.startTime, formData.endTime)) {
                errors.endTime = 'End time must be after start time';
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }

    /**
     * Check if a date string is valid
     * @param {string} dateString - Date in YYYY-MM-DD format
     * @returns {boolean}
     */
    function isValidDate(dateString) {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date);
    }

    /**
     * Check if end time is after start time
     * @param {string} startTime - Start time in HH:MM format
     * @param {string} endTime - End time in HH:MM format
     * @returns {boolean}
     */
    function isValidTimeRange(startTime, endTime) {
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);

        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        return endMinutes > startMinutes;
    }

    /**
     * Show error message for a field
     * @param {string} fieldId - The input field ID
     * @param {string} message - Error message to display
     */
    function showError(fieldId, message) {
        const input = document.getElementById(fieldId);
        const errorSpan = document.getElementById(fieldId.replace('event', '').toLowerCase() + 'Error');

        if (input) {
            input.classList.add('error');
        }
        if (errorSpan) {
            errorSpan.textContent = message;
        }
    }

    /**
     * Clear all error messages
     */
    function clearErrors() {
        const errorSpans = document.querySelectorAll('.error-message');
        const inputs = document.querySelectorAll('.form-group input, .form-group textarea');

        errorSpans.forEach(span => span.textContent = '');
        inputs.forEach(input => input.classList.remove('error'));
    }

    /**
     * Display all validation errors
     * @param {Object} errors - Object with field names and error messages
     */
    function displayErrors(errors) {
        clearErrors();

        Object.entries(errors).forEach(([field, message]) => {
            const fieldId = 'event' + field.charAt(0).toUpperCase() + field.slice(1);
            showError(fieldId, message);
        });
    }

    return {
        validateForm,
        showError,
        clearErrors,
        displayErrors,
        isValidDate
    };
})();
