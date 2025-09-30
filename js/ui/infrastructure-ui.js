// infrastructure-ui.js - UI для инфраструктуры
function updateInfrastructureList() {
    if (!window.simulation) return;
    
    const container = document.getElementById('infrastructureContainer');
    const stats = window.simulation.getStats();
    
    if (!container) return;
    
    // Обновляем заголовок с балансом
    const panel = document.querySelector('.infrastructure-panel h2');
    if (panel) {
        panel.textContent = `🏢 Управление инфраструктурой | Баланс: ${Math.round(stats.publicFunds)} ПП`;
    }
    
    container.innerHTML = '';
    
    // Показываем текущую инфраструктуру
    window.simulation.infrastructure.forEach(infra => {
        const data = infra.getDisplayData();
        const card = document.createElement('div');
        card.className = 'infrastructure-card';
        
        let specificInfo = '';
        switch(data.category) {
            case 'energy':
                specificInfo = `<div>⚡ Выработка: ${data.energyOutput} ед.</div>`;
                break;
            case 'agriculture':
                specificInfo = `<div>🌾 Производство: ${data.foodOutput} ед.</div>`;
                break;
            case 'industry':
                specificInfo = `<div>🏭 Производство: ${data.productionOutput} ед.</div>`;
                break;
            case 'commerce':
                specificInfo = `<div>💰 Доход: ${data.commerceOutput} ед.</div>`;
                break;
            default:
                specificInfo = `<div>📊 Эффект: +${data.effectValue}%</div>`;
        }
        
        card.innerHTML = `
            <div class="card-header">
                <div class="card-title">${data.icon} ${data.name}</div>
                <div class="level-badge">Уровень ${data.level}</div>
            </div>
            <div class="resident-details">
                <div>${data.description}</div>
                <div>🔄 Состояние: ${data.condition}%</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${data.condition}%"></div>
                </div>
                <div>⚡ Эффективность: ${data.efficiency}%</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${data.efficiency}%"></div>
                </div>
                ${specificInfo}
                <div>🔧 Обслуживание: ${data.maintenanceCost} ПП/месяц</div>                
                <div>⬆️ Улучшение: ${data.upgradeCost} ПП (Баланс: ${Math.round(stats.publicFunds)} ПП)</div>
                <div class="investment-controls">
                    <button onclick="upgradeInfrastructure('${infra.id}')" class="success">⬆️ Улучшить</button>
                    <button onclick="repairInfrastructure('${infra.id}')" class="warning">🔧 Ремонт</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    
    // Если нет инфраструктуры, показываем сообщение
    if (window.simulation.infrastructure.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #666;">
                <h3>🏗️ Инфраструктура не построена</h3>
                <p>Используйте кнопки ниже для строительства объектов</p>
                <button onclick="showInfrastructureCosts()" class="info">💰 Показать стоимость строительства</button>
            </div>
        `;
    }
}

// Функции для улучшения инфраструктуры
function upgradeInfrastructure(infrastructureId) {
    if (!window.simulation) return;
    
    const infra = window.simulation.infrastructure.find(i => i.id === infrastructureId);
    if (!infra) return;
    
    const upgradeCost = infra.getUpgradeCost();
    const stats = window.simulation.getStats();
    
    if (stats.publicFunds >= upgradeCost) {
        try {
            if (infra.upgrade()) {
                updateUI();
                alert(`✅ ${infra.config.name} улучшен до уровня ${infra.level}!`);
            } else {
                alert('❌ Достигнут максимальный уровень улучшения');
            }
        } catch (error) {
            alert(`❌ Ошибка улучшения: ${error.message}`);
        }
    } else {
        alert(`❌ Недостаточно средств. Нужно: ${Math.round(upgradeCost)} ПП | Текущий баланс: ${Math.round(stats.publicFunds)} ПП`);
    }
}

function repairInfrastructure(infrastructureId) {
    if (!window.simulation) return;
    
    const infra = window.simulation.infrastructure.find(i => i.id === infrastructureId);
    if (!infra) return;
    
    const repairCost = infra.getMaintenanceCost() * 2;
    const stats = window.simulation.getStats();
    
    if (stats.publicFunds >= repairCost) {
        window.simulation.publicFunds -= repairCost;
        infra.maintain();
        updateUI();
        alert(`✅ ${infra.config.name} отремонтирован за ${Math.round(repairCost)} ПП!`);
    } else {
        alert(`❌ Недостаточно средств. Нужно: ${Math.round(repairCost)} ПП`);
    }
}