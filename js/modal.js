/**
 * Modal Module - Modal dialog controller
 */
const Modal = (function() {
    let currentMode = 'add';
    let currentEventId = null;

    const elements = {
        modal: null,
        overlay: null,
        form: null,
        title: null,
        deleteBtn: null,
        closeBtn: null
    };

    /**
     * Initialize modal elements
     */
    function init() {
        elements.modal = document.getElementById('eventModal');
        elements.overlay = elements.modal.querySelector('.modal-overlay');
        elements.form = document.getElementById('eventForm');
        elements.title = document.getElementById('modalTitle');
        elements.deleteBtn = document.getElementById('deleteEventBtn');
        elements.closeBtn = document.getElementById('closeModal');

        // Event listeners
        elements.overlay.addEventListener('click', close);
        elements.closeBtn.addEventListener('click', close);
        elements.deleteBtn.addEventListener('click', handleDelete);
        elements.form.addEventListener('submit', handleSubmit);

        // Escape key listener
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !elements.modal.classList.contains('hidden')) {
                close();
            }
        });
    }

    /**
     * Open the modal
     * @param {string} mode - 'add' or 'edit'
     * @param {Object|null} event - Event object for edit mode
     * @param {string|null} date - Pre-selected date for add mode
     */
    function open(mode, event = null, date = null) {
        currentMode = mode;
        currentEventId = event ? event.id : null;

        // Update modal title
        elements.title.textContent = mode === 'add' ? 'Add Event' : 'Edit Event';

        // Show/hide delete button
        if (mode === 'edit') {
            elements.deleteBtn.classList.remove('hidden');
        } else {
            elements.deleteBtn.classList.add('hidden');
        }

        // Clear form and errors
        elements.form.reset();
        Validation.clearErrors();

        // Populate form
        if (mode === 'edit' && event) {
            document.getElementById('eventTitle').value = event.title;
            document.getElementById('eventDate').value = event.date;
            document.getElementById('eventStartTime').value = event.startTime || '';
            document.getElementById('eventEndTime').value = event.endTime || '';
            document.getElementById('eventDescription').value = event.description || '';
            document.getElementById('eventId').value = event.id;
        } else if (date) {
            document.getElementById('eventDate').value = date;
        }

        // Show modal
        elements.modal.classList.remove('hidden');

        // Focus first input
        document.getElementById('eventTitle').focus();
    }

    /**
     * Close the modal
     */
    function close() {
        elements.modal.classList.add('hidden');
        elements.form.reset();
        Validation.clearErrors();
        currentMode = 'add';
        currentEventId = null;
    }

    /**
     * Handle form submission
     * @param {Event} e - Submit event
     */
    function handleSubmit(e) {
        e.preventDefault();

        const formData = {
            title: document.getElementById('eventTitle').value,
            date: document.getElementById('eventDate').value,
            startTime: document.getElementById('eventStartTime').value,
            endTime: document.getElementById('eventEndTime').value,
            description: document.getElementById('eventDescription').value
        };

        // Validate
        const validation = Validation.validateForm(formData);

        if (!validation.isValid) {
            Validation.displayErrors(validation.errors);
            return;
        }

        // Save event
        if (currentMode === 'add') {
            Events.createEvent(formData);
        } else {
            Events.updateEvent(currentEventId, formData);
        }

        // Close modal and refresh calendar
        close();
        Calendar.render();
    }

    /**
     * Handle delete button click
     */
    function handleDelete() {
        if (!currentEventId) return;

        if (confirm('Are you sure you want to delete this event?')) {
            Events.deleteEvent(currentEventId);
            close();
            Calendar.render();
        }
    }

    return {
        init,
        open,
        close
    };
})();
