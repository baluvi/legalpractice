/**
 * Settings/Theme Module
 * Handles global theme switching.
 */

App.Theme = {
    init() {
        const toggle = document.getElementById('theme-toggle');
        if (toggle) {
            toggle.addEventListener('change', (e) => {
                document.body.classList.toggle('dark-mode', e.target.checked);
            });
        }
    }
};