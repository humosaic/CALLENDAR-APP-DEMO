/**
 * Calendar Module - Google Calendar style rendering
 */
const Calendar = (function() {
    let currentYear;
    let currentMonth;

    const MONTH_NAMES = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const DAY_NAMES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    /**
     * Initialize the calendar with current date
     */
    function init() {
        const today = new Date();
        currentYear = today.getFullYear();
        currentMonth = today.getMonth();
        render();
        renderMiniCalendar();
    }

    /**
     * Get the first day of the month (0 = Sunday, 6 = Saturday)
     */
    function getFirstDayOfMonth(year, month) {
        return new Date(year, month, 1).getDay();
    }

    /**
     * Get the number of days in a month
     */
    function getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    /**
     * Format date as YYYY-MM-DD
     */
    function formatDate(year, month, day) {
        const m = String(month + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        return `${year}-${m}-${d}`;
    }

    /**
     * Check if a date is today
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
     * Format time for display (e.g., "1pm", "9am")
     */
    function formatTime(timeStr) {
        if (!timeStr) return '';
        const [hours, minutes] = timeStr.split(':').map(Number);
        const period = hours >= 12 ? 'pm' : 'am';
        const hour12 = hours % 12 || 12;
        return minutes === 0 ? `${hour12}${period}` : `${hour12}:${String(minutes).padStart(2, '0')}${period}`;
    }

    /**
     * Render the main calendar
     */
    function render() {
        const headersContainer = document.getElementById('dayHeaders');
        const daysContainer = document.getElementById('calendarDays');
        const monthDisplay = document.getElementById('currentMonth');

        if (!headersContainer || !daysContainer || !monthDisplay) return;

        // Update month/year display
        monthDisplay.textContent = `${MONTH_NAMES[currentMonth]} ${currentYear}`;

        // Clear existing content
        headersContainer.innerHTML = '';
        daysContainer.innerHTML = '';

        const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);

        // Get events for display
        const events = Events.getEventsByMonth(currentYear, currentMonth);

        // Calculate week dates for headers (first week of visible calendar)
        const headerDates = [];
        for (let i = 0; i < 7; i++) {
            let dayNum;
            let month = currentMonth;
            let year = currentYear;

            if (i < firstDay) {
                // Previous month
                dayNum = daysInPrevMonth - (firstDay - 1) + i;
                month = currentMonth === 0 ? 11 : currentMonth - 1;
                year = currentMonth === 0 ? currentYear - 1 : currentYear;
            } else {
                dayNum = i - firstDay + 1;
            }
            headerDates.push({ day: dayNum, month, year });
        }

        // Create day headers with day name and date
        DAY_NAMES.forEach((name, idx) => {
            const header = document.createElement('div');
            header.className = 'day-header';

            const dateInfo = headerDates[idx];
            if (isToday(dateInfo.year, dateInfo.month, dateInfo.day)) {
                header.classList.add('today');
            }

            header.innerHTML = `
                <div class="day-name">${name}</div>
                <div class="day-number">${dateInfo.day}</div>
            `;
            headersContainer.appendChild(header);
        });

        // Create cells for previous month's trailing days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
            const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
            const cell = createDayCell(prevYear, prevMonth, day, true);
            daysContainer.appendChild(cell);
        }

        // Create cells for current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            const cell = createDayCell(currentYear, currentMonth, day, false, events);
            daysContainer.appendChild(cell);
        }

        // Fill remaining cells to complete the grid
        const totalCells = firstDay + daysInMonth;
        const remainingCells = Math.ceil(totalCells / 7) * 7 - totalCells;

        for (let day = 1; day <= remainingCells; day++) {
            const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
            const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
            const cell = createDayCell(nextYear, nextMonth, day, true);
            daysContainer.appendChild(cell);
        }

        // Update mini calendar
        renderMiniCalendar();
    }

    /**
     * Create a day cell element
     */
    function createDayCell(year, month, day, isOtherMonth, monthEvents = []) {
        const cell = document.createElement('div');
        cell.className = 'day-cell';

        if (isOtherMonth) {
            cell.classList.add('other-month');
        }

        const dateStr = formatDate(year, month, day);
        cell.dataset.date = dateStr;

        // Events for this day
        if (!isOtherMonth) {
            const dayEvents = monthEvents.filter(e => e.date === dateStr);

            if (dayEvents.length > 0) {
                cell.classList.add('has-events');

                const eventList = document.createElement('div');
                eventList.className = 'event-list';

                // Show up to 3 events
                const maxVisible = 3;
                dayEvents.slice(0, maxVisible).forEach(event => {
                    const eventItem = document.createElement('div');
                    eventItem.className = 'event-item';

                    if (event.startTime) {
                        eventItem.classList.add('timed');
                        eventItem.innerHTML = `<span class="event-time">${formatTime(event.startTime)}</span> ${event.title}`;
                    } else {
                        eventItem.classList.add('all-day');
                        eventItem.textContent = event.title;
                    }

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
     * Render the mini calendar in sidebar
     */
    function renderMiniCalendar() {
        const miniDays = document.getElementById('miniDays');
        const miniMonth = document.getElementById('miniMonth');

        if (!miniDays || !miniMonth) return;

        miniMonth.textContent = `${MONTH_NAMES[currentMonth]} ${currentYear}`;
        miniDays.innerHTML = '';

        const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
        const daysInMonth = getDaysInMonth(currentYear, currentMonth);
        const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);

        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            const day = daysInPrevMonth - i;
            const dayEl = document.createElement('div');
            dayEl.className = 'mini-day other-month';
            dayEl.textContent = day;
            miniDays.appendChild(dayEl);
        }

        // Current month days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'mini-day';

            if (isToday(currentYear, currentMonth, day)) {
                dayEl.classList.add('today');
            }

            dayEl.textContent = day;
            dayEl.addEventListener('click', () => {
                const dateStr = formatDate(currentYear, currentMonth, day);
                Modal.open('add', null, dateStr);
            });
            miniDays.appendChild(dayEl);
        }

        // Next month days
        const totalCells = firstDay + daysInMonth;
        const remainingCells = Math.ceil(totalCells / 7) * 7 - totalCells;

        for (let day = 1; day <= remainingCells; day++) {
            const dayEl = document.createElement('div');
            dayEl.className = 'mini-day other-month';
            dayEl.textContent = day;
            miniDays.appendChild(dayEl);
        }
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
     * Go to today
     */
    function goToToday() {
        const today = new Date();
        currentYear = today.getFullYear();
        currentMonth = today.getMonth();
        render();
    }

    /**
     * Get current year
     */
    function getCurrentYear() {
        return currentYear;
    }

    /**
     * Get current month
     */
    function getCurrentMonth() {
        return currentMonth;
    }

    return {
        init,
        render,
        prevMonth,
        nextMonth,
        goToToday,
        getCurrentYear,
        getCurrentMonth,
        formatDate
    };
})();
