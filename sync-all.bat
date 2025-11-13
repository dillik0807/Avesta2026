@echo off
chcp 65001 >nul
echo.
echo ═══════════════════════════════════════════════════════════
echo 🔄 СИНХРОНИЗАЦИЯ ВСЕХ ВЕРСИЙ ПРОЕКТА AVESTA2026
echo ═══════════════════════════════════════════════════════════
echo.

echo 📦 Шаг 1: Синхронизация основных файлов...
echo.

echo   → Копирование index.html...
copy /Y index.html www\index.html >nul
copy /Y index.html avesta\www\index.html >nul
echo   ✅ index.html синхронизирован

echo   → Копирование JS файлов...
copy /Y mobile-menu-complete.js www\mobile-menu-complete.js >nul
copy /Y mobile-menu-complete.js avesta\www\mobile-menu-complete.js >nul
copy /Y simple-excel.js www\simple-excel.js >nul
copy /Y simple-excel.js avesta\www\simple-excel.js >nul
copy /Y password-hash-functions.js www\password-hash-functions.js >nul
copy /Y realtime-sync.js www\realtime-sync.js >nul
copy /Y realtime-sync.js avesta\www\realtime-sync.js >nul
echo   ✅ JS файлы синхронизированы (включая realtime-sync.js)

echo   → Копирование CSS файлов...
copy /Y offline-styles.css www\offline-styles.css >nul
copy /Y offline-styles.css avesta\www\offline-styles.css >nul
echo   ✅ CSS файлы синхронизированы

echo.
echo 📱 Шаг 2: Синхронизация PWA файлов...
echo.

echo   → Копирование manifest.json...
copy /Y manifest.json www\manifest.json >nul
copy /Y manifest.json avesta\www\manifest.json >nul
echo   ✅ manifest.json синхронизирован

echo   → Копирование Service Worker...
copy /Y sw.js www\sw.js >nul
copy /Y sw.js avesta\www\sw.js >nul
echo   ✅ Service Worker синхронизирован

echo.
echo ⚙️ Шаг 3: Синхронизация конфигурационных файлов...
echo.

echo   → Копирование capacitor.config.json...
copy /Y capacitor.config.json avesta\capacitor.config.json >nul
echo   ✅ capacitor.config.json синхронизирован

echo   → Копирование package.json...
copy /Y package.json avesta\package.json >nul
echo   ✅ package.json синхронизирован

echo   → Копирование скриптов сборки...
copy /Y build-apk.bat avesta\build-apk.bat >nul
copy /Y run-android.bat avesta\run-android.bat >nul
copy /Y build-ios.bat avesta\build-ios.bat >nul
copy /Y run-ios.bat avesta\run-ios.bat >nul
echo   ✅ Скрипты сборки синхронизированы

echo.
echo 📄 Шаг 4: Синхронизация документации...
echo.

echo   → Копирование документов...
copy /Y PROJECT-STATUS.txt avesta\PROJECT-STATUS.txt >nul
copy /Y ПРОВЕРКА-ПРОЕКТА.txt avesta\ПРОВЕРКА-ПРОЕКТА.txt >nul
copy /Y firebase-rules-CORRECT.json avesta\firebase-rules-CORRECT.json >nul
echo   ✅ Документация синхронизирована

echo.
echo 🤖 Шаг 5: Синхронизация Android проекта...
echo.

call npx cap sync android

echo.
echo ═══════════════════════════════════════════════════════════
echo ✅ СИНХРОНИЗАЦИЯ ЗАВЕРШЕНА УСПЕШНО!
echo ═══════════════════════════════════════════════════════════
echo.
echo 📊 Синхронизированные компоненты:
echo   ✅ Основные файлы (index.html, JS, CSS)
echo   ✅ PWA файлы (manifest.json, sw.js)
echo   ✅ Конфигурационные файлы
echo   ✅ Документация
echo   ✅ Android проект
echo.
echo 📍 Синхронизированные папки:
echo   • www/
echo   • avesta/www/
echo   • android/app/src/main/assets/public/
echo.
echo 🚀 Проект готов к сборке и развертыванию!
echo.

pause
