// Упрощенная библиотека для экспорта в Excel без зависимостей
// Заменяет XLSX для автономной работы

window.XLSX = {
    utils: {
        table_to_sheet: function(table) {
            const rows = [];
            const tableRows = table.querySelectorAll('tr');
            
            tableRows.forEach(tr => {
                const row = [];
                const cells = tr.querySelectorAll('th, td');
                cells.forEach(cell => {
                    row.push(cell.textContent.trim());
                });
                rows.push(row);
            });
            
            return { data: rows };
        },
        
        json_to_sheet: function(data) {
            if (!data || data.length === 0) return { data: [] };
            
            const headers = Object.keys(data[0]);
            const rows = [headers];
            
            data.forEach(item => {
                const row = headers.map(header => item[header] || '');
                rows.push(row);
            });
            
            return { data: rows };
        },
        
        sheet_to_csv: function(sheet) {
            if (!sheet.data) return '';
            
            return sheet.data.map(row => 
                row.map(cell => {
                    // Экранируем запятые и кавычки
                    const cellStr = String(cell || '');
                    if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
                        return '"' + cellStr.replace(/"/g, '""') + '"';
                    }
                    return cellStr;
                }).join(',')
            ).join('\n');
        }
    },
    
    write: function(workbook, options) {
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        
        if (options.type === 'binary') {
            // Создаем простой Excel файл в формате HTML
            const htmlContent = this.createExcelHTML(sheet);
            return htmlContent;
        }
        
        return this.utils.sheet_to_csv(sheet);
    },
    
    createExcelHTML: function(sheet) {
        if (!sheet.data) return '';
        
        let html = `
            <html xmlns:o="urn:schemas-microsoft-com:office:office" 
                  xmlns:x="urn:schemas-microsoft-com:office:excel" 
                  xmlns="http://www.w3.org/TR/REC-html40">
            <head>
                <meta charset="UTF-8">
                <style>
                    table { border-collapse: collapse; width: 100%; }
                    th, td { border: 1px solid #000; padding: 5px; text-align: left; }
                    th { background-color: #f0f0f0; font-weight: bold; }
                </style>
            </head>
            <body>
                <table>
        `;
        
        sheet.data.forEach((row, index) => {
            const tag = index === 0 ? 'th' : 'td';
            html += '<tr>';
            row.forEach(cell => {
                html += `<${tag}>${this.escapeHtml(cell || '')}</${tag}>`;
            });
            html += '</tr>';
        });
        
        html += `
                </table>
            </body>
            </html>
        `;
        
        return html;
    },
    
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Функция для скачивания файла
window.saveAs = function(blob, filename) {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Освобождаем память
    setTimeout(() => URL.revokeObjectURL(url), 100);
};

// Создание Blob для Excel файлов
window.createExcelBlob = function(content) {
    return new Blob([content], {
        type: 'application/vnd.ms-excel;charset=utf-8'
    });
};

// Создание Blob для CSV файлов  
window.createCSVBlob = function(content) {
    return new Blob(['\ufeff' + content], {
        type: 'text/csv;charset=utf-8'
    });
};

console.log('✅ Упрощенная XLSX библиотека загружена для автономной работы');