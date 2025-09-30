// Функции управления инфраструктурой
function buildInfrastructure(type) {
    if (!window.simulation) return;
    
    try {
        const infrastructure = window.simulation.buildInfrastructure(type);
        updateUI();
        
        const config = CONFIG.INFRASTRUCTURE_TYPES[type];
        console.log(`🏗️ Построена инфраструктура: ${config.name}`);
        return infrastructure;
    } catch (error) {
        console.error('Ошибка строительства:', error);
        alert(`Ошибка строительства: ${error.message}`);
    }
}

function autoMaintainInfrastructure() {
    if (!window.simulation) return;
    
    let maintainedCount = 0;
    let totalCost = 0;
    
    window.simulation.infrastructure.forEach(infra => {
        if (infra.condition < 80 && window.simulation.publicFunds >= infra.getMaintenanceCost()) {
            window.simulation.publicFunds -= infra.getMaintenanceCost();
            infra.maintain();
            maintainedCount++;
            totalCost += infra.getMaintenanceCost();
        }
    });
    
    if (maintainedCount > 0) {
        updateUI();
        console.log(`🔧 Обслужено объектов: ${maintainedCount}, стоимость: ${Math.round(totalCost)} ПП`);
        alert(`✅ Обслужено ${maintainedCount} объектов инфраструктуры за ${Math.round(totalCost)} ПП`);
    } else {
        alert('❌ Нет объектов, требующих обслуживания, или недостаточно средств');
    }
}

function upgradeInfrastructure(infrastructureId) {
    if (!window.simulation) return;
    
    const infra = window.simulation.infrastructure.find(i => i.id === infrastructureId);
    if (!infra) return;
    
    const upgradeCost = infra.getMaintenanceCost() * 5;
    
    if (window.simulation.publicFunds >= upgradeCost) {
        window.simulation.publicFunds -= upgradeCost;
        const success = infra.upgrade();
        
        if (success) {
            updateUI();
            console.log(`⬆️ Улучшена инфраструктура: ${CONFIG.INFRASTRUCTURE_TYPES[infra.type].name} до уровня ${infra.level}`);
            alert(`✅ Инфраструктура улучшена до уровня ${infra.level}!`);
        } else {
            alert('❌ Достигнут максимальный уровень улучшения');
        }
    } else {
        alert(`❌ Недостаточно средств для улучшения. Нужно: ${Math.round(upgradeCost)} ПП`);
    }
}

function repairInfrastructure(infrastructureId) {
    if (!window.simulation) return;
    
    const infra = window.simulation.infrastructure.find(i => i.id === infrastructureId);
    if (!infra) return;
    
    const repairCost = infra.getMaintenanceCost() * 2;
    
    if (window.simulation.publicFunds >= repairCost) {
        window.simulation.publicFunds -= repairCost;
        infra.maintain();
        updateUI();
        
        console.log(`🔧 Отремонтирована инфраструктура: ${CONFIG.INFRASTRUCTURE_TYPES[infra.type].name}`);
        alert(`✅ Инфраструктура отремонтирована за ${Math.round(repairCost)} ПП!`);
    } else {
        alert(`❌ Недостаточно средств для ремонта. Нужно: ${Math.round(repairCost)} ПП`);
    }
}