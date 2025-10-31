# 📱 Avesta2026 - Сборка Android APK

## ✅ Проект готов к использованию!

### 📦 Готовый APK файл:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

### 🚀 Команды для сборки:

#### Быстрая сборка APK:
```bash
.\build-apk.bat
```

#### Запуск на подключенном устройстве:
```bash
.\run-android.bat
```

#### Ручная сборка:
```bash
# 1. Копирование файлов
copy index.html www\index.html
copy *.js www\
copy *.css www\

# 2. Синхронизация
npx cap sync android

# 3. Сборка APK
cd android
.\gradlew assembleDebug
```

### 📋 Информация о приложении:
- **Название:** Avesta2026
- **Package ID:** com.avesta.warehouse
- **Версия:** 1.0.0
- **Платформа:** Android
- **Размер проекта:** ~1.5 MB

### 🔧 Возможности:
- ✅ Мобильное меню исправлено
- ✅ Адаптивный дизайн
- ✅ Офлайн режим
- ✅ Firebase интеграция
- ✅ Экспорт в Excel
- ✅ PWA функциональность

### 📱 Установка APK:
1. Скопируйте файл `app-debug.apk` на Android устройство
2. Разрешите установку из неизвестных источников
3. Установите приложение
4. Готово! 🎉

### 🛠️ Для разработки:
- Используйте `npx cap run android` для live reload
- Используйте `npx cap open android` для открытия в Android Studio