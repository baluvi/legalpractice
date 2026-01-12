/**
 * Files Module
 * Handles adding file references specific to the CURRENT case.
 */

App.Files = {
    // Храним ссылки на реальные файлы (Blob) только для текущей сессии,
    // чтобы их можно было открыть сразу после загрузки.
    sessionFiles: {},

    init() {
        this.container = document.getElementById('files-list-container');
        this.addBtn = document.getElementById('btn-upload-file');
        this.fileInput = document.getElementById('file-input');

        // Рендер пока не вызываем, он вызовется из Cases.selectCase
        
        if (this.addBtn && this.fileInput) {
            this.addBtn.addEventListener('click', () => {
                // Защита: нельзя добавлять файлы, если дело не выбрано
                if (!App.state.currentCase) {
                    alert('Ошибка: Дело не выбрано');
                    return;
                }
                this.fileInput.click();
            });

            this.fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
                this.fileInput.value = '';
            });
        }
    },

    handleFileUpload(files) {
        if (!files.length || !App.state.currentCase) return;

        Array.from(files).forEach(file => {
            const fileId = Date.now() + Math.random();
            
            // Сохраняем доступ к файлу в сессии
            this.sessionFiles[fileId] = file;

            // Добавляем метаданные В ТЕКУЩЕЕ ДЕЛО
            const newFile = {
                id: fileId,
                name: file.name,
                type: 'file',
                date: new Date().toLocaleDateString()
            };
            
            // Если массива нет, создаем
            if (!App.state.currentCase.files) {
                App.state.currentCase.files = [];
            }
            
            App.state.currentCase.files.push(newFile);
        });

        this.saveAndRender();
    },

    saveAndRender() {
        // Сохраняем глобальное состояние дел (так как мы изменили currentCase, который является частью cases)
        App.saveCases();
        this.render();
    },

    render() {
        if (!this.container) return;
        this.container.innerHTML = '';

        // Берем файлы ТОЛЬКО из текущего дела
        const currentCase = App.state.currentCase;
        
        // Если дело не выбрано или файлов нет
        if (!currentCase || !currentCase.files || currentCase.files.length === 0) {
            // Можно вывести заглушку "Нет файлов"
            return;
        }

        currentCase.files.forEach((file, index) => {
            const el = document.createElement('div');
            el.className = 'file-folder';
            
            let iconClass = 'fa-regular fa-file'; 
            if (file.name.endsWith('.pdf')) iconClass = 'fa-solid fa-file-pdf';
            else if (file.name.match(/\.(doc|docx)$/i)) iconClass = 'fa-solid fa-file-word';
            else if (file.name.match(/\.(xls|xlsx)$/i)) iconClass = 'fa-solid fa-file-excel';
            else if (file.name.match(/\.(jpg|jpeg|png|gif)$/i)) iconClass = 'fa-solid fa-image';

            el.innerHTML = `
                <i class="${iconClass}"></i>
                <span class="file-name">${file.name}</span>
                <i class="fa-solid fa-xmark remove-file-icon" title="Удалить"></i>
            `;

            // Открытие
            el.addEventListener('click', () => {
                const blobFile = this.sessionFiles[file.id];
                if (blobFile) {
                    const fileURL = URL.createObjectURL(blobFile);
                    window.open(fileURL, '_blank');
                } else {
                    alert('Файл недоступен (загружен в предыдущей сессии). В реальной системе он бы скачался с сервера.');
                }
            });

            // Удаление
            const removeBtn = el.querySelector('.remove-file-icon');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if(confirm(`Удалить файл ${file.name}?`)) {
                    // Удаляем из массива текущего дела
                    currentCase.files.splice(index, 1);
                    this.saveAndRender();
                }
            });

            this.container.appendChild(el);
        });
    }
};

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    if (App) { App.Files = App.Files || {}; Object.assign(App.Files, App.Files); App.Files.init(); }
});