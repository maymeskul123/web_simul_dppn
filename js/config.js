// Конфигурация симуляции
const CONFIG = {
    // ... предыдущие настройки без изменений ...
    BASE_PP_PER_MONTH: 100,
    VOLUNTEER_PP_BONUS: 50,
    EDUCATION_PP_BONUS: 30,
    CENSUS_PP_BONUS: 20,
    MAX_MONEY_CONVERSION: 0.3,
    MAX_VOTES_CONVERSION: 0.2,
    MAX_SOCIAL_CONVERSION: 0.1,
    
    // Вероятности активности
    ACTIVITY_PROBABILITIES: {
        VOLUNTEER: 0.3,
        EDUCATION: 0.2,
        CENSUS: 0.1,
        NONE: 0.4
    },
    
    // Лимиты жителей
    DEFAULT_RESIDENTS: 5,
    MIN_RESIDENTS: 1,
    MAX_RESIDENTS: 100,

    // ИНФРАСТРУКТУРА - ПОЛНАЯ ВЕРСИЯ
    INFRASTRUCTURE_TYPES: {
        // === ОБРАЗОВАНИЕ И НАУКА ===
        SCHOOL: { 
            name: 'Школа', cost: 1000, effect: 'education', icon: '🏫',
            description: 'Базовое образование', category: 'education'
        },
        UNIVERSITY: { 
            name: 'Университет', cost: 2500, effect: 'education', icon: '🎓',
            description: 'Высшее образование', category: 'education',
            innovationOutput: 50
        },
        RESEARCH_LAB: { 
            name: 'Исследовательская лаборатория', cost: 3000, effect: 'innovation', icon: '🔬',
            description: 'Научные исследования', category: 'research',
            innovationOutput: 100
        },
        TECH_CAMPUS: { 
            name: 'Технический кампус', cost: 4000, effect: 'innovation', icon: '💻',
            description: 'IT и технологии', category: 'research',
            innovationOutput: 150
        },
        SCIENCE_CENTER: { 
            name: 'Научный центр', cost: 5000, effect: 'innovation', icon: '🧪',
            description: 'Фундаментальные исследования', category: 'research',
            innovationOutput: 200
        },

        // === ЗДРАВООХРАНЕНИЕ ===
        CLINIC: { 
            name: 'Поликлиника', cost: 800, effect: 'healthcare', icon: '🚑',
            description: 'Базовая медицинская помощь', category: 'healthcare'
        },
        HOSPITAL: { 
            name: 'Больница', cost: 1500, effect: 'healthcare', icon: '🏥',
            description: 'Полный спектр медицинских услуг', category: 'healthcare'
        },
        MEDICAL_RESEARCH: { 
            name: 'Медицинский исследовательский центр', cost: 3500, effect: 'healthcare', icon: '🧬',
            description: 'Медицинские исследования', category: 'healthcare',
            innovationOutput: 80
        },

        // === ТРАНСПОРТ И ЛОГИСТИКА ===
        TRANSPORT: { 
            name: 'Транспортный узел', cost: 800, effect: 'mobility', icon: '🚍',
            description: 'Общественный транспорт', category: 'logistics',
            logisticsOutput: 50
        },
        METRO: { 
            name: 'Метрополитен', cost: 3000, effect: 'mobility', icon: '🚇',
            description: 'Высокоскоростной транспорт', category: 'logistics',
            logisticsOutput: 120
        },
        LOGISTICS_CENTER: { 
            name: 'Логистический центр', cost: 2000, effect: 'mobility', icon: '📦',
            description: 'Грузоперевозки и распределение', category: 'logistics',
            logisticsOutput: 100
        },
        PORT: { 
            name: 'Порт', cost: 4000, effect: 'commerce', icon: '⚓',
            description: 'Морские перевозки', category: 'logistics',
            logisticsOutput: 150, commerceOutput: 80
        },
        AIRPORT: { 
            name: 'Аэропорт', cost: 5000, effect: 'commerce', icon: '✈️',
            description: 'Воздушные перевозки', category: 'logistics',
            logisticsOutput: 200, commerceOutput: 100
        },

        // === ЭНЕРГЕТИКА ===
        SOLAR_PLANT: { 
            name: 'Солнечная электростанция', cost: 1200, effect: 'energy', icon: '☀️',
            description: 'Чистая энергия от солнца', category: 'energy',
            energyOutput: 100
        },
        WIND_FARM: { 
            name: 'Ветряная ферма', cost: 1500, effect: 'energy', icon: '🌬️',
            description: 'Энергия ветра', category: 'energy',
            energyOutput: 120
        },
        HYDRO_PLANT: { 
            name: 'ГЭС', cost: 2000, effect: 'energy', icon: '💧',
            description: 'Гидроэнергетика', category: 'energy',
            energyOutput: 150
        },
        NUCLEAR_PLANT: { 
            name: 'АЭС', cost: 5000, effect: 'energy', icon: '⚛️',
            description: 'Высокая мощность', category: 'energy',
            energyOutput: 500
        },
        FUSION_PLANT: { 
            name: 'Термоядерный реактор', cost: 10000, effect: 'energy', icon: '🌟',
            description: 'Энергия будущего', category: 'energy',
            energyOutput: 1000, innovationOutput: 200
        },

        // === СЕЛЬСКОЕ ХОЗЯЙСТВО ===
        FARM: { 
            name: 'Ферма', cost: 800, effect: 'food', icon: '🚜',
            description: 'Традиционное сельское хозяйство', category: 'agriculture',
            foodOutput: 80
        },
        VERTICAL_FARM: { 
            name: 'Вертикальная ферма', cost: 2000, effect: 'food', icon: '🏢',
            description: 'Эффективное городское земледелие', category: 'agriculture',
            foodOutput: 150
        },
        HYDROPONICS: { 
            name: 'Гидропоника', cost: 1200, effect: 'food', icon: '💧',
            description: 'Выращивание без почвы', category: 'agriculture',
            foodOutput: 100
        },
        AQUAPONICS: { 
            name: 'Аквапоника', cost: 1800, effect: 'food', icon: '🐟',
            description: 'Симбиоз рыб и растений', category: 'agriculture',
            foodOutput: 120
        },

        // === ПРОМЫШЛЕННОСТЬ ===
        FACTORY: { 
            name: 'Завод', cost: 2000, effect: 'production', icon: '🏭',
            description: 'Промышленное производство', category: 'industry',
            productionOutput: 100
        },
        TECH_PARK: { 
            name: 'Технопарк', cost: 3000, effect: 'innovation', icon: '🔬',
            description: 'Технологические инновации', category: 'industry',
            innovationOutput: 150, productionOutput: 50
        },
        ROBOTICS_FACTORY: { 
            name: 'Роботизированный завод', cost: 4000, effect: 'production', icon: '🤖',
            description: 'Автоматизированное производство', category: 'industry',
            productionOutput: 200, innovationOutput: 100
        },
        NANOTECH_LAB: { 
            name: 'Нанотехнологическая лаборатория', cost: 6000, effect: 'innovation', icon: '🔍',
            description: 'Нанотехнологии', category: 'industry',
            innovationOutput: 250, productionOutput: 80
        },

        // === ТОРГОВЛЯ И КОММЕРЦИЯ ===
        MARKET: { 
            name: 'Рынок', cost: 600, effect: 'commerce', icon: '🛒',
            description: 'Местная торговля', category: 'commerce',
            commerceOutput: 60
        },
        SHOPPING_MALL: { 
            name: 'Торговый центр', cost: 1500, effect: 'commerce', icon: '🏬',
            description: 'Крупный торговый комплекс', category: 'commerce',
            commerceOutput: 120
        },
        BUSINESS_CENTER: { 
            name: 'Бизнес-центр', cost: 2500, effect: 'commerce', icon: '💼',
            description: 'Офисные помещения и услуги', category: 'commerce',
            commerceOutput: 180, innovationOutput: 40
        },
        STOCK_EXCHANGE: { 
            name: 'Фондовая биржа', cost: 4000, effect: 'commerce', icon: '📈',
            description: 'Финансовые операции', category: 'commerce',
            commerceOutput: 250, innovationOutput: 80
        },

        // === КОММУНАЛЬНАЯ ИНФРАСТРУКТУРА ===
        WATER_PLANT: { 
            name: 'Водоочистная станция', cost: 1200, effect: 'utility', icon: '💧',
            description: 'Чистая вода', category: 'utility'
        },
        WASTE_MANAGEMENT: { 
            name: 'Завод по переработке отходов', cost: 1000, effect: 'utility', icon: '🗑️',
            description: 'Утилизация и переработка', category: 'utility'
        },
        COMMUNICATION_TOWER: { 
            name: 'Коммуникационная вышка', cost: 800, effect: 'utility', icon: '📡',
            description: 'Связь и интернет', category: 'utility'
        },
        SMART_GRID: { 
            name: 'Умная энергосеть', cost: 3000, effect: 'energy', icon: '🔋',
            description: 'Интеллектуальное распределение энергии', category: 'utility',
            energyOutput: 50, innovationOutput: 100
        },

        // === КУЛЬТУРА И ОТДЫХ ===
        PARK: { 
            name: 'Парк', cost: 500, effect: 'satisfaction', icon: '🌳',
            description: 'Зона отдыха', category: 'culture'
        },
        THEATER: { 
            name: 'Театр', cost: 1200, effect: 'satisfaction', icon: '🎭',
            description: 'Культурные мероприятия', category: 'culture'
        },
        SPORTS_COMPLEX: { 
            name: 'Спортивный комплекс', cost: 1500, effect: 'healthcare', icon: '⚽',
            description: 'Спорт и фитнес', category: 'culture'
        },
        MUSEUM: { 
            name: 'Музей', cost: 1000, effect: 'education', icon: '🖼️',
            description: 'История и искусство', category: 'culture',
            innovationOutput: 30
        }
    },

    
    // ИНВЕСТИЦИИ - СУПЕР РАСШИРЕННАЯ ВЕРСИЯ
    INVESTMENT_TYPES: {
        // === ТРАДИЦИОННЫЙ БИЗНЕС ===
        RETAIL_BUSINESS: { 
            name: 'Розничный бизнес', minInvestment: 400, returnRate: 0.12, duration: 18,
            icon: '🛍️', description: 'Магазины и торговые точки', risk: 0.2,
            category: 'business'
        },
        FOOD_INDUSTRY: { 
            name: 'Пищевая промышленность', minInvestment: 600, returnRate: 0.14, duration: 16,
            icon: '🍕', description: 'Производство продуктов питания', risk: 0.15,
            category: 'business'
        },
        REAL_ESTATE: { 
            name: 'Недвижимость', minInvestment: 800, returnRate: 0.11, duration: 24,
            icon: '🏠', description: 'Жилая и коммерческая недвижимость', risk: 0.1,
            category: 'business'
        },
        
        // === ТЕХНОЛОГИИ И ИННОВАЦИИ ===
        SOFTWARE_DEV: { 
            name: 'Разработка ПО', minInvestment: 500, returnRate: 0.22, duration: 10,
            icon: '💻', description: 'Программное обеспечение', risk: 0.3,
            category: 'technology'
        },
        AI_RESEARCH: { 
            name: 'ИИ исследования', minInvestment: 900, returnRate: 0.30, duration: 8,
            icon: '🧠', description: 'Искусственный интеллект', risk: 0.5,
            category: 'technology'
        },
        BLOCKCHAIN: { 
            name: 'Блокчейн технологии', minInvestment: 700, returnRate: 0.25, duration: 9,
            icon: '⛓️', description: 'Децентрализованные системы', risk: 0.4,
            category: 'technology'
        },
        IOT: { 
            name: 'Интернет вещей', minInvestment: 600, returnRate: 0.20, duration: 12,
            icon: '📱', description: 'Умные устройства и сети', risk: 0.25,
            category: 'technology'
        },
        
        // === БИОТЕХНОЛОГИИ И МЕДИЦИНА ===
        BIOTECH: { 
            name: 'Биотехнологии', minInvestment: 700, returnRate: 0.18, duration: 15,
            icon: '🧬', description: 'Биомедицинские исследования', risk: 0.35,
            category: 'healthcare'
        },
        PHARMACEUTICAL: { 
            name: 'Фармацевтика', minInvestment: 1000, returnRate: 0.16, duration: 20,
            icon: '💊', description: 'Разработка лекарств', risk: 0.3,
            category: 'healthcare'
        },
        MEDICAL_TECH: { 
            name: 'Медицинское оборудование', minInvestment: 800, returnRate: 0.15, duration: 18,
            icon: '🩺', description: 'Диагностическое оборудование', risk: 0.25,
            category: 'healthcare'
        },
        
        // === ЭНЕРГЕТИКА И ЭКОЛОГИЯ ===
        RENEWABLE_ENERGY: { 
            name: 'ВИЭ', minInvestment: 500, returnRate: 0.14, duration: 22,
            icon: '🌞', description: 'Возобновляемая энергетика', risk: 0.2,
            category: 'energy'
        },
        ENERGY_STORAGE: { 
            name: 'Накопители энергии', minInvestment: 600, returnRate: 0.19, duration: 14,
            icon: '🔋', description: 'Системы хранения энергии', risk: 0.28,
            category: 'energy'
        },
        GREEN_TECH: { 
            name: 'Зеленые технологии', minInvestment: 400, returnRate: 0.13, duration: 20,
            icon: '🌱', description: 'Экологические решения', risk: 0.18,
            category: 'energy'
        },
        
        // === ОБРАЗОВАНИЕ И НАУКА ===
        ONLINE_EDUCATION: { 
            name: 'Онлайн-образование', minInvestment: 300, returnRate: 0.17, duration: 16,
            icon: '🎓', description: 'Дистанционное обучение', risk: 0.22,
            category: 'education'
        },
        RESEARCH_GRANT: { 
            name: 'Научный грант', minInvestment: 400, returnRate: 0.09, duration: 30,
            icon: '🔬', description: 'Фундаментальные исследования', risk: 0.4,
            category: 'education'
        },
        TECH_EDUCATION: { 
            name: 'Техническое образование', minInvestment: 500, returnRate: 0.15, duration: 18,
            icon: '⚙️', description: 'Инженерные программы', risk: 0.2,
            category: 'education'
        },
        
        // === ТРАНСПОРТ И ЛОГИСТИКА ===
        E_MOBILITY: { 
            name: 'Электротранспорт', minInvestment: 700, returnRate: 0.21, duration: 12,
            icon: '🚗', description: 'Электромобили и зарядка', risk: 0.32,
            category: 'transport'
        },
        LOGISTICS_TECH: { 
            name: 'Логистические технологии', minInvestment: 600, returnRate: 0.16, duration: 15,
            icon: '📦', description: 'Оптимизация перевозок', risk: 0.25,
            category: 'transport'
        },
        DRONE_DELIVERY: { 
            name: 'Доставка дронами', minInvestment: 800, returnRate: 0.24, duration: 10,
            icon: '🚁', description: 'Беспилотная доставка', risk: 0.38,
            category: 'transport'
        },
        
        // === КОСМИЧЕСКИЕ ТЕХНОЛОГИИ ===
        SPACE_TECH: { 
            name: 'Космические технологии', minInvestment: 1200, returnRate: 0.35, duration: 8,
            icon: '🚀', description: 'Космические исследования', risk: 0.6,
            category: 'innovation'
        },
        SATELLITE_TECH: { 
            name: 'Спутниковые системы', minInvestment: 900, returnRate: 0.28, duration: 11,
            icon: '🛰️', description: 'Спутниковая связь', risk: 0.45,
            category: 'innovation'
        },
        
        // === КРИПТО И ФИНТЕХ ===
        CRYPTO_PLATFORM: { 
            name: 'Криптоплатформа', minInvestment: 600, returnRate: 0.32, duration: 7,
            icon: '₿', description: 'Криптовалютные решения', risk: 0.55,
            category: 'finance'
        },
        FINTECH: { 
            name: 'Финтех', minInvestment: 500, returnRate: 0.26, duration: 9,
            icon: '💳', description: 'Финансовые технологии', risk: 0.35,
            category: 'finance'
        },
        
        // === ТВОРЧЕСКИЕ ИНДУСТРИИ ===
        GAME_DEV: { 
            name: 'Разработка игр', minInvestment: 400, returnRate: 0.29, duration: 8,
            icon: '🎮', description: 'Видеоигры и приложения', risk: 0.42,
            category: 'creative'
        },
        AR_VR: { 
            name: 'AR/VR технологии', minInvestment: 700, returnRate: 0.27, duration: 10,
            icon: '👓', description: 'Дополненная реальность', risk: 0.48,
            category: 'creative'
        },
        CREATIVE_MEDIA: { 
            name: 'Креативные медиа', minInvestment: 300, returnRate: 0.19, duration: 14,
            icon: '🎬', description: 'Контент и развлечения', risk: 0.3,
            category: 'creative'
        },
        
        // === СОЦИАЛЬНЫЕ ПРОЕКТЫ ===
        SOCIAL_ENTERPRISE: { 
            name: 'Социальное предприятие', minInvestment: 200, returnRate: 0.08, duration: 30,
            icon: '🤝', description: 'Социальная поддержка', risk: 0.15,
            category: 'social'
        },
        COMMUNITY_DEVELOPMENT: { 
            name: 'Развитие сообществ', minInvestment: 250, returnRate: 0.07, duration: 28,
            icon: '🏘️', description: 'Местные инициативы', risk: 0.12,
            category: 'social'
        },
        ENVIRONMENTAL_PROTECTION: { 
            name: 'Защита окружающей среды', minInvestment: 350, returnRate: 0.06, duration: 32,
            icon: '🌍', description: 'Экологические программы', risk: 0.1,
            category: 'social'
        }
    }
};