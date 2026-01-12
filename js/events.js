App.Events = {
    init() {
        this.modal = document.getElementById('event-modal');
        this.inpId = document.getElementById('event-id');
        this.inpTime = document.getElementById('event-time');
        this.inpDesc = document.getElementById('event-desc');

        // Рендерим события для текущей даты (которая по умолчанию Сегодня)
        this.render();

        // ДЕЛЕГИРОВАНИЕ: Ловит клик по ЛЮБОЙ кнопке с классом js-btn-add-event
        document.addEventListener('click', (e) => {
            // closest ищет ближайшего родителя (или сам элемент) с классом
            // Это важно, так как внутри кнопки лежит иконка <i>
            if (e.target.closest('.js-btn-add-event')) {
                this.openModal();
            }
        });

        document.getElementById('btn-close-modal').addEventListener('click', () => this.closeModal());
        document.getElementById('btn-save-event').addEventListener('click', () => this.saveEvent());
        document.getElementById('btn-delete-event').addEventListener('click', () => this.deleteEvent());
        
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.closeModal();
            });
        }
    },

    render() {
        // Берем дату из общего состояния
        const dateKey = App.getDateKey(App.state.selectedDate);
        // ... остальной код рендера ...
        // (см. код из предыдущих ответов, там это уже было учтено)
        
        const dayEvents = App.state.events[dateKey] || [];
        dayEvents.sort((a, b) => a.time.localeCompare(b.time));

        const dateLabels = document.querySelectorAll('.js-date-label, #selected-date-label');
        const listContainers = document.querySelectorAll('.js-events-list, #events-list-container');
        
        // ... обновление HTML ...
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const dateStr = App.state.selectedDate.toLocaleDateString('ru-RU', options);
        dateLabels.forEach(el => el.innerText = dateStr);
        
        let html = '';
        if (dayEvents.length === 0) {
            html = `<div class="event-item empty-slot"><div class="event-desc text-muted">Нет событий</div></div>`;
        } else {
            dayEvents.forEach(event => {
                html += `
                    <div class="event-item">
                        <div class="event-time">${event.time}</div>
                        <div class="event-desc">${event.desc}</div>
                        <div class="event-actions">
                            <i class="fa-solid fa-pen action-icon edit-btn" data-id="${event.id}"></i>
                        </div>
                    </div>
                `;
            });
        }

        listContainers.forEach(container => {
            container.innerHTML = html;
            container.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const id = btn.dataset.id;
                    const event = dayEvents.find(ev => ev.id == id);
                    if(event) this.openModal(event);
                });
            });
        });
    },

    openModal(event = null) {
        this.modal.classList.remove('hidden');
        const title = document.getElementById('modal-title');
        const delBtn = document.getElementById('btn-delete-event');

        if (event) {
            title.innerText = 'Редактировать';
            this.inpId.value = event.id;
            this.inpTime.value = event.time;
            this.inpDesc.value = event.desc;
            delBtn.classList.remove('hidden');
        } else {
            title.innerText = 'Новая заметка';
            this.inpId.value = '';
            const now = new Date();
            this.inpTime.value = now.toTimeString().substring(0,5);
            this.inpDesc.value = '';
            delBtn.classList.add('hidden');
        }
    },
    
    closeModal() { this.modal.classList.add('hidden'); },
    
    saveEvent() {
        // ... (код saveEvent прежний, только в конце вызываем this.render())
        const time = this.inpTime.value;
        const desc = this.inpDesc.value.trim();
        const id = this.inpId.value;

        if (!time || !desc) return;

        const dateKey = App.getDateKey(App.state.selectedDate);
        if (!App.state.events[dateKey]) App.state.events[dateKey] = [];

        if (id) {
            const idx = App.state.events[dateKey].findIndex(e => e.id == id);
            if (idx > -1) App.state.events[dateKey][idx] = { id, time, desc };
        } else {
            App.state.events[dateKey].push({ id: Date.now(), time, desc });
        }

        App.saveEvents();
        this.closeModal();
    },

    deleteEvent() {
        // ... (код deleteEvent прежний)
        const id = this.inpId.value;
        const dateKey = App.getDateKey(App.state.selectedDate);
        if (confirm('Удалить?')) {
            App.state.events[dateKey] = App.state.events[dateKey].filter(e => e.id != id);
            App.saveEvents();
            this.closeModal();
        }
    }
};