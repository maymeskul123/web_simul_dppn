// Главный файл инициализации
function updateUI() {
    if (!window.simulation) return;
    
    try {
        const stats = window.simulation.getStats();
        
        // Основная статистика
        document.getElementById('statMonth').textContent = stats.month;
        document.getElementById('statResidents').textContent = stats.totalResidents;
        document.getElementById('statTotalPP').textContent = Math.round(stats.totalPP);
        document.getElementById('statAvgPP').textContent = Math.round(stats.averagePP);
        document.getElementById('statMoney').textContent = Math.round(stats.totalMoney);
        document.getElementById('statVotes').textContent = Math.round(stats.totalVotes);
        document.getElementById('statSocial').textContent = Math.round(stats.totalSocial);
        document.getElementById('statPublicFunds').textContent = Math.round(stats.publicFunds);
        
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
        if (strategySelect) {
            strategySelect.value = stats.investmentStrategy;
        }
        
        console.log('🔄 UI обновлен');
        
    } catch (error) {
        console.error('Ошибка обновления UI:', error);
    }
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
            window.simulation.publicFunds = 3000;
            window.simulation.buildInfrastructure('SCHOOL');
            window.simulation.buildInfrastructure('HOSPITAL');
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

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Инициализация DPPN симулятора...');
    
    try {
        // Создаем симуляцию как глобальную переменную
        window.simulation = new DPPSimulation();
        
        // Добавляем начальных жителей
        window.simulation.addResidents(CONFIG.DEFAULT_RESIDENTS);
        
        // Инициализируем начальную инфраструктуру
        try {
            window.simulation.publicFunds = 3000;
            window.simulation.buildInfrastructure('SCHOOL');
            window.simulation.buildInfrastructure('HOSPITAL');
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
});

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
    
    // Обработчик для поиска жителей (используем делегирование событий)
    const searchInput = document.getElementById('searchResident');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            // Проверяем, что функция существует перед вызовом
            if (typeof searchResidents === 'function') {
                searchResidents();
            }
        });
    }
    
    console.log('🎯 Глобальные обработчики установлены');
}

console.log('📁 Все модули DPPN симулятора загружены');