class Infrastructure {
    constructor(type, level = 1) {
        this.id = Date.now() + Math.random();
        this.type = type;
        this.level = level;
        this.condition = 100;
        this.efficiency = 80;
        this.maintenanceCost = CONFIG.INFRASTRUCTURE_TYPES[type].cost * 0.1;
        this.lastMaintenance = 0;
        this.effect = CONFIG.INFRASTRUCTURE_TYPES[type].effect;
    }

    upgrade() {
        if (this.level < 5) {
            this.level++;
            this.efficiency = Math.min(100, this.efficiency + 5);
            return true;
        }
        return false;
    }

    maintain() {
        this.condition = Math.min(100, this.condition + 20);
        this.efficiency = Math.min(100, this.efficiency + 10);
        this.lastMaintenance = simulation.month;
        return this.condition;
    }

    decay() {
        // Износ зависит от уровня
        const decayRate = 5 - (this.level * 0.5);
        this.condition = Math.max(0, this.condition - decayRate);
        
        // Эффективность падает при плохом состоянии
        if (this.condition < 50) {
            this.efficiency = Math.max(30, this.efficiency - 3);
        } else if (this.condition < 80) {
            this.efficiency = Math.max(50, this.efficiency - 1);
        }
        
        // Автоматическое обслуживание каждые 12 месяцев
        if (simulation.month - this.lastMaintenance >= 12) {
            this.maintain();
        }
    }

    getEffect() {
        return (this.efficiency / 100) * this.level;
    }

    getMaintenanceCost() {
        return this.maintenanceCost * this.level;
    }

    getDisplayData() {
        const config = CONFIG.INFRASTRUCTURE_TYPES[this.type];
        return {
            name: config.name,
            icon: config.icon,
            type: this.type,
            level: this.level,
            condition: Math.round(this.condition),
            efficiency: Math.round(this.efficiency),
            effect: this.effect,
            effectValue: Math.round(this.getEffect() * 100),
            maintenanceCost: Math.round(this.getMaintenanceCost()),
            description: config.description
        };
    }
}