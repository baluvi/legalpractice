App.Reports = {
    chart: null,
    colors: {
        'Текущее': '#1976d2',
        'Заморожено': '#00bcd4',
        'Архивное': '#9e9e9e',
        'Обжалуется': '#ff9800'
    },

    init() {
        // Отрисовка произойдет при переключении на вкладку
    },

    render() {
        const cases = App.state.cases || [];
        const stats = { 'Текущее': [], 'Заморожено': [], 'Архивное': [], 'Обжалуется': [] };

        cases.forEach(c => {
            if (stats[c.status]) stats[c.status].push(c.title);
        });

        const ctx = document.getElementById('statusChart');
        if (!ctx) return;

        if (this.chart) this.chart.destroy();

        const labels = Object.keys(stats);
        const counts = labels.map(l => stats[l].length);

        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: counts,
                    backgroundColor: labels.map(l => this.colors[l]),
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                onHover: (event, elements) => {
                    if (elements.length > 0) {
                        const idx = elements[0].index;
                        const status = labels[idx];
                        this.showList(status, stats[status]);
                    }
                }
            }
        });
    },

     showList(status, titles) {
        const titleEl = document.getElementById('detail-status-title');
        const listEl = document.getElementById('status-cases-list');
        
        if (!titleEl || !listEl) return;

        // Заголовок в правой части (Статус и общее кол-во)
        titleEl.innerText = status + " (" + titles.length + ")";
        titleEl.style.color = this.colors[status];

        // Если дел с таким статусом нет
        if (titles.length === 0) {
            listEl.innerHTML = '<div class="text-muted" style="padding: 20px; text-align: center;">Нет дел с таким статусом</div>';
            return;
        }

        // Выводим список имен
        listEl.innerHTML = titles.map(name => `
            <div class="detail-item" style="border-left-color: ${this.colors[status]}">
                ${name}
            </div>
        `).join('');
    }
};