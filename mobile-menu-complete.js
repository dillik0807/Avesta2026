// Полное решение мобильного меню
console.log('🚀 Загрузка полного решения мобильного меню...');

let isMobileMenuOpen = false;

// Создаем полностью новое мобильное меню
function createMobileMenu() {
    console.log('📱 Создаем новое мобильное меню...');
    
    // Удаляем старое меню если есть
    const oldMobileMenu = document.getElementById('new-mobile-menu');
    if (oldMobileMenu) oldMobileMenu.remove();
    
    // Создаем новое меню
    const mobileMenu = document.createElement('div');
    mobileMenu.id = 'new-mobile-menu';
    mobileMenu.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: -300px;
            width: 280px;
            height: 100vh;
            background-color: #1e40af;
            color: white;
            z-index: 9999;
            transition: left 0.3s ease;
            overflow-y: auto;
            padding: 20px;
            box-shadow: 2px 0 10px rgba(0,0,0,0.3);
        ">
            <div style="margin-bottom: 30px;">
                <h2 style="color: white; font-size: 20px; font-weight: bold; margin-bottom: 10px;">Система учёта</h2>
                <div style="background-color: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; font-size: 14px;">
                    <div>Пользователь: <span id="mobile-current-user">admin</span></div>
                    <div>Роль: <span id="mobile-current-role">Администратор</span></div>
                </div>
                
                <!-- Селектор года для мобильного меню -->
                <div style="background-color: rgba(255,255,255,0.1); padding: 10px; border-radius: 5px; margin-top: 10px;">
                    <label style="color: white; font-size: 12px; font-weight: bold; display: block; margin-bottom: 5px;">Рабочий год:</label>
                    <div style="display: flex; gap: 5px; align-items: center;">
                        <select id="mobile-year-selector" style="
                            flex: 1;
                            padding: 4px;
                            border-radius: 4px;
                            border: none;
                            background-color: white;
                            color: black;
                            font-size: 12px;
                        ">
                            <!-- Годы будут добавлены динамически -->
                        </select>
                        <button id="mobile-add-year-btn" onclick="addNewYear()" style="
                            background-color: #16a34a;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            padding: 4px 8px;
                            font-size: 12px;
                            cursor: pointer;
                            display: none;
                        " title="Добавить новый год">+</button>
                    </div>
                    <div style="color: rgba(255,255,255,0.7); font-size: 10px; margin-top: 3px;">
                        Текущий: <span id="mobile-current-year">2025</span>
                    </div>
                </div>
            </div>
            
            <nav style="margin-bottom: 30px;">
                <button class="mobile-menu-item" data-section="dashboard" style="
                    width: 100%;
                    text-align: left;
                    padding: 12px 16px;
                    margin: 4px 0;
                    background-color: transparent;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.2s;
                ">🏠 Главная</button>
                
                <button class="mobile-menu-item" data-section="income" style="
                    width: 100%;
                    text-align: left;
                    padding: 12px 16px;
                    margin: 4px 0;
                    background-color: transparent;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.2s;
                ">📦 Приход</button>
                
                <button class="mobile-menu-item" data-section="expense" style="
                    width: 100%;
                    text-align: left;
                    padding: 12px 16px;
                    margin: 4px 0;
                    background-color: transparent;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.2s;
                ">📤 Расход</button>
                
                <button class="mobile-menu-item" data-section="payments" style="
                    width: 100%;
                    text-align: left;
                    padding: 12px 16px;
                    margin: 4px 0;
                    background-color: transparent;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.2s;
                ">💰 Погашения</button>
                
                <button class="mobile-menu-item" data-section="partners" style="
                    width: 100%;
                    text-align: left;
                    padding: 12px 16px;
                    margin: 4px 0;
                    background-color: transparent;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.2s;
                ">🤝 Партнёры</button>
                
                <button class="mobile-menu-item" data-section="wagon-summary" style="
                    width: 100%;
                    text-align: left;
                    padding: 12px 16px;
                    margin: 4px 0;
                    background-color: transparent;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.2s;
                ">🚛 Свод Вагонов</button>
                
                <button class="mobile-menu-item" data-section="balance-summary" style="
                    width: 100%;
                    text-align: left;
                    padding: 12px 16px;
                    margin: 4px 0;
                    background-color: transparent;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.2s;
                ">📊 Свод Остатков</button>
                
                <button class="mobile-menu-item" data-section="stock-balance" style="
                    width: 100%;
                    text-align: left;
                    padding: 12px 16px;
                    margin: 4px 0;
                    background-color: transparent;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.2s;
                ">📦 Остатки складов</button>
                
                <button class="mobile-menu-item" data-section="debt-report" style="
                    width: 100%;
                    text-align: left;
                    padding: 12px 16px;
                    margin: 4px 0;
                    background-color: transparent;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.2s;
                ">💳 Отчёт по долгам</button>
                
                <button class="mobile-menu-item" data-section="wagon-totals" style="
                    width: 100%;
                    text-align: left;
                    padding: 12px 16px;
                    margin: 4px 0;
                    background-color: transparent;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.2s;
                ">🚚 Итоги Вагонов</button>
                
                <button class="mobile-menu-item" data-section="reports" style="
                    width: 100%;
                    text-align: left;
                    padding: 12px 16px;
                    margin: 4px 0;
                    background-color: transparent;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.2s;
                ">📈 Отчёты</button>
                
                <button class="mobile-menu-item" data-section="management" style="
                    width: 100%;
                    text-align: left;
                    padding: 12px 16px;
                    margin: 4px 0;
                    background-color: transparent;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.2s;
                ">⚙️ Управление</button>
                
                <button class="mobile-menu-item" data-section="year-management" style="
                    width: 100%;
                    text-align: left;
                    padding: 12px 16px;
                    margin: 4px 0;
                    background-color: transparent;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.2s;
                ">📅 Управление годами</button>
                
                <button class="mobile-menu-item" data-section="users" style="
                    width: 100%;
                    text-align: left;
                    padding: 12px 16px;
                    margin: 4px 0;
                    background-color: transparent;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.2s;
                ">👥 Пользователи</button>
                
                <button class="mobile-menu-item" data-section="backup" style="
                    width: 100%;
                    text-align: left;
                    padding: 12px 16px;
                    margin: 4px 0;
                    background-color: transparent;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.2s;
                ">💾 Резервное копирование</button>
            </nav>
            
            <div style="margin-top: auto; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2);">
                <button id="mobile-logout-btn" style="
                    width: 100%;
                    padding: 12px;
                    background-color: #dc2626;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 16px;
                    font-weight: bold;
                ">🚪 Выход</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(mobileMenu);
    
    // Добавляем hover эффекты
    const menuItems = mobileMenu.querySelectorAll('.mobile-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(255,255,255,0.1)';
        });
        item.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
        });
        
        // Добавляем обработчик клика
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            console.log('📱 Переход к разделу:', section);
            
            // Вызываем функцию showSection если она существует
            if (window.showSection) {
                window.showSection(section);
            }
            
            // Закрываем меню
            closeMobileMenu();
        });
    });
    
    // Обработчик для кнопки выхода
    const logoutBtn = mobileMenu.querySelector('#mobile-logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            console.log('📱 Выход из системы');
            if (window.logout) {
                window.logout();
            }
            closeMobileMenu();
        });
    }
    
    // Инициализируем селектор года в мобильном меню
    initializeMobileYearSelector();
    
    // Обновляем права доступа к пунктам меню
    setTimeout(() => {
        if (window.updateMobileMenuAccess) {
            window.updateMobileMenuAccess();
        }
    }, 100);
    
    console.log('✅ Новое мобильное меню создано');
    return mobileMenu;
}

