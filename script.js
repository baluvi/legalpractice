/**
 * Main Application Logic
 * Implements Module Pattern for Clean Code
 */

const App = {
    state: {
        currentDate: new Date(),
        currMonth: new Date().getMonth(),
        currYear: new Date().getFullYear(),
        caseCount: 246
    },

    config: {
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    },

    init() {
        this.Navigation.init();
        this.Calendar.init();
        this.Cases.init();
        this.Registration.init();
        this.Theme.init();
    },

    // --- MODULE: NAVIGATION ---
    Navigation: {
        init() {
            const navItems = document.querySelectorAll('.nav-item[data-target]');
            const views = document.querySelectorAll('.view-section');
            const backBtn = document.getElementById('btn-back-details');

            navItems.forEach(item => {
                item.addEventListener('click', () => {
                    const target = item.dataset.target;
                    this.switchView(target);
                });
            });

            if(backBtn) {
                backBtn.addEventListener('click', () => this.switchView('dashboard'));
            }
        },

        switchView(targetId) {
            // Hide all views
            document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
            // Remove active class from nav
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

            // Show target view
            const targetView = document.getElementById(`view-${targetId}`);
            if (targetView) targetView.classList.remove('hidden');

            // Set active nav
            const targetNav = document.querySelector(`.nav-item[data-target="${targetId}"]`);
            if (targetNav) targetNav.classList.add('active');

            // If switching to details, conceptually we are "inside" dashboard for sidebar purposes
            if (targetId === 'details') {
                const dashNav = document.querySelector(`.nav-item[data-target="dashboard"]`);
                if(dashNav) dashNav.classList.add('active');
            }
        }
    },

    // --- MODULE: CALENDAR ---
    Calendar: {
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
    },

    // --- MODULE: CASES ---
    Cases: {
        init() {
            const addBtn = document.getElementById('btn-add-case');
            const list = document.getElementById('cases-list');

            if (addBtn && list) {
                addBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.addCase(list);
                });
            }

            // Delegation for clicking existing cases
            if (list) {
                list.addEventListener('click', (e) => {
                    if (e.target.closest('.case-card')) {
                        App.Navigation.switchView('details');
                    }
                });
            }
        },

        addCase(listElement) {
            const card = document.createElement('div');
            card.className = 'case-card';
            card.style.animation = "fadeIn 0.5s";
            card.innerHTML = `
                <div class="case-info">
                    <i class="fa-solid fa-folder folder-icon-large"></i>
                    <div class="case-title">Дело №${App.state.caseCount} - Новое</div>
                </div>
                <div class="case-menu"><i class="fa-solid fa-bars"></i></div>
            `;
            App.state.caseCount++;
            listElement.appendChild(card);
            listElement.scrollTop = listElement.scrollHeight;
        }
    },

    // --- MODULE: REGISTRATION ---
    Registration: {
        init() {
            const addBtn = document.getElementById('btn-add-reg-row');
            const tbody = document.querySelector('#reg-table tbody');

            if (addBtn && tbody) {
                addBtn.addEventListener('click', () => {
                    const tr = document.createElement('tr');
                    tr.style.animation = "fadeIn 0.5s";
                    const num = tbody.children.length + 1;
                    tr.innerHTML = `
                        <td>${num}</td>
                        <td contenteditable="true"></td>
                        <td contenteditable="true"></td>
                        <td contenteditable="true"></td>
                        <td contenteditable="true"></td>
                        <td contenteditable="true"></td>
                        <td contenteditable="true"></td>
                        <td contenteditable="true"></td>
                    `;
                    tbody.appendChild(tr);
                });
            }
        }
    },

    // --- MODULE: THEME ---
    Theme: {
        init() {
            const toggle = document.getElementById('theme-toggle');
            if (toggle) {
                toggle.addEventListener('change', (e) => {
                    document.body.classList.toggle('dark-mode', e.target.checked);
                });
            }
        }
    }
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => App.init());