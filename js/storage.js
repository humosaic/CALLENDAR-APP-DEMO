/**
 * Storage Module - LocalStorage wrapper for calendar events
 */
const Storage = (function() {
    const STORAGE_KEY = 'calendar_events';

    /**
     * Get all events from localStorage
     * @returns {Array} Array of event objects
     */
    function getEvents() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) return [];
            const events = JSON.parse(data);
            return Array.isArray(events) ? events : [];
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    }

    /**
     * Save events to localStorage
     * @param {Array} events - Array of event objects to save
     */
    function saveEvents(events) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    return {
        getEvents,
        saveEvents
    };
})();
