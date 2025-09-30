// UI для управления инфраструктурой
function updateInfrastructureList() {
    if (!simulation) return;
    
    const container = document.getElementById('infrastructureContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Обновляем статистику инфраструктуры
    updateInfrastructureStats();
    
    simulation.infrastructure.forEach(infra => {
        const data = infra.getDisplayData();
        const card = document.createElement('div');
        card.className = 'infrastructure-card';
        card.innerHTML = `
            <div class="card-header">
                <div class="card-title">${data.icon} ${data.name}</div>
                <div class="level-badge">Ур. ${data.level}</div>
            </div>
            <div class="resident-details">
                <div>${data.description}</div>
                <div>🏗️ Состояние: ${data.condition}%</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${data.condition}%"></div>
                </div>
                <div>⚡ Эффективность: ${data.efficiency}%</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${data.efficiency}%"></div>
                </div>
                <div>📈 Эффект: +${data.effectValue}% к ${getEffectName(data.effect)}</div>
                <div>💰 Обслуживание: ${data.maintenanceCost} ПП/мес</div>
                <div class="investment-controls">
                    <button onclick="upgradeInfrastructure('${infra.id}')" class="success">⬆️ Улучшить</button>
                    <button onclick="repairInfrastructure('${infra.id}')" class="warning">🔧 Ремонт</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    
    console.log(`🏢 Обновлен список инфраструктуры: ${simulation.infrastructure.length} объектов`);
}

function updateInfrastructureStats() {
    if (!simulation) return;
    
    const stats = simulation.getStats();
    const levels = stats.infrastructureLevels;
    
    // Основная статистика
    document.getElementById('statInfrastructure').textContent = simulation.infrastructure.length;
    document.getElementById('statInfraLevel').textContent = stats.infrastructureLevel;
    document.getElementById('statInfraEfficiency').textContent = Math.round(stats.infrastructureEfficiency);
    
    // Детальная статистика по типам
    const schools = simulation.infrastructure.filter(i => i.type === 'SCHOOL');
    const hospitals = simulation.infrastructure.filter(i => i.type === 'HOSPITAL');
    const transport = simulation.infrastructure.filter(i => i.type === 'TRANSPORT');
    const energy = simulation.infrastructure.filter(i => i.type === 'ENERGY');
    
    document.getElementById('infraEducationLevel').textContent = Math.round(levels.education || 0);
    document.getElementById('infraSchoolsCount').textContent = schools.length;
    document.getElementById('infraEducationBonus').textContent = Math.round((levels.education || 0) * 10);
    
    document.getElementById('infraHealthLevel').textContent = Math.round(levels.healthcare || 0);
    document.getElementById('infraHospitalsCount').textContent = hospitals.length;
    document.getElementById('infraHealthBonus').textContent = Math.round((levels.healthcare || 0) * 10);
    
    document.getElementById('infraTransportLevel').textContent = Math.round(levels.mobility || 0);
    document.getElementById('infraTransportCount').textContent = transport.length;
    document.getElementById('infraTransportBonus').textContent = Math.round((levels.mobility || 0) * 10);
    
    document.getElementById('infraEnergyLevel').textContent = Math.round(levels.productivity || 0);
    document.getElementById('infraEnergyCount').textContent = energy.length;
    document.getElementById('infraEnergyBonus').textContent = Math.round((levels.productivity || 0) * 10);
}

function getEffectName(effect) {
    const effects = {
        'education': 'образованию',
        'healthcare': 'здоровью',
        'mobility': 'мобильности',
        'productivity': 'продуктивности'
    };
    return effects[effect] || effect;
}

function repairInfrastructure(infrastructureId) {
    if (!simulation) return;
    
    const infra = simulation.infrastructure.find(i => i.id === infrastructureId);
    if (!infra) return;
    
    const repairCost = infra.getMaintenanceCost() * 2;
    
    if (simulation.publicFunds >= repairCost) {
        simulation.publicFunds -= repairCost;
        infra.maintain();
        updateUI();
        
        console.log(`🔧 Отремонтирована инфраструктура: ${CONFIG.INFRASTRUCTURE_TYPES[infra.type].name}`);
        alert(`✅ Инфраструктура отремонтирована за ${Math.round(repairCost)} ПП!`);
    } else {
        alert(`❌ Недостаточно средств для ремонта. Нужно: ${Math.round(repairCost)} ПП`);
    }
}