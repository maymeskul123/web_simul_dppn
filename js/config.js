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

    // Инфраструктура
    INFRASTRUCTURE_TYPES: {
        SCHOOL: { 
            name: 'Школа', 
            cost: 1000, 
            effect: 'education',
            icon: '🏫',
            description: 'Повышает уровень образования'
        },
        HOSPITAL: { 
            name: 'Больница', 
            cost: 1500, 
            effect: 'healthcare',
            icon: '🏥',
            description: 'Улучшает здоровье жителей'
        },
        TRANSPORT: { 
            name: 'Транспорт', 
            cost: 800, 
            effect: 'mobility',
            icon: '🚍',
            description: 'Повышает мобильность и активность'
        },
        ENERGY: { 
            name: 'Энергетика', 
            cost: 1200, 
            effect: 'productivity',
            icon: '⚡',
            description: 'Увеличивает продуктивность'
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