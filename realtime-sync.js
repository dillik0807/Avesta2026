/**
 * 🔄 СИСТЕМА СИНХРОНИЗАЦИИ В РЕАЛЬНОМ ВРЕМЕНИ
 * Автоматическая синхронизация данных между всеми пользователями
 */

class RealtimeSync {
    constructor() {
        this.isConnected = false;
        this.listener = null;
        this.syncQueue = [];
        this.isSyncing = false;
        this.lastSyncTime = null;
        this.lastPushTime = 0;
        this.offlineMode = false;
        this.hasOfflineData = false;
    }

    /**
     * Инициализация системы синхронизации
     */
    async initialize() {
        try {
            console.log('🔄 Инициализация системы синхронизации...');

            // Проверка Firebase SDK
            if (!window.firebaseDB || !window.firebaseRefs) {
                throw new Error('Firebase SDK не загружен');
            }

            // Авторизация
            await this.authenticate();

            // Настройка слушателя изменений
            await this.setupRealtimeListener();

            // Первичная загрузка данных
            await this.initialSync();

            // Настройка автосинхронизации при изменениях
            this.setupAutoSync();

            this.isConnected = true;
            
            // Переключаемся в онлайн режим
            await this.switchToOnlineMode();
            
            this.updateStatus('connected', 'Синхронизация активна');
            console.log('✅ Система синхронизации активирована');

            return true;
        } catch (error) {
            console.error('❌ Ошибка инициализации синхронизации:', error);
            this.updateStatus('offline', 'Ошибка подключения');
            throw error;
        }
    }

    /**
     * Авторизация в Firebase
     */
    async authenticate() {
        console.log('🔐 Авторизация в Firebase...');
        const auth = window.firebaseAuth;
        await window.signInAnonymously(auth);
        console.log('✅ Авторизация успешна');
    }

    /**
     * Настройка слушателя изменений в реальном времени
     */
    async setupRealtimeListener() {
        const { ref, onValue } = window.firebaseRefs;
        const dataRef = ref(window.firebaseDB, 'retailAppData');

        console.log('👂 Настройка слушателя изменений...');

        this.listener = onValue(dataRef, (snapshot) => {
            // Игнорируем обновления в течение 2 секунд после отправки
            const timeSinceLastPush = Date.now() - (this.lastPushTime || 0);
            if (timeSinceLastPush < 2000) {
                console.log('⏭️ Пропускаем свое обновление (прошло ' + timeSinceLastPush + 'мс)');
                return;
            }

            if (snapshot.exists()) {
                const cloudData = snapshot.val();
                console.log('🔔 Получено обновление от другого пользователя');
                this.handleRemoteUpdate(cloudData);
            }
        }, (error) => {
            console.error('❌ Ошибка слушателя:', error);
            this.handleConnectionError(error);
        });

        console.log('✅ Слушатель настроен');
    }

    /**
     * Первичная синхронизация данных
     */
    async initialSync() {
        try {
            console.log('📥 Загрузка данных из облака...');
            const { ref, get } = window.firebaseRefs;
            const dataRef = ref(window.firebaseDB, 'retailAppData');
            const snapshot = await get(dataRef);

            if (snapshot.exists()) {
                const cloudData = snapshot.val();
                console.log('📊 Данные получены из облака');
                
                // ВСЕГДА используем данные из облака (облако - главный источник)
                this.applyCloudData(cloudData);
            } else {
                console.log('ℹ️ В облаке нет данных');
                
                // Проверяем локальные данные
                const localData = localStorage.getItem('retailAppData');
                if (localData && localData !== 'null') {
                    console.log('📦 Найдены локальные данные, загружаем в облако');
                    const parsedData = JSON.parse(localData);
                    await this.pushToCloud(parsedData);
                } else if (window.appData && Object.keys(window.appData.years || {}).length > 0) {
                    console.log('📦 Найдены данные в памяти, загружаем в облако');
                    await this.pushToCloud(window.appData);
                }
            }
        } catch (error) {
            console.error('❌ Ошибка первичной синхронизации:', error);
            throw error;
        }
    }



