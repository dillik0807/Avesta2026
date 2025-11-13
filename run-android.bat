@echo off
echo 🚀 Запуск Avesta2026 на Android устройстве...
echo.

echo 📦 Подготовка файлов...
copy index.html www\index.html
copy *.js www\
copy *.css www\
copy manifest.json www\

echo 🔄 Синхронизация с Android...
npx cap sync android

echo 📱 Запуск на устройстве...
npx cap run android

pause