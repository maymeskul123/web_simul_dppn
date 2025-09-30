// init.js - Загрузчик классов в правильном порядке
function loadScript(src, callback) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    script.onerror = function() {
        console.error('❌ Ошибка загрузки скрипта:', src);
    };
    document.head.appendChild(script);
}

function initializeClasses() {
    console.log('📦 Загрузка классов DPPN...');
    
    // Загружаем классы в правильном порядке
    loadScript('js/classes/Resident.js', function() {
        console.log('✅ Resident.js загружен');
        
        loadScript('js/classes/Infrastructure.js', function() {
            console.log('✅ Infrastructure.js загружен');
            
            loadScript('js/classes/Investment.js', function() {
                console.log('✅ Investment.js загружен');
                
                loadScript('js/classes/Simulation.js', function() {
                    console.log('✅ Simulation.js загружен');
                    
                    // После загрузки всех классов запускаем основное приложение
                    loadScript('js/main.js', function() {
                        console.log('✅ main.js загружен');
                    });
                });
            });
        });
    });
}

// Запускаем загрузку когда DOM готов
document.addEventListener('DOMContentLoaded', function() {
    // Сначала загружаем конфиг
    loadScript('js/config.js', function() {
        console.log('✅ config.js загружен');
        // Затем загружаем классы
        initializeClasses();
    });
});