/**
 * 👤 КАРТОЧКА КЛИЕНТА
 * Модуль для отображения детальной информации по клиенту
 */

// Показать интерфейс выбора клиента
function showClientCardInterface() {
    const filtersDiv = document.getElementById('reportFilters');
    filtersDiv.classList.remove('hidden');
    
    // Сохраняем оригинальный HTML для восстановления
    // Проверяем, что HTML содержит стандартные элементы фильтров
    if (!window.originalReportFiltersHTML) {
        const hasStandardFilters = filtersDiv.innerHTML.includes('reportDateFrom') || 
                                   filtersDiv.innerHTML.includes('generateReport');
        if (hasStandardFilters) {
            window.originalReportFiltersHTML = filtersDiv.innerHTML;
            console.log('💾 Сохранён оригинальный HTML фильтров');
        } else {
            console.log('⏭️ HTML фильтров ещё не инициализирован, пропускаем сохранение');
        }
    }
    
    // Создаём специальный интерфейс для выбора клиента
    filtersDiv.innerHTML = `
        <h3 class="text-lg font-semibold mb-4">Выберите клиента</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div style="position: relative;">
                <label for="clientCardInput" class="block text-sm font-medium mb-2">Клиент</label>
                <input 
                    type="text" 
                    id="clientCardInput" 
                    placeholder="Начните вводить имя клиента..."
                    class="w-full p-2 border rounded"
                    autocomplete="off"
                />
                <div id="clientCardDropdown" class="absolute z-10 w-full bg-white border border-gray-300 rounded-b shadow-lg max-h-60 overflow-y-auto hidden"></div>
                <div class="mt-2">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" id="showAllClients" class="w-4 h-4">
                        <span class="text-sm">Показать всех клиентов</span>
                    </label>
                </div>
            </div>
            <div>
                <label for="clientCardWarehouse" class="block text-sm font-medium mb-2">Склад (фильтр)</label>
                <select id="clientCardWarehouse" class="w-full p-2 border rounded">
                    <option value="">Все склады</option>
                </select>
            </div>
        </div>
        <div class="mt-4 flex gap-4">
            <button id="generateClientCard" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                Показать карточку
            </button>
            <button id="exportClientCardExcel" class="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 hidden">
                📊 Экспорт в Excel
            </button>
        </div>
    `;
    
    // Настройка автозаполнения для клиентов
    const clientInput = document.getElementById('clientCardInput');
    const clientDropdown = document.getElementById('clientCardDropdown');
    const clients = appData.clients || [];
    
    // Массив клиентов для автозаполнения
    const clientsList = clients.map(client => {
        const clientName = typeof client === 'string' ? client : client.name;
        const clientPhone = typeof client === 'string' ? '' : (client.phone || '');
        return {
            name: clientName,
            phone: clientPhone,
            display: clientPhone ? `${clientName} (${clientPhone})` : clientName
        };
    });
    
    // Функция фильтрации и отображения списка
    function filterClients(searchText) {
        const filtered = clientsList.filter(client => 
            client.name.toLowerCase().includes(searchText.toLowerCase()) ||
            client.phone.includes(searchText)
        );
        
        if (filtered.length > 0 && searchText) {
            clientDropdown.innerHTML = '';
            filtered.forEach(client => {
                const div = document.createElement('div');
                div.className = 'p-2 hover:bg-blue-100 cursor-pointer';
                div.textContent = client.display;
                div.onclick = () => {
                    clientInput.value = client.name;
                    clientInput.dataset.selectedClient = client.name;
                    clientDropdown.classList.add('hidden');
                };
                clientDropdown.appendChild(div);
            });
            clientDropdown.classList.remove('hidden');
        } else {
            clientDropdown.classList.add('hidden');
        }
    }
    
    // События для автозаполнения
    clientInput.addEventListener('input', (e) => {
        filterClients(e.target.value);
    });
    
    clientInput.addEventListener('focus', (e) => {
        if (e.target.value) {
            filterClients(e.target.value);
        }
    });
    
    // Закрытие списка при клике вне
    document.addEventListener('click', (e) => {
        if (!clientInput.contains(e.target) && !clientDropdown.contains(e.target)) {
            clientDropdown.classList.add('hidden');
        }
    });
    
    // Обработчик галочки "Показать всех клиентов"
    const showAllClientsCheckbox = document.getElementById('showAllClients');
    showAllClientsCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            clientInput.value = 'ВСЕ КЛИЕНТЫ';
            clientInput.disabled = true;
            clientInput.dataset.selectedClient = 'ALL';
            clientDropdown.classList.add('hidden');
        } else {
            clientInput.value = '';
            clientInput.disabled = false;
            clientInput.dataset.selectedClient = '';
        }
    });
    
    // Заполняем список складов с учётом прав доступа
    const warehouseSelect = document.getElementById('clientCardWarehouse');
    let warehouses = appData.warehouses || [];
    
    // Фильтрация для завсклада
    if (currentUser && currentUser.role === 'warehouse' && currentUser.warehouseGroup) {
        const userWarehouses = getUserWarehouseNames();
        warehouses = warehouses.filter(w => userWarehouses.includes(w));
    }
    
    warehouses.forEach(warehouse => {
        // Поддержка старого формата (строки) и нового (объекты)
        const warehouseName = typeof warehouse === 'string' ? warehouse : warehouse.name;
        const warehouseGroup = typeof warehouse === 'string' ? '' : (warehouse.group || '');
        
        const option = document.createElement('option');
        option.value = warehouseName;
        option.textContent = warehouseGroup ? `${warehouseName} (${warehouseGroup})` : warehouseName;
        warehouseSelect.appendChild(option);
    });
    
    // Обработчики кнопок (с небольшой задержкой для гарантии создания элементов)
    setTimeout(() => {
        const generateBtn = document.getElementById('generateClientCard');
        const exportBtn = document.getElementById('exportClientCardExcel');
        
        if (generateBtn) {
            generateBtn.addEventListener('click', generateClientCard);
            console.log('✅ Обработчик кнопки "Показать карточку" установлен');
        } else {
            console.error('❌ Кнопка generateClientCard не найдена');
        }
        
        if (exportBtn) {
            exportBtn.addEventListener('click', exportClientCardToExcel);
            console.log('✅ Обработчик кнопки "Экспорт" установлен');
        } else {
            console.error('❌ Кнопка exportClientCardExcel не найдена');
        }
    }, 100);
}

