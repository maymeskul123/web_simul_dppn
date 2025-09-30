class DPPSimulation {
    constructor() {
        this.residents = [];
        this.infrastructure = [];
        this.investments = [];
        this.month = 0;
        this.isRunning = false;
        this.history = [];
        this.publicFunds = 0;
        this.autoInvestEnabled = false;
        this.investmentStrategy = 'balanced';
        this.systemStats = {
            totalPpGenerated: 0,
            totalInvestments: 0,
            infrastructureBuilt: 0
        };
    }
    
    addResidents(count) {
        const names = ['Алексей', 'Мария', 'Иван', 'Ольга', 'Дмитрий'];
        const surnames = ['Иванов', 'Петров', 'Сидоров', 'Кузнецов'];
        const occupations = ['Студент', 'Рабочий', 'Специалист'];
        
        for (let i = 0; i < count; i++) {
            const name = names[Math.floor(Math.random() * names.length)];
            const surname = surnames[Math.floor(Math.random() * surnames.length)];
            const age = Math.floor(Math.random() * 50) + 18;
            const occupation = occupations[Math.floor(Math.random() * occupations.length)];
            
            const resident = new Resident(
                this.residents.length + 1,
                `${name} ${surname}`,
                age,
                occupation
            );
            
            this.residents.push(resident);
        }
    }
    
    simulateMonth() {
        this.month++;
        const infrastructureLevels = this.getInfrastructureLevels();
        const monthStats = {
            month: this.month,
            totalPP: 0,
            activities: { volunteer: 0, education: 0, census: 0, none: 0 },
            averageSatisfaction: 0,
            autoInvestments: 0,
            voluntaryContributions: 0,    // ⭐ НОВОЕ: Добровольные взносы
            infrastructureMaintenance: 0, // ⭐ НОВОЕ: Расходы на обслуживание
            investmentRevenue: 0          // ⭐ НОВОЕ: Доход от инвестиций
        };
        
        // Симуляция активности жителей
        this.residents.forEach(resident => {
            const activity = resident.simulateActivity(infrastructureLevels, this.month);
            monthStats.activities[activity.activity]++;
            monthStats.totalPP += resident.pp;
        });
        
        // ⭐ НОВОЕ: Сбор добровольных взносов
        monthStats.voluntaryContributions = this.collectVoluntaryContributions();
        
        // Авто-инвестиции если включены
        if (this.autoInvestEnabled && this.month % 3 === 0) {
            monthStats.autoInvestments = this.processAutoInvestments();
        }
        
        // ⭐ НОВОЕ: Автоматическое обслуживание инфраструктуры
        monthStats.infrastructureMaintenance = this.performAutomaticMaintenance();
        
        // Обработка инфраструктуры
        this.infrastructure.forEach(infra => {
            infra.decay();
        });
        
        // Обработка инвестиций
        let monthlyInvestmentIncome = 0;
        this.investments.forEach(investment => {
            monthlyInvestmentIncome += investment.processMonth();
        });
        monthStats.monthlyInvestmentIncome = monthlyInvestmentIncome;
        monthStats.investmentRevenue = monthlyInvestmentIncome;
        this.publicFunds += monthlyInvestmentIncome; // ⭐ ДОХОД В ФОНДЫ
            
        // Расчет средней удовлетворенности
        monthStats.averageSatisfaction = this.residents.length > 0 
            ? this.residents.reduce((sum, r) => sum + r.satisfaction, 0) / this.residents.length
            : 0;
            
        this.history.push(monthStats);
        return monthStats;
    }
    
    // ⭐ НОВЫЙ МЕТОД: Сбор добровольных взносов от жителей
    collectVoluntaryContributions() {
        let totalContributions = 0;
        this.residents.forEach(resident => {
            // Добровольный взнос 5% если ПП > 300 (излишки)
            if (resident.pp > 300 && Math.random() < 0.4) {
                const contribution = resident.pp * 0.05;
                if (contribution > 0 && resident.pp >= contribution) {
                    resident.pp -= contribution;
                    this.publicFunds += contribution;
                    totalContributions += contribution;
                }
            }
        });
        if (totalContributions > 0) {
            console.log(`💰 Добровольные взносы: ${Math.round(totalContributions)} ПП`);
        }
        return totalContributions;
    }
    
    // ⭐ НОВЫЙ МЕТОД: Автоматическое обслуживание инфраструктуры
    performAutomaticMaintenance() {
        let totalMaintenanceCost = 0;
        let maintainedCount = 0;
        
        this.infrastructure.forEach(infra => {
            // Авто-ремонт если состояние < 60% и есть деньги
            const maintenanceCost = infra.getMaintenanceCost();
            if (infra.condition < 60 && this.publicFunds >= maintenanceCost) {
                this.publicFunds -= maintenanceCost;
                infra.condition = Math.min(100, infra.condition + 25);
                infra.efficiency = Math.min(100, infra.efficiency + 10);
                totalMaintenanceCost += maintenanceCost;
                maintainedCount++;
            }
        });
        
        if (totalMaintenanceCost > 0) {
            console.log(`🔧 Авто-обслуживание: ${maintainedCount} объектов за ${Math.round(totalMaintenanceCost)} ПП`);
        }
        return totalMaintenanceCost;
    }
    
    processAutoInvestments() {
        let totalInvested = 0;
        
        // Создаем новый инвестиционный проект каждый 3 месяц
        const investmentTypes = Object.keys(CONFIG.INVESTMENT_TYPES);
        const randomType = investmentTypes[Math.floor(Math.random() * investmentTypes.length)];
        
        try {
            this.createInvestment(randomType);
            totalInvested += CONFIG.INVESTMENT_TYPES[randomType].minInvestment;
            console.log(`🤖 Авто-инвестиция: ${CONFIG.INVESTMENT_TYPES[randomType].name}`);
        } catch (error) {
            console.log('❌ Не удалось создать авто-инвестицию:', error.message);
        }
        
        return totalInvested;
    }
    
    getInfrastructureLevels() {
        const levels = {
            education: 0,
            healthcare: 0,
            mobility: 0,
            productivity: 0
        };
        
        this.infrastructure.forEach(infra => {
            const effect = infra.getEffect();
            switch(infra.config.effect) {
                case 'education':
                    levels.education += effect;
                    break;
                case 'healthcare':
                    levels.healthcare += effect;
                    break;
                case 'mobility':
                    levels.mobility += effect;
                    break;
                case 'productivity':
                    levels.productivity += effect;
                    break;
            }
        });
        
        // Нормализация уровней
        Object.keys(levels).forEach(key => {
            levels[key] = Math.min(100, levels[key] * 10);
        });
        
        return levels;
    }
    
    getStats() {
        const totalPP = this.residents.reduce((sum, r) => sum + r.pp, 0);
        const totalInvested = this.residents.reduce((sum, r) => sum + r.invested, 0);
        const totalMoney = this.residents.reduce((sum, r) => sum + r.convertedToMoney, 0);
        const totalVotes = this.residents.reduce((sum, r) => sum + r.convertedToVotes, 0);
        const totalSocial = this.residents.reduce((sum, r) => sum + r.convertedToSocial, 0);
        
        const activeInvestments = this.investments.filter(inv => !inv.isCompleted).length;
        const completedInvestments = this.investments.filter(inv => inv.isCompleted).length;
        const totalInvestment = this.investments.reduce((sum, inv) => sum + inv.currentInvestment, 0);
        const monthlyInvestmentIncome = this.investments.reduce((sum, inv) => sum + inv.monthlyReturn, 0);
        
        // Расчет уровней инфраструктуры
        const infrastructureLevels = this.getInfrastructureLevels();
        
        return {
            totalResidents: this.residents.length,
            totalPP: totalPP,
            averagePP: this.residents.length > 0 ? totalPP / this.residents.length : 0,
            month: this.month,
            publicFunds: this.publicFunds,
            totalMoney: totalMoney,
            totalVotes: totalVotes,
            totalSocial: totalSocial,
            totalInvested: totalInvested,
            
            // Инфраструктура
            infrastructureCount: this.infrastructure.length,
            infrastructureLevel: Math.round(this.infrastructure.reduce((sum, infra) => sum + infra.level, 0) / Math.max(1, this.infrastructure.length)),
            infrastructureEfficiency: Math.round(this.infrastructure.reduce((sum, infra) => sum + infra.efficiency, 0) / Math.max(1, this.infrastructure.length)),
            infrastructureLevels: infrastructureLevels,
            
            // Инвестиции
            activeInvestments: activeInvestments,
            completedInvestments: completedInvestments,
            totalInvestment: totalInvestment,
            monthlyInvestmentIncome: monthlyInvestmentIncome,
            investmentStrategy: this.investmentStrategy,
            autoInvestEnabled: this.autoInvestEnabled,
            
            // Удовлетворенность
            averageSatisfaction: this.residents.length > 0 ? 
                this.residents.reduce((sum, r) => sum + r.satisfaction, 0) / this.residents.length : 0
        };
    }
    
    reset() {
        this.residents = [];
        this.infrastructure = [];
        this.investments = [];
        this.month = 0;
        this.history = [];
        this.publicFunds = 0;
        this.autoInvestEnabled = false;
    }
    
    removeResidents(count) {
        const removeCount = Math.min(count, this.residents.length - CONFIG.MIN_RESIDENTS);
        if (removeCount > 0) {
            this.residents = this.residents.slice(0, -removeCount);
        }
        return removeCount;
    }
    
    buildInfrastructure(type) {
        const config = CONFIG.INFRASTRUCTURE_TYPES[type];
        if (!config) {
            throw new Error(`Неизвестный тип инфраструктуры: ${type}`);
        }
        
        if (this.publicFunds >= config.cost) {
            this.publicFunds -= config.cost;
            const infrastructure = new Infrastructure(type);
            this.infrastructure.push(infrastructure);
            this.systemStats.infrastructureBuilt++;
            return infrastructure;
        } else {
            throw new Error(`Недостаточно средств. Нужно: ${config.cost} ПП`);
        }
    }
    
    createInvestment(type) {
        const config = CONFIG.INVESTMENT_TYPES[type];
        if (!config) {
            throw new Error(`Неизвестный тип инвестиции: ${type}`);
        }
        
        const investment = new Investment(type, config.minInvestment);
        this.investments.push(investment);
        return investment;
    }
    
    updateConfig(newConfig) {
        Object.assign(CONFIG, newConfig);
    }
    
    autoConvert() {
        let totalConverted = 0;
        
        this.residents.forEach(resident => {
            // Автоматическая конвертация части ПП
            const moneyAmount = resident.pp * 0.1; // 10% в деньги
            const votesAmount = resident.pp * 0.05; // 5% в голоса
            const socialAmount = resident.pp * 0.03; // 3% в социальные
            
            totalConverted += resident.convertToMoney(moneyAmount);
            totalConverted += resident.convertToVotes(votesAmount);
            totalConverted += resident.convertToSocial(socialAmount);
        });
        
        return totalConverted;
    }
    
    analyzeSystemNeeds() {
        // Упрощенный анализ потребностей системы
        const stats = this.getStats();
        return {
            education: 100 - (stats.infrastructureLevels.education || 0),
            healthcare: 100 - (stats.infrastructureLevels.healthcare || 0),
            technology: Math.random() * 100,
            business: Math.random() * 100
        };
    }
}

console.log('✅ Simulation.js загружен');