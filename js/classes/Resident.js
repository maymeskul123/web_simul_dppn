class Resident {
    constructor(id, name, age, occupation) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.occupation = occupation;
        this.pp = CONFIG.BASE_PP_PER_MONTH;
        this.activity = 'Не активен';
        this.convertedToMoney = 0;
        this.convertedToVotes = 0;
        this.convertedToSocial = 0;
        this.invested = 0;
        this.activityHistory = [];
        this.satisfaction = 50;
        this.health = 80;
        this.education = 50;
        this.productivity = 1.0;
    }
    
    simulateActivity(infrastructureLevels, currentMonth) {
        const rand = Math.random();
        let activityType = 'none';
        let ppBonus = 0;
        
        // Влияние инфраструктуры
        const educationBonus = infrastructureLevels.education || 1;
        const healthBonus = infrastructureLevels.healthcare || 1;
        const productivityBonus = infrastructureLevels.productivity || 1;
        
        // Используем CONFIG корректно:
        if (rand < CONFIG.ACTIVITY_PROBABILITIES.VOLUNTEER) {
            activityType = 'volunteer';
            ppBonus = CONFIG.VOLUNTEER_PP_BONUS * healthBonus;
        } else if (rand < CONFIG.ACTIVITY_PROBABILITIES.VOLUNTEER + CONFIG.ACTIVITY_PROBABILITIES.EDUCATION) {
            activityType = 'education';
            ppBonus = CONFIG.EDUCATION_PP_BONUS * educationBonus;
        } else if (rand < CONFIG.ACTIVITY_PROBABILITIES.VOLUNTEER + CONFIG.ACTIVITY_PROBABILITIES.EDUCATION + CONFIG.ACTIVITY_PROBABILITIES.CENSUS) {
            activityType = 'census';
            ppBonus = CONFIG.CENSUS_PP_BONUS;
        }
        
        // Учет продуктивности
        const monthlyPP = (CONFIG.BASE_PP_PER_MONTH + ppBonus) * productivityBonus;
        this.pp += monthlyPP;
        this.activity = this.getActivityName(activityType);
        
        // История активности
        this.activityHistory.push({
            month: currentMonth,
            activity: activityType,
            ppEarned: monthlyPP,
            ppBalance: this.pp
        });
        
        // Обновление показателей
        this.updateSatisfaction(activityType, infrastructureLevels);
        this.updateStats(infrastructureLevels);
        
        return { activity: activityType, ppEarned: monthlyPP };
    }
    
    updateStats(infrastructureLevels) {
        // Влияние инфраструктуры на показатели
        this.health = Math.min(100, this.health + (infrastructureLevels.healthcare || 0) * 0.5);
        this.education = Math.min(100, this.education + (infrastructureLevels.education || 0) * 0.3);
        this.productivity = 1.0 + (infrastructureLevels.productivity || 0) * 0.1;
        
        // Естественная деградация
        this.health = Math.max(0, this.health - 1);
        
        // Ограничение истории
        if (this.activityHistory.length > 12) {
            this.activityHistory = this.activityHistory.slice(-12);
        }
    }
    
    investInProject(project, amount) {
        if (amount <= this.pp && amount > 0) {
            this.pp -= amount;
            this.invested += amount;
            return project.addInvestment(amount, this);
        }
        return false;
    }
    
    getActivityName(activityType) {
        const activities = {
            'volunteer': 'Волонтерство',
            'education': 'Образование', 
            'census': 'Перепись',
            'none': 'Отдых'
        };
        return activities[activityType];
    }
    
    updateSatisfaction(activityType, infrastructureLevels) {
        let satisfactionChange = 0;
        
        // Базовая удовлетворенность от активности
        if (activityType !== 'none') {
            satisfactionChange += 5;
        } else {
            satisfactionChange -= 2;
        }
        
        // Влияние инфраструктуры
        satisfactionChange += (infrastructureLevels.education || 0) * 0.5;
        satisfactionChange += (infrastructureLevels.healthcare || 0) * 0.3;
        satisfactionChange += (infrastructureLevels.mobility || 0) * 0.2;
        
        // Влияние личных показателей
        satisfactionChange += (this.health / 100) * 2;
        satisfactionChange += (this.education / 100) * 1;
        
        this.satisfaction = Math.max(0, Math.min(100, this.satisfaction + satisfactionChange));
    }
    
    convertToMoney(amount) {
        const maxAllowed = this.pp * CONFIG.MAX_MONEY_CONVERSION;
        const actualAmount = Math.min(amount, maxAllowed);
        
        if (actualAmount > 0 && actualAmount <= this.pp) {
            this.pp -= actualAmount;
            this.convertedToMoney += actualAmount;
            return actualAmount;
        }
        return 0;
    }
    
    convertToVotes(amount) {
        const maxAllowed = this.pp * CONFIG.MAX_VOTES_CONVERSION;
        const actualAmount = Math.min(amount, maxAllowed);
        
        if (actualAmount > 0 && actualAmount <= this.pp) {
            this.pp -= actualAmount;
            this.convertedToVotes += actualAmount;
            return actualAmount;
        }
        return 0;
    }
    
    convertToSocial(amount) {
        const maxAllowed = this.pp * CONFIG.MAX_SOCIAL_CONVERSION;
        const actualAmount = Math.min(amount, maxAllowed);
        
        if (actualAmount > 0 && actualAmount <= this.pp) {
            this.pp -= actualAmount;
            this.convertedToSocial += actualAmount;
            return actualAmount;
        }
        return 0;
    }
    
    // Получение данных для отображения
    getDisplayData() {
        return {
            name: this.name,
            age: this.age,
            occupation: this.occupation,
            pp: Math.round(this.pp),
            activity: this.activity,
            satisfaction: Math.round(this.satisfaction),
            health: Math.round(this.health),
            education: Math.round(this.education),
            invested: Math.round(this.invested),
            convertedToMoney: Math.round(this.convertedToMoney),
            convertedToVotes: Math.round(this.convertedToVotes),
            convertedToSocial: Math.round(this.convertedToSocial)
        };
    }
}