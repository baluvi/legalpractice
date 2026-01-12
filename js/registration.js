/**
 * Registration Module
 * Handles the Registration Table logic.
 */

App.Registration = {
    init() {
        this.addBtn = document.getElementById('btn-add-reg-row');
        this.tbody = document.querySelector('#reg-table tbody');
        
        this.loadData(); // Загружаем данные при старте
        this.bindEvents();
    },

    bindEvents() {
        this.addBtn.addEventListener('click', () => this.addRow());

        // Делегирование событий для таблицы
        this.tbody.addEventListener('input', () => this.saveData());
        
        this.tbody.addEventListener('focusout', (e) => {
            // Даем небольшую задержку, чтобы понять, перешел ли фокус на другую ячейку той же строки
            setTimeout(() => {
                const row = e.target.closest('tr');
                if (row) this.checkAndRemoveEmptyRow(row);
            }, 100);
        });

        this.tbody.addEventListener('click', (e) => {
            if (e.target.closest('.btn-delete-row')) {
                const row = e.target.closest('tr');
                row.remove();
                this.updateNumbers();
                this.saveData();
            }
        });
    },

    addRow(data = null) {
        const tr = document.createElement('tr');
        tr.style.animation = "fadeIn 0.3s";
        
        // Если данных нет (новая строка), создаем пустые ячейки
        const cells = data || ["", "", "", "", "", "", ""];
        
        tr.innerHTML = `
            <td class="row-number"></td>
            <td contenteditable="true">${cells[0]}</td>
            <td contenteditable="true">${cells[1]}</td>
            <td contenteditable="true">${cells[2]}</td>
            <td contenteditable="true">${cells[3]}</td>
            <td contenteditable="true">${cells[4]}</td>
            <td contenteditable="true">${cells[5]}</td>
            <td contenteditable="true">${cells[6]}</td>
            <td><button class="btn-delete-row"><i class="fa-solid fa-trash-can"></i></button></td>
        `;

        this.tbody.appendChild(tr);
        this.updateNumbers();

        // Если это создание новой строки (не из загрузки), ставим фокус на первую ячейку
        if (!data) {
            tr.querySelector('td[contenteditable="true"]').focus();
        }
    },

    // Проверка: если все ячейки пусты — удаляем строку
    checkAndRemoveEmptyRow(row) {
        // Проверяем, не находится ли фокус все еще внутри этой строки
        if (row.contains(document.activeElement)) return;

        const cells = row.querySelectorAll('td[contenteditable="true"]');
        let hasContent = false;
        cells.forEach(cell => {
            if (cell.innerText.trim().length > 0) hasContent = true;
        });

        if (!hasContent) {
            row.remove();
            this.updateNumbers();
            this.saveData();
        }
    },

    updateNumbers() {
        const rows = this.tbody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            row.querySelector('.row-number').innerText = index + 1;
        });
    },

    saveData() {
        const rows = this.tbody.querySelectorAll('tr');
        const data = [];
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td[contenteditable="true"]');
            const rowData = Array.from(cells).map(cell => cell.innerText.trim());
            // Сохраняем только если в строке есть хоть какой-то текст
            if (rowData.some(text => text !== "")) {
                data.push(rowData);
            }
        });

        localStorage.setItem('registration_table_data', JSON.stringify(data));
    },

    loadData() {
        const rawData = localStorage.getItem('registration_table_data');
        if (rawData) {
            const data = JSON.parse(rawData);
            this.tbody.innerHTML = ''; // Очищаем перед загрузкой
            data.forEach(rowData => this.addRow(rowData));
        }
    }
};

// Запуск модуля
document.addEventListener('DOMContentLoaded', () => App.Registration.init());