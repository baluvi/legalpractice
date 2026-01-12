/**
 * Navigation Module
 * Handles sidebar clicks and view switching.
 */

App.Navigation = {
    init() {
        const navItems = document.querySelectorAll('.nav-item[data-target]');
        const backBtn = document.getElementById('btn-back-details');

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const target = item.dataset.target;
                this.switchView(target);
            });
        });

        if(backBtn) {
            backBtn.addEventListener('click', () => this.switchView('dashboard'));
        }
    },

    switchView(targetId) {
        // Hide all views
        document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
        // Remove active class from nav
        document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

        // Show target view
        const targetView = document.getElementById(`view-${targetId}`);
        if (targetView) targetView.classList.remove('hidden');

        // Set active nav
        const targetNav = document.querySelector(`.nav-item[data-target="${targetId}"]`);
        if (targetNav) targetNav.classList.add('active');

        // If switching to details, conceptually we are "inside" dashboard for sidebar purposes
        if (targetId === 'details') {
            const dashNav = document.querySelector(`.nav-item[data-target="dashboard"]`);
            if(dashNav) dashNav.classList.add('active');
        }
    }
};