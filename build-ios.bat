@echo off
echo 🍎 Сборка iOS версии Avesta2026...
echo.

echo 📦 Подготовка файлов...
copy index.html www\index.html
copy *.js www\
copy *.css www\
copy manifest.json www\

echo 📱 Добавление iOS платформы...
npx cap add ios

echo 🔄 Синхронизация с iOS...
npx cap sync ios

echo 🚀 Открытие в Xcode...
npx cap open ios

echo ✅ iOS проект готов!
echo 💡 Используйте Xcode для сборки и тестирования

pause