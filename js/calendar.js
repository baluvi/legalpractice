/**
 * Calendar Module
 * Renders the calendar widget and handles date navigation.
 */

App.Calendar = {
    init() {
        this.render();
        
        // Bind Controls (Prev/Next)
        const prevBtns = document.querySelectorAll('.js-prev-month');
        const nextBtns = document.querySelectorAll('.js-next-month');

        prevBtns.forEach(btn => btn.addEventListener('click', () => this.changeMonth(-1)));
        nextBtns.forEach(btn => btn.addEventListener('click', () => this.changeMonth(1)));
    },

    changeMonth(step) {
        App.state.currMonth += step;
        if (App.state.currMonth < 0) {
            App.state.currMonth = 11;
            App.state.currYear--;
        } else if (App.state.currMonth > 11) {
            App.state.currMonth = 0;
            App.state.currYear++;
        }
        this.render();
    },

    render() {
        const { currMonth, currYear, currentDate } = App.state;
        const monthName = App.config.months[currMonth];

        // Update Labels
        document.querySelectorAll('.js-month-label').forEach(el => el.innerText = `${monthName} ${currYear}`);

        // Calculate Dates
        const firstDay = new Date(currYear, currMonth, 1).getDay();
        const lastDate = new Date(currYear, currMonth + 1, 0).getDate();

        // Render Grids
        document.querySelectorAll('.js-calendar-grid').forEach(grid => {
            // Clear existing days (keep headers)
            grid.querySelectorAll('.day-number').forEach(el => el.remove());

            // Add empty slots
            for (let i = 0; i < firstDay; i++) {
                const empty = document.createElement('div');
                empty.className = 'day-number';
                grid.appendChild(empty);
            }

            // Add days
            for (let i = 1; i <= lastDate; i++) {
                const day = document.createElement('div');
                day.className = 'day-number';
                day.innerText = i;

                // Highlight today
                if (i === currentDate.getDate() && 
                    currMonth === currentDate.getMonth() && 
                    currYear === currentDate.getFullYear()) {
                    day.classList.add('selected');
                }

                // Click event for sync highlighting
                day.addEventListener('click', function() {
                    document.querySelectorAll('.day-number.selected').forEach(el => el.classList.remove('selected'));
                    
                    // Select this number in ALL calendars
                    const num = this.innerText;
                    document.querySelectorAll('.day-number').forEach(d => {
                        if(d.innerText === num) d.classList.add('selected');
                    });
                });

                grid.appendChild(day);
            }
        });
    }
};