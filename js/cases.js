/**
 * Cases Module
 * Manages the Case List and Adding new cases.
 */

App.Cases = {
    init() {
        const addBtn = document.getElementById('btn-add-case');
        const list = document.getElementById('cases-list');

        if (addBtn && list) {
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.addCase(list);
            });
        }

        // Delegation for clicking existing cases
        if (list) {
            list.addEventListener('click', (e) => {
                if (e.target.closest('.case-card')) {
                    App.Navigation.switchView('details');
                }
            });
        }
    },

    addCase(listElement) {
        const card = document.createElement('article');
        card.className = 'case-card';
        card.style.animation = "fadeIn 0.5s";
        card.innerHTML = `
            <div class="case-info">
                <i class="fa-solid fa-folder folder-icon-large"></i>
                <div class="case-title">Дело №${App.state.caseCount} - Новое</div>
            </div>
            <div class="case-menu"><i class="fa-solid fa-bars"></i></div>
        `;
        App.state.caseCount++;
        listElement.appendChild(card);
        listElement.scrollTop = listElement.scrollHeight;
    }
};