    /**
     * Применение данных из облака
     */
    applyCloudData(cloudData) {
        console.log('📥 Применяем данные из облака');
        window.appData = cloudData;
        
        // ВСЕГДА сохраняем в localStorage (для работы приложения)
        // Облако - главный источник данных, localStorage - локальная копия
        localStorage.setItem('retailAppData', JSON.stringify(cloudData));
        console.log('💾 Данные сохранены в localStorage (копия из облака)');
        
        if (window.currentUser && typeof window.updateAllTables === 'function') {
            window.updateAllTables();
        }
        
        this.lastSyncTime = Date.now();
        console.log('✅ Данные из облака применены');
    }

    /**
     * Обработка удаленного обновления
     */
    handleRemoteUpdate(cloudData) {
        console.log('🔄 Обработка удаленного обновления...');
        
        // Просто применяем обновление без уведомлений и проверки конфликтов
        // Последнее изменение всегда побеждает (last-write-wins)
        this.applyCloudData(cloudData);
        console.log('✅ Данные автоматически обновлены');
    }



    /**
     * Настройка автоматической синхронизации
     */
    setupAutoSync() {
        console.log('⚙️ Настройка автосинхронизации...');

        // Перехватываем все функции сохранения данных
        this.interceptSaveFunctions();

        // Периодическая синхронизация (каждые 30 секунд)
        setInterval(() => {
            if (this.isConnected && !this.isSyncing) {
                this.syncIfNeeded();
            }
        }, 30000);

        console.log('✅ Автосинхронизация настроена');
    }

    /**
     * Перехват функций сохранения
     */
    interceptSaveFunctions() {
        const self = this;
        
        // Сохраняем оригинальную функцию saveData
        const originalSaveData = window.saveData;
        
        // Заменяем на нашу версию
        window.saveData = function() {
            // Всегда вызываем оригинальную функцию (сохраняем в localStorage)
            if (originalSaveData) {
                originalSaveData.call(this);
            }
            
            // Если онлайн - добавляем в очередь синхронизации с облаком
            if (self.isConnected && !self.offlineMode) {
                console.log('☁️ Онлайн режим: синхронизируем с облаком');
                self.queueSync();
            } else {
                console.log('💾 Офлайн режим: данные в localStorage');
                self.hasOfflineData = true;
            }
        };

        console.log('✅ Функции сохранения перехвачены');
    }

    /**
     * Добавление в очередь синхронизации
     */
    queueSync() {
        if (!this.isConnected) return;

        // Добавляем задачу в очередь
        this.syncQueue.push(Date.now());

        // Запускаем синхронизацию с задержкой (debounce)
        clearTimeout(this.syncTimeout);
        this.syncTimeout = setTimeout(() => {
            this.processSyncQueue();
        }, 1000); // Ждем 1 секунду после последнего изменения
    }

    /**
     * Обработка очереди синхронизации
     */
    async processSyncQueue() {
        if (this.isSyncing || this.syncQueue.length === 0) return;

        this.isSyncing = true;
        this.syncQueue = [];

        try {
            await this.pushToCloud(window.appData);
            console.log('✅ Автосинхронизация выполнена');
        } catch (error) {
            console.error('❌ Ошибка автосинхронизации:', error);
        } finally {
            this.isSyncing = false;
        }
    }

    /**
     * Отправка данных в облако
     */
    async pushToCloud(data) {
        try {
            console.log('📤 Отправка данных в облако...');
            this.updateStatus('syncing', 'Синхронизация...');

            const { ref, set } = window.firebaseRefs;
            const dataRef = ref(window.firebaseDB, 'retailAppData');

            // Запоминаем время отправки (для игнорирования своих обновлений)
            this.lastPushTime = Date.now();
            
            await set(dataRef, data);
            
            this.lastSyncTime = Date.now();
            this.updateStatus('connected', 'Синхронизировано');
            
            console.log('✅ Данные отправлены в облако');

            // Возвращаем статус через 2 секунды
            setTimeout(() => {
                this.updateStatus('connected', 'Онлайн');
            }, 2000);

        } catch (error) {
            console.error('❌ Ошибка отправки в облако:', error);
            this.updateStatus('error', 'Ошибка синхронизации');
            throw error;
        }
    }