// Генерация карточки клиента
function generateClientCard() {
    console.log('🔵 Функция generateClientCard вызвана');
    
    const clientInput = document.getElementById('clientCardInput');
    const clientName = clientInput.dataset.selectedClient || clientInput.value;
    const warehouseFilter = document.getElementById('clientCardWarehouse').value;
    const showAllClients = document.getElementById('showAllClients').checked;
    
    console.log('📋 Выбранный клиент:', clientName);
    console.log('📋 Показать всех:', showAllClients);
    console.log('🏪 Фильтр склада:', warehouseFilter || 'Все склады');
    
    if (!clientName && !showAllClients) {
        alert('Пожалуйста, выберите клиента или отметьте "Показать всех клиентов"');
        return;
    }
    
    console.log('📊 Расчёт данных карточки...');
    
    let cardHtml;
    if (showAllClients || clientName === 'ALL') {
        // Показываем всех клиентов
        cardHtml = generateAllClientsCardHtml(warehouseFilter);
    } else {
        // Показываем одного клиента
        const cardData = calculateClientCardData(clientName, warehouseFilter);
        console.log('📊 Данные рассчитаны:', cardData);
        cardHtml = generateClientCardHtml(clientName, cardData, warehouseFilter);
    }
    
    console.log('📄 Отображение карточки...');
    document.getElementById('reportContent').innerHTML = cardHtml;
    document.getElementById('reportResults').classList.remove('hidden');
    document.getElementById('exportClientCardExcel').classList.remove('hidden');
    
    console.log('✅ Карточка клиента отображена');
}

// Расчёт данных для карточки клиента
function calculateClientCardData(clientName, warehouseFilter) {
    const yearData = getCurrentYearData();
    let expense = yearData.expense || [];
    let payments = yearData.payments || [];
    
    // Фильтрация для завсклада - по подгруппе складов
    if (currentUser && currentUser.role === 'warehouse' && currentUser.warehouseGroup) {
        const userWarehouses = getUserWarehouseNames();
        expense = expense.filter(item => userWarehouses.includes(item.warehouse));
    }
    
    // Фильтрация по клиенту
    expense = expense.filter(item => item.client === clientName);
    payments = payments.filter(item => item.client === clientName);
    
    // Дополнительная фильтрация по складу если выбран
    if (warehouseFilter) {
        expense = expense.filter(item => item.warehouse === warehouseFilter);
    }
    
    // Группировка расходов по складам
    const expenseByWarehouse = {};
    let totalExpenseAmount = 0;
    
    expense.forEach(item => {
        const warehouse = item.warehouse;
        if (!expenseByWarehouse[warehouse]) {
            expenseByWarehouse[warehouse] = {
                items: [],
                totalAmount: 0,
                totalQuantity: 0
            };
        }
        
        expenseByWarehouse[warehouse].items.push(item);
        expenseByWarehouse[warehouse].totalAmount += (item.total || item.totalAmount || 0);
        expenseByWarehouse[warehouse].totalQuantity += (item.quantity || 0);
        totalExpenseAmount += (item.total || item.totalAmount || 0);
    });
    
    // Расчёт погашений
    let totalPayments = 0;
    payments.forEach(item => {
        totalPayments += (item.amount || 0);
    });
    
    // Расчёт долга
    const debt = totalExpenseAmount - totalPayments;
    
    // Проверка на NaN и замена на 0
    const safeTotalExpense = isNaN(totalExpenseAmount) ? 0 : totalExpenseAmount;
    const safeTotalPayments = isNaN(totalPayments) ? 0 : totalPayments;
    const safeDebt = isNaN(debt) ? 0 : debt;
    
    console.log('💰 Итоги:', {
        totalExpenseAmount: safeTotalExpense,
        totalPayments: safeTotalPayments,
        debt: safeDebt
    });
    
    return {
        expense: expense,
        payments: payments,
        expenseByWarehouse: expenseByWarehouse,
        totalExpenseAmount: safeTotalExpense,
        totalPayments: safeTotalPayments,
        debt: safeDebt
    };
}

