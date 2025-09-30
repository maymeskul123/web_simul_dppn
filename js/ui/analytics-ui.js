// analytics-ui.js - UI для аналитики
function updateAnalytics() {
    if (!window.simulation) return;
    
    const stats = window.simulation.getStats();
    const history = window.simulation.history;
    
    // Экономические показатели
    document.getElementById('analyticsGDP').textContent = Math.round(stats.totalPP);
    document.getElementById('analyticsGrowth').textContent = history.length > 1 ? 
        Math.round(((history[history.length-1].totalPP - history[0].totalPP) / history[0].totalPP) * 100) : 0;
    document.getElementById('analyticsInflation').textContent = Math.round(stats.month * 0.5);
    document.getElementById('analyticsUnemployment').textContent = Math.max(0, 100 - (stats.averageSatisfaction || 50));
    document.getElementById('analyticsProductivity').textContent = Math.round((stats.averagePP / 100) * 100);
    
    // Социальные показатели
    document.getElementById('analyticsQualityOfLife').textContent = Math.round(calculateQualityOfLife(stats));
    document.getElementById('analyticsSatisfaction').textContent = Math.round(stats.averageSatisfaction);
    document.getElementById('analyticsEducation').textContent = Math.round(stats.infrastructureLevels?.education || 0);
    document.getElementById('analyticsHealthcare').textContent = Math.round(stats.infrastructureLevels?.healthcare || 0);
    document.getElementById('analyticsMobility').textContent = Math.round(stats.infrastructureLevels?.mobility || 0);
    
    // Технологические показатели
    document.getElementById('analyticsInnovation').textContent = Math.round(calculateInnovationIndex(stats));
    document.getElementById('analyticsTechDevelopment').textContent = Math.round((stats.infrastructureCount / 10) * 100);
    document.getElementById('analyticsInfrastructureIndex').textContent = Math.round(stats.infrastructureEfficiency);
    document.getElementById('analyticsDigitalization').textContent = Math.round((stats.totalInvested / Math.max(1, stats.totalPP)) * 100);
    document.getElementById('analyticsResearch').textContent = Math.round((stats.infrastructureLevels?.education || 0) * 0.6);
    
    // Тенденции и прогнозы
    document.getElementById('analyticsStability').textContent = Math.round(calculateStabilityIndex(history));
    document.getElementById('analyticsSustainability').textContent = Math.round((calculateStabilityIndex(history) + (history.length > 1 ? 
        ((history[history.length-1].totalPP - history[0].totalPP) / history[0].totalPP) * 100 : 0)) / 2);
    document.getElementById('analyticsForecast').textContent = Math.round((history.length > 1 ? 
        ((history[history.length-1].totalPP - history[0].totalPP) / history[0].totalPP) * 100 : 5) * 0.8);
    document.getElementById('analyticsRisks').textContent = Math.round(100 - calculateStabilityIndex(history));
    document.getElementById('analyticsEfficiency').textContent = Math.round(calculateSystemEfficiency(stats));
    
    // Ключевые метрики
    document.getElementById('metricAvgPPGrowth').textContent = history.length > 1 ? 
        Math.round(((history[history.length-1].totalPP - history[0].totalPP) / history[0].totalPP) * 100) : 0;
    document.getElementById('metricInvestmentEfficiency').textContent = Math.round(stats.monthlyInvestmentIncome / Math.max(1, stats.totalInvestment) * 100);
    document.getElementById('metricInfraROI').textContent = Math.round(stats.infrastructureCount > 0 ? 
        (stats.totalPP / Math.max(1, stats.infrastructureCount * 1000)) : 0);
    document.getElementById('metricSocialCapital').textContent = Math.round((stats.averageSatisfaction + (stats.totalSocial / Math.max(1, stats.totalPP) * 100)) / 2);
    document.getElementById('metricDevelopmentIndex').textContent = Math.round(calculateQualityOfLife(stats));
    
    // Простой текстовый график
    updateHistoryChart(history);
    
    console.log('📊 Обновлена аналитика');
}

