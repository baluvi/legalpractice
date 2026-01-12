/**
 * Settings Module
 */

App.Settings = {
    // Словарь переводов
    translations: {
        ru: {
            menu_profile: "Профиль",
            menu_dashboard: "Журнал ведения дел",
            menu_registration: "Журнал регистрации",
            menu_reports: "Отчеты",
            menu_settings: "Настройки",
            menu_help: "Помощь",
            settings_title: "Настройки",
            setting_theme_title: "Темная тема",
            setting_theme_desc: "Переключить интерфейс в ночной режим",
            setting_lang_title: "Язык",
            setting_lang_desc: "Язык интерфейса системы",
            setting_font_title: "Размер шрифта",
            setting_font_desc: "Увеличить или уменьшить текст",
            setting_reset_title: "Очистить данные",
            setting_reset_desc: "Удалить все записи из таблиц",
            btn_reset: "Сброс"
        },
        en: {
            menu_profile: "Profile",
            menu_dashboard: "Case Log",
            menu_registration: "Registration Journal",
            menu_reports: "Reports",
            menu_settings: "Settings",
            menu_help: "Help",
            settings_title: "Settings",
            setting_theme_title: "Dark Mode",
            setting_theme_desc: "Switch interface to night mode",
            setting_lang_title: "Language",
            setting_lang_desc: "System interface language",
            setting_font_title: "Font Size",
            setting_font_desc: "Increase or decrease text size",
            setting_reset_title: "Clear Data",
            setting_reset_desc: "Delete all table records",
            btn_reset: "Reset"
        }
    },

    init() {
        this.loadSettings();
        this.bindEvents();
    },

    bindEvents() {
        // Темная тема
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('change', (e) => {
            this.setTheme(e.target.checked);
        });

        // Язык
        const langSelect = document.getElementById('lang-select');
        langSelect.addEventListener('change', (e) => {
            this.setLanguage(e.target.value);
        });

        // Шрифт
        document.getElementById('font-inc').addEventListener('click', () => this.changeFontSize(1));
        document.getElementById('font-dec').addEventListener('click', () => this.changeFontSize(-1));

        // Сброс данных
        document.getElementById('btn-reset-data').addEventListener('click', () => {
            if(confirm("Вы уверены, что хотите удалить все данные?")) {
                localStorage.clear();
                location.reload();
            }
        });
    },

    setTheme(isDark) {
        document.body.classList.toggle('dark-mode', isDark);
        localStorage.setItem('settings_dark_mode', isDark);
    },

    setLanguage(lang) {
        const texts = this.translations[lang];
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (texts[key]) el.innerText = texts[key];
        });
        localStorage.setItem('settings_lang', lang);
        document.documentElement.lang = lang;
    },

    changeFontSize(delta) {
        let currentSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--main-font-size'));
        let newSize = currentSize + delta;
        
        // Ограничения
        if (newSize < 12) newSize = 12;
        if (newSize > 24) newSize = 24;

        document.documentElement.style.setProperty('--main-font-size', newSize + 'px');
        document.getElementById('font-size-value').innerText = newSize + 'px';
        localStorage.setItem('settings_font_size', newSize);
    },

    loadSettings() {
        // Загрузка темы
        const isDark = localStorage.getItem('settings_dark_mode') === 'true';
        document.getElementById('theme-toggle').checked = isDark;
        this.setTheme(isDark);

        // Загрузка языка
        const lang = localStorage.getItem('settings_lang') || 'ru';
        document.getElementById('lang-select').value = lang;
        this.setLanguage(lang);

        // Загрузка шрифта
        const fontSize = localStorage.getItem('settings_font_size') || '16';
        document.documentElement.style.setProperty('--main-font-size', fontSize + 'px');
        document.getElementById('font-size-value').innerText = fontSize + 'px';
    }
};