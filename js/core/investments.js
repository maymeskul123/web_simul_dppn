// Функции управления инвестициями
function createInvestment(type) {
    if (!simulation) return;
    
    try {
        const investment = simulation.createInvestment(type);
        updateUI();
        
        console.log(`💼 Создан проект: ${CONFIG.INVESTMENT_TYPES[type].name}`);
        return investment;
    } catch (error) {
        console.error('Ошибка создания проекта:', error);
        alert(`Ошибка создания проекта: ${error.message}`);
    }
}

function investInProject(projectId, amount) {
    if (!simulation) return false;
    
    const project = simulation.investments.find(inv => inv.id === projectId);
    if (!project) {
        alert('Проект не найден!');
        return false;
    }
    
    if (project.isCompleted) {
        alert('Этот проект уже завершен!');
        return false;
    }
    
    // Находим жителя с наибольшим количеством ПП
    const resident = simulation.residents.reduce((prev, current) => 
        (prev.pp > current.pp) ? prev : current
    );
    
    if (resident.pp < amount) {
        alert(`Недостаточно ПП для инвестирования! У ${resident.name} только ${Math.round(resident.pp)} ПП`);
        return false;
    }
    
    if (resident.investInProject(project, amount)) {
        updateUI();
        console.log(`💰 ${resident.name} инвестировал ${amount} ПП в проект`);
        return true;
    }
    
    return false;
}

function toggleAutoInvest() {
    if (!simulation) return;
    
    simulation.autoInvestEnabled = !simulation.autoInvestEnabled;
    const btn = document.getElementById('autoInvestBtn');
    
    if (simulation.autoInvestEnabled) {
        btn.textContent = '✅ Авто-инвестиции: Вкл';
        btn.className = 'success';
        console.log('🤖 Авто-инвестиции включены');
    } else {
        btn.textContent = '🚫 Авто-инвестиции: Выкл';
        btn.className = '';
        console.log('🤖 Авто-инвестиции выключены');
    }
    
    updateUI();
}

function changeInvestmentStrategy() {
    if (!simulation) return;
    
    const select = document.getElementById('investmentStrategy');
    simulation.investmentStrategy = select.value;
    
    updateUI();
    console.log(`🎯 Стратегия инвестиций изменена на: ${select.value}`);
}

function createSmartProject() {
    if (!simulation) return;
    
    const needs = simulation.analyzeSystemNeeds();
    let projectType = '';
    
    // Выбираем тип проекта по наибольшей потребности
    const maxNeed = Math.max(needs.education, needs.healthcare, needs.technology, needs.business);
    
    if (maxNeed === needs.education) {
        projectType = 'EDUCATION';
    } else if (maxNeed === needs.healthcare) {
        projectType = 'HEALTHCARE';
    } else if (maxNeed === needs.technology) {
        projectType = 'TECHNOLOGY';
    } else {
        projectType = 'BUSINESS';
    }
    
    createInvestment(projectType);
    
    console.log(`🎯 Создан умный проект: ${CONFIG.INVESTMENT_TYPES[projectType].name} (потребность: ${Math.round(maxNeed)}%)`);
}

function analyzeInvestmentNeeds() {
    if (!simulation) return;
    
    const needs = simulation.analyzeSystemNeeds();
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