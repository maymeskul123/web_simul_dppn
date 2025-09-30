// Конфигурация симуляции
const CONFIG = {
    MIN_RESIDENTS: 1,
    MAX_RESIDENTS: 100,
    DEFAULT_RESIDENTS: 5,
    
    BASE_PP_PER_MONTH: 100,
    VOLUNTEER_PP_BONUS: 50,
    EDUCATION_PP_BONUS: 30,
    CENSUS_PP_BONUS: 20,
    
    MAX_MONEY_CONVERSION: 0.3,
    MAX_VOTES_CONVERSION: 0.2,
    MAX_SOCIAL_CONVERSION: 0.5,
    
    ACTIVITY_PROBABILITIES: {
        VOLUNTEER: 0.3,
        EDUCATION: 0.4,
        CENSUS: 0.2,
        NONE: 0.1
    },

    // Инфраструктура - РАСШИРЕННАЯ ВЕРСИЯ
    INFRASTRUCTURE_TYPES: {
        // Образование
        SCHOOL: { 
            name: 'Школа', 
            cost: 1000, 
            effect: 'education',
            icon: '🏫',
            description: 'Повышает уровень образования',
            category: 'education'
        },
        UNIVERSITY: { 
            name: 'Университет', 
            cost: 2500, 
            effect: 'education',
            icon: '🎓',
            description: 'Высшее образование и исследования',
            category: 'education'
        },
        
        // Здравоохранение
        HOSPITAL: { 
            name: 'Больница', 
            cost: 1500, 
            effect: 'healthcare',
            icon: '🏥',
            description: 'Улучшает здоровье жителей',
            category: 'healthcare'
        },
        CLINIC: { 
            name: 'Поликлиника', 
            cost: 800, 
            effect: 'healthcare',
            icon: '🚑',
            description: 'Базовая медицинская помощь',
            category: 'healthcare'
        },
        
        // Транспорт
        TRANSPORT: { 
            name: 'Транспорт', 
            cost: 800, 
            effect: 'mobility',
            icon: '🚍',
            description: 'Повышает мобильность и активность',
            category: 'transport'
        },
        METRO: { 
            name: 'Метро', 
            cost: 3000, 
            effect: 'mobility',
            icon: '🚇',
            description: 'Высокоскоростной транспорт',
            category: 'transport'
        },
        
        // Энергетика - НОВОЕ
        SOLAR_PLANT: { 
            name: 'Солнечная станция', 
            cost: 1200, 
            effect: 'energy',
            icon: '☀️',
            description: 'Чистая энергия от солнца',
            category: 'energy',
            energyOutput: 100
        },
        WIND_FARM: { 
            name: 'Ветряная ферма', 
            cost: 1500, 
            effect: 'energy',
            icon: '🌬️',
            description: 'Энергия ветра',
            category: 'energy',
            energyOutput: 120
        },
        NUCLEAR_PLANT: { 
            name: 'АЭС', 
            cost: 5000, 
            effect: 'energy',
            icon: '⚛️',
            description: 'Высокая мощность, требует контроля',
            category: 'energy',
            energyOutput: 500
        },
        
        // Сельское хозяйство - НОВОЕ
        FARM: { 
            name: 'Ферма', 
            cost: 800, 
            effect: 'food',
            icon: '🚜',
            description: 'Традиционное сельское хозяйство',
            category: 'agriculture',
            foodOutput: 80
        },
        VERTICAL_FARM: { 
            name: 'Вертикальная ферма', 
            cost: 2000, 
            effect: 'food',
            icon: '🏢',
            description: 'Эффективное городское земледелие',
            category: 'agriculture',
            foodOutput: 150
        },
        HYDROPONICS: { 
            name: 'Гидропоника', 
            cost: 1200, 
            effect: 'food',
            icon: '💧',
            description: 'Выращивание без почвы',
            category: 'agriculture',
            foodOutput: 100
        },
        
        // Промышленность - НОВОЕ
        FACTORY: { 
            name: 'Завод', 
            cost: 2000, 
            effect: 'production',
            icon: '🏭',
            description: 'Промышленное производство',
            category: 'industry',
            productionOutput: 100
        },
        TECH_PARK: { 
            name: 'Технопарк', 
            cost: 3000, 
            effect: 'innovation',
            icon: '🔬',
            description: 'Технологические инновации',
            category: 'industry',
            innovationOutput: 150
        }
    },

    // Инвестиции
    INVESTMENT_TYPES: {
        BUSINESS: { 
            name: 'Бизнес', 
            minInvestment: 500, 
            returnRate: 0.15, 
            duration: 12,
            icon: '💼',
            description: 'Коммерческие проекты'
        },
        EDUCATION: { 
            name: 'Образование', 
            minInvestment: 300, 
            returnRate: 0.10, 
            duration: 18,
            icon: '🎓',
            description: 'Образовательные программы'
        },
        HEALTHCARE: { 
            name: 'Здравоохранение', 
            minInvestment: 400, 
            returnRate: 0.12, 
            duration: 15,
            icon: '🏥',
            description: 'Медицинские услуги'
        },
        TECHNOLOGY: { 
            name: 'Технологии', 
            minInvestment: 600, 
            returnRate: 0.20, 
            duration: 10,
            icon: '🔬',
            description: 'Технологические инновации'
        }
    }
};

// Глобальные переменные
window.simulation = null;
window.simulationInterval = null;