// Создаем overlay для затемнения
function createOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'mobile-menu-overlay-new';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 9998;
        display: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    overlay.addEventListener('click', closeMobileMenu);
    document.body.appendChild(overlay);
    
    return overlay;
}

// Функция открытия меню
function openMobileMenu() {
    console.log('📱 Открываем новое мобильное меню');
    
    const menu = document.getElementById('new-mobile-menu');
    const overlay = document.getElementById('mobile-menu-overlay-new');
    
    if (menu && overlay) {
        isMobileMenuOpen = true;
        
        // Показываем overlay
        overlay.style.display = 'block';
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
        
        // Показываем меню
        const menuDiv = menu.firstElementChild;
        menuDiv.style.left = '0px';
        
        console.log('✅ Меню открыто');
    }
}

// Функция закрытия меню
function closeMobileMenu() {
    console.log('📱 Закрываем новое мобильное меню');
    
    const menu = document.getElementById('new-mobile-menu');
    const overlay = document.getElementById('mobile-menu-overlay-new');
    
    if (menu && overlay) {
        isMobileMenuOpen = false;
        
        // Скрываем меню
        const menuDiv = menu.firstElementChild;
        menuDiv.style.left = '-300px';
        
        // Скрываем overlay
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
        
        console.log('❌ Меню закрыто');
    }
}

