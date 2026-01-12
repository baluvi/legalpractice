/**
 * Cases Module
 * Manages Case List, Details View, and Editing.
 */

App.Cases = {
    tempOrders: [],

    init() {
        // Кнопка добавления на главной
        const addBtn = document.getElementById('btn-add-case');
        
        // Элементы модального окна
        this.modal = document.getElementById('case-edit-modal');
        this.editBtn = document.getElementById('btn-edit-case-info');
        this.closeBtn = document.getElementById('close-case-modal');
        this.saveBtn = document.getElementById('btn-save-case-details');
        this.inpStatus = document.getElementById('edit-case-status');
        // Inputs
        this.inpNum = document.getElementById('edit-case-number');
        this.inpTitle = document.getElementById('edit-case-title');
        this.inpLink = document.getElementById('edit-case-link');
        this.inpContacts = document.getElementById('edit-case-contacts');
        this.inpOrder = document.getElementById('new-order-input');
        this.btnAddOrder = document.getElementById('btn-add-order');
        this.ordersListContainer = document.getElementById('edit-orders-list');

        // 1. При старте рендерим список дел на главной
        this.renderCaseList();
        
        // Обработчик кнопки "Добавить дело"
        if (addBtn) {
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.createNewCase();
            });
        }

        // --- EVENTS МОДАЛЬНОГО ОКНА ---
        if (this.editBtn) this.editBtn.addEventListener('click', () => this.openEditModal());
        if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.closeModal());
        if (this.saveBtn) this.saveBtn.addEventListener('click', () => this.saveChanges());
        
        if (this.modal) {
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.closeModal();
            });
        }

        if (this.btnAddOrder) {
            this.btnAddOrder.addEventListener('click', () => {
                const val = this.inpOrder.value.trim();
                if (val) {
                    this.tempOrders.push(val);
                    this.renderModalOrders();
                    this.inpOrder.value = '';
                }
            });
        }
    },

    // --- ЛОГИКА СПИСКА (ГЛАВНАЯ) ---

    renderCaseList() {
        const list = document.getElementById('cases-list');
        if (!list) return;

        list.innerHTML = ''; // Очищаем список перед перерисовкой

        App.state.cases.forEach(caseItem => {
            const card = document.createElement('article');
            card.className = 'case-card';
            card.innerHTML = `
                <div class="case-info">
                    <i class="fa-solid fa-folder folder-icon-large"></i>
                    <div class="case-title">Дело №${caseItem.number} - ${caseItem.title}</div>
                </div>
                <div class="case-menu"><i class="fa-solid fa-bars"></i></div>
            `;

            // Клик по карточке открывает детали именно этого дела
            card.addEventListener('click', () => {
                this.selectCase(caseItem);
            });

            list.appendChild(card);
        });
    },

    createNewCase() {
        const newId = App.state.caseCount++;
        const newCase = {
            id: newId,
            number: String(newId),
            title: 'Новое дело',
            status: 'Текущее', // Статус по умолчанию
            trackingLink: '',
            orders: [],
            contacts: '',
            files: []
        };
        App.state.cases.push(newCase);
        App.saveCases();
        this.renderCaseList();
    },

    selectCase(caseItem) {
        // 1. Устанавливаем текущее дело
        App.state.currentCase = caseItem;

        // 2. Гарантируем, что у дела есть массив файлов (для старых записей)
        if (!App.state.currentCase.files) {
            App.state.currentCase.files = [];
        }

        // 3. Рендерим детали (Заголовок, инфо)
        this.renderDetails();

        // 4. ВАЖНО: Принудительно обновляем список файлов для ЭТОГО дела
        if (App.Files) {
            App.Files.render();
        }
        
        // 5. Обновляем календарь/события (если нужно сбросить выделение)
        // ... (можно добавить App.Events.render(), если нужно)

        // 6. Переключаем экран
        App.Navigation.switchView('details');
    },

    // --- ЛОГИКА ДЕТАЛЕЙ (ВТОРОЙ ЭКРАН) ---

    renderDetails() {
        const data = App.state.currentCase;
        if (!data) return;

        // ... (код заголовка H1 прежний) ...
        const headerTitle = document.querySelector('#view-details h1');
        if (headerTitle) {
            // Используем data.title, который берется из currentCase (синхронизировано)
            headerTitle.innerHTML = `
                <i class="fa-solid fa-arrow-left btn-back" id="btn-back-details" title="Назад"></i> 
                <div class="app-logo"><i class="fa-solid fa-scale-balanced"></i></div>
                <span> Журнал ведения дел</span> | Дело №${data.number} - ${data.title}
            `;
            
            const backBtn = document.getElementById('btn-back-details');
            if (backBtn) backBtn.addEventListener('click', () => App.Navigation.switchView('dashboard'));
        }
        // 1. Отображение СТАТУСА
        const statusContainer = document.getElementById('info-status-container');
        
        // Определяем класс цвета
        let statusClass = 'status-active';
        switch (data.status) {
            case 'Заморожено': statusClass = 'status-frozen'; break;
            case 'Архивное': statusClass = 'status-archive'; break;
            case 'Обжалуется': statusClass = 'status-appeal'; break;
            default: statusClass = 'status-active'; // Для "Текущее"
        }

        // Если у старых дел нет поля status, ставим "Текущее"
        const statusText = data.status || 'Текущее';

        statusContainer.innerHTML = `<span class="status-badge ${statusClass}">${statusText}</span>`;

        // ... (остальной код: ссылки, ордера, контакты) ...
        const linkContainer = document.getElementById('info-tracking-container');
        const ordersContainer = document.getElementById('info-orders-container');
        const contactsText = document.getElementById('info-contacts-text');

        if (data.trackingLink) {
            const shortLink = data.trackingLink.length > 30 ? data.trackingLink.substring(0, 30) + '...' : data.trackingLink;
            linkContainer.innerHTML = `<a href="${data.trackingLink}" target="_blank" class="info-link">${shortLink}</a>`;
        } else {
            linkContainer.innerHTML = `<span class="text-muted">Ссылка не указана</span>`;
        }
        
        ordersContainer.innerHTML = '';
        if (data.orders && data.orders.length > 0) {
            data.orders.forEach(order => {
                const tag = document.createElement('span');
                tag.className = 'order-tag';
                tag.innerText = order;
                ordersContainer.appendChild(tag);
            });
        } else {
            ordersContainer.innerHTML = '<span class="text-muted" style="font-size:12px">Нет ордеров</span>';
        }

        contactsText.innerHTML = data.contacts ? data.contacts.replace(/\n/g, '<br>') : 'Нет информации';
    },

    // --- ЛОГИКА РЕДАКТИРОВАНИЯ ---

    openEditModal() {
        const data = App.state.currentCase;
        if (!data) return;

        this.inpNum.value = data.number;
        this.inpTitle.value = data.title;
        // Заполняем Select
        this.inpStatus.value = data.status || 'Текущее'; 
        this.inpLink.value = data.trackingLink;
        this.inpContacts.value = data.contacts;
        
        this.tempOrders = [...(data.orders || [])];
        this.renderModalOrders();

        this.modal.classList.remove('hidden');
    },

    closeModal() {
        this.modal.classList.add('hidden');
    },

    renderModalOrders() {
        this.ordersListContainer.innerHTML = '';
        this.tempOrders.forEach((order, index) => {
            const chip = document.createElement('div');
            chip.className = 'order-chip';
            chip.innerHTML = `
                ${order} 
                <i class="fa-solid fa-times" style="cursor: pointer; color: #666;" data-idx="${index}"></i>
            `;
            chip.querySelector('i').addEventListener('click', () => {
                this.tempOrders.splice(index, 1);
                this.renderModalOrders();
            });
            this.ordersListContainer.appendChild(chip);
        });
    },

    saveChanges() {
        const current = App.state.currentCase;
        
        current.number = this.inpNum.value;
        current.title = this.inpTitle.value;
        // Сохраняем статус
        current.status = this.inpStatus.value; 
        current.trackingLink = this.inpLink.value;
        current.contacts = this.inpContacts.value;
        current.orders = [...this.tempOrders];

        // Обновление в массиве
        const index = App.state.cases.findIndex(c => c.id === current.id);
        if (index !== -1) App.state.cases[index] = current;

        App.saveCases();
        this.renderDetails();
        this.renderCaseList();

        if (App.Reports) App.Reports.render(); 
        
        this.closeModal();
    }
};