// Функции хэширования паролей для копирования в другие файлы

// Простое хэширование пароля (SHA-256)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Проверка пароля (поддерживает старые незахэшированные и новые хэшированные)
async function verifyPassword(inputPassword, storedPassword) {
    // Если пароль уже хэширован (64 символа hex)
    if (storedPassword.length === 64 && /^[a-f0-9]+$/.test(storedPassword)) {
        const inputHash = await hashPassword(inputPassword);
        return inputHash === storedPassword;
    }
    // Старый формат - прямое сравнение
    return inputPassword === storedPassword;
}
