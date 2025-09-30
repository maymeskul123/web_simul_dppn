// UI для управления инфраструктурой
function updateInfrastructureList() {
    if (!window.simulation) return;
    
    const container = document.getElementById('infrastructureContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Обновляем статистику инфраструктуры
    updateInfrastructureStats();
    
    window.simulation.infrastructure.forEach(infra => {
        const data = infra.getDisplayData();
        const card = document.createElement('div');
        card.className = 'infrastructure-card';
        
        // Специфическая информация в зависимости от категории
        let specificInfo = '';
        switch(data.category) {
            case 'energy':
                specificInfo = `<div>⚡ Выработка энергии: ${data.energyOutput} ед.</div>`;
                break;
            case 'agriculture':
                specificInfo = `<div>🌾 Производство еды: ${data.foodOutput} ед.</div>`;
                break;
            case 'industry':
                specificInfo = `<div>🏭 Производство: ${data.productionOutput} ед.</div>`;
                if (data.innovationOutput > 0) {
                    specificInfo += `<div>🔬 Инновации: ${data.innovationOutput} ед.</div>`;
                }
                break;
        }
        
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
                ${specificInfo}
                <div>💰 Обслуживание: ${data.maintenanceCost} ПП/мес</div>
                <div class="investment-controls">
                    <button onclick="upgradeInfrastructure('${infra.id}')" class="success">⬆️ Улучшить (${data.upgradeCost} ПП)</button>
                    <button onclick="repairInfrastructure('${infra.id}')" class="warning">🔧 Ремонт (${Math.round(data.maintenanceCost * 2)} ПП)</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
    
    console.log(`🏢 Обновлен список инфраструктуры: ${window.simulation.infrastructure.length} объектов`);
}

function updateInfrastructureStats() {
    if (!window.simulation) return;
    
    const stats = window.simulation.getStats();
    const levels = stats.infrastructureLevels;
    
    // Основная статистика
    document.getElementById('statInfrastructure').textContent = window.simulation.infrastructure.length;
    document.getElementById('statInfraLevel').textContent = stats.infrastructureLevel;
    document.getElementById('statInfraEfficiency').textContent = Math.round(stats.infrastructureEfficiency);
    
    // Расчет производства энергии и еды
    const totalEnergy = window.simulation.infrastructure.reduce((sum, infra) => sum + infra.getEnergyOutput(), 0);
    const totalFood = window.simulation.infrastructure.reduce((sum, infra) => sum + infra.getFoodOutput(), 0);
    const totalProduction = window.simulation.infrastructure.reduce((sum, infra) => sum + infra.getProductionOutput(), 0);
    
    // Детальная статистика по типам
    const schools = window.simulation.infrastructure.filter(i => i.type === 'SCHOOL' || i.type === 'UNIVERSITY');
    const hospitals = window.simulation.infrastructure.filter(i => i.type === 'HOSPITAL' || i.type === 'CLINIC');
    const transport = window.simulation.infrastructure.filter(i => i.type === 'TRANSPORT' || i.type === 'METRO');
    const energy = window.simulation.infrastructure.filter(i => i.category === 'energy');
    const agriculture = window.simulation.infrastructure.filter(i => i.category === 'agriculture');
    const industry = window.simulation.infrastructure.filter(i => i.category === 'industry');
    
    document.getElementById('infraEducationLevel').textContent = Math.round(levels.education || 0);
    document.getElementById('infraSchoolsCount').textContent = schools.length;
    document.getElementById('infraEducationBonus').textContent = Math.round((levels.education || 0) * 10);
    
    document.getElementById('infraHealthLevel').textContent = Math.round(levels.healthcare || 0);
    document.getElementById('infraHospitalsCount').textContent = hospitals.length;
    document.getElementById('infraHealthBonus').textContent = Math.round((levels.healthcare || 0) * 10);
    
    document.getElementById('infraTransportLevel').textContent = Math.round(levels.mobility || 0);
    document.getElementById('infraTransportCount').textContent = transport.length;
    document.getElementById('infraTransportBonus').textContent = Math.round((levels.mobility || 0) * 10);
    
    document.getElementById('infraEnergyLevel').textContent = Math.round(totalEnergy / 100);
    document.getElementById('infraEnergyCount').textContent = energy.length;
    document.getElementById('infraEnergyBonus').textContent = Math.round(totalEnergy);
    
    // Добавляем новые статистики
    document.getElementById('statEducation').textContent = Math.round(levels.education || 0);
    document.getElementById('statHealthcare').textContent = Math.round(levels.healthcare || 0);
}

function getEffectName(effect) {
    const effects = {
        'education': 'образованию',
        'healthcare': 'здоровью',
        'mobility': 'мобильности',
        'energy': 'энергии',
        'food': 'производству еды',
        'production': 'производству',
        'innovation': 'инновациям'
    };
    return effects[effect] || effect;
}