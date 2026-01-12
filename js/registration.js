/**
 * Registration Module
 * Handles the Registration Table logic.
 */

App.Registration = {
    init() {
        const addBtn = document.getElementById('btn-add-reg-row');
        const tbody = document.querySelector('#reg-table tbody');

        if (addBtn && tbody) {
            addBtn.addEventListener('click', () => {
                const tr = document.createElement('tr');
                tr.style.animation = "fadeIn 0.5s";
                const num = tbody.children.length + 1;
                tr.innerHTML = `
                    <td>${num}</td>
                    <td contenteditable="true"></td>
                    <td contenteditable="true"></td>
                    <td contenteditable="true"></td>
                    <td contenteditable="true"></td>
                    <td contenteditable="true"></td>
                    <td contenteditable="true"></td>
                    <td contenteditable="true"></td>
                `;
                tbody.appendChild(tr);
            });
        }
    }
};