# PowerShell скрипт для синхронизации всех версий проекта
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🔄 СИНХРОНИЗАЦИЯ ВСЕХ ВЕРСИЙ ПРОЕКТА AVESTA2026" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Шаг 1: Основные файлы
Write-Host "📦 Шаг 1: Синхронизация основных файлов..." -ForegroundColor Yellow
Write-Host ""

Write-Host "  → Копирование index.html..." -ForegroundColor Gray
Copy-Item -Path "index.html" -Destination "www\index.html" -Force
Copy-Item -Path "index.html" -Destination "avesta\www\index.html" -Force
Write-Host "  ✅ index.html синхронизирован" -ForegroundColor Green

Write-Host "  → Копирование JS файлов..." -ForegroundColor Gray
Copy-Item -Path "mobile-menu-complete.js" -Destination "www\mobile-menu-complete.js" -Force
Copy-Item -Path "mobile-menu-complete.js" -Destination "avesta\www\mobile-menu-complete.js" -Force
Copy-Item -Path "simple-excel.js" -Destination "www\simple-excel.js" -Force
Copy-Item -Path "simple-excel.js" -Destination "avesta\www\simple-excel.js" -Force
Copy-Item -Path "password-hash-functions.js" -Destination "www\password-hash-functions.js" -Force
Copy-Item -Path "realtime-sync.js" -Destination "www\realtime-sync.js" -Force
Copy-Item -Path "realtime-sync.js" -Destination "avesta\www\realtime-sync.js" -Force
Write-Host "  ✅ JS файлы синхронизированы (включая realtime-sync.js)" -ForegroundColor Green

Write-Host "  → Копирование CSS файлов..." -ForegroundColor Gray
Copy-Item -Path "offline-styles.css" -Destination "www\offline-styles.css" -Force
Copy-Item -Path "offline-styles.css" -Destination "avesta\www\offline-styles.css" -Force
Write-Host "  ✅ CSS файлы синхронизированы" -ForegroundColor Green

# Шаг 2: PWA файлы
Write-Host ""
Write-Host "📱 Шаг 2: Синхронизация PWA файлов..." -ForegroundColor Yellow
Write-Host ""

Write-Host "  → Копирование manifest.json..." -ForegroundColor Gray
Copy-Item -Path "manifest.json" -Destination "www\manifest.json" -Force
Copy-Item -Path "manifest.json" -Destination "avesta\www\manifest.json" -Force
Write-Host "  ✅ manifest.json синхронизирован" -ForegroundColor Green

Write-Host "  → Копирование Service Worker..." -ForegroundColor Gray
Copy-Item -Path "sw.js" -Destination "www\sw.js" -Force
Copy-Item -Path "sw.js" -Destination "avesta\www\sw.js" -Force
Write-Host "  ✅ Service Worker синхронизирован" -ForegroundColor Green

# Шаг 3: Конфигурационные файлы
Write-Host ""
Write-Host "⚙️ Шаг 3: Синхронизация конфигурационных файлов..." -ForegroundColor Yellow
Write-Host ""

Write-Host "  → Копирование capacitor.config.json..." -ForegroundColor Gray
Copy-Item -Path "capacitor.config.json" -Destination "avesta\capacitor.config.json" -Force
Write-Host "  ✅ capacitor.config.json синхронизирован" -ForegroundColor Green

Write-Host "  → Копирование package.json..." -ForegroundColor Gray
Copy-Item -Path "package.json" -Destination "avesta\package.json" -Force
Write-Host "  ✅ package.json синхронизирован" -ForegroundColor Green

Write-Host "  → Копирование скриптов сборки..." -ForegroundColor Gray
Copy-Item -Path "build-apk.bat" -Destination "avesta\build-apk.bat" -Force
Copy-Item -Path "run-android.bat" -Destination "avesta\run-android.bat" -Force
Copy-Item -Path "build-ios.bat" -Destination "avesta\build-ios.bat" -Force
Copy-Item -Path "run-ios.bat" -Destination "avesta\run-ios.bat" -Force
Write-Host "  ✅ Скрипты сборки синхронизированы" -ForegroundColor Green

# Шаг 4: Документация
Write-Host ""
Write-Host "📄 Шаг 4: Синхронизация документации..." -ForegroundColor Yellow
Write-Host ""

Write-Host "  → Копирование документов..." -ForegroundColor Gray
Copy-Item -Path "PROJECT-STATUS.txt" -Destination "avesta\PROJECT-STATUS.txt" -Force
Copy-Item -Path "ПРОВЕРКА-ПРОЕКТА.txt" -Destination "avesta\ПРОВЕРКА-ПРОЕКТА.txt" -Force
Copy-Item -Path "firebase-rules-CORRECT.json" -Destination "avesta\firebase-rules-CORRECT.json" -Force
Write-Host "  ✅ Документация синхронизирована" -ForegroundColor Green

# Шаг 5: Android проект
Write-Host ""
Write-Host "🤖 Шаг 5: Синхронизация Android проекта..." -ForegroundColor Yellow
Write-Host ""

npx cap sync android

# Итоги
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✅ СИНХРОНИЗАЦИЯ ЗАВЕРШЕНА УСПЕШНО!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "📊 Синхронизированные компоненты:" -ForegroundColor White
Write-Host "  ✅ Основные файлы (index.html, JS, CSS)" -ForegroundColor Green
Write-Host "  ✅ PWA файлы (manifest.json, sw.js)" -ForegroundColor Green
Write-Host "  ✅ Конфигурационные файлы" -ForegroundColor Green
Write-Host "  ✅ Документация" -ForegroundColor Green
Write-Host "  ✅ Android проект" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Синхронизированные папки:" -ForegroundColor White
Write-Host "  • www/" -ForegroundColor Cyan
Write-Host "  • avesta/www/" -ForegroundColor Cyan
Write-Host "  • android/app/src/main/assets/public/" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Проект готов к сборке и развертыванию!" -ForegroundColor Green
Write-Host ""
