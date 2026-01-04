/**
 * Calendar Module - Calendar grid rendering and navigation
 */
const Calendar = (function() {
    let currentYear;
    let currentMonth;

    const MONTH_NAMES = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    /**
     * Initialize the calendar with current date
     */
    function init() {
        const today = new Date();
        currentYear = today.getFullYear();
        currentMonth = today.getMonth();
        render();
    }

    /**
     * Get the first day of the month (0 = Sunday, 6 = Saturday)
     * @param {number} year
     * @param {number} month
     * @returns {number}
     */
    function getFirstDayOfMonth(year, month) {
        return new Date(year, month, 1).getDay();
    }

    /**
     * Get the number of days in a month
     * @param {number} year
     * @param {number} month
     * @returns {number}
     */
    function getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    /**
     * Format date as YYYY-MM-DD
     * @param {number} year
     * @param {number} month
     * @param {number} day
     * @returns {string}
     */
    function formatDate(year, month, day) {
        const m = String(month + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        return `${year}-${m}-${d}`;
    }

    /**
     * Check if a date is today
     * @param {number} year
     * @param {number} month
     * @param {number} day
     * @returns {boolean}
     */
    function isToday(year, month, day) {
        const today = new Date();
        return (
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day
        );
    }

    /**
     * Render the calendar grid
     */
    function render() {
        const container = document.getElementById('calendarDays');
        const monthDisplay = document.getElementById('currentMonth');

        if (!container || !monthDisplay) return;

        // Update month/year display
        monthDisplay.textContent = `${MONTH_NAMES[currentMonth]} ${currentYear}`;

        // Clear existing cells
        container.innerHTML = '';

        const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);

        // Get events for this month
        const events = Events.getEventsByMonth(currentYear, currentMonth);

        // Create cells for previous month's trailing days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            const cell = createDayCell(prevYear, prevMonth, day, true);
            container.appendChild(cell);
        }

        // Create cells for current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = createDayCell(currentYear, currentMonth, day, false, events);
            container.appendChild(cell);
        }

        // Fill remaining cells to complete the grid (6 rows x 7 days = 42 cells)
        const totalCells = firstDay + daysInMonth;
        const remainingCells = Math.ceil(totalCells / 7) * 7 - totalCells;

        for (let day = 1; day <= remainingCells; day++) {
            const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
            const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
            const cell = createDayCell(nextYear, nextMonth, day, true);
            container.appendChild(cell);
        }
    }

    /**
     * Create a day cell element
     * @param {number} year
     * @param {number} month
     * @param {number} day
     * @param {boolean} isOtherMonth
     * @param {Array} monthEvents
     * @returns {HTMLElement}
     */
    function createDayCell(year, month, day, isOtherMonth, monthEvents = []) {
        const cell = document.createElement('div');
        cell.className = 'day-cell';

        if (isOtherMonth) {
            cell.classList.add('other-month');
        }

        if (!isOtherMonth && isToday(year, month, day)) {
            cell.classList.add('today');
        }

        const dateStr = formatDate(year, month, day);
        cell.dataset.date = dateStr;

        // Day number
        const dayNumber = document.createElement('span');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        cell.appendChild(dayNumber);

        // Events for this day
        if (!isOtherMonth) {
            const dayEvents = monthEvents.filter(e => e.date === dateStr);

            if (dayEvents.length > 0) {
                cell.classList.add('has-events');

                const eventList = document.createElement('div');
                eventList.className = 'event-list';

                // Show up to 2 events, then "more" indicator
                const maxVisible = 2;
                dayEvents.slice(0, maxVisible).forEach(event => {
                    const eventItem = document.createElement('div');
                    eventItem.className = 'event-item';
                    eventItem.textContent = event.title;
                    eventItem.dataset.eventId = event.id;
                    eventItem.addEventListener('click', (e) => {
                        e.stopPropagation();
                        Modal.open('edit', event);
                    });
                    eventList.appendChild(eventItem);
                });

                if (dayEvents.length > maxVisible) {
                    const more = document.createElement('div');
                    more.className = 'event-more';
                    more.textContent = `+${dayEvents.length - maxVisible} more`;
                    eventList.appendChild(more);
                }

                cell.appendChild(eventList);
            }
        }

        // Click handler to add event on this date
        cell.addEventListener('click', () => {
            Modal.open('add', null, dateStr);
        });

        return cell;
    }

    /**
     * Navigate to previous month
     */
    function prevMonth() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        render();
    }

    /**
     * Navigate to next month
     */
    function nextMonth() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        render();
    }

    /**
     * Get current year
     * @returns {number}
     */
    function getCurrentYear() {
        return currentYear;
    }

    /**
     * Get current month
     * @returns {number}
     */
    function getCurrentMonth() {
        return currentMonth;
    }

    return {
        init,
        render,
        prevMonth,
        nextMonth,
        getCurrentYear,
        getCurrentMonth,
        formatDate
    };
})();
