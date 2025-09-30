class Investment {
    constructor(type, totalInvestment) {
        this.id = Date.now() + Math.random();
        this.type = type;
        this.totalInvestment = totalInvestment;
        this.currentInvestment = 0;
        this.monthsRemaining = CONFIG.INVESTMENT_TYPES[type].duration;
        this.returnRate = CONFIG.INVESTMENT_TYPES[type].returnRate;
        this.isCompleted = false;
        this.monthlyReturn = 0;
        this.startMonth = simulation.month;
        this.investors = [];
        this.risk = this.calculateRisk();
    }

    addInvestment(amount, resident = null) {
        if (this.isCompleted) return false;
        
        this.currentInvestment += amount;
        
        if (resident) {
            const existingInvestor = this.investors.find(inv => inv.id === resident.id);
            if (existingInvestor) {
                existingInvestor.amount += amount;
            } else {
                this.investors.push({
                    id: resident.id,
                    name: resident.name,
                    amount: amount
                });
            }
        }
        
        if (this.currentInvestment >= this.totalInvestment) {
            this.completeInvestment();
            return true;
        }
        return false;
    }

    completeInvestment() {
        this.isCompleted = true;
        this.monthlyReturn = this.totalInvestment * this.returnRate / 12;
        this.monthsRemaining = 0;
    }

    processMonth() {
        if (this.isCompleted) {
            return this.monthlyReturn;
        }
        
        this.monthsRemaining--;
        if (this.monthsRemaining <= 0) {
            this.completeInvestment();
        }
        return 0;
    }

    calculateRisk() {
        const baseRisk = {
            'BUSINESS': 0.3,
            'EDUCATION': 0.1,
            'HEALTHCARE': 0.2,
            'TECHNOLOGY': 0.4
        };
        return baseRisk[this.type] || 0.2;
    }

    getProgress() {
        return (this.currentInvestment / this.totalInvestment) * 100;
    }

    getTimeRemaining() {
        return this.monthsRemaining;
    }

    getExpectedReturn() {
        return this.totalInvestment * this.returnRate;
    }

    getDisplayData() {
        const config = CONFIG.INVESTMENT_TYPES[this.type];
        return {
            name: config.name,
            icon: config.icon,
            type: this.type,
            progress: Math.round(this.getProgress()),
            currentInvestment: Math.round(this.currentInvestment),
            totalInvestment: Math.round(this.totalInvestment),
            monthsRemaining: this.monthsRemaining,
            returnRate: Math.round(this.returnRate * 100),
            monthlyReturn: Math.round(this.monthlyReturn),
            isCompleted: this.isCompleted,
            risk: Math.round(this.risk * 100),
            description: config.description,
            investors: this.investors.length
        };
    }
}