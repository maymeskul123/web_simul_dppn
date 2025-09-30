// UI для аналитики
function updateAnalytics() {
    if (!simulation) return;
    
    const stats = simulation.getStats();
    const history = simulation.history;
    
    // Расчет аналитических показателей
    const gdp = stats.totalPP + stats.totalInvestment;
    const qualityOfLife = calculateQualityOfLife(stats);
    const growth = calculateGrowthRate(history);
    const innovation = calculateInnovationIndex(stats);
    const stability = calculateStabilityIndex(history);
    
    // Экономические показатели
    document.getElementById('analyticsGDP').textContent = Math.round(gdp);
    document.getElementById('analyticsGrowth').textContent = Math.round(growth);
    document.getElementById('analyticsInflation').textContent = Math.round(growth * 0.3); // Упрощенный расчет
    document.getElementById('analyticsUnemployment').textContent = Math.round(100 - stats.averageSatisfaction);
    document.getElementById('analyticsProductivity').textContent = Math.round((stats.averagePP / 100) * 100);
    
    // Социальные показатели
    document.getElementById('analyticsQualityOfLife').textContent = Math.round(qualityOfLife);
    document.getElementById('analyticsSatisfaction').textContent = Math.round(stats.averageSatisfaction);
    document.getElementById('analyticsEducation').textContent = Math.round(stats.infrastructureLevels.education || 0);
    document.getElementById('analyticsHealthcare').textContent = Math.round(stats.infrastructureLevels.healthcare || 0);
    document.getElementById('analyticsMobility').textContent = Math.round(stats.infrastructureLevels.mobility || 0);
    
    // Технологические показатели
    document.getElementById('analyticsInnovation').textContent = Math.round(innovation);
    document.getElementById('analyticsTechDevelopment').textContent = Math.round(innovation * 0.8);
    document.getElementById('analyticsInfrastructureIndex').textContent = Math.round(stats.infrastructureEfficiency);
    document.getElementById('analyticsDigitalization').textContent = Math.round((stats.totalInvested / Math.max(1, stats.totalPP)) * 100);
    document.getElementById('analyticsResearch').textContent = Math.round(innovation * 0.6);
    
    // Тенденции и прогнозы
    document.getElementById('analyticsStability').textContent = Math.round(stability);
    document.getElementById('analyticsSustainability').textContent = Math.round((stability + growth) / 2);
    document.getElementById('analyticsForecast').textContent = Math.round(growth * 0.8); // Прогноз на 6 месяцев
    document.getElementById('analyticsRisks').textContent = Math.round(100 - stability);
    document.getElementById('analyticsEfficiency').textContent = Math.round(calculateSystemEfficiency(stats));
    
    // Ключевые метрики
    updateKeyMetrics(stats, history);
    
    console.log('📊 Обновлена аналитика');
}

function calculateQualityOfLife(stats) {
    const factors = [
        stats.averageSatisfaction,
        stats.infrastructureLevels.education || 0,
        stats.infrastructureLevels.healthcare || 0,
        stats.infrastructureLevels.mobility || 0,
        (stats.totalPP / Math.max(1, stats.totalResidents)) / 10
    ];
    
    return factors.reduce((sum, factor) => sum + factor, 0) / factors.length;
}

function calculateGrowthRate(history) {
    if (history.length < 2) return 0;
    
    const recent = history.slice(-6); // Последние 6 месяцев
    if (recent.length < 2) return 0;
    
    const first = recent[0].totalPP;
    const last = recent[recent.length - 1].totalPP;
    
    return ((last - first) / first) * 100;
}

