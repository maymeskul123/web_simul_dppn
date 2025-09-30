// Главный файл инициализации DPPN симулятора
function checkDependencies() {
    if (typeof Resident === 'undefined') {
        throw new Error('Класс Resident не загружен');
    }
    if (typeof Infrastructure === 'undefined') {
        throw new Error('Класс Infrastructure не загружен');
    }
    if (typeof Investment === 'undefined') {
        throw new Error('Класс Investment не загружен');
    }
    if (typeof DPPSimulation === 'undefined') {
        throw new Error('Класс DPPSimulation не загружен');
    }
    if (typeof CONFIG === 'undefined') {
        throw new Error('CONFIG не загружен');
    }
}

function initializeApp() {
    try {
        console.log('🚀 Инициализация DPPN симулятора...');
        
        // Проверяем зависимости
        checkDependencies();
        
        // Создаем симуляцию как глобальную переменную
        window.simulation = new DPPSimulation();
        
        // Добавляем начальных жителей
        window.simulation.addResidents(CONFIG.DEFAULT_RESIDENTS);
        
        // Инициализируем минимально необходимую инфраструктуру для жизни
        try {
            window.simulation.publicFunds = 5000;
            // Базовая инфраструктура для жизни
            window.simulation.buildInfrastructure('SCHOOL');
            window.simulation.buildInfrastructure('HOSPITAL');
            window.simulation.buildInfrastructure('TRANSPORT');
            window.simulation.buildInfrastructure('FARM');
            window.simulation.buildInfrastructure('SOLAR_PLANT');
            window.simulation.buildInfrastructure('WATER_PLANT');
            window.simulation.buildInfrastructure('MARKET');
            window.simulation.buildInfrastructure('PARK');
            
            console.log('🏗️ Создана стартовая инфраструктура');
        } catch (e) {
            console.warn('Не удалось создать стартовую инфраструктуру:', e.message);
        }
        
        // Инициализируем UI компоненты
        if (typeof initTabs === 'function') initTabs();
        updateUI();
        
        // Добавляем глобальные обработчики
        setupGlobalHandlers();
        
        console.log('✅ DPPN симулятор успешно запущен!');
        console.log('📊 Начальное состояние:', window.simulation.getStats());
        
    } catch (error) {
        console.error('❌ Ошибка инициализации:', error);
        alert('Ошибка запуска симулятора: ' + error.message);
    }
}

function updateUI() {
    if (!window.simulation) return;
    
    try {
        const stats = window.simulation.getStats();
        
        // Основная статистика
        document.getElementById('statMonth').textContent = stats.month;
        document.getElementById('statResidents').textContent = stats.totalResidents;
        document.getElementById('statTotalPP').textContent = Math.round(stats.totalPP);
        document.getElementById('statAvgPP').textContent = Math.round(stats.averagePP);
        document.getElementById('statMoney').textContent = Math.round(stats.totalMoney || 0);
        document.getElementById('statVotes').textContent = Math.round(stats.totalVotes || 0);
        document.getElementById('statSocial').textContent = Math.round(stats.totalSocial || 0);
        document.getElementById('statPublicFunds').textContent = Math.round(stats.publicFunds || 0);
        document.getElementById('statTotalInvested').textContent = Math.round(stats.totalInvested || 0);
        document.getElementById('statAutoInvestments').textContent = stats.autoInvestEnabled ? 'Вкл' : 'Выкл';
        
        // Инфраструктура
        document.getElementById('statInfrastructure').textContent = stats.infrastructureCount || 0;
        document.getElementById('statInfraLevel').textContent = stats.infrastructureLevel || 0;
        document.getElementById('statInfraEfficiency').textContent = Math.round(stats.infrastructureEfficiency || 0);
        document.getElementById('statEducation').textContent = Math.round((stats.infrastructureLevels?.education || 0));
        document.getElementById('statHealthcare').textContent = Math.round((stats.infrastructureLevels?.healthcare || 0));
        
        // Инвестиции
        document.getElementById('statActiveInvestments').textContent = stats.activeInvestments || 0;
        document.getElementById('statCompletedInvestments').textContent = stats.completedInvestments || 0;
        document.getElementById('statTotalInvestment').textContent = Math.round(stats.totalInvestment || 0);
        document.getElementById('statInvestmentReturn').textContent = Math.round(stats.monthlyInvestmentIncome || 0);
        document.getElementById('statInvestmentStrategy').textContent = getStrategyName(stats.investmentStrategy);
        
        document.getElementById('currentResidents').textContent = stats.totalResidents;
        
        // Обновление всех компонентов UI
        if (typeof updateResidentsList === 'function') updateResidentsList();
        if (typeof updateInfrastructureList === 'function') updateInfrastructureList();
        if (typeof updateInvestmentsList === 'function') updateInvestmentsList();
        if (typeof updateAnalytics === 'function') updateAnalytics();
        
        // Обновление кнопки авто-инвестиций
        const autoInvestBtn = document.getElementById('autoInvestBtn');
        if (autoInvestBtn) {
            if (stats.autoInvestEnabled) {
                autoInvestBtn.textContent = '✅ Авто-инвестиции: Вкл';
                autoInvestBtn.className = 'success';
            } else {
                autoInvestBtn.textContent = '🚫 Авто-инвестиции: Выкл';
                autoInvestBtn.className = '';
            }
        }
        
        // Обновление стратегии инвестиций
        const strategySelect = document.getElementById('investmentStrategy');
        if (strategySelect && stats.investmentStrategy) {
            strategySelect.value = stats.investmentStrategy;
        }
        
        console.log('🔄 UI обновлен');
        
    } catch (error) {
        console.error('Ошибка обновления UI:', error);
    }
}

