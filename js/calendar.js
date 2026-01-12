App.Calendar = {
    dayNames: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],

    init() {
        // При инициализации сразу рендерим календари
        this.render();

        // Навешиваем обработчики на стрелки (они есть в обоих view)
        // Используем делегирование или forEach, но важно, чтобы работало везде
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('js-prev-month')) {
                this.changeMonth(-1);
            }
            if (e.target.classList.contains('js-next-month')) {
                this.changeMonth(1);
            }
        });
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
        const { currMonth, currYear, selectedDate } = App.state;
        const monthName = App.config.months[currMonth];

        // 1. Обновляем заголовки месяца везде
        document.querySelectorAll('.js-month-label').forEach(el => el.innerText = `${monthName} ${currYear}`);

        // 2. Рисуем сетку во всех календарях на странице
        document.querySelectorAll('.js-calendar-grid').forEach(grid => {
            grid.innerHTML = '';

            // Дни недели
            this.dayNames.forEach(name => {
                const dayNameEl = document.createElement('div');
                dayNameEl.className = 'day-name';
                dayNameEl.innerText = name;
                grid.appendChild(dayNameEl);
            });

            // Расчет отступов
            let firstDayIndex = new Date(currYear, currMonth, 1).getDay();
            let emptySlots = (firstDayIndex === 0 ? 7 : firstDayIndex) - 1;
            const lastDate = new Date(currYear, currMonth + 1, 0).getDate();

            // Пустые слоты
            for (let i = 0; i < emptySlots; i++) {
                const empty = document.createElement('div');
                empty.className = 'day-number';
                grid.appendChild(empty);
            }

            // Даты
            for (let i = 1; i <= lastDate; i++) {
                const day = document.createElement('div');
                day.className = 'day-number';
                day.innerText = i;
                
                // Создаем объект даты для текущей ячейки
                const thisDate = new Date(currYear, currMonth, i);
                const dateKey = App.getDateKey(thisDate);

                // А. ПРОВЕРКА: Выбрана ли эта дата? (Синхронизация)
                // Сравниваем текущую ячейку с App.state.selectedDate
                if (App.isSameDate(thisDate, selectedDate)) {
                    day.classList.add('selected');
                }

                // Б. ПРОВЕРКА: Есть ли события (точка)?
                if (App.state.events[dateKey] && App.state.events[dateKey].length > 0) {
                    day.classList.add('has-event');
                }

                // В. КЛИК ПО ДАТЕ
                day.addEventListener('click', () => {
                    // 1. Обновляем глобальное состояние
                    App.state.selectedDate = new Date(currYear, currMonth, i);

                    // 2. Перерисовываем ВСЕ календари (чтобы выделение обновилось везде)
                    this.render();

                    // 3. Обновляем списки событий (справа и в деталях)
                    if (App.Events) App.Events.render();
                });

                grid.appendChild(day);
            }
        });
    }
};