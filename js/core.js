const App = {
    state: {
        currentDate: new Date(), // Используется для отображения текущего месяца календаря
        currMonth: new Date().getMonth(),
        currYear: new Date().getFullYear(),
        
        // ВАЖНО: Выбранная дата по умолчанию - Сегодня
        selectedDate: new Date(), 
        
        events: JSON.parse(localStorage.getItem('legalAppEvents')) || {},
        cases: JSON.parse(localStorage.getItem('legalAppCases')) || [ /* ... */ ],
        currentCase: null,
        caseCount: 246
    },
    isSameDate(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    },
    config: {
        months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
    },

    // Метод для сохранения событий
    saveEvents() {
        localStorage.setItem('legalAppEvents', JSON.stringify(this.state.events));
        // Перерисовываем календарь (чтобы обновить точки) и список
        this.Calendar.render();
        this.Events.render();
    },
    saveCases() {
        localStorage.setItem('legalAppCases', JSON.stringify(this.state.cases));
    },
    // Генерация ключа даты
    getDateKey(date) {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    },
    saveCurrentCase() {
        localStorage.setItem('legalAppCurrentCase', JSON.stringify(this.state.currentCase));
        // Сообщаем модулю Cases обновить вид
        if(this.Cases) this.Cases.renderDetails();
    },
    init() {
        if(this.Navigation) this.Navigation.init();
        if(this.Calendar) this.Calendar.init();
        if(this.Cases) this.Cases.init();
        if(this.Registration) this.Registration.init();
        if(this.Settings) this.Settings.init();
        // Инициализация модуля событий
        if(this.Events) this.Events.init();
        
    }
};