    /**
     * Синхронизация при необходимости
     */
    async syncIfNeeded() {
        // Проверяем, были ли изменения
        const currentData = JSON.stringify(window.appData);
        const savedData = localStorage.getItem('retailAppData');

        if (currentData !== savedData) {
            console.log('🔄 Обнаружены несинхронизированные изменения');
            await this.pushToCloud(window.appData);
        }
    }



    /**
     * Обновление статуса синхронизации
     */
    updateStatus(status, text) {
        if (typeof window.updateSyncStatus === 'function') {
            window.updateSyncStatus(status, text);
        }
    }

    /**
     * Обработка ошибки подключения
     */
    handleConnectionError(error) {
        console.error('❌ Ошибка подключения:', error);
        this.isConnected = false;
        this.offlineMode = true;
        this.updateStatus('offline', 'Офлайн режим');

        console.log('📴 Переключение в офлайн режим');
        console.log('💾 Данные будут сохраняться в localStorage');

        // Пытаемся переподключиться через 10 секунд
        setTimeout(() => {
            console.log('🔄 Попытка переподключения...');
            this.initialize().catch(err => {
                console.error('❌ Переподключение не удалось:', err);
            });
        }, 10000);
    }

    /**
     * Переключение в онлайн режим
     */
    async switchToOnlineMode() {
        console.log('🌐 Переключение в онлайн режим...');
        this.offlineMode = false;
        this.hasOfflineData = false;
        console.log('✅ Онлайн режим активирован');
    }

    /**
     * Отключение синхронизации
     */
    disconnect() {
        if (this.listener) {
            // Отписываемся от слушателя
            this.listener();
            this.listener = null;
        }

        this.isConnected = false;
        this.updateStatus('offline', 'Отключено');
        console.log('🔌 Синхронизация отключена');
    }

    /**
     * Ручная синхронизация
     */
    async manualSync() {
        if (!this.isConnected) {
            alert('Синхронизация не подключена. Подключитесь к Firebase сначала.');
            return;
        }

        try {
            await this.pushToCloud(window.appData);
            alert('✅ Данные успешно синхронизированы!');
        } catch (error) {
            alert('❌ Ошибка синхронизации: ' + error.message);
        }
    }
}

// Создаем глобальный экземпляр
window.realtimeSync = new RealtimeSync();

// Автоматическая инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Ждем загрузки Firebase SDK
    setTimeout(() => {
        if (window.firebaseDB && window.firebaseRefs) {
            console.log('🚀 Автоматический запуск синхронизации...');
            window.realtimeSync.initialize().catch(error => {
                console.error('❌ Не удалось запустить синхронизацию:', error);
                // Переключаемся в офлайн режим
                window.realtimeSync.offlineMode = true;
                window.realtimeSync.updateStatus('offline', 'Офлайн режим');
            });
        }
    }, 3000);
});

// Слушатели событий онлайн/офлайн
window.addEventListener('online', async () => {
    console.log('🌐 Интернет подключен');
    if (window.realtimeSync && window.realtimeSync.offlineMode) {
        console.log('🔄 Попытка переподключения...');
        try {
            await window.realtimeSync.initialize();
        } catch (error) {
            console.error('❌ Не удалось переподключиться:', error);
        }
    }
});

window.addEventListener('offline', () => {
    console.log('📴 Интернет отключен');
    if (window.realtimeSync) {
        window.realtimeSync.offlineMode = true;
        window.realtimeSync.isConnected = false;
        window.realtimeSync.updateStatus('offline', 'Офлайн режим');
        console.log('💾 Данные будут сохраняться в localStorage');
    }
});

console.log('✅ Модуль синхронизации в реальном времени загружен');
