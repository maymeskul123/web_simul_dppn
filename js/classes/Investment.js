class Investment {
    constructor(type, totalInvestment) {
        this.id = Date.now() + Math.random();
        this.type = type;
        this.totalInvestment = totalInvestment;
        this.currentInvestment = 0;
        this.config = CONFIG.INVESTMENT_TYPES[type];
        this.monthsRemaining = this.config.duration;
        this.returnRate = this.config.returnRate;
        this.isCompleted = false;
        this.monthlyReturn = 0;
        this.startMonth = window.simulation ? window.simulation.month : 0;
        this.investors = [];
        this.risk = this.config.risk || 0.2;
        this.category = this.config.category || 'general';
        
        // Статистика доходности
        this.totalReturns = 0;
        this.monthsActive = 0;
        this.actualReturnRate = 0;
        
        // Влияние на систему
        this.systemImpact = this.calculateSystemImpact();
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
        // Расчет ежемесячного дохода с учетом риска
        const baseMonthlyReturn = this.totalInvestment * this.returnRate / 12;
        const riskFactor = 1 - (this.risk * 0.3); // Риск снижает фактическую доходность
        this.monthlyReturn = baseMonthlyReturn * riskFactor;
        this.monthsRemaining = 0;
        
        console.log(`✅ Проект "${this.config.name}" завершен. Ежемесячный доход: ${Math.round(this.monthlyReturn)} ПП`);
    }

    processMonth() {
        if (this.isCompleted) {
            this.monthsActive++;
            this.totalReturns += this.monthlyReturn;
            
            // Расчет фактической доходности
            if (this.monthsActive > 0) {
                this.actualReturnRate = (this.totalReturns / this.totalInvestment) * (12 / this.monthsActive);
            }
            
            return this.monthlyReturn;
        }
        
        this.monthsRemaining--;
        if (this.monthsRemaining <= 0) {
            this.completeInvestment();
        }
        return 0;
    }

    calculateSystemImpact() {
        const impacts = {
            'technology': { innovation: 0.8, education: 0.3 },
            'healthcare': { health: 0.7, satisfaction: 0.4 },
            'education': { education: 0.9, innovation: 0.2 },
            'energy': { productivity: 0.6, environment: 0.5 },
            'business': { commerce: 0.8, satisfaction: 0.3 },
            'transport': { mobility: 0.7, commerce: 0.4 },
            'social': { satisfaction: 0.9, health: 0.3 },
            'finance': { commerce: 0.9, innovation: 0.2 },
            'creative': { satisfaction: 0.8, education: 0.3 },
            'innovation': { innovation: 1.0, education: 0.4 }
        };
        
        return impacts[this.category] || { innovation: 0.1 };
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

    getActualReturnRate() {
        return this.actualReturnRate || this.returnRate;
    }

    getROI() {
        if (this.totalInvestment === 0) return 0;
        return (this.totalReturns / this.totalInvestment) * 100;
    }

    getDisplayData() {
        const actualReturnRate = this.getActualReturnRate();
        const expectedVsActual = actualReturnRate - this.returnRate;
        
        return {
            name: this.config.name,
            icon: this.config.icon,
            type: this.type,
            category: this.category,
            progress: Math.round(this.getProgress()),
            currentInvestment: Math.round(this.currentInvestment),
            totalInvestment: Math.round(this.totalInvestment),
            monthsRemaining: this.monthsRemaining,
            returnRate: Math.round(this.returnRate * 100),
            actualReturnRate: Math.round(actualReturnRate * 100),
            monthlyReturn: Math.round(this.monthlyReturn),
            totalReturns: Math.round(this.totalReturns),
            roi: Math.round(this.getROI()),
            isCompleted: this.isCompleted,
            risk: Math.round(this.risk * 100),
            description: this.config.description,
            investors: this.investors.length,
            performance: expectedVsActual > 0 ? 'above' : expectedVsActual < 0 ? 'below' : 'meeting'
        };
    }
}