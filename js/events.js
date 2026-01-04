/**
 * Events Module - CRUD operations for calendar events
 */
const Events = (function() {
    /**
     * Generate a unique event ID
     * @returns {string} Unique ID
     */
    function generateId() {
        return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Create a new event
     * @param {Object} eventData - Event data from form
     * @returns {Object} Created event with ID
     */
    function createEvent(eventData) {
        const events = Storage.getEvents();

        const newEvent = {
            id: generateId(),
            title: eventData.title.trim(),
            date: eventData.date,
            startTime: eventData.startTime || '',
            endTime: eventData.endTime || '',
            description: eventData.description ? eventData.description.trim() : ''
        };

        events.push(newEvent);
        Storage.saveEvents(events);

        return newEvent;
    }

    /**
     * Update an existing event
     * @param {string} id - Event ID
     * @param {Object} eventData - Updated event data
     * @returns {Object|null} Updated event or null if not found
     */
    function updateEvent(id, eventData) {
        const events = Storage.getEvents();
        const index = events.findIndex(event => event.id === id);

        if (index === -1) return null;

        events[index] = {
            ...events[index],
            title: eventData.title.trim(),
            date: eventData.date,
            startTime: eventData.startTime || '',
            endTime: eventData.endTime || '',
            description: eventData.description ? eventData.description.trim() : ''
        };

        Storage.saveEvents(events);
        return events[index];
    }

    /**
     * Delete an event
     * @param {string} id - Event ID to delete
     * @returns {boolean} True if deleted, false if not found
     */
    function deleteEvent(id) {
        const events = Storage.getEvents();
        const filteredEvents = events.filter(event => event.id !== id);

        if (filteredEvents.length === events.length) return false;

        Storage.saveEvents(filteredEvents);
        return true;
    }

    /**
     * Get event by ID
     * @param {string} id - Event ID
     * @returns {Object|null} Event object or null
     */
    function getEventById(id) {
        const events = Storage.getEvents();
        return events.find(event => event.id === id) || null;
    }

    /**
     * Get all events for a specific date
     * @param {string} date - Date in YYYY-MM-DD format
     * @returns {Array} Array of events for that date
     */
    function getEventsByDate(date) {
        const events = Storage.getEvents();
        return events.filter(event => event.date === date);
    }

    /**
     * Get all events for a specific month
     * @param {number} year - Year
     * @param {number} month - Month (0-11)
     * @returns {Array} Array of events for that month
     */
    function getEventsByMonth(year, month) {
        const events = Storage.getEvents();
        return events.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getFullYear() === year && eventDate.getMonth() === month;
        });
    }

    return {
        createEvent,
        updateEvent,
        deleteEvent,
        getEventById,
        getEventsByDate,
        getEventsByMonth
    };
})();
