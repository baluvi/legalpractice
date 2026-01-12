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

    register() {
        const pass = document.getElementById('reg-password').value;
        const confirmPass = document.getElementById('reg-password-confirm').value;

        if (pass !== confirmPass) {
            alert('Пароли не совпадают!');
            return;
        }

        const userData = {
            name: document.getElementById('reg-name').value,
            spec: document.getElementById('reg-spec').value,
            email: document.getElementById('reg-email').value,
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
        if(document.getElementById('profile-display-spec')) 
            document.getElementById('profile-display-spec').innerText = user.spec;
        if(document.getElementById('profile-display-email')) 
            document.getElementById('profile-display-email').innerText = user.email;
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