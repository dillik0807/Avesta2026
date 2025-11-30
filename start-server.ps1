# PowerShell скрипт для запуска локального сервера
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🌐 ЗАПУСК ЛОКАЛЬНОГО СЕРВЕРА" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Проверка Python
Write-Host "Проверка наличия Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "✅ Python найден: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python не найден!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Установите Python с https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host "Или используйте другой способ запуска (см. README)" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Нажмите Enter для выхода"
    exit 1
}

Write-Host ""
Write-Host "🚀 Запуск сервера на http://localhost:8000" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Откройте браузер и перейдите по адресу:" -ForegroundColor Cyan
Write-Host "   http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "⚠️ Для остановки сервера нажмите Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Запуск сервера
python -m http.server 8000
