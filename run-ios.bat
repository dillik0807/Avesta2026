@echo off
echo 🍎 Запуск Avesta2026 на iOS симуляторе...
echo.

echo 📦 Подготовка файлов...
copy index.html www\index.html
copy *.js www\
copy *.css www\

echo 🔄 Синхронизация...
npx cap sync ios

echo 📱 Запуск на iOS симуляторе...
npx cap run ios

pause