// 🔍 Скрипт быстрой диагностики localStorage
// Скопируйте этот код в консоль браузера (F12) и выполните

(function() {
    console.clear();
    console.log('%c🔍 ДИАГНОСТИКА СИСТЕМЫ ХРАНЕНИЯ ДАННЫХ', 'font-size: 20px; font-weight: bold; color: #4CAF50;');
    console.log('═'.repeat(60));
    
    const results = {
        errors: [],
        warnings: [],
        success: []
    };
    
    // 1. Проверка localStorage
    console.log('\n📦 1. Проверка localStorage');
    console.log('─'.repeat(60));
    
    if (typeof(Storage) !== "undefined") {
        results.success.push('✅ localStorage доступен');
        console.log('✅ localStorage доступен');
    } else {
        results.errors.push('❌ localStorage НЕ поддерживается');
        console.error('❌ localStorage НЕ поддерживается браузером');
    }
    
    // 2. Проверка данных
    console.log('\n💾 2. Проверка сохраненных данных');
    console.log('─'.repeat(60));
    
    const savedData = localStorage.getItem('retailAppData');
    if (savedData) {
        const sizeKB = (savedData.length / 1024).toFixed(2);
        const sizeMB = (savedData.length / 1024 / 1024).toFixed(2);
        
        console.log(`✅ Данные найдены`);
        console.log(`📊 Размер: ${sizeKB} КБ (${sizeMB} МБ)`);
        console.log(`📊 Символов: ${savedData.length.toLocaleString()}`);
        
        results.success.push(`Данные найдены: ${sizeKB} КБ`);
        
        if (parseFloat(sizeKB) > 5000) {
            results.warnings.push('⚠️ Размер данных превышает 5 МБ - возможны проблемы');
            console.warn('⚠️ Размер данных превышает 5 МБ - рекомендуется очистка');
        }
        
        // Парсинг данных
        try {
            const parsed = JSON.parse(savedData);
            console.log('✅ Данные валидны (JSON корректен)');
            results.success.push('JSON структура корректна');
            
            // Проверка структуры
            console.log('\n📋 Структура данных:');
            console.log('  • users:', parsed.users?.length || 0);
            console.log('  • products:', parsed.products?.length || 0);
            console.log('  • companies:', parsed.companies?.length || 0);
            console.log('  • warehouses:', parsed.warehouses?.length || 0);
            console.log('  • clients:', parsed.clients?.length || 0);
            console.log('  • currentYear:', parsed.currentYear || 'не установлен');
            console.log('  • years:', Object.keys(parsed.years || {}).join(', ') || 'нет');
            
            if (parsed.currentYear && parsed.years && parsed.years[parsed.currentYear]) {
                const yearData = parsed.years[parsed.currentYear];
                console.log(`\n📅 Данные за ${parsed.currentYear}:`);
                console.log('  • Приходов:', yearData.income?.length || 0);
                console.log('  • Расходов:', yearData.expense?.length || 0);
                console.log('  • Погашений:', yearData.payments?.length || 0);
                
                results.success.push(`Год ${parsed.currentYear}: ${yearData.income?.length || 0} приходов, ${yearData.expense?.length || 0} расходов`);
            } else {
                results.warnings.push('⚠️ Данные текущего года не найдены');
                console.warn('⚠️ Данные текущего года не найдены или структура некорректна');
            }
            
        } catch (error) {
            results.errors.push('❌ Ошибка парсинга JSON: ' + error.message);
            console.error('❌ Ошибка парсинга JSON:', error);
        }
        
    } else {
        results.warnings.push('⚠️ Данные не найдены в localStorage');
        console.warn('⚠️ Данные не найдены в localStorage');
    }
    
    // 3. Проверка appData в памяти
    console.log('\n🧠 3. Проверка appData в памяти');
    console.log('─'.repeat(60));
    
    if (typeof appData !== 'undefined') {
        console.log('✅ appData существует в памяти');
        console.log('  • currentYear:', appData.currentYear);
        console.log('  • years:', Object.keys(appData.years || {}).join(', '));
        
        if (appData.currentYear && appData.years && appData.years[appData.currentYear]) {
            const yearData = appData.years[appData.currentYear];
            console.log(`  • Приходов (${appData.currentYear}):`, yearData.income?.length || 0);
            console.log(`  • Расходов (${appData.currentYear}):`, yearData.expense?.length || 0);
            console.log(`  • Погашений (${appData.currentYear}):`, yearData.payments?.length || 0);
            results.success.push('appData в памяти корректен');
        } else {
            results.warnings.push('⚠️ Структура appData некорректна');
            console.warn('⚠️ Структура appData некорректна');
        }
    } else {
        results.errors.push('❌ appData не найден в памяти');
        console.error('❌ appData не найден в памяти');
    }
    
    // 4. Проверка функций
    console.log('\n⚙️ 4. Проверка функций');
    console.log('─'.repeat(60));
    
    const functions = ['saveData', 'loadData', 'getCurrentYearData', 'updateIncomeTable', 'updateExpenseTable'];
    functions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            console.log(`✅ ${funcName}() существует`);
            results.success.push(`Функция ${funcName} доступна`);
        } else {
            console.warn(`⚠️ ${funcName}() не найдена`);
            results.warnings.push(`Функция ${funcName} не найдена`);
        }
    });
    
    // 5. Проверка Firebase
    console.log('\n☁️ 5. Проверка Firebase');
    console.log('─'.repeat(60));
    
    if (typeof isFirebaseConnected !== 'undefined') {
        console.log('  • Статус подключения:', isFirebaseConnected ? '🟢 Подключен' : '🔴 Отключен');
        console.log('  • Firebase DB:', window.firebaseDB ? '✅ Доступен' : '❌ Недоступен');
        console.log('  • Firebase Auth:', window.firebaseAuth ? '✅ Доступен' : '❌ Недоступен');
        
        if (isFirebaseConnected) {
            results.success.push('Firebase подключен');
        } else {
            results.warnings.push('Firebase отключен (работа в офлайн режиме)');
        }
    } else {
        console.warn('⚠️ Переменная isFirebaseConnected не найдена');
    }
    
    // 6. Тест сохранения
    console.log('\n🧪 6. Тест сохранения данных');
    console.log('─'.repeat(60));
    
    try {
        const testKey = 'test_save_' + Date.now();
        const testData = { test: true, timestamp: Date.now() };
        localStorage.setItem(testKey, JSON.stringify(testData));
        
        const retrieved = localStorage.getItem(testKey);
        if (retrieved && JSON.parse(retrieved).test === true) {
            console.log('✅ Тест сохранения пройден успешно');
            results.success.push('Тест сохранения успешен');
        } else {
            console.error('❌ Тест сохранения не пройден');
            results.errors.push('Тест сохранения не пройден');
        }
        
        localStorage.removeItem(testKey);
    } catch (error) {
        console.error('❌ Ошибка теста сохранения:', error.message);
        results.errors.push('Ошибка теста: ' + error.message);
    }
    
    // 7. Проверка лимитов
    console.log('\n📏 7. Проверка лимитов localStorage');
    console.log('─'.repeat(60));
    
    try {
        const testSize = 1024 * 1024; // 1 MB
        const testData = 'x'.repeat(testSize);
        localStorage.setItem('test_limit', testData);
        localStorage.removeItem('test_limit');
        console.log('✅ Лимит localStorage не достигнут (тест 1 МБ пройден)');
        results.success.push('Лимит localStorage в норме');
    } catch (error) {
        console.error('❌ Возможно достигнут лимит localStorage:', error.message);
        results.errors.push('Лимит localStorage достигнут');
    }
    
    // ИТОГОВЫЙ ОТЧЕТ
    console.log('\n' + '═'.repeat(60));
    console.log('%c📊 ИТОГОВЫЙ ОТЧЕТ', 'font-size: 18px; font-weight: bold; color: #2196F3;');
    console.log('═'.repeat(60));
    
    console.log(`\n%c✅ Успешно (${results.success.length}):`, 'color: green; font-weight: bold;');
    results.success.forEach(msg => console.log('  ' + msg));
    
    if (results.warnings.length > 0) {
        console.log(`\n%c⚠️ Предупреждения (${results.warnings.length}):`, 'color: orange; font-weight: bold;');
        results.warnings.forEach(msg => console.warn('  ' + msg));
    }
    
    if (results.errors.length > 0) {
        console.log(`\n%c❌ Ошибки (${results.errors.length}):`, 'color: red; font-weight: bold;');
        results.errors.forEach(msg => console.error('  ' + msg));
    }
    
    // РЕКОМЕНДАЦИИ
    console.log('\n' + '═'.repeat(60));
    console.log('%c💡 РЕКОМЕНДАЦИИ', 'font-size: 16px; font-weight: bold; color: #FF9800;');
    console.log('═'.repeat(60));
    
    if (results.errors.length === 0 && results.warnings.length === 0) {
        console.log('%c✅ Система работает корректно!', 'color: green; font-weight: bold; font-size: 14px;');
        console.log('\nЕсли данные все равно не сохраняются:');
        console.log('1. Проверьте консоль на наличие ошибок при добавлении данных');
        console.log('2. Убедитесь, что вызывается функция saveData()');
        console.log('3. Попробуйте добавить данные и выполнить этот скрипт снова');
    } else {
        console.log('\n🔧 Действия для исправления:');
        
        if (results.errors.some(e => e.includes('localStorage НЕ поддерживается'))) {
            console.log('1. ❌ localStorage недоступен - проверьте настройки браузера');
            console.log('   • Отключите режим инкогнито');
            console.log('   • Проверьте настройки приватности');
        }
        
        if (results.errors.some(e => e.includes('Лимит localStorage'))) {
            console.log('2. ❌ Достигнут лимит localStorage');
            console.log('   • Экспортируйте данные через "Резервное копирование"');
            console.log('   • Удалите старые годы');
            console.log('   • Очистите localStorage: localStorage.clear()');
        }
        
        if (results.warnings.some(w => w.includes('Данные не найдены'))) {
            console.log('3. ⚠️ Данные не найдены - возможно первый запуск');
            console.log('   • Добавьте тестовые данные');
            console.log('   • Проверьте, сохраняются ли они');
        }
        
        if (results.warnings.some(w => w.includes('структура некорректна'))) {
            console.log('4. ⚠️ Структура данных некорректна');
            console.log('   • Выполните: localStorage.clear() и перезагрузите страницу');
            console.log('   • Или используйте скрипт исправления структуры');
        }
    }
    
    console.log('\n📄 Для детальной помощи откройте файл: РЕШЕНИЕ-ПРОБЛЕМЫ-СОХРАНЕНИЯ.md');
    console.log('🧪 Для тестирования откройте: test-save-data.html');
    console.log('\n' + '═'.repeat(60));
    
    // Возвращаем результаты
    return {
        success: results.success.length,
        warnings: results.warnings.length,
        errors: results.errors.length,
        details: results
    };
})();