function getStrategyName(strategy) {
    const names = {
        'conservative': 'Консервативная',
        'balanced': 'Сбалансированная',
        'aggressive': 'Агрессивная'
    };
    return names[strategy] || strategy || 'Сбалансированная';
}

// Глобальные функции для HTML
function addResidents() {
    if (!window.simulation) {
        console.error('Симуляция не инициализирована');
        return;
    }
    
    const countInput = document.getElementById('residentCount');
    if (!countInput) {
        console.error('Поле residentCount не найдено');
        return;
    }
    
    const count = parseInt(countInput.value) || 1;
    const currentCount = window.simulation.residents.length;
    const newTotal = currentCount + count;
    
    if (newTotal > CONFIG.MAX_RESIDENTS) {
        alert(`Максимальное количество жителей: ${CONFIG.MAX_RESIDENTS}`);
        return;
    }
    
    console.log(`👥 Добавление ${count} жителей...`);
    window.simulation.addResidents(count);
    updateUI();
    console.log(`✅ Добавлено ${count} жителей. Теперь: ${window.simulation.residents.length}`);
}

function removeResidents() {
    if (!window.simulation) return;
    
    const countInput = document.getElementById('residentCount');
    const count = parseInt(countInput.value) || 1;
    const currentCount = window.simulation.residents.length;
    const newTotal = currentCount - count;
    
    if (newTotal < CONFIG.MIN_RESIDENTS) {
        alert(`Минимальное количество жителей: ${CONFIG.MIN_RESIDENTS}`);
        return;
    }
    
    console.log(`👥 Удаление ${count} жителей...`);
    window.simulation.removeResidents(count);
    updateUI();
    console.log(`✅ Удалено ${count} жителей. Теперь: ${window.simulation.residents.length}`);
}

function simulateMonth() {
    if (!window.simulation) return;
    
    console.log('📅 Симуляция месяца...');
    window.simulation.simulateMonth();
    updateUI();
    console.log('✅ Месяц симулирован');
}

function autoConvert() {
    if (!window.simulation) return;
    
    console.log('🔄 Авто-конвертация...');
    const totalConverted = window.simulation.autoConvert();
    updateUI();
    console.log(`✅ Авто-конвертация завершена: ${Math.round(totalConverted)} ПП`);
}

function startAutoSimulation() {
    if (!window.simulationInterval) {
        console.log('▶️ Запуск авто-симуляции...');
        window.simulationInterval = setInterval(() => {
            simulateMonth();
            if (Math.random() < 0.3) {
                autoConvert();
            }
        }, 2000);
    }
}

function stopAutoSimulation() {
    if (window.simulationInterval) {
        console.log('⏹️ Остановка авто-симуляции...');
        clearInterval(window.simulationInterval);
        window.simulationInterval = null;
    }
}

