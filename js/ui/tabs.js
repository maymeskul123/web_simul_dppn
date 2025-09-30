// Управление вкладками
function switchTab(tabName) {
    if (!simulation) return;
    
    // Скрыть все вкладки
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Убрать активность со всех вкладок
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Показать выбранную вкладку
    const targetTab = document.getElementById(tabName);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Активировать соответствующую кнопку вкладки
    const tabButtons = document.querySelectorAll('.tab');
    tabButtons.forEach(tab => {
        if (tab.textContent.includes(getTabDisplayName(tabName))) {
            tab.classList.add('active');
        }
    });
    
    console.log(`📁 Переключена вкладка: ${tabName}`);
}

function getTabDisplayName(tabName) {
    const names = {
        'control': 'Управление',
        'residents': 'Жители',
        'infrastructure': 'Инфраструктура',
        'investments': 'Инвестиции',
        'analytics': 'Аналитика'
    };
    return names[tabName] || tabName;
}

function initTabs() {
    // Добавляем обработчики для вкладок
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabName = this.getAttribute('onclick').match(/'(.*?)'/)[1];
            switchTab(tabName);
        });
    });
    
    console.log('📁 Инициализированы вкладки');
}