function calculateInnovationIndex(stats) {
    const factors = [
        (stats.totalInvested / Math.max(1, stats.totalPP)) * 100,
        stats.infrastructureLevels.education || 0,
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

function updateKeyMetrics(stats, history) {
    // Средний рост ПП
    const ppGrowth = calculateGrowthRate(history);
    document.getElementById('metricAvgPPGrowth').textContent = Math.round(ppGrowth);
    
    // Эффективность инвестиций
    const investmentEfficiency = stats.monthlyInvestmentIncome / Math.max(1, stats.totalInvestment) * 100;
    document.getElementById('metricInvestmentEfficiency').textContent = Math.round(investmentEfficiency);
    
    // Окупаемость инфраструктуры
    const infraROI = stats.infrastructureCount > 0 ? 
        (stats.totalPP / Math.max(1, stats.infrastructureCount * 1000)) : 0;
    document.getElementById('metricInfraROI').textContent = Math.round(infraROI);
    
    // Социальный капитал
    const socialCapital = (stats.averageSatisfaction + (stats.totalSocial / Math.max(1, stats.totalPP) * 100)) / 2;
    document.getElementById('metricSocialCapital').textContent = Math.round(socialCapital);
    
    // Индекс развития
    const developmentIndex = (ppGrowth + investmentEfficiency + socialCapital) / 3;
    document.getElementById('metricDevelopmentIndex').textContent = Math.round(developmentIndex);
}

// Функции генерации отчетов
function generateEconomicReport() {
    if (!simulation) return;
    
    const stats = simulation.getStats();
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

📈 ПОКАЗАТЕЛИ:
• Качество жизни: ${Math.round(calculateQualityOfLife(stats))}/100
• Стабильность системы: ${Math.round(calculateStabilityIndex(simulation.history))}/100
    `;
    
    alert(report);
    console.log('📊 Сгенерирован экономический отчет');
}

function generateSocialReport() {
    if (!simulation) return;
    
    const stats = simulation.getStats();
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

💰 СОЦИАЛЬНЫЕ ИНВЕСТИЦИИ:
• В голоса: ${Math.round(stats.totalVotes)} ПП
• В социальные проекты: ${Math.round(stats.totalSocial)} ПП
• Общие инвестиции жителей: ${Math.round(stats.totalInvested)} ПП

📈 ТЕНДЕНЦИИ:
• Рост удовлетворенности: ${calculateSatisfactionTrend(simulation.history)}
• Социальная активность: ${calculateSocialActivity(stats)}
    `;
    
    alert(report);
    console.log('👥 Сгенерирован социальный отчет');
}

function calculateSatisfactionTrend(history) {
    if (history.length < 2) return "стабильная";
    
    const recent = history.slice(-3);
    const trend = recent[recent.length - 1].averageSatisfaction - recent[0].averageSatisfaction;
    
    if (trend > 5) return "растущая 📈";
    if (trend < -5) return "снижающаяся 📉";
    return "стабильная ➡️";
}

function calculateSocialActivity(stats) {
    const activity = (stats.totalVotes + stats.totalSocial) / Math.max(1, stats.totalPP) * 100;
    
    if (activity > 20) return "высокая 🎯";
    if (activity > 10) return "средняя 👍";
    return "низкая 👎";
}

function generateInfrastructureReport() {
    if (!simulation) return;
    
    const stats = simulation.getStats();
    const report = `
🏢 ИНФРАСТРУКТУРНЫЙ ОТЧЕТ DPPN
================================

📊 ОБЩАЯ СТАТИСТИКА:
• Всего объектов: ${stats.infrastructureCount}
• Общий уровень: ${stats.infrastructureLevel}
• Средняя эффективность: ${Math.round(stats.infrastructureEfficiency)}%

🎯 РАСПРЕДЕЛЕНИЕ:
${getInfrastructureDistribution(simulation.infrastructure)}

⚡ ЭФФЕКТИВНОСТЬ:
• Образование: +${Math.round((stats.infrastructureLevels.education || 0) * 10)}%
• Здравоохранение: +${Math.round((stats.infrastructureLevels.healthcare || 0) * 10)}%
• Мобильность: +${Math.round((stats.infrastructureLevels.mobility || 0) * 10)}%
• Продуктивность: +${Math.round((stats.infrastructureLevels.productivity || 0) * 10)}%

💰 ФИНАНСЫ:
• Общественные фонды: ${Math.round(stats.publicFunds)} ПП
• Рекомендуется на обслуживание: ${Math.round(calculateMaintenanceNeed(simulation.infrastructure))} ПП
    `;
    
    alert(report);
    console.log('🏢 Сгенерирован инфраструктурный отчет');
}

function getInfrastructureDistribution(infrastructure) {
    const types = {};
    infrastructure.forEach(infra => {
        types[infra.type] = (types[infra.type] || 0) + 1;
    });
    
    let distribution = '';
    Object.keys(types).forEach(type => {
        const config = CONFIG.INFRASTRUCTURE_TYPES[type];
        distribution += `• ${config.icon} ${config.name}: ${types[type]} объектов\n`;
    });
    
    return distribution || '• Нет данных';
}

function calculateMaintenanceNeed(infrastructure) {
    return infrastructure.reduce((sum, infra) => {
        if (infra.condition < 80) {
            return sum + infra.getMaintenanceCost();
        }
        return sum;
    }, 0);
}

function generateInvestmentReport() {
    if (!simulation) return;
    
    const stats = simulation.getStats();
    const report = `
💼 ИНВЕСТИЦИОННЫЙ ОТЧЕТ DPPN
=============================

📊 ОБЩАЯ СТАТИСТИКА:
• Всего проектов: ${simulation.investments.length}
• Активных: ${stats.activeInvestments}
• Завершенных: ${stats.completedInvestments}

💰 ФИНАНСЫ:
• Общий объем: ${Math.round(stats.totalInvestment)} ПП
• Ежемесячный доход: ${Math.round(stats.monthlyInvestmentIncome)} ПП
• Общая доходность: ${Math.round(stats.monthlyInvestmentIncome / Math.max(1, stats.totalInvestment) * 1200)}%

🎯 СТРАТЕГИЯ:
• Текущая: ${getStrategyName(stats.investmentStrategy)}
• Авто-инвестиции: ${stats.autoInvestEnabled ? 'Включены ✅' : 'Выключены ❌'}

📈 РЕКОМЕНДАЦИИ:
${getInvestmentRecommendations(stats)}
    `;
    
    alert(report);
    console.log('💼 Сгенерирован инвестиционный отчет');
}

function getInvestmentRecommendations(stats) {
    const needs = simulation.analyzeSystemNeeds();
    const maxNeed = Math.max(needs.education, needs.healthcare, needs.technology, needs.business);
    
    let recommendations = '';
    
    if (maxNeed === needs.education) {
        recommendations = '• Приоритет: образовательные проекты 🎓\n• Рекомендуется создать 1-2 новых проекта';
    } else if (maxNeed === needs.healthcare) {
        recommendations = '• Приоритет: медицинские проекты 🏥\n• Рекомендуется создать 1-2 новых проекта';
    } else if (maxNeed === needs.technology) {
        recommendations = '• Приоритет: технологические проекты 🔬\n• Высокий риск, но высокая доходность';
    } else {
        recommendations = '• Приоритет: бизнес-проекты 💼\n• Стабильный доход, умеренный риск';
    }
    
    if (stats.publicFunds < 1000) {
        recommendations += '\n• ⚠️ Низкий уровень общественных фондов';
    }
    
    return recommendations;
}

function exportAllData() {
    if (!simulation) return;
    
    const data = {
        simulation: {
            month: simulation.month,
            publicFunds: simulation.publicFunds,
            stats: simulation.getStats(),
            systemStats: simulation.systemStats
        },
        residents: simulation.residents.map(r => r.getDisplayData()),
        infrastructure: simulation.infrastructure.map(i => i.getDisplayData()),
        investments: simulation.investments.map(i => i.getDisplayData()),
        history: simulation.history,
        config: CONFIG,
        exportDate: new Date().toISOString()
    };
    
    const json = JSON.stringify(data, null, 2);
    downloadJSON(json, 'dppn_simulation_data.json');
    
    console.log('💾 Экспортированы все данные симуляции');
}

function downloadJSON(json, filename) {
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}