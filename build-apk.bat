@echo off
echo 🚀 Сборка APK для Avesta2026...
echo.

echo 📦 Копирование файлов в www...
copy index.html www\index.html
copy *.js www\
copy *.css www\
copy manifest.json www\

echo 🔄 Синхронизация с Android...
npx cap sync android

echo 🏗️ Сборка APK...
cd android
gradlew assembleDebug

echo ✅ APK готов!
echo 📍 Файл находится в: android\app\build\outputs\apk\debug\app-debug.apk

pause