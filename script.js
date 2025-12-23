document.addEventListener('DOMContentLoaded', function() {
    
    // ЭЛЕМЕНТЫ НАВИГАЦИИ
    const navDashboard = document.getElementById('nav-dashboard');
    const navRegistration = document.getElementById('nav-registration');
    
    // ЭЛЕМЕНТЫ ЭКРАНОВ
    const viewDashboard = document.getElementById('view-dashboard');
    const viewRegistration = document.getElementById('view-registration');
    const viewDetails = document.getElementById('view-case-details');

    // КНОПКИ ФУНКЦИОНАЛА
    const addCaseBtn = document.getElementById('add-case-btn');
    const casesList = document.getElementById('cases-list');
    const addRegRowBtn = document.getElementById('add-reg-row-btn');
    const regTableBody = document.querySelector('#reg-table tbody');

    // ПЕРЕМЕННЫЕ
    let caseNumber = 246;

    // --- ФУНКЦИЯ ПЕРЕКЛЮЧЕНИЯ ЭКРАНОВ МЕНЮ ---
    function switchTab(activeTabId) {
        // 1. Скрываем все экраны
        viewDashboard.classList.add('hidden');
        viewRegistration.classList.add('hidden');
        viewDetails.classList.add('hidden');

        // 2. Убираем активный класс у всех кнопок меню
        navDashboard.classList.remove('active');
        navRegistration.classList.remove('active');

        // 3. Логика выбора
        if (activeTabId === 'dashboard') {
            viewDashboard.classList.remove('hidden');
            navDashboard.classList.add('active');
        } else if (activeTabId === 'registration') {
            viewRegistration.classList.remove('hidden');
            navRegistration.classList.add('active');
        }
    }

    // Обработчики кликов по меню
    if (navDashboard) {
        navDashboard.addEventListener('click', () => switchTab('dashboard'));
    }
    if (navRegistration) {
        navRegistration.addEventListener('click', () => switchTab('registration'));
    }

    // --- ЛОГИКА ДАШБОРДА (ДОБАВЛЕНИЕ ДЕЛА) ---
    if (addCaseBtn && casesList) {
        addCaseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const newCard = document.createElement('div');
            newCard.classList.add('case-card');
            newCard.style.animation = "fadeIn 0.5s";
            newCard.innerHTML = `
                <div class="case-info">
                    <i class="fa-solid fa-folder folder-icon-large"></i>
                    <div class="case-title">
                        Дело №${caseNumber} - Новое дело <br> "В работе"
                    </div>
                </div>
                <div class="case-menu"><i class="fa-solid fa-bars"></i></div>
            `;
            casesList.appendChild(newCard);
            setTimeout(() => { casesList.scrollTop = casesList.scrollHeight; }, 50);
            caseNumber++;
        });
    }

    // --- ЛОГИКА ДАШБОРДА (ОТКРЫТИЕ ДЕТАЛЕЙ) ---
    if (casesList) {
        casesList.addEventListener('click', function(e) {
            const card = e.target.closest('.case-card');
            if (card) {
                // Скрываем дашборд, показываем детали
                viewDashboard.classList.add('hidden');
                viewDetails.classList.remove('hidden');
            }
        });
    }

    // Глобальная функция закрытия деталей (назад)
    window.closeCaseDetails = function() {
        viewDetails.classList.add('hidden');
        viewDashboard.classList.remove('hidden');
    }

    // --- ЛОГИКА ТАБЛИЦЫ РЕГИСТРАЦИИ (ДОБАВЛЕНИЕ СТРОКИ) ---
    if (addRegRowBtn && regTableBody) {
        addRegRowBtn.addEventListener('click', function() {
            const newRow = document.createElement('tr');
            newRow.style.animation = "fadeIn 0.5s";
            
            // Получаем номер строки (просто для примера)
            const rowCount = regTableBody.children.length + 1;

            newRow.innerHTML = `
                <td>${rowCount}</td>
                <td contenteditable="true"></td>
                <td contenteditable="true"></td>
                <td contenteditable="true"></td>
                <td contenteditable="true"></td>
                <td contenteditable="true"></td>
                <td contenteditable="true"></td>
            `;
            regTableBody.appendChild(newRow);
        });
    }
});