/**
 * Auth Module
 * Управляет регистрацией и доступом к системе
 */
App.Auth = {
    init() {
        this.form = document.getElementById('registration-form');
        this.authSection = document.getElementById('view-auth');
        this.sidebar = document.querySelector('.sidebar');
        this.main = document.querySelector('.main-content');
        this.setupUsageLogic();

        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.register();
            });
        }

        this.checkAuth();
    },

    checkAuth() {
        const user = localStorage.getItem('legalAppUser');
        if (user) {
            App.state.user = JSON.parse(user);
            this.showApp();
        } else {
            this.hideApp();
        }
    },

    setupUsageLogic() {
        const usageRadios = document.getElementsByName('usage-type');
        const orgActionRadios = document.getElementsByName('org-action');
        const orgSubOptions = document.getElementById('org-sub-options');
        const joinKeyBlock = document.getElementById('join-key-block');

        // Переключение между Личным и Орг
        usageRadios.forEach(r => {
            r.addEventListener('change', (e) => {
                if (e.target.value === 'org') {
                    orgSubOptions.classList.add('visible');
                    const createRadio = document.querySelector('input[name="org-action"][value="create"]');
                    if (createRadio) createRadio.checked = true;
                    joinKeyBlock.classList.remove('visible');
                } else {
                    orgSubOptions.classList.remove('visible');
                    // При скрытии основной панели, скрываем и поле ключа
                    joinKeyBlock.classList.remove('visible');
                }
            });
        });

        // Переключение между Создать и Присоединиться
        orgActionRadios.forEach(r => {
            r.addEventListener('change', (e) => {
                if (e.target.value === 'join') {
                    joinKeyBlock.classList.add('visible');
                } else {
                    joinKeyBlock.classList.remove('visible');
                }
            });
        });
    },

    register() {
        const pass = document.getElementById('reg-password').value;
        const confirmPass = document.getElementById('reg-password-confirm').value;

        if (pass !== confirmPass) {
            alert('Пароли не совпадают!');
            return;
        }

        const usageType = document.querySelector('input[name="usage-type"]:checked').value;
        let orgData = { type: 'individual' };

        if (usageType === 'org') {
            const orgAction = document.querySelector('input[name="org-action"]:checked').value;
            if (orgAction === 'create') {
                // Генерация ключа (простая имитация)
                const generatedKey = 'KEY-' + Math.random().toString(36).substr(2, 6).toUpperCase();
                orgData = { type: 'org', role: 'admin', key: generatedKey };
                alert(`Ваша группа создана! Ключ доступа: ${generatedKey}`);
            } else {
                const keyInput = document.getElementById('reg-org-key').value;
                if (!keyInput) { alert('Введите ключ доступа!'); return; }
                orgData = { type: 'org', role: 'member', key: keyInput };
            }
        }

        const userData = {
            name: document.getElementById('reg-name').value,
            email: document.getElementById('reg-email').value,
            org: orgData,
            regDate: new Date().toLocaleDateString()
        };

        localStorage.setItem('legalAppUser', JSON.stringify(userData));
        App.state.user = userData;
        
        // Маленькая анимация успеха
        const btn = this.form.querySelector('button');
        btn.innerText = 'Готово!';
        btn.style.background = 'var(--success)';

        setTimeout(() => {
            this.showApp();
            App.Navigation.switchView('dashboard');
            this.updateProfileUI();
        }, 800);
    },

    showApp() {
        this.authSection.classList.add('hidden');
        this.sidebar.classList.remove('hidden');
        this.main.classList.remove('hidden');
        this.updateProfileUI();
    },

    hideApp() {
        this.authSection.classList.remove('hidden');
        this.sidebar.classList.add('hidden');
        this.main.classList.add('hidden');
    },

    updateProfileUI() {
        const user = App.state.user;
        if (!user) return;

        if(document.getElementById('profile-display-name')) 
            document.getElementById('profile-display-name').innerText = user.name;
        if(document.getElementById('profile-display-email')) 
            document.getElementById('profile-display-email').innerText = user.email;

        if (user.org && user.org.type === 'org' && user.org.role === 'admin') {
            const profileContainer = document.querySelector('.profile-info-group');
            // Чтобы не дублировать при каждом рендере
            if (!document.getElementById('profile-org-key')) {
                const keyBlock = document.createElement('div');
                keyBlock.className = 'info-block mt-10';
                keyBlock.id = 'profile-org-key';
                keyBlock.innerHTML = `
                    <label class="profile-info-label">Ваш ключ организации:</label>
                    <p class="profile-info-value" style="color: var(--calendar-highlight)">${user.org.key}</p>
                `;
                profileContainer.appendChild(keyBlock);
            }
        }
    },

    // костыль, позже убрать
    resetSystem() {
        if (confirm('ВНИМАНИЕ! Это действие удалит ВСЕ ваши дела, заметки и данные профиля. Продолжить?')) {
            localStorage.clear();
            location.reload(); // Перезагрузка вернет на экран регистрации
        }
    }
};

// Добавим обработчик кнопки сброса в инициализацию App
document.addEventListener('DOMContentLoaded', () => {
    const resetBtn = document.getElementById('btn-reset-system');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => App.Auth.resetSystem());
    }
});