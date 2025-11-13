// Service Worker для офлайн-режима
const CACHE_NAME = 'warehouse-app-v1.0.0';
const STATIC_CACHE = 'warehouse-static-v1.0.0';
const DYNAMIC_CACHE = 'warehouse-dynamic-v1.0.0';

// Файлы для кэширования
const STATIC_FILES = [
    '/',
    '/index.html',
    '/mobile-adapter.js',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

// Установка Service Worker
self.addEventListener('install', (event) => {
    console.log('📦 Service Worker: Установка');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('📦 Service Worker: Кэширование статических файлов');
                return cache.addAll(STATIC_FILES);
            })
            .catch((error) => {
                console.error('❌ Ошибка кэширования:', error);
            })
    );
    
    self.skipWaiting();
});

// Активация Service Worker
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker: Активация');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('🗑️ Service Worker: Удаление старого кэша', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    self.clients.claim();
});

// Перехват сетевых запросов
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Стратегия для статических файлов: Cache First
    if (STATIC_FILES.some(file => request.url.includes(file))) {
        event.respondWith(
            caches.match(request)
                .then((response) => {
                    return response || fetch(request)
                        .then((fetchResponse) => {
                            return caches.open(STATIC_CACHE)
                                .then((cache) => {
                                    cache.put(request, fetchResponse.clone());
                                    return fetchResponse;
                                });
                        });
                })
                .catch(() => {
                    // Возвращаем офлайн страницу если нет кэша
                    if (request.destination === 'document') {
                        return caches.match('/index.html');
                    }
                })
        );
        return;
    }
    
    // Стратегия для Firebase: Network First
    if (url.hostname.includes('firebase')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Кэшируем успешные ответы
                    if (response.status === 200) {
                        const responseClone = response.clone();
                        caches.open(DYNAMIC_CACHE)
                            .then((cache) => {
                                cache.put(request, responseClone);
                            });
                    }
                    return response;
                })
                .catch(() => {
                    // Возвращаем из кэша если сеть недоступна
                    return caches.match(request);
                })
        );
        return;
    }
    
    // Стратегия по умолчанию: Network First с fallback на кэш
    event.respondWith(
        fetch(request)
            .then((response) => {
                // Кэшируем GET запросы
                if (request.method === 'GET' && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(DYNAMIC_CACHE)
                        .then((cache) => {
                            cache.put(request, responseClone);
                        });
                }
                return response;
            })
            .catch(() => {
                return caches.match(request);
            })
    );
});

// Обработка сообщений от клиента
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
    
    if (event.data && event.data.type === 'CLEAR_CACHE') {
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    return caches.delete(cacheName);
                })
            );
        }).then(() => {
            event.ports[0].postMessage({ success: true });
        });
    }
});

// Синхронизация в фоне
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        console.log('🔄 Service Worker: Фоновая синхронизация');
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Получаем данные из IndexedDB или localStorage
        const syncData = await getSyncData();
        
        if (syncData && syncData.length > 0) {
            // Отправляем данные на сервер
            await sendDataToServer(syncData);
            
            // Очищаем данные после успешной отправки
            await clearSyncData();
            
            // Уведомляем клиента об успешной синхронизации
            self.clients.matchAll().then((clients) => {
                clients.forEach((client) => {
                    client.postMessage({
                        type: 'SYNC_SUCCESS',
                        message: 'Данные синхронизированы в фоне'
                    });
                });
            });
        }
    } catch (error) {
        console.error('❌ Ошибка фоновой синхронизации:', error);
        
        // Уведомляем клиента об ошибке
        self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
                client.postMessage({
                    type: 'SYNC_ERROR',
                    message: 'Ошибка синхронизации: ' + error.message
                });
            });
        });
    }
}

async function getSyncData() {
    // Здесь можно реализовать получение данных для синхронизации
    return [];
}

async function sendDataToServer(data) {
    // Здесь реализуется отправка данных на Firebase или другой сервер
    const response = await fetch('/api/sync', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        throw new Error('Ошибка отправки данных на сервер');
    }
    
    return response.json();
}

async function clearSyncData() {
    // Очистка данных после успешной синхронизации
    console.log('🧹 Очистка данных синхронизации');
}

console.log('🔧 Service Worker загружен');