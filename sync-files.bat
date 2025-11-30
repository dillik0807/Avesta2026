@echo off
echo ========================================
echo Синхронизация файлов между проектами
echo ========================================
echo.

echo Копирование index.html...
copy /Y www\index.html avesta\www\index.html
copy /Y www\index.html index.html

echo Копирование client-card.js...
copy /Y www\client-card.js avesta\www\client-card.js
copy /Y www\client-card.js client-card.js

echo Копирование mobile-menu-complete.js...
copy /Y www\mobile-menu-complete.js avesta\www\mobile-menu-complete.js
copy /Y www\mobile-menu-complete.js mobile-menu-complete.js

echo Копирование realtime-sync.js...
copy /Y www\realtime-sync.js avesta\www\realtime-sync.js
copy /Y www\realtime-sync.js realtime-sync.js

echo Копирование simple-excel.js...
copy /Y www\simple-excel.js avesta\www\simple-excel.js
copy /Y www\simple-excel.js simple-excel.js

echo Копирование sw.js...
copy /Y www\sw.js avesta\www\sw.js
copy /Y www\sw.js sw.js

echo Копирование manifest.json...
copy /Y www\manifest.json avesta\www\manifest.json
copy /Y www\manifest.json manifest.json

echo Копирование offline-styles.css...
copy /Y www\offline-styles.css avesta\www\offline-styles.css
copy /Y www\offline-styles.css offline-styles.css

echo.
echo ========================================
echo Синхронизация завершена!
echo ========================================
pause
