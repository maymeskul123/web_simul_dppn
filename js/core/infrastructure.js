// Функции управления инфраструктурой
function buildInfrastructure(type) {
    if (!simulation) return;
    
    try {
        const infrastructure = simulation.buildInfrastructure(type);
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
    if (!simulation) return;
    
    let maintainedCount = 0;
    let totalCost = 0;
    
    simulation.infrastructure.forEach(infra => {
        if (infra.condition < 80 && simulation.publicFunds >= infra.getMaintenanceCost()) {
            simulation.publicFunds -= infra.getMaintenanceCost();
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
    if (!simulation) return;
    
    const infra = simulation.infrastructure.find(i => i.id === infrastructureId);
    if (!infra) return;
    
    const upgradeCost = infra.getMaintenanceCost() * 5; // Стоимость улучшения
    
    if (simulation.publicFunds >= upgradeCost) {
        simulation.publicFunds -= upgradeCost;
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