// Генерация HTML карточки клиента
function generateClientCardHtml(clientName, data, warehouseFilter) {
    const filterText = warehouseFilter ? ` (Склад: ${warehouseFilter})` : ' (Все склады)';
    const userRole = currentUser.role === 'warehouse' ? ' (Моя группа складов)' : ' (Все группы)';
    
    let html = `
        <div class="p-6">
            <div class="mb-6 bg-blue-50 p-4 rounded-lg">
                <h2 class="text-2xl font-bold text-blue-900 mb-2">👤 ${clientName}</h2>
                <p class="text-sm text-gray-600">${filterText}${userRole}</p>
            </div>
            
            <!-- Сводка по долгам -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                    <div class="text-sm text-gray-600 mb-1">Общий расход</div>
                    <div class="text-2xl font-bold text-red-700">$${data.totalExpenseAmount.toFixed(2)}</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <div class="text-sm text-gray-600 mb-1">Погашено</div>
                    <div class="text-2xl font-bold text-green-700">$${data.totalPayments.toFixed(2)}</div>
                </div>
                <div class="bg-${data.debt > 0 ? 'orange' : 'blue'}-50 p-4 rounded-lg border-l-4 border-${data.debt > 0 ? 'orange' : 'blue'}-500">
                    <div class="text-sm text-gray-600 mb-1">${data.debt > 0 ? 'Долг' : 'Переплата'}</div>
                    <div class="text-2xl font-bold text-${data.debt > 0 ? 'orange' : 'blue'}-700">$${Math.abs(data.debt).toFixed(2)}</div>
                </div>
            </div>
    `;
    
    // Расходы по складам
    html += `
            <div class="mb-6">
                <h3 class="text-xl font-bold mb-4 text-gray-800">📦 Расходы по складам</h3>
    `;
    
    const warehouses = Object.keys(data.expenseByWarehouse).sort();
    if (warehouses.length > 0) {
        warehouses.forEach(warehouse => {
            const whData = data.expenseByWarehouse[warehouse];
            html += `
                <div class="mb-4 bg-gray-50 rounded-lg overflow-hidden">
                    <div class="bg-gray-200 p-3 font-semibold flex justify-between items-center">
                        <span>🏪 ${warehouse}</span>
                        <span class="text-blue-700">Итого: $${whData.totalAmount.toFixed(2)}</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-gray-100 text-sm">
                                <tr>
                                    <th class="p-2 text-left">Дата</th>
                                    <th class="p-2 text-left">Товар</th>
                                    <th class="p-2 text-left">Фирма</th>
                                    <th class="p-2 text-right">Кол-во</th>
                                    <th class="p-2 text-right">Цена</th>
                                    <th class="p-2 text-right">Сумма</th>
                                    <th class="p-2 text-left">Примечания</th>
                                </tr>
                            </thead>
                            <tbody class="text-sm">
            `;
            
            whData.items.forEach(item => {
                html += `
                    <tr class="border-b hover:bg-gray-50">
                        <td class="p-2">${item.date}</td>
                        <td class="p-2">${item.product}</td>
                        <td class="p-2">${item.company}</td>
                        <td class="p-2 text-right">${(item.quantity || 0).toFixed(2)}</td>
                        <td class="p-2 text-right">$${(item.price || 0).toFixed(2)}</td>
                        <td class="p-2 text-right font-semibold">$${(item.total || item.totalAmount || 0).toFixed(2)}</td>
                        <td class="p-2 text-gray-600">${item.notes || '-'}</td>
                    </tr>
                `;
            });
            
            html += `
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        });
    } else {
        html += '<p class="text-gray-500 italic">Нет расходов</p>';
    }
    
    html += '</div>';
    
    // Погашения
    html += `
            <div class="mb-6">
                <h3 class="text-xl font-bold mb-4 text-gray-800">💰 История погашений</h3>
    `;
    
    if (data.payments.length > 0) {
        html += `
                <div class="overflow-x-auto bg-green-50 rounded-lg">
                    <table class="w-full">
                        <thead class="bg-green-100">
                            <tr>
                                <th class="p-3 text-left">Дата</th>
                                <th class="p-3 text-right">Сомони</th>
                                <th class="p-3 text-right">Курс</th>
                                <th class="p-3 text-right">Сумма ($)</th>
                                <th class="p-3 text-left">Примечания</th>
                                <th class="p-3 text-left">Создал</th>
                            </tr>
                        </thead>
                        <tbody>
        `;
        
        data.payments.forEach(item => {
            const editInfo = item.editedBy ? ` (изм: ${item.editedBy})` : '';
            html += `
                <tr class="border-b hover:bg-green-50">
                    <td class="p-3">${item.date}</td>
                    <td class="p-3 text-right">${(item.somoni || 0).toFixed(2)}</td>
                    <td class="p-3 text-right">${(item.rate || 0).toFixed(2)}</td>
                    <td class="p-3 text-right font-semibold text-green-700">$${(item.amount || 0).toFixed(2)}</td>
                    <td class="p-3 text-gray-600">${item.notes || '-'}</td>
                    <td class="p-3 text-sm">${item.user}${editInfo}</td>
                </tr>
            `;
        });
        
        html += `
                        </tbody>
                    </table>
                </div>
        `;
    } else {
        html += '<p class="text-gray-500 italic">Нет погашений</p>';
    }
    
    html += `
            </div>
        </div>
    `;
    
    return html;
}

// Экспорт карточки клиента в Excel
function exportClientCardToExcel() {
    const clientInput = document.getElementById('clientCardInput');
    const clientName = clientInput.dataset.selectedClient || clientInput.value;
    const warehouseFilter = document.getElementById('clientCardWarehouse').value;
    const showAllClients = document.getElementById('showAllClients').checked;
    
    if (!clientName && !showAllClients) {
        alert('Нет данных для экспорта');
        return;
    }
    
    const wb = XLSX.utils.book_new();
    
    // Если выбраны все клиенты
    if (showAllClients || clientName === 'ALL') {
        exportAllClientsToExcel(wb, warehouseFilter);
        return;
    }
    
    // Экспорт одного клиента
    const cardData = calculateClientCardData(clientName, warehouseFilter);
    const filterText = warehouseFilter ? ` (${warehouseFilter})` : '';
    const userRole = currentUser.role === 'warehouse' ? ' (Моя группа)' : '';
    
    // Лист 1: Сводка
    const summaryData = [
        ['КАРТОЧКА КЛИЕНТА'],
        ['Клиент:', clientName],
        ['Фильтр:', warehouseFilter || 'Все склады'],
        ['Доступ:', currentUser.role === 'warehouse' ? 'Моя группа складов' : 'Все группы'],
        ['Дата формирования:', new Date().toLocaleString('ru-RU')],
        [],
        ['СВОДКА ПО ДОЛГАМ'],
        ['Общий расход ($):', cardData.totalExpenseAmount.toFixed(2)],
        ['Погашено ($):', cardData.totalPayments.toFixed(2)],
        ['Долг ($):', cardData.debt.toFixed(2)]
    ];
    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Сводка');
    
    // Лист 2: Расходы
    const expenseData = [['Дата', 'Товар', 'Фирма', 'Склад', 'Количество', 'Цена ($)', 'Сумма ($)', 'Примечания', 'Создал']];
    cardData.expense.forEach(item => {
        const editInfo = item.editedBy ? ` (изм: ${item.editedBy})` : '';
        expenseData.push([
            item.date,
            item.product,
            item.company,
            item.warehouse,
            item.quantity,
            item.price,
            item.total || item.totalAmount || 0,
            item.notes || '',
            item.user + editInfo
        ]);
    });
    // Добавляем итоговую строку
    expenseData.push([]);
    expenseData.push(['', '', '', 'ИТОГО:', '', '', cardData.totalExpenseAmount.toFixed(2), '', '']);
    
    const ws2 = XLSX.utils.aoa_to_sheet(expenseData);
    XLSX.utils.book_append_sheet(wb, ws2, 'Расходы');
    
    // Лист 3: Погашения
    const paymentsData = [['Дата', 'Сомони', 'Курс', 'Сумма ($)', 'Примечания', 'Создал']];
    cardData.payments.forEach(item => {
        const editInfo = item.editedBy ? ` (изм: ${item.editedBy})` : '';
        paymentsData.push([
            item.date,
            item.somoni,
            item.rate,
            item.amount,
            item.notes || '',
            item.user + editInfo
        ]);
    });
    // Добавляем итоговую строку
    paymentsData.push([]);
    paymentsData.push(['', '', 'ИТОГО:', cardData.totalPayments.toFixed(2), '', '']);
    
    const ws3 = XLSX.utils.aoa_to_sheet(paymentsData);
    XLSX.utils.book_append_sheet(wb, ws3, 'Погашения');
    
    // Сохранение файла
    const fileName = `Карточка_${clientName}${filterText}${userRole}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
}

// Генерация карточки для всех клиентов
function generateAllClientsCardHtml(warehouseFilter) {
    console.log('🔵 generateAllClientsCardHtml вызвана');
    console.log('🏪 Фильтр склада:', warehouseFilter);
    
    const filterText = warehouseFilter ? ` (Склад: ${warehouseFilter})` : ' (Все склады)';
    const userRole = currentUser.role === 'warehouse' ? ' (Моя группа складов)' : ' (Все группы)';
    
    const yearData = getCurrentYearData();
    let expense = yearData.expense || [];
    let payments = yearData.payments || [];
    
    console.log('📊 Всего расходов:', expense.length);
    console.log('💰 Всего погашений:', payments.length);
    
    // Фильтрация для завсклада
    if (currentUser && currentUser.role === 'warehouse' && currentUser.warehouseGroup) {
        // Получаем список складов пользователя
        const userGroups = Array.isArray(currentUser.warehouseGroup) 
            ? currentUser.warehouseGroup 
            : [currentUser.warehouseGroup];
        
        const userWarehouses = appData.warehouses
            .filter(w => userGroups.includes(w.group))
            .map(w => w.name);
        
        expense = expense.filter(item => userWarehouses.includes(item.warehouse));
    }
    
    // Фильтрация по складу если выбран
    if (warehouseFilter) {
        expense = expense.filter(item => item.warehouse === warehouseFilter);
    }
    
    // Группировка по клиентам
    const clientsData = {};
    
    console.log('📋 Группировка расходов по клиентам...');
    expense.forEach(item => {
        const client = item.client;
        if (!client) {
            console.warn('⚠️ Расход без клиента:', item);
            return;
        }
        if (!clientsData[client]) {
            clientsData[client] = {
                totalExpense: 0,
                totalPayments: 0,
                debt: 0
            };
        }
        const amount = item.total || item.totalAmount || 0;
        clientsData[client].totalExpense += amount;
    });
    
    console.log('💰 Группировка погашений по клиентам...');
    payments.forEach(item => {
        const client = item.client;
        if (!client) {
            console.warn('⚠️ Погашение без клиента:', item);
            return;
        }
        if (!clientsData[client]) {
            clientsData[client] = {
                totalExpense: 0,
                totalPayments: 0,
                debt: 0
            };
        }
        clientsData[client].totalPayments += (item.amount || 0);
    });
    
    console.log('👥 Найдено клиентов:', Object.keys(clientsData).length);
    console.log('📊 Данные клиентов:', clientsData);
    
    // Расчет долгов
    Object.keys(clientsData).forEach(client => {
        clientsData[client].debt = clientsData[client].totalExpense - clientsData[client].totalPayments;
    });
    
    // Сортировка клиентов по долгу (от большего к меньшему)
    const sortedClients = Object.keys(clientsData).sort((a, b) => {
        return clientsData[b].debt - clientsData[a].debt;
    });
    
    // Общие итоги
    let grandTotalExpense = 0;
    let grandTotalPayments = 0;
    let grandTotalDebt = 0;
    
    Object.values(clientsData).forEach(data => {
        grandTotalExpense += data.totalExpense;
        grandTotalPayments += data.totalPayments;
        grandTotalDebt += data.debt;
    });
    
    let html = `
        <div class="p-6">
            <div class="mb-6 bg-blue-50 p-4 rounded-lg">
                <h2 class="text-2xl font-bold text-blue-900 mb-2">👥 Все клиенты</h2>
                <p class="text-sm text-gray-600">${filterText}${userRole}</p>
                <p class="text-sm text-gray-600 mt-1">Всего клиентов: ${sortedClients.length}</p>
            </div>
            
            <!-- Общая сводка -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                    <div class="text-sm text-gray-600 mb-1">Общий расход</div>
                    <div class="text-2xl font-bold text-red-700">${grandTotalExpense.toFixed(2)}</div>
                </div>
                <div class="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <div class="text-sm text-gray-600 mb-1">Погашено</div>
                    <div class="text-2xl font-bold text-green-700">${grandTotalPayments.toFixed(2)}</div>
                </div>
                <div class="bg-${grandTotalDebt > 0 ? 'orange' : 'blue'}-50 p-4 rounded-lg border-l-4 border-${grandTotalDebt > 0 ? 'orange' : 'blue'}-500">
                    <div class="text-sm text-gray-600 mb-1">${grandTotalDebt > 0 ? 'Общий долг' : 'Общая переплата'}</div>
                    <div class="text-2xl font-bold text-${grandTotalDebt > 0 ? 'orange' : 'blue'}-700">${Math.abs(grandTotalDebt).toFixed(2)}</div>
                </div>
            </div>
            
            <!-- Таблица клиентов -->
            <div class="mb-6">
                <h3 class="text-xl font-bold mb-4 text-gray-800">📊 Сводка по клиентам</h3>
                <div class="overflow-x-auto bg-white rounded-lg shadow">
                    <table class="w-full">
                        <thead class="bg-gray-100">
                            <tr>
                                <th class="p-3 text-left">№</th>
                                <th class="p-3 text-left">Клиент</th>
                                <th class="p-3 text-right">Расход ($)</th>
                                <th class="p-3 text-right">Погашено ($)</th>
                                <th class="p-3 text-right">Долг ($)</th>
                                <th class="p-3 text-center">Статус</th>
                            </tr>
                        </thead>
                        <tbody>
    `;
    
    sortedClients.forEach((client, index) => {
        const data = clientsData[client];
        const debtColor = data.debt > 0 ? 'text-red-600' : (data.debt < 0 ? 'text-blue-600' : 'text-gray-600');
        const statusIcon = data.debt > 0 ? '⚠️' : (data.debt < 0 ? '✅' : '➖');
        
        html += `
            <tr class="border-b hover:bg-gray-50">
                <td class="p-3">${index + 1}</td>
                <td class="p-3 font-semibold">${client}</td>
                <td class="p-3 text-right">${data.totalExpense.toFixed(2)}</td>
                <td class="p-3 text-right">${data.totalPayments.toFixed(2)}</td>
                <td class="p-3 text-right font-bold ${debtColor}">${Math.abs(data.debt).toFixed(2)}</td>
                <td class="p-3 text-center">${statusIcon}</td>
            </tr>
        `;
    });
    
    html += `
                        </tbody>
                        <tfoot class="bg-gray-100 font-bold">
                            <tr>
                                <td class="p-3" colspan="2">ИТОГО:</td>
                                <td class="p-3 text-right">${grandTotalExpense.toFixed(2)}</td>
                                <td class="p-3 text-right">${grandTotalPayments.toFixed(2)}</td>
                                <td class="p-3 text-right ${grandTotalDebt > 0 ? 'text-red-600' : 'text-blue-600'}">${Math.abs(grandTotalDebt).toFixed(2)}</td>
                                <td class="p-3"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
    `;
    
    // Детальная информация по каждому клиенту
    html += `<div class="mb-6"><h3 class="text-xl font-bold mb-4 text-gray-800">📋 Детальная информация по клиентам</h3>`;
    
    sortedClients.forEach((clientName, index) => {
        const data = clientsData[clientName];
        
        // Получаем расходы и погашения для этого клиента
        const clientExpense = expense.filter(item => item.client === clientName);
        const clientPayments = payments.filter(item => item.client === clientName);
        
        // Группировка расходов по складам
        const expenseByWarehouse = {};
        clientExpense.forEach(item => {
            const warehouse = item.warehouse;
            if (!expenseByWarehouse[warehouse]) {
                expenseByWarehouse[warehouse] = {
                    items: [],
                    totalAmount: 0
                };
            }
            expenseByWarehouse[warehouse].items.push(item);
            expenseByWarehouse[warehouse].totalAmount += (item.total || item.totalAmount || 0);
        });
        
        html += `
            <div class="mb-6 border-2 border-gray-200 rounded-lg p-4 bg-gray-50">
                <div class="flex justify-between items-center mb-4 bg-blue-100 p-3 rounded">
                    <h4 class="text-lg font-bold text-blue-900">${index + 1}. ${clientName}</h4>
                    <div class="text-right">
                        <div class="text-sm text-gray-600">Долг:</div>
                        <div class="text-xl font-bold ${data.debt > 0 ? 'text-red-600' : 'text-blue-600'}">
                            ${Math.abs(data.debt).toFixed(2)} $
                        </div>
                    </div>
                </div>
        `;
        
        // Расходы по складам
        if (Object.keys(expenseByWarehouse).length > 0) {
            html += `<div class="mb-4"><h5 class="font-semibold mb-2 text-gray-700">📦 Расходы:</h5>`;
            
            Object.keys(expenseByWarehouse).sort().forEach(warehouse => {
                const whData = expenseByWarehouse[warehouse];
                html += `
                    <div class="mb-3 bg-white rounded border">
                        <div class="bg-gray-100 p-2 font-semibold flex justify-between text-sm">
                            <span>🏪 ${warehouse}</span>
                            <span class="text-blue-700">${whData.totalAmount.toFixed(2)} $</span>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-sm">
                                <thead class="bg-gray-50">
                                    <tr>
                                        <th class="p-2 text-left">Дата</th>
                                        <th class="p-2 text-left">Товар</th>
                                        <th class="p-2 text-left">Фирма</th>
                                        <th class="p-2 text-right">Кол-во</th>
                                        <th class="p-2 text-right">Цена</th>
                                        <th class="p-2 text-right">Сумма</th>
                                    </tr>
                                </thead>
                                <tbody>
                `;
                
                whData.items.forEach(item => {
                    html += `
                        <tr class="border-t hover:bg-gray-50">
                            <td class="p-2">${item.date}</td>
                            <td class="p-2">${item.product}</td>
                            <td class="p-2">${item.company}</td>
                            <td class="p-2 text-right">${(item.quantity || 0).toFixed(2)}</td>
                            <td class="p-2 text-right">${(item.price || 0).toFixed(2)}</td>
                            <td class="p-2 text-right font-semibold">${(item.total || item.totalAmount || 0).toFixed(2)}</td>
                        </tr>
                    `;
                });
                
                html += `
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
            });
            
            html += `</div>`;
        } else {
            html += `<div class="mb-4 text-gray-500 italic">Нет расходов</div>`;
        }
        
        // Погашения
        if (clientPayments.length > 0) {
            html += `
                <div class="mb-2">
                    <h5 class="font-semibold mb-2 text-gray-700">💰 Погашения:</h5>
                    <div class="overflow-x-auto bg-white rounded border">
                        <table class="w-full text-sm">
                            <thead class="bg-green-50">
                                <tr>
                                    <th class="p-2 text-left">Дата</th>
                                    <th class="p-2 text-right">Сомони</th>
                                    <th class="p-2 text-right">Курс</th>
                                    <th class="p-2 text-right">Сумма ($)</th>
                                    <th class="p-2 text-left">Примечания</th>
                                </tr>
                            </thead>
                            <tbody>
            `;
            
            clientPayments.forEach(item => {
                html += `
                    <tr class="border-t hover:bg-green-50">
                        <td class="p-2">${item.date}</td>
                        <td class="p-2 text-right">${(item.somoni || 0).toFixed(2)}</td>
                        <td class="p-2 text-right">${(item.rate || 0).toFixed(2)}</td>
                        <td class="p-2 text-right font-semibold text-green-700">${(item.amount || 0).toFixed(2)}</td>
                        <td class="p-2">${item.notes || '-'}</td>
                    </tr>
                `;
            });
            
            html += `
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        } else {
            html += `<div class="mb-2 text-gray-500 italic">Нет погашений</div>`;
        }
        
        html += `</div>`;
    });
    
    html += `</div></div>`;
    
    return html;
}

// Экспорт всех клиентов в Excel
function exportAllClientsToExcel(wb, warehouseFilter) {
    const filterText = warehouseFilter ? ` (${warehouseFilter})` : '';
    const userRole = currentUser.role === 'warehouse' ? ' (Моя группа)' : '';
    
    const yearData = getCurrentYearData();
    let expense = yearData.expense || [];
    let payments = yearData.payments || [];
    
    // Фильтрация для завсклада
    if (currentUser && currentUser.role === 'warehouse' && currentUser.warehouseGroup) {
        const userGroups = Array.isArray(currentUser.warehouseGroup) 
            ? currentUser.warehouseGroup 
            : [currentUser.warehouseGroup];
        
        const userWarehouses = appData.warehouses
            .filter(w => userGroups.includes(w.group))
            .map(w => w.name);
        
        expense = expense.filter(item => userWarehouses.includes(item.warehouse));
    }
    
    // Фильтрация по складу
    if (warehouseFilter) {
        expense = expense.filter(item => item.warehouse === warehouseFilter);
    }
    
    // Группировка по клиентам
    const clientsData = {};
    
    expense.forEach(item => {
        const client = item.client;
        if (!client) return;
        if (!clientsData[client]) {
            clientsData[client] = {
                totalExpense: 0,
                totalPayments: 0,
                debt: 0,
                expense: [],
                payments: []
            };
        }
        clientsData[client].expense.push(item);
        clientsData[client].totalExpense += (item.total || item.totalAmount || 0);
    });
    
    payments.forEach(item => {
        const client = item.client;
        if (!client) return;
        if (!clientsData[client]) {
            clientsData[client] = {
                totalExpense: 0,
                totalPayments: 0,
                debt: 0,
                expense: [],
                payments: []
            };
        }
        clientsData[client].payments.push(item);
        clientsData[client].totalPayments += (item.amount || 0);
    });
    
    // Расчет долгов
    Object.keys(clientsData).forEach(client => {
        clientsData[client].debt = clientsData[client].totalExpense - clientsData[client].totalPayments;
    });
    
    // Сортировка клиентов
    const sortedClients = Object.keys(clientsData).sort((a, b) => {
        return clientsData[b].debt - clientsData[a].debt;
    });
    
    // Общие итоги
    let grandTotalExpense = 0;
    let grandTotalPayments = 0;
    let grandTotalDebt = 0;
    
    Object.values(clientsData).forEach(data => {
        grandTotalExpense += data.totalExpense;
        grandTotalPayments += data.totalPayments;
        grandTotalDebt += data.debt;
    });
    
    // Лист 1: Общая сводка
    const summaryData = [
        ['ВСЕ КЛИЕНТЫ - КАРТОЧКА'],
        ['Фильтр:', warehouseFilter || 'Все склады'],
        ['Доступ:', currentUser.role === 'warehouse' ? 'Моя группа складов' : 'Все группы'],
        ['Дата формирования:', new Date().toLocaleString('ru-RU')],
        ['Всего клиентов:', sortedClients.length],
        [],
        ['ОБЩАЯ СВОДКА'],
        ['Общий расход ($):', grandTotalExpense.toFixed(2)],
        ['Погашено ($):', grandTotalPayments.toFixed(2)],
        ['Общий долг ($):', grandTotalDebt.toFixed(2)],
        [],
        ['СВОДКА ПО КЛИЕНТАМ'],
        ['№', 'Клиент', 'Расход ($)', 'Погашено ($)', 'Долг ($)']
    ];
    
    sortedClients.forEach((client, index) => {
        const data = clientsData[client];
        summaryData.push([
            index + 1,
            client,
            data.totalExpense.toFixed(2),
            data.totalPayments.toFixed(2),
            data.debt.toFixed(2)
        ]);
    });
    
    summaryData.push([]);
    summaryData.push(['ИТОГО:', '', grandTotalExpense.toFixed(2), grandTotalPayments.toFixed(2), grandTotalDebt.toFixed(2)]);
    
    const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, ws1, 'Общая сводка');
    
    // Листы для каждого клиента
    sortedClients.forEach((clientName, index) => {
        const data = clientsData[clientName];
        
        // Лист расходов клиента
        const expenseData = [
            [`КЛИЕНТ: ${clientName}`],
            ['Расход ($):', data.totalExpense.toFixed(2)],
            ['Погашено ($):', data.totalPayments.toFixed(2)],
            ['Долг ($):', data.debt.toFixed(2)],
            [],
            ['РАСХОДЫ'],
            ['Дата', 'Товар', 'Фирма', 'Склад', 'Количество', 'Цена ($)', 'Сумма ($)', 'Примечания', 'Создал']
        ];
        
        data.expense.forEach(item => {
            const editInfo = item.editedBy ? ` (изм: ${item.editedBy})` : '';
            expenseData.push([
                item.date,
                item.product,
                item.company,
                item.warehouse,
                item.quantity,
                item.price,
                item.total || item.totalAmount || 0,
                item.notes || '',
                (item.user || '') + editInfo
            ]);
        });
        
        expenseData.push([]);
        expenseData.push(['', '', '', '', '', 'ИТОГО:', data.totalExpense.toFixed(2), '', '']);
        expenseData.push([]);
        expenseData.push(['ПОГАШЕНИЯ']);
        expenseData.push(['Дата', 'Сомони', 'Курс', 'Сумма ($)', 'Примечания', 'Создал']);
        
        data.payments.forEach(item => {
            const editInfo = item.editedBy ? ` (изм: ${item.editedBy})` : '';
            expenseData.push([
                item.date,
                item.somoni,
                item.rate,
                item.amount,
                item.notes || '',
                (item.user || '') + editInfo
            ]);
        });
        
        expenseData.push([]);
        expenseData.push(['', '', 'ИТОГО:', data.totalPayments.toFixed(2), '', '']);
        
        const wsClient = XLSX.utils.aoa_to_sheet(expenseData);
        
        // Ограничиваем длину имени листа (Excel максимум 31 символ)
        let sheetName = `${index + 1}. ${clientName}`;
        if (sheetName.length > 31) {
            sheetName = sheetName.substring(0, 28) + '...';
        }
        
        XLSX.utils.book_append_sheet(wb, wsClient, sheetName);
    });
    
    // Сохранение файла
    const fileName = `Все_клиенты${filterText}${userRole}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
}

console.log('✅ Модуль карточки клиента загружен');