function resetSimulation() {
    console.log('🗑️ Сброс симуляции...');
    stopAutoSimulation();
    
    if (window.simulation) {
        window.simulation.reset();
        window.simulation.addResidents(CONFIG.DEFAULT_RESIDENTS);
        
        try {
            window.simulation.publicFunds = 5000;
            window.simulation.buildInfrastructure('SCHOOL');
            window.simulation.buildInfrastructure('HOSPITAL');
            window.simulation.buildInfrastructure('TRANSPORT');
            window.simulation.buildInfrastructure('FARM');
            window.simulation.buildInfrastructure('SOLAR_PLANT');
            window.simulation.buildInfrastructure('WATER_PLANT');
            window.simulation.buildInfrastructure('MARKET');
            window.simulation.buildInfrastructure('PARK');
        } catch (e) {
            console.warn('Не удалось создать стартовую инфраструктуру:', e.message);
        }
        
        updateUI();
    }
    console.log('✅ Симуляция сброшена');
}

function updateCoefficients() {
    if (!window.simulation) return;
    
    const newConfig = {
        BASE_PP_PER_MONTH: parseInt(document.getElementById('basePP').value) || 100,
        VOLUNTEER_PP_BONUS: parseInt(document.getElementById('volunteerBonus').value) || 50,
        EDUCATION_PP_BONUS: parseInt(document.getElementById('educationBonus').value) || 30,
        MAX_MONEY_CONVERSION: (parseInt(document.getElementById('moneyLimit').value) || 30) / 100
    };
    
    window.simulation.updateConfig(newConfig);
    updateUI();
    
    alert('✅ Коэффициенты обновлены!');
    console.log('⚙️ Обновлены коэффициенты:', newConfig);
}

function toggleAutoInvest() {
    if (!window.simulation) return;
    
    window.simulation.autoInvestEnabled = !window.simulation.autoInvestEnabled;
    
    // Обновляем кнопку напрямую
    const autoInvestBtn = document.getElementById('autoInvestBtn');
    if (autoInvestBtn) {
        if (window.simulation.autoInvestEnabled) {
            autoInvestBtn.textContent = '✅ Авто-инвестиции: Вкл';
            autoInvestBtn.className = 'success';
            // Запускаем авто-инвестиции если включены
            startAutoInvestments();
        } else {
            autoInvestBtn.textContent = '🚫 Авто-инвестиции: Выкл';
            autoInvestBtn.className = '';
        }
    }
    
    console.log(`🤖 Авто-инвестиции: ${window.simulation.autoInvestEnabled ? 'Включены' : 'Выключены'}`);
}

function showFinancialInfo() {
    if (!window.simulation) return;
    
    const stats = window.simulation.getStats();
    let message = `💰 ФИНАНСОВАЯ ИНФОРМАЦИЯ\n\n`;
    message += `📊 ТЕКУЩИЙ БАЛАНС: ${Math.round(stats.publicFunds)} ПП\n\n`;
    message += `📈 ИСТОЧНИКИ ПОПОЛНЕНИЯ:\n`;
    message += `• Налоги с жителей: ~${stats.totalResidents * 20} ПП/месяц\n`;
    message += `• Доходы от инвестиций: ${Math.round(stats.monthlyInvestmentIncome)} ПП/месяц\n\n`;
    message += `📉 РАСХОДЫ:\n`;
    message += `• Обслуживание инфраструктуры: ~${stats.infrastructureCount * 50} ПП/месяц\n`;
    message += `• Строительство новых объектов: 500-10000 ПП\n\n`;
    message += `💡 СОВЕТ: Следите за балансом! При отрицательном балансе инфраструктура разрушается быстрее.`;
    
    alert(message);
}

function startAutoInvestments() {
    if (!window.simulation || !window.simulation.autoInvestEnabled) return;
    
    console.log('💰 Запуск авто-инвестиций...');
    
    // Инвестируем в случайные проекты
    const investmentTypes = Object.keys(CONFIG.INVESTMENT_TYPES);
    const randomType = investmentTypes[Math.floor(Math.random() * investmentTypes.length)];
    
    try {
        createInvestment(randomType);
        
        // Инвестируем средства от жителей
        window.simulation.residents.forEach(resident => {
            if (resident.pp > 100 && Math.random() < 0.3) {
                const investmentAmount = resident.pp * 0.1; // 10% от ПП
                const activeInvestments = window.simulation.investments.filter(inv => !inv.isCompleted);
                
                if (activeInvestments.length > 0) {
                    const randomProject = activeInvestments[Math.floor(Math.random() * activeInvestments.length)];
                    resident.investInProject(randomProject, investmentAmount);
                }
            }
        });
        
        console.log(`💼 Авто-инвестиция в проект: ${CONFIG.INVESTMENT_TYPES[randomType]?.name}`);
    } catch (error) {
        console.log('❌ Не удалось создать авто-инвестицию:', error.message);
    }
    
    // Повторяем каждые 5 секунд если включено
    if (window.simulation.autoInvestEnabled) {
        setTimeout(startAutoInvestments, 5000);
    }
}

