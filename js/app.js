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
        // Main navigation buttons
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');
        const todayBtn = document.getElementById('todayBtn');
        const createBtn = document.getElementById('createBtn');

        if (prevBtn) {
            prevBtn.addEventListener('click', Calendar.prevMonth);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', Calendar.nextMonth);
        }

        if (todayBtn) {
            todayBtn.addEventListener('click', Calendar.goToToday);
        }

        if (createBtn) {
            createBtn.addEventListener('click', () => {
                Modal.open('add');
            });
        }

        // Mini calendar navigation
        const miniPrev = document.getElementById('miniPrev');
        const miniNext = document.getElementById('miniNext');

        if (miniPrev) {
            miniPrev.addEventListener('click', Calendar.prevMonth);
        }

        if (miniNext) {
            miniNext.addEventListener('click', Calendar.nextMonth);
        }
    }

    return {
        init
    };
})();

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);
