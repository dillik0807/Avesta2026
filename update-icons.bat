@echo off
echo 🎨 Обновление иконок Avesta...
echo.

echo 📁 Копирование SVG иконки в ресурсы...
copy icon-avesta.svg android\app\src\main\res\drawable\ic_launcher.svg

echo 🔄 Синхронизация проекта...
npx cap sync android

echo ✅ Иконки обновлены!
echo 💡 Откройте create-icons.html в браузере для создания PNG иконок
echo 💡 Или используйте Android Studio для автоматической генерации

pause