function calculateQualityOfLife(stats) {
    const factors = [
        stats.averageSatisfaction || 0,
        (stats.infrastructureLevels?.education || 0),
        (stats.infrastructureLevels?.healthcare || 0),
        (stats.infrastructureLevels?.mobility || 0),
        (stats.totalPP / Math.max(1, stats.totalResidents)) / 10
    ];
    
    return factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
}

function calculateInnovationIndex(stats) {
    const factors = [
        (stats.totalInvested / Math.max(1, stats.totalPP)) * 100,
        stats.infrastructureLevels?.education || 0,
        (stats.investments.length / Math.max(1, stats.totalResidents)) * 100,
        stats.infrastructureEfficiency
    ];
    
    return Math.min(100, factors.reduce((sum, factor) => sum + factor, 0) / factors.length);
}

function calculateStabilityIndex(history) {
    if (history.length < 3) return 50;
    
    const satisfactionValues = history.map(h => h.averageSatisfaction);
    const variance = calculateVariance(satisfactionValues);
    
    // Меньше дисперсия = больше стабильность
    return Math.max(0, 100 - (variance * 10));
}

function calculateVariance(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squareDiffs = values.map(value => Math.pow(value - mean, 2));
    return squareDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
}

function calculateSystemEfficiency(stats) {
    const factors = [
        stats.averageSatisfaction,
        stats.infrastructureEfficiency,
        (stats.monthlyInvestmentIncome / Math.max(1, stats.totalInvestment)) * 1000,
        (stats.totalPP / Math.max(1, stats.totalResidents)) / 2
    ];
    
    return factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
}

function updateHistoryChart(history) {
    const chartContainer = document.getElementById('historyChart');
    if (!chartContainer || history.length < 2) {
        chartContainer.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">График развития будет отображаться здесь после сбора данных</p>';
        return;
    }
    
    // Простой текстовый график роста ПП
    let chartHTML = '<div style="font-family: monospace; font-size: 12px; line-height: 1.2;">';
    chartHTML += '<div style="margin-bottom: 10px; font-weight: bold;">📈 История развития ПП:</div>';
    
    const maxPP = Math.max(...history.map(h => h.totalPP));
    const chartHeight = 8;
    const chartWidth = Math.min(20, history.length);
    
    // Берем последние данные для графика
    const recentHistory = history.slice(-chartWidth);
    
    for (let i = 0; i < chartHeight; i++) {
        let line = '';
        const threshold = maxPP * (chartHeight - i) / chartHeight;
        
        recentHistory.forEach(month => {
            line += month.totalPP >= threshold ? '█' : '░';
        });
        
        chartHTML += `<div>${line}</div>`;
    }
    
    // Подписи месяцев
    let monthsLine = '';
    recentHistory.forEach((month, index) => {
        if (index % 3 === 0) {
            monthsLine += `M${month.month}`.padEnd(4, ' ');
        } else {
            monthsLine += '    ';
        }
    });
    chartHTML += `<div style="margin-top: 5px;">${monthsLine}</div>`;
    
    // Легенда
    chartHTML += `<div style="margin-top: 10px; font-size: 10px; color: #666;">`;
    chartHTML += `Макс: ${Math.round(maxPP)} ПП | Всего месяцев: ${history.length}`;
    chartHTML += `</div>`;
    
    chartHTML += '</div>';
    chartContainer.innerHTML = chartHTML;
}

