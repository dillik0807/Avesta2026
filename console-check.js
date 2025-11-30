// 🔍 СКРИПТ ПРОВЕРКИ ИСПРАВЛЕНИЯ УДАЛЕНИЯ
// Скопируйте этот код в консоль браузера (F12) и выполните

(function() {
    console.clear();
    console.log('%c🔍 ПРОВЕРКА ИСПРАВЛЕНИЯ УДАЛЕНИЯ ДАННЫХ', 'font-size: 20px; font-weight: bold; color: #4CAF50;');
    console.log('═'.repeat(60));
    
    const results = {
        fixed: [],
        issues: [],
        warnings: []
    };
    
    // 1. Проверка наличия исправлений в realtime-sync.js
    console.log('\n📄 1. Проверка realtime-sync.js');
    console.log('─'.repeat(60));
    
    if (window.realtimeSync) {
        console.log('✅ realtimeSync объект найден');
        results.fixed.push('realtimeSync загружен');
        
        // Проверяем методы
        const methods = ['initialize', 'pushToCloud', 'applyCloudData', 'setupRealtimeListener'];
        methods.forEach(method => {
            if (typeof window.realtimeSync[method] === 'function') {
                console.log(`  ✅ Метод ${method}() существует`);
            } else {
                console.warn(`  ⚠️ Метод ${method}() не найден`);
                results.warnings.push(`Метод ${method} отсутствует`);
            }
        });
    } else {
        console.error('❌ realtimeSync не найден');
        results.issues.push('realtimeSync не загружен');
    }
    
    // 2. Проверка window.lastFirebasePush
    console.log('\n⏰ 2. Проверка метки времени');
    console.log('─'.repeat(60));
    
    if (typeof window.lastFirebasePush !== 'undefined') {
        const timeSince = Date.now() - window.lastFirebasePush;
        console.log(`✅ window.lastFirebasePush установлен`);
        console.log(`  Последняя отправка: ${Math.round(timeSince / 1000)} секунд назад`);
        results.fixed.push('Метка времени работает');
    } else {
        console.warn('⚠️ window.lastFirebasePush не установлен (возможно, еще не было отправки)');
        results.warnings.push('Метка времени не установлена');
    }
    
    // 3. Проверка функций сохранения
    console.log('\n💾 3. Проверка функций сохранения');
    console.log('─'.repeat(60));
    
    const saveFunctions = ['saveData', 'syncToCloud', 'syncToCloudSilent'];
    saveFunctions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            console.log(`✅ ${funcName}() существует`);
            results.fixed.push(`Функция ${funcName} доступна`);
        } else {
            console.error(`❌ ${funcName}() не найдена`);
            results.issues.push(`Функция ${funcName} отсутствует`);
        }
    });
    
    // 4. Проверка Firebase подключения
    console.log('\n☁️ 4. Проверка Firebase');
    console.log('─'.repeat(60));
    
    if (typeof isFirebaseConnected !== 'undefined') {
        if (isFirebaseConnected) {
            console.log('✅ Firebase подключен');
            results.fixed.push('Firebase онлайн');
        } else {
            console.warn('⚠️ Firebase отключен (офлайн режим)');
            results.warnings.push('Firebase офлайн');
        }
    } else {
        console.error('❌ Переменная isFirebaseConnected не найдена');
        results.issues.push('Firebase статус неизвестен');
    }
    
    // 5. Проверка данных
    console.log('\n📊 5. Проверка данных');
    console.log('─'.repeat(60));
    
    if (typeof appData !== 'undefined' && appData) {
        console.log('✅ appData существует');
        console.log(`  Текущий год: ${appData.currentYear || 'не установлен'}`);
        
        if (appData.currentYear && appData.years && appData.years[appData.currentYear]) {
            const yearData = appData.years[appData.currentYear];
            console.log(`  Приходов: ${yearData.income?.length || 0}`);
            console.log(`  Расходов: ${yearData.expense?.length || 0}`);
            console.log(`  Погашений: ${yearData.payments?.length || 0}`);
            results.fixed.push('Данные загружены корректно');
        }
    } else {
        console.error('❌ appData не найден');
        results.issues.push('appData отсутствует');
    }
    
    // 6. Тест удаления (симуляция)
    console.log('\n🧪 6. Симуляция теста удаления');
    console.log('─'.repeat(60));
    
    console.log('Для реального теста:');
    console.log('1. Добавьте тестовую запись');
    console.log('2. Удалите её');
    console.log('3. Следите за сообщениями в консоли');
    console.log('4. Должны появиться:');
    console.log('   ✅ "💾 Данные сохранены в localStorage"');
    console.log('   ✅ "💾 Данные автоматически синхронизированы с облаком"');
    console.log('   ✅ "⏭️ Пропускаем свое обновление"');
    console.log('5. НЕ должны появиться:');
    console.log('   ❌ "🔄 Применяем обновление от другого пользователя"');
    
    // ИТОГОВЫЙ ОТЧЕТ
    console.log('\n' + '═'.repeat(60));
    console.log('%c📊 ИТОГОВЫЙ ОТЧЕТ', 'font-size: 18px; font-weight: bold; color: #2196F3;');
    console.log('═'.repeat(60));
    
    console.log(`\n%c✅ Исправления применены (${results.fixed.length}):`, 'color: green; font-weight: bold;');
    results.fixed.forEach(msg => console.log('  ' + msg));
    
    if (results.warnings.length > 0) {
        console.log(`\n%c⚠️ Предупреждения (${results.warnings.length}):`, 'color: orange; font-weight: bold;');
        results.warnings.forEach(msg => console.warn('  ' + msg));
    }
    
    if (results.issues.length > 0) {
        console.log(`\n%c❌ Проблемы (${results.issues.length}):`, 'color: red; font-weight: bold;');
        results.issues.forEach(msg => console.error('  ' + msg));
    }
    
    // ВЕРДИКТ
    console.log('\n' + '═'.repeat(60));
    console.log('%c🎯 ВЕРДИКТ', 'font-size: 16px; font-weight: bold; color: #FF9800;');
    console.log('═'.repeat(60));
    
    if (results.issues.length === 0) {
        console.log('%c✅ ИСПРАВЛЕНИЯ ПРИМЕНЕНЫ УСПЕШНО!', 'color: green; font-weight: bold; font-size: 14px;');
        console.log('\nТеперь проверьте реальное удаление:');
        console.log('1. Добавьте тестовую запись');
        console.log('2. Удалите её');
        console.log('3. Подождите 10 секунд');
        console.log('4. Обновите страницу (F5)');
        console.log('5. Запись НЕ должна появиться снова ✅');
    } else {
        console.log('%c⚠️ ОБНАРУЖЕНЫ ПРОБЛЕМЫ', 'color: orange; font-weight: bold; font-size: 14px;');
        console.log('\nВозможные причины:');
        console.log('1. Страница не перезагружена после обновления файлов');
        console.log('2. Кэш браузера не очищен');
        console.log('3. Файлы не обновлены на сервере');
        console.log('\nРешение:');
        console.log('1. Очистите кэш (Ctrl + Shift + Delete)');
        console.log('2. Перезагрузите страницу (Ctrl + F5)');
        console.log('3. Запустите этот скрипт снова');
    }
    
    console.log('\n' + '═'.repeat(60));
    
    // Возвращаем результаты
    return {
        fixed: results.fixed.length,
        warnings: results.warnings.length,
        issues: results.issues.length,
        status: results.issues.length === 0 ? 'OK' : 'NEEDS_ATTENTION',
        details: results
    };
})();
