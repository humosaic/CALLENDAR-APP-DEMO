/**
 * App Module - Main application entry point
 */
const App = (function() {
    /**
     * Initialize the application
     */
    function init() {
        // Initialize modules
        Modal.init();
        Calendar.init();

        // Set up event listeners
        setupEventListeners();
    }

    /**
     * Set up global event listeners
     */
    function setupEventListeners() {
        // Navigation buttons
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');
        const addEventBtn = document.getElementById('addEventBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', Calendar.prevMonth);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', Calendar.nextMonth);
        }

        if (addEventBtn) {
            addEventBtn.addEventListener('click', () => {
                Modal.open('add');
            });
        }
    }

    return {
        init
    };
})();

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);