// Функции отчетов
function generateEconomicReport() {
    if (!window.simulation) return;
    
    const stats = window.simulation.getStats();
    const report = `
📊 ЭКОНОМИЧЕСКИЙ ОТЧЕТ DPPN
============================

📅 Период: ${stats.month} месяцев
👥 Население: ${stats.totalResidents} жителей

💸 ФИНАНСЫ:
• Общий ПП: ${Math.round(stats.totalPP)}
• Средний ПП: ${Math.round(stats.averagePP)}
• Общественные фонды: ${Math.round(stats.publicFunds)}

🏢 ИНФРАСТРУКТУРА:
• Объектов: ${stats.infrastructureCount}
• Уровень развития: ${stats.infrastructureLevel}
• Эффективность: ${Math.round(stats.infrastructureEfficiency)}%

💼 ИНВЕСТИЦИИ:
• Активных проектов: ${stats.activeInvestments}
• Общий объем: ${Math.round(stats.totalInvestment)}
• Ежемесячный доход: ${Math.round(stats.monthlyInvestmentIncome)}
    `;
    
    alert(report);
    console.log('📊 Сгенерирован экономический отчет');
}

function generateSocialReport() {
    if (!window.simulation) return;
    
    const stats = window.simulation.getStats();
    const report = `
👥 СОЦИАЛЬНЫЙ ОТЧЕТ DPPN
========================

📊 ОБЩАЯ СТАТИСТИКА:
• Жителей: ${stats.totalResidents}
• Средняя удовлетворенность: ${Math.round(stats.averageSatisfaction)}%
• Качество жизни: ${Math.round(calculateQualityOfLife(stats))}/100

🎯 АКТИВНОСТЬ:
• Образование: ${Math.round(stats.infrastructureLevels.education || 0)}/100
• Здравоохранение: ${Math.round(stats.infrastructureLevels.healthcare || 0)}/100
• Мобильность: ${Math.round(stats.infrastructureLevels.mobility || 0)}/100
    `;
    
    alert(report);
    console.log('👥 Сгенерирован социальный отчет');
}

function generateInfrastructureReport() {
    if (!window.simulation) return;
    
    const stats = window.simulation.getStats();
    const report = `
🏢 ИНФРАСТРУКТУРНЫЙ ОТЧЕТ DPPN
================================

📊 ОБЩАЯ СТАТИСТИКА:
• Всего объектов: ${stats.infrastructureCount}
• Общий уровень: ${stats.infrastructureLevel}
• Средняя эффективность: ${Math.round(stats.infrastructureEfficiency)}%

⚡ ЭФФЕКТИВНОСТЬ:
• Образование: +${Math.round((stats.infrastructureLevels.education || 0) * 10)}%
• Здравоохранение: +${Math.round((stats.infrastructureLevels.healthcare || 0) * 10)}%
• Мобильность: +${Math.round((stats.infrastructureLevels.mobility || 0) * 10)}%
    `;
    
    alert(report);
    console.log('🏢 Сгенерирован инфраструктурный отчет');
}

function generateInvestmentReport() {
    if (!window.simulation) return;
    
    const stats = window.simulation.getStats();
    const report = `
💼 ИНВЕСТИЦИОННЫЙ ОТЧЕТ DPPN
=============================

📊 ОБЩАЯ СТАТИСТИКА:
• Всего проектов: ${window.simulation.investments.length}
• Активных: ${stats.activeInvestments}
• Завершенных: ${stats.completedInvestments}

💰 ФИНАНСЫ:
• Общий объем: ${Math.round(stats.totalInvestment)} ПП
• Ежемесячный доход: ${Math.round(stats.monthlyInvestmentIncome)} ПП
• Авто-инвестиции: ${stats.autoInvestEnabled ? 'Включены ✅' : 'Выключены ❌'}
    `;
    
    alert(report);
    console.log('💼 Сгенерирован инвестиционный отчет');
}

function exportAllData() {
    if (!window.simulation) return;
    
    const data = {
        simulation: window.simulation.getStats(),
        residents: window.simulation.residents.length,
        infrastructure: window.simulation.infrastructure.length,
        investments: window.simulation.investments.length,
        exportDate: new Date().toISOString()
    };
    
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'dppn_simulation_data.json');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    console.log('💾 Экспортированы все данные симуляции');
}