// Основные функции симуляции
function simulateMonth() {
    if (!window.simulation) {
        console.error('Симуляция не инициализирована');
        return;
    }
    
    try {
        const monthStats = window.simulation.simulateMonth();
        updateUI();
        
        console.log(`📅 Месяц ${window.simulation.month}:`, {
            жителей: window.simulation.residents.length,
            общий_ПП: Math.round(monthStats.totalPP),
            автоинвестиции: Math.round(monthStats.autoInvestments)
        });
        
    } catch (error) {
        console.error('Ошибка симуляции:', error);
        alert(`Ошибка симуляции: ${error.message}`);
    }
}

function autoConvert() {
    if (!window.simulation) return;
    
    const totalConverted = window.simulation.autoConvert();
    updateUI();
    
    if (totalConverted > 0) {
        console.log(`🔄 Авто-конвертация: ${Math.round(totalConverted)} ПП`);
    }
    return totalConverted;
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