// UI для управления жителями
function updateResidentsList() {
    if (!window.simulation) {
        console.error('Симуляция не инициализирована для обновления списка жителей');
        return;
    }
    
    const container = document.getElementById('residentsContainer');
    if (!container) {
        console.error('Контейнер residentsContainer не найден');
        return;
    }
    
    container.innerHTML = '';
    
    console.log(`👥 Отрисовка ${window.simulation.residents.length} жителей...`);
    
    window.simulation.residents.forEach(resident => {
        const data = resident.getDisplayData();
        const card = document.createElement('div');
        card.className = 'resident-card';
        card.innerHTML = `
            <div class="card-header">
                <div class="card-title">${data.name}</div>
                <div class="pp-value">${data.pp} ПП</div>
            </div>
            <div class="resident-details">
                <div>📅 Возраст: ${data.age} | 💼 ${data.occupation}</div>
                <div>🎯 Активность: ${data.activity}</div>
                <div>❤️ Здоровье: ${data.health}%</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${data.health}%"></div>
                </div>
                <div>🎓 Образование: ${data.education}%</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${data.education}%"></div>
                </div>
                <div>😊 Удовлетворенность: ${data.satisfaction}%</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${data.satisfaction}%"></div>
                </div>
                <div>💰 Конвертировано:</div>
                <div>• Деньги: ${data.convertedToMoney} ПП</div>
                <div>• Голоса: ${data.convertedToVotes} ПП</div>
                <div>• Социальные: ${data.convertedToSocial} ПП</div>
                <div>💼 Инвестировано: ${data.invested} ПП</div>
            </div>
        `;
        container.appendChild(card);
    });
    
    console.log(`✅ Список жителей обновлен: ${window.simulation.residents.length} человек`);
}

function searchResidents() {
    if (!window.simulation) return;
    
    const searchTerm = document.getElementById('searchResident').value.toLowerCase();
    const container = document.getElementById('residentsContainer');
    
    if (!container) return;
    
    const cards = container.getElementsByClassName('resident-card');
    
    for (let card of cards) {
        const name = card.querySelector('.card-title').textContent.toLowerCase();
        const occupation = card.querySelector('.resident-details div').textContent.toLowerCase();
        
        if (name.includes(searchTerm) || occupation.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    }
    
    console.log(`🔍 Поиск жителей: "${searchTerm}"`);
}

function sortResidents() {
    if (!window.simulation) return;
    
    const sortBy = document.getElementById('sortResidents').value;
    
    window.simulation.residents.sort((a, b) => {
        switch(sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'pp':
                return b.pp - a.pp;
            case 'satisfaction':
                return b.satisfaction - a.satisfaction;
            case 'health':
                return b.health - a.health;
            case 'education':
                return b.education - a.education;
            case 'invested':
                return b.invested - a.invested;
            default:
                return 0;
        }
    });
    
    updateResidentsList();
    console.log(`🔀 Отсортированы жители по: ${sortBy}`);
}

function exportResidentsData() {
    if (!window.simulation) return;
    
    const data = window.simulation.residents.map(resident => resident.getDisplayData());
    const csv = convertToCSV(data);
    downloadCSV(csv, 'dppn_residents.csv');
    
    console.log('📊 Экспортированы данные жителей');
}

function convertToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header];
            return `"${value}"`;
        });
        csvRows.push(values.join(','));
    }
    
    return csvRows.join('\n');
}

function downloadCSV(csv, filename) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}