function changeInvestmentStrategy() {
    if (!window.simulation) return;
    
    const select = document.getElementById('investmentStrategy');
    window.simulation.investmentStrategy = select.value;
    
    updateUI();
    console.log(`🎯 Стратегия инвестиций изменена на: ${select.value}`);
}

function createSmartProject() {
    if (!window.simulation) return;
    
    const needs = window.simulation.analyzeSystemNeeds();
    let projectType = '';
    
    // Выбираем тип проекта по наибольшей потребности
    const maxNeed = Math.max(needs.education, needs.healthcare, needs.technology, needs.business);
    
    if (maxNeed === needs.education) {
        projectType = 'ONLINE_EDUCATION';
    } else if (maxNeed === needs.healthcare) {
        projectType = 'BIOTECH';
    } else if (maxNeed === needs.technology) {
        projectType = 'SOFTWARE_DEV';
    } else {
        projectType = 'RETAIL_BUSINESS';
    }
    
    createInvestment(projectType);
    console.log(`🎯 Создан умный проект: ${CONFIG.INVESTMENT_TYPES[projectType]?.name || projectType}`);
}

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

function showInfrastructureCosts() {
    if (!window.simulation) return;
    
    const stats = window.simulation.getStats();
    let message = `💰 Текущий баланс: ${Math.round(stats.publicFunds)} ПП\n\n`;
    message += `📊 Доходы:\n`;
    message += `• Жители генерируют: ${stats.totalResidents * 100} ПП/месяц\n`;
    message += `• Инвестиции приносят: ${Math.round(stats.monthlyInvestmentIncome)} ПП/месяц\n\n`;
    message += `🏗️ Стоимость строительства:\n`;
    
    // Показываем стоимость нескольких основных объектов
    const sampleInfrastructure = ['SCHOOL', 'HOSPITAL', 'SOLAR_PLANT', 'FARM'];
    sampleInfrastructure.forEach(type => {
        const config = CONFIG.INFRASTRUCTURE_TYPES[type];
        if (config) {
            message += `• ${config.icon} ${config.name}: ${config.cost} ПП\n`;
        }
    });
    
    alert(message);
}

function createInvestment(type) {
    if (!window.simulation) return;
    
    try {
        const investment = window.simulation.createInvestment(type);
        updateUI();
        
        console.log(`💼 Создан проект: ${CONFIG.INVESTMENT_TYPES[type]?.name || type}`);
        return investment;
    } catch (error) {
        console.error('Ошибка создания проекта:', error);
        alert(`Ошибка создания проекта: ${error.message}`);
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

function analyzeInvestmentNeeds() {
    if (!window.simulation) return;
    
    const needs = window.simulation.analyzeSystemNeeds();
    const report = `
📊 Анализ потребностей в инвестициях:

🎓 Образование: ${Math.round(needs.education)}%
🏥 Здравоохранение: ${Math.round(needs.healthcare)}%
🔬 Технологии: ${Math.round(needs.technology)}%
💼 Бизнес: ${Math.round(needs.business)}%

💡 Рекомендация: ${getInvestmentRecommendation(needs)}
    `;
    
    alert(report);
    console.log('📈 Анализ потребностей:', needs);
}

function getInvestmentRecommendation(needs) {
    const maxNeed = Math.max(needs.education, needs.healthcare, needs.technology, needs.business);
    
    if (maxNeed === needs.education) {
        return "Создать образовательный проект";
    } else if (maxNeed === needs.healthcare) {
        return "Создать медицинский проект";
    } else if (maxNeed === needs.technology) {
        return "Создать технологический проект";
    } else {
        return "Создать бизнес-проект";
    }
}

function setupGlobalHandlers() {
    // Обработчик для Enter в поле количества жителей
    const residentCountInput = document.getElementById('residentCount');
    if (residentCountInput) {
        residentCountInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                addResidents();
            }
        });
    }
    
    // Обработчик для поиска жителей
    const searchInput = document.getElementById('searchResident');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            if (typeof searchResidents === 'function') {
                searchResidents();
            }
        });
    }
    
    console.log('🎯 Глобальные обработчики установлены');
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', initializeApp);

console.log('📁 main.js загружен');