// Функция для инициализации селектора года в мобильном меню
function initializeMobileYearSelector() {
    console.log('📱 Инициализация мобильного селектора года...');
    
    // Ждем пока основное приложение загрузится
    setTimeout(() => {
        const mobileSelector = document.getElementById('mobile-year-selector');
        const mobileAddYearBtn = document.getElementById('mobile-add-year-btn');
        const mobileCurrentYear = document.getElementById('mobile-current-year');
        
        if (mobileSelector && window.appData && window.appData.years) {
            console.log('📱 Обновляем мобильный селектор года');
            
            // Очищаем селектор
            mobileSelector.innerHTML = '';
            
            // Сортируем годы по убыванию
            const sortedYears = Object.keys(window.appData.years).sort((a, b) => b - a);
            
            // Добавляем опции
            sortedYears.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.textContent = year;
                if (year === window.appData.currentYear.toString()) {
                    option.selected = true;
                }
                mobileSelector.appendChild(option);
            });
            
            // Обновляем отображение текущего года
            if (mobileCurrentYear) {
                mobileCurrentYear.textContent = window.appData.currentYear;
            }
            
            // Добавляем обработчик изменения года с проверкой доступности функции
            mobileSelector.addEventListener('change', function() {
                const selectedYear = this.value;
                console.log('📱 Попытка переключения на год:', selectedYear);
                console.log('📱 window.switchYear доступна:', !!window.switchYear);
                
                // Ждем пока функция switchYear станет доступной
                const trySwitch = () => {
                    if (window.switchYear && selectedYear) {
                        console.log('📱 Вызываем switchYear для года:', selectedYear);
                        window.switchYear(selectedYear);
                    } else if (selectedYear) {
                        console.log('📱 switchYear еще не доступна, ждем...');
                        setTimeout(trySwitch, 100);
                    }
                };
                
                trySwitch();
            });
            
            // Настраиваем права доступа к кнопке добавления года
            if (mobileAddYearBtn && window.currentUser) {
                if (window.currentUser.role === 'admin') {
                    mobileAddYearBtn.style.display = 'block';
                } else {
                    mobileAddYearBtn.style.display = 'none';
                }
            }
            
            console.log('✅ Мобильный селектор года инициализирован');
        } else {
            console.log('⏳ Данные еще не загружены, повторная попытка через 1 секунду');
            // Повторяем попытку через секунду
            setTimeout(initializeMobileYearSelector, 1000);
        }
    }, 500);
}

// Функция для обновления мобильного селектора года (вызывается из основного приложения)
function updateMobileYearSelector() {
    console.log('📱 Обновление мобильного селектора года...');
    
    const mobileSelector = document.getElementById('mobile-year-selector');
    const mobileCurrentYear = document.getElementById('mobile-current-year');
    const mobileAddYearBtn = document.getElementById('mobile-add-year-btn');
    
    if (mobileSelector && window.appData && window.appData.years) {
        // Очищаем селектор
        mobileSelector.innerHTML = '';
        
        // Сортируем годы по убыванию
        const sortedYears = Object.keys(window.appData.years).sort((a, b) => b - a);
        
        // Добавляем опции
        sortedYears.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            if (year === window.appData.currentYear.toString()) {
                option.selected = true;
            }
            mobileSelector.appendChild(option);
        });
        
        // Обновляем отображение текущего года
        if (mobileCurrentYear) {
            mobileCurrentYear.textContent = window.appData.currentYear;
        }
        
        // Удаляем старые обработчики и добавляем новый
        const newSelector = mobileSelector.cloneNode(true);
        mobileSelector.parentNode.replaceChild(newSelector, mobileSelector);
        
        // Добавляем обработчик изменения года
        newSelector.addEventListener('change', function() {
            const selectedYear = this.value;
            console.log('📱 Переключение на год:', selectedYear);
            
            if (window.switchYear && selectedYear) {
                window.switchYear(selectedYear);
            } else {
                console.error('❌ Функция switchYear не найдена или год не выбран');
            }
        });
        
        // Настраиваем права доступа
        if (mobileAddYearBtn && window.currentUser) {
            if (window.currentUser.role === 'admin') {
                mobileAddYearBtn.style.display = 'block';
            } else {
                mobileAddYearBtn.style.display = 'none';
            }
        }
        
        console.log('✅ Мобильный селектор года обновлен');
    }
}

// Делаем функцию доступной глобально
window.updateMobileYearSelector = updateMobileYearSelector;

// Глобальный обработчик для мобильного селектора года через делегирование событий
document.addEventListener('change', function(e) {
    if (e.target && e.target.id === 'mobile-year-selector') {
        const selectedYear = e.target.value;
        console.log('📱 Глобальный обработчик: переключение на год:', selectedYear);
        
        if (window.switchYear && selectedYear) {
            console.log('📱 Вызываем switchYear через глобальный обработчик');
            window.switchYear(selectedYear);
        } else {
            console.error('❌ switchYear не доступна или год не выбран');
            
            // Попробуем найти функцию через небольшую задержку
            setTimeout(() => {
                if (window.switchYear && selectedYear) {
                    console.log('📱 Повторная попытка вызова switchYear');
                    window.switchYear(selectedYear);
                }
            }, 100);
        }
    }
});

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Инициализация нового мобильного меню...');
    
    // Создаем меню и overlay
    createMobileMenu();
    createOverlay();
    
    // Находим кнопку мобильного меню
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    
    if (mobileMenuBtn) {
        // Удаляем старые обработчики
        const newBtn = mobileMenuBtn.cloneNode(true);
        mobileMenuBtn.parentNode.replaceChild(newBtn, mobileMenuBtn);
        
        // Добавляем новый обработчик
        newBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('📱 Клик по кнопке мобильного меню');
            
            if (isMobileMenuOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
        
        console.log('✅ Обработчик кнопки меню установлен');
    } else {
        console.error('❌ Кнопка мобильного меню не найдена');
    }
    
    // Обработчик для клавиши Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMobileMenuOpen) {
            closeMobileMenu();
        }
    });
    
    console.log('✅ Новое мобильное меню полностью инициализировано');
});

// Добавляем CSS для мобильных устройств
const mobileCSS = document.createElement('style');
mobileCSS.textContent = `
    @media (max-width: 768px) {
        /* Скрываем оригинальное меню на мобильных */
        #sidebar {
            display: none !important;
        }
        
        /* Показываем мобильную шапку */
        .mobile-header {
            display: flex !important;
        }
    }
    
    @media (min-width: 769px) {
        /* Скрываем новое мобильное меню на десктопе */
        #new-mobile-menu {
            display: none !important;
        }
        
        #mobile-menu-overlay-new {
            display: none !important;
        }
    }
`;
document.head.appendChild(mobileCSS);

console.log('✅ Полное решение мобильного меню загружено');