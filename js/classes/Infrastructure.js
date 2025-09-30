class Infrastructure {
    constructor(type, level = 1) {
        this.id = Date.now() + Math.random();
        this.type = type;
        this.level = level;
        this.condition = 100;
        this.efficiency = 80;
        this.config = CONFIG.INFRASTRUCTURE_TYPES[type];
        this.maintenanceCost = this.config.cost * 0.1;
        this.lastMaintenance = 0;
        this.effect = this.config.effect;
        this.category = this.config.category;
        
        // Специфические показатели для разных типов
        this.energyOutput = this.config.energyOutput || 0;
        this.foodOutput = this.config.foodOutput || 0;
        this.productionOutput = this.config.productionOutput || 0;
        this.innovationOutput = this.config.innovationOutput || 0;
    }

    upgrade() {
        if (this.level < 5) {
            const upgradeCost = this.getUpgradeCost();
            
            if (window.simulation.publicFunds >= upgradeCost) {
                window.simulation.publicFunds -= upgradeCost;
                this.level++;
                this.efficiency = Math.min(100, this.efficiency + 10);
                
                // Улучшаем специфические показатели
                this.energyOutput *= 1.2;
                this.foodOutput *= 1.2;
                this.productionOutput *= 1.2;
                this.innovationOutput *= 1.2;
                
                return true;
            } else {
                throw new Error(`Недостаточно средств для улучшения. Нужно: ${upgradeCost} ПП`);
            }
        }
        return false;
    }

    getUpgradeCost() {
        return this.config.cost * (this.level * 0.5);
    }

    maintain() {
        const maintenanceCost = this.getMaintenanceCost();
        
        if (window.simulation.publicFunds >= maintenanceCost) {
            window.simulation.publicFunds -= maintenanceCost;
            this.condition = Math.min(100, this.condition + 30);
            this.efficiency = Math.min(100, this.efficiency + 15);
            this.lastMaintenance = window.simulation.month;
            return true;
        }
        return false;
    }

    decay() {
        // Износ зависит от уровня и типа
        let decayRate = 5 - (this.level * 0.5);
        
        // Разный износ для разных категорий
        switch(this.category) {
            case 'energy':
                decayRate += 1; // Энергетика изнашивается быстрее
                break;
            case 'industry':
                decayRate += 2; // Промышленность изнашивается еще быстрее
                break;
            case 'agriculture':
                decayRate += 0.5; // Сельское хозяйство медленнее
                break;
        }
        
        this.condition = Math.max(0, this.condition - decayRate);
        
        // Эффективность падает при плохом состоянии
        if (this.condition < 50) {
            this.efficiency = Math.max(30, this.efficiency - 5);
        } else if (this.condition < 80) {
            this.efficiency = Math.max(50, this.efficiency - 2);
        }
        
        // Автоматическое обслуживание каждые 12 месяцев
        if (window.simulation.month - this.lastMaintenance >= 12) {
            this.maintain();
        }
    }

    getEffect() {
        return (this.efficiency / 100) * this.level;
    }

    getMaintenanceCost() {
        return this.maintenanceCost * this.level;
    }

    // Специфические выходные данные с учетом уровня и эффективности
    getEnergyOutput() {
        return this.energyOutput * this.getEffect();
    }

    getFoodOutput() {
        return this.foodOutput * this.getEffect();
    }

    getProductionOutput() {
        return this.productionOutput * this.getEffect();
    }

    getInnovationOutput() {
        return this.innovationOutput * this.getEffect();
    }

    getDisplayData() {
        return {
            name: this.config.name,
            icon: this.config.icon,
            type: this.type,
            level: this.level,
            condition: Math.round(this.condition),
            efficiency: Math.round(this.efficiency),
            effect: this.effect,
            effectValue: Math.round(this.getEffect() * 100),
            maintenanceCost: Math.round(this.getMaintenanceCost()),
            description: this.config.description,
            category: this.category,
            energyOutput: Math.round(this.getEnergyOutput()),
            foodOutput: Math.round(this.getFoodOutput()),
            productionOutput: Math.round(this.getProductionOutput()),
            innovationOutput: Math.round(this.getInnovationOutput()),
            upgradeCost: Math.round(this.getUpgradeCost())
        };
    }
}