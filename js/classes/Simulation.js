class DPPSimulation {
    constructor() {
        this.residents = [];
        this.infrastructure = [];
        this.investments = [];
        this.month = 0;
        this.isRunning = false;
        this.speed = 1;
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
        const names = ['Алексей', 'Мария', 'Иван', 'Ольга', 'Дмитрий', 'Елена', 'Сергей', 'Наталья', 'Андрей', 'Татьяна'];
        const surnames = ['Иванов', 'Петров', 'Сидоров', 'Кузнецов', 'Смирнов', 'Попов', 'Васильев', 'Фёдоров'];
        const occupations = ['Студент', 'Рабочий', 'Специалист', 'Пенсионер', 'Предприниматель', 'Ученый', 'Врач', 'Учитель'];
        
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
        
        this.systemStats.totalResidentsAdded = (this.systemStats.totalResidentsAdded || 0) + count;
    }
    
    removeResidents(count) {
        const removeCount = Math.min(count, this.residents.length);
        this.residents.splice(-removeCount, removeCount);
        return removeCount;
    }
    
    buildInfrastructure(type) {
        const config = CONFIG.INFRASTRUCTURE_TYPES[type];
        if (this.publicFunds >= config.cost) {
            this.publicFunds -= config.cost;
            const infra = new Infrastructure(type);
            this.infrastructure.push(infra);
            this.systemStats.infrastructureBuilt++;
            return infra;
        } else {
            throw new Error(`Недостаточно средств. Нужно: ${config.cost} ПП, доступно: ${this.publicFunds} ПП`);
        }
    }
    
    createInvestment(type) {
        const config = CONFIG.INVESTMENT_TYPES[type];
        const investment = new Investment(type, config.minInvestment);
        this.investments.push(investment);
        this.systemStats.totalInvestments++;
        return investment;
    }
    
    getInfrastructureLevels() {
        const levels = {};
        this.infrastructure.forEach(infra => {
            levels[infra.effect] = (levels[infra.effect] || 0) + infra.getEffect();
        });
        return levels;
    }
    
    simulateMonth() {
        this.month++;
        const infrastructureLevels = this.getInfrastructureLevels();
        const monthStats = {
            month: this.month,
            totalPP: 0,
            activities: { volunteer: 0, education: 0, census: 0, none: 0 },
            conversions: { money: 0, votes: 0, social: 0 },
            averageSatisfaction: 0,
            infrastructureLevels: infrastructureLevels,
            autoInvestments: 0,
            newInvestments: 0,
            infrastructureDecay: 0
        };
        
        // Симуляция активности жителей
        this.residents.forEach(resident => {
            const activity = resident.simulateActivity(infrastructureLevels);
            monthStats.activities[activity.activity]++;
            monthStats.totalPP += resident.pp;
        });
        
        this.systemStats.totalPpGenerated += monthStats.totalPP;
        
        // Автоматические инвестиции
        if (this.autoInvestEnabled) {
            monthStats.autoInvestments = this.autoInvest();
        }
        
        // Автоматическое создание проектов по потребностям
        if (this.month % 6 === 0) {
            monthStats.newInvestments = this.autoCreateProjectsBasedOnNeeds();
        }
        
        // Обработка инвестиций
        let investmentReturns = 0;
        this.investments.forEach(investment => {
            const returns = investment.processMonth();
            investmentReturns += returns;
            this.publicFunds += returns;
        });
        
        // Обновление инфраструктуры
        this.infrastructure.forEach(infra => {
            infra.decay();
            monthStats.infrastructureDecay += (100 - infra.condition);
        });
        
        // Расчет средней удовлетворенности
        monthStats.averageSatisfaction = this.residents.length > 0 
            ? this.residents.reduce((sum, r) => sum + r.satisfaction, 0) / this.residents.length
            : 0;
            
        this.history.push(monthStats);
        
        // Ограничение истории
        if (this.history.length > 60) {
            this.history = this.history.slice(-60);
        }
        
        return monthStats;
    }
    
    autoInvest() {
        let totalInvested = 0;
        const availableInvestments = this.investments.filter(inv => !inv.isCompleted);
        
        if (availableInvestments.length === 0) return 0;
        
        this.residents.forEach(resident => {
            // Вероятность инвестирования зависит от образования и количества ПП
            const investmentProbability = 0.1 + (resident.education / 100) * 0.2;
            const hasEnoughPP = resident.pp > 300;
            
            if (Math.random() < investmentProbability && hasEnoughPP) {
                const selectedInvestment = this.selectInvestmentByStrategy(availableInvestments);
                const amount = resident.pp * (0.05 + Math.random() * 0.15);
                
                if (resident.investInProject(selectedInvestment, amount)) {
                    totalInvested += amount;
                }
            }
        });
        
        return totalInvested;
    }
    
    selectInvestmentByStrategy(availableInvestments) {
        let filteredInvestments = availableInvestments;
        
        switch(this.investmentStrategy) {
            case 'conservative':
                filteredInvestments = availableInvestments.filter(inv => 
                    inv.returnRate <= 0.12 && inv.risk <= 0.2
                );
                break;
            case 'aggressive':
                filteredInvestments = availableInvestments.filter(inv => 
                    inv.returnRate >= 0.18
                );
                break;
        }
        
        if (filteredInvestments.length === 0) {
            return availableInvestments[Math.floor(Math.random() * availableInvestments.length)];
        }
        
        return filteredInvestments[Math.floor(Math.random() * filteredInvestments.length)];
    }
    
    autoCreateProjectsBasedOnNeeds() {
        const needs = this.analyzeSystemNeeds();
        let projectsCreated = 0;
        
        if (needs.education > 70 && Math.random() < 0.3) {
            this.createInvestment('EDUCATION');
            projectsCreated++;
        }
        if (needs.healthcare > 70 && Math.random() < 0.25) {
            this.createInvestment('HEALTHCARE');
            projectsCreated++;
        }
        if (needs.technology > 60 && Math.random() < 0.2) {
            this.createInvestment('TECHNOLOGY');
            projectsCreated++;
        }
        if (needs.business > 50 && Math.random() < 0.35) {
            this.createInvestment('BUSINESS');
            projectsCreated++;
        }
        
        return projectsCreated;
    }
    
    analyzeSystemNeeds() {
        const levels = this.getInfrastructureLevels();
        const residentCount = this.residents.length;
        
        return {
            education: 100 - (levels.education || 0) * 10,
            healthcare: 100 - (levels.healthcare || 0) * 10,
            technology: 100 - (this.infrastructure.length / Math.max(1, residentCount)) * 100,
            business: 100 - (this.investments.filter(inv => inv.type === 'BUSINESS').length * 20)
        };
    }
    
    autoConvert() {
        let totalConverted = 0;
        
        this.residents.forEach(resident => {
            if (Math.random() < 0.3) {
                const conversionType = Math.floor(Math.random() * 3);
                const amount = resident.pp * (0.1 + Math.random() * 0.2);
                let converted = 0;
                
                switch(conversionType) {
                    case 0: 
                        converted = resident.convertToMoney(amount);
                        break;
                    case 1: 
                        converted = resident.convertToVotes(amount);
                        break;
                    case 2: 
                        converted = resident.convertToSocial(amount);
                        break;
                }
                
                totalConverted += converted;
            }
        });
        
        return totalConverted;
    }
    
    getStats() {
        const totalPP = this.residents.reduce((sum, r) => sum + r.pp, 0);
        const totalMoney = this.residents.reduce((sum, r) => sum + r.convertedToMoney, 0);
        const totalVotes = this.residents.reduce((sum, r) => sum + r.convertedToVotes, 0);
        const totalSocial = this.residents.reduce((sum, r) => sum + r.convertedToSocial, 0);
        const totalInvested = this.residents.reduce((sum, r) => sum + r.invested, 0);
        
        const activeInvestments = this.investments.filter(inv => !inv.isCompleted).length;
        const completedInvestments = this.investments.filter(inv => inv.isCompleted).length;
        const totalInvestment = this.investments.reduce((sum, inv) => sum + inv.totalInvestment, 0);
        const monthlyInvestmentIncome = this.investments.reduce((sum, inv) => sum + inv.monthlyReturn, 0);
        
        const infrastructureLevel = this.infrastructure.reduce((sum, infra) => sum + infra.level, 0);
        const infrastructureEfficiency = this.infrastructure.length > 0 
            ? this.infrastructure.reduce((sum, infra) => sum + infra.efficiency, 0) / this.infrastructure.length 
            : 0;
            
        const infrastructureLevels = this.getInfrastructureLevels();
        
        return {
            totalResidents: this.residents.length,
            totalPP: totalPP,
            averagePP: this.residents.length > 0 ? totalPP / this.residents.length : 0,
            totalMoney: totalMoney,
            totalVotes: totalVotes,
            totalSocial: totalSocial,
            totalInvested: totalInvested,
            activeInvestments: activeInvestments,
            completedInvestments: completedInvestments,
            totalInvestment: totalInvestment,
            monthlyInvestmentIncome: monthlyInvestmentIncome,
            infrastructureCount: this.infrastructure.length,
            infrastructureLevel: infrastructureLevel,
            infrastructureEfficiency: infrastructureEfficiency,
            infrastructureLevels: infrastructureLevels,
            publicFunds: this.publicFunds,
            month: this.month,
            autoInvestEnabled: this.autoInvestEnabled,
            investmentStrategy: this.investmentStrategy,
            systemStats: this.systemStats
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
        this.systemStats = {
            totalPpGenerated: 0,
            totalInvestments: 0,
            infrastructureBuilt: 0,
            totalResidentsAdded: 0
        };
    }
    
    updateConfig(newConfig) {
        Object.keys(newConfig).forEach(key => {
            if (CONFIG.hasOwnProperty(key)) {
                if (typeof CONFIG[key] === 'object' && CONFIG[key] !== null) {
                    Object.assign(CONFIG[key], newConfig[key]);
                } else {
                    CONFIG[key] = newConfig[key];
                }
            }
        });
    }
}