// UI для управления инвестициями
// В функции updateInvestmentsList обновляем отображение:
function updateInvestmentsList() {
    if (!window.simulation) return;
    
    const container = document.getElementById('investmentsContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    updateInvestmentStats();
    
    window.simulation.investments.forEach(investment => {
        const data = investment.getDisplayData();
        const card = document.createElement('div');
        card.className = 'investment-card';
        
        const progressBar = data.isCompleted ? 
            `<div class="progress-bar" style="background: #27ae60;">
                <div class="progress-fill" style="width: 100%; background: #27ae60;"></div>
            </div>` :
            `<div class="progress-bar">
                <div class="progress-fill" style="width: ${data.progress}%;"></div>
            </div>`;
        
        // Индикатор производительности
        const performanceIndicator = data.isCompleted ? 
            `<div style="color: ${getPerformanceColor(data.performance)}; font-weight: bold;">
                📊 Факт. доходность: ${data.actualReturnRate}% 
                ${data.performance === 'above' ? '📈' : data.performance === 'below' ? '📉' : '➡️'}
            </div>` : '';
        
        card.innerHTML = `
            <div class="card-header">
                <div class="card-title">${data.icon} ${data.name}</div>
                <div class="level-badge" style="background: ${getRiskColor(data.risk)};">
                    ${data.category} | Риск: ${data.risk}%
                </div>
            </div>
            <div class="resident-details">
                <div>${data.description}</div>
                <div>📊 Прогресс: ${data.progress}%</div>
                ${progressBar}
                <div>💰 Инвестировано: ${data.currentInvestment}/${data.totalInvestment} ПП</div>
                <div>🎯 Ожидаемая доходность: ${data.returnRate}% годовых</div>
                ${performanceIndicator}
                <div>⏰ Срок: ${data.monthsRemaining} месяцев</div>
                <div>👥 Инвесторов: ${data.investors}</div>
                ${data.isCompleted ? 
                    `<div style="color: #27ae60; font-weight: bold;">✅ Завершен</div>
                     <div>📈 Ежемесячный доход: ${data.monthlyReturn} ПП</div>
                     <div>💵 Общий доход: ${data.totalReturns} ПП (ROI: ${data.roi}%)</div>` :
                    `<div style="color: #e67e22; font-weight: bold;">🔄 В процессе</div>`
                }
                ${!data.isCompleted ? `
                <div class="investment-controls">
                    <button onclick="investInProject('${investment.id}', 100)" class="success">💼 100 ПП</button>
                    <button onclick="investInProject('${investment.id}', 500)" class="warning">💼 500 ПП</button>
                    <button onclick="investInProject('${investment.id}', 1000)" class="info">💼 1000 ПП</button>
                </div>
                ` : ''}
            </div>
        `;
        container.appendChild(card);
    });
}

function getPerformanceColor(performance) {
    const colors = {
        'above': '#27ae60',
        'meeting': '#f39c12', 
        'below': '#e74c3c'
    };
    return colors[performance] || '#f39c12';
}

function updateInvestmentStats() {
    if (!simulation) return;
    
    const stats = simulation.getStats();
    
    // Основная статистика
    document.getElementById('statActiveInvestments').textContent = stats.activeInvestments;
    document.getElementById('statCompletedInvestments').textContent = stats.completedInvestments;
    document.getElementById('statTotalInvestment').textContent = Math.round(stats.totalInvestment);
    document.getElementById('statInvestmentReturn').textContent = Math.round(stats.monthlyInvestmentIncome);
    document.getElementById('statInvestmentStrategy').textContent = getStrategyName(stats.investmentStrategy);
    document.getElementById('statTotalInvested').textContent = Math.round(stats.totalInvested);
    document.getElementById('statAutoInvestments').textContent = stats.autoInvestEnabled ? 'Вкл' : 'Выкл';
    
    // Детальная статистика портфеля
    const businessInvestments = simulation.investments.filter(i => i.type === 'BUSINESS');
    const educationInvestments = simulation.investments.filter(i => i.type === 'EDUCATION');
    const healthcareInvestments = simulation.investments.filter(i => i.type === 'HEALTHCARE');
    const technologyInvestments = simulation.investments.filter(i => i.type === 'TECHNOLOGY');
    
    const total = simulation.investments.length;
    
    document.getElementById('investTotalProjects').textContent = total;
    document.getElementById('investActiveProjects').textContent = stats.activeInvestments;
    document.getElementById('investCompletedProjects').textContent = stats.completedInvestments;
    document.getElementById('investSuccessfulProjects').textContent = simulation.investments.filter(i => i.isCompleted).length;
    
    document.getElementById('investTotalAmount').textContent = Math.round(stats.totalInvestment);
    document.getElementById('investCurrentReturn').textContent = Math.round(stats.monthlyInvestmentIncome / Math.max(1, stats.totalInvestment) * 1200);
    document.getElementById('investMonthlyIncome').textContent = Math.round(stats.monthlyInvestmentIncome);
    document.getElementById('investTotalIncome').textContent = Math.round(stats.monthlyInvestmentIncome * 6); // Примерно за полгода
    
    document.getElementById('investBusiness').textContent = total > 0 ? Math.round(businessInvestments.length / total * 100) : 0;
    document.getElementById('investEducation').textContent = total > 0 ? Math.round(educationInvestments.length / total * 100) : 0;
    document.getElementById('investHealthcare').textContent = total > 0 ? Math.round(healthcareInvestments.length / total * 100) : 0;
    document.getElementById('investTechnology').textContent = total > 0 ? Math.round(technologyInvestments.length / total * 100) : 0;
}

function getRiskColor(risk) {
    if (risk <= 10) return '#27ae60';
    if (risk <= 20) return '#f39c12';
    if (risk <= 30) return '#e67e22';
    return '#e74c3c';
}

function getStrategyName(strategy) {
    const names = {
        'conservative': 'Консервативная',
        'balanced': 'Сбалансированная',
        'aggressive': 'Агрессивная'
    };
    return names[strategy] || strategy;
}