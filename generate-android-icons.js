const fs = require('fs');
const { createCanvas } = require('canvas');

// Размеры иконок для Android
const iconSizes = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192
};

function drawIcon(canvas, size) {
    const ctx = canvas.getContext('2d');
    
    // Создаем градиенты
    const bgGradient = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    bgGradient.addColorStop(0, '#1e40af');
    bgGradient.addColorStop(1, '#0f172a');
    
    const goldGradient = ctx.createLinearGradient(0, 0, size, size);
    goldGradient.addColorStop(0, '#FFD700');
    goldGradient.addColorStop(0.25, '#FFA500');
    goldGradient.addColorStop(0.5, '#FFD700');
    goldGradient.addColorStop(0.75, '#B8860B');
    goldGradient.addColorStop(1, '#DAA520');
    
    // Фон с закругленными углами
    const radius = size * 0.125;
    ctx.fillStyle = bgGradient;
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, radius);
    ctx.fill();
    
    // Рамка
    ctx.strokeStyle = goldGradient;
    ctx.lineWidth = Math.max(2, size * 0.008);
    ctx.beginPath();
    ctx.roundRect(size * 0.0625, size * 0.0625, size * 0.875, size * 0.875, radius * 0.5);
    ctx.stroke();
    
    // Текст "Avesta"
    ctx.fillStyle = goldGradient;
    ctx.font = `900 ${Math.max(12, size * 0.125)}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Тень для текста
    ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    ctx.shadowBlur = Math.max(1, size * 0.006);
    ctx.shadowOffsetX = Math.max(1, size * 0.004);
    ctx.shadowOffsetY = Math.max(1, size * 0.004);
    
    ctx.fillText('Avesta', size/2, size * 0.55);
    
    // Подзаголовок "2026"
    ctx.font = `bold ${Math.max(8, size * 0.0625)}px Arial`;
    ctx.globalAlpha = 0.8;
    ctx.fillText('2026', size/2, size * 0.665);
    
    // Убираем тень и прозрачность
    ctx.shadowColor = 'transparent';
    ctx.globalAlpha = 1;
    
    // Декоративные элементы
    ctx.fillStyle = goldGradient;
    ctx.globalAlpha = 0.6;
    
    const dotSize = Math.max(2, size * 0.016);
    const margin = size * 0.25;
    
    // Углы
    ctx.beginPath();
    ctx.arc(margin, margin, dotSize, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(size - margin, margin, dotSize, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(margin, size - margin, dotSize, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(size - margin, size - margin, dotSize, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.globalAlpha = 1;
}

// Создаем простую версию без canvas (для Windows)
function createSimpleIcon(size, folder) {
    const svgContent = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
      <stop offset="25%" style="stop-color:#FFA500;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#FFD700;stop-opacity:1" />
      <stop offset="75%" style="stop-color:#B8860B;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#DAA520;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="backgroundGradient" cx="50%" cy="50%" r="50%">
      <stop offset="0%" style="stop-color:#1e40af;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
    </radialGradient>
    <filter id="textShadow">
      <feDropShadow dx="${size * 0.004}" dy="${size * 0.004}" stdDeviation="${size * 0.006}" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.125}" fill="url(#backgroundGradient)"/>
  <rect x="${size * 0.0625}" y="${size * 0.0625}" width="${size * 0.875}" height="${size * 0.875}" rx="${size * 0.0625}" fill="none" stroke="url(#goldGradient)" stroke-width="${Math.max(2, size * 0.008)}"/>
  <text x="${size/2}" y="${size * 0.55}" text-anchor="middle" fill="url(#goldGradient)" font-family="Arial" font-size="${Math.max(12, size * 0.125)}" font-weight="900" filter="url(#textShadow)">Avesta</text>
  <text x="${size/2}" y="${size * 0.665}" text-anchor="middle" fill="url(#goldGradient)" font-family="Arial" font-size="${Math.max(8, size * 0.0625)}" font-weight="bold" opacity="0.8">2026</text>
  <circle cx="${size * 0.25}" cy="${size * 0.25}" r="${Math.max(2, size * 0.016)}" fill="url(#goldGradient)" opacity="0.6"/>
  <circle cx="${size * 0.75}" cy="${size * 0.25}" r="${Math.max(2, size * 0.016)}" fill="url(#goldGradient)" opacity="0.6"/>
  <circle cx="${size * 0.25}" cy="${size * 0.75}" r="${Math.max(2, size * 0.016)}" fill="url(#goldGradient)" opacity="0.6"/>
  <circle cx="${size * 0.75}" cy="${size * 0.75}" r="${Math.max(2, size * 0.016)}" fill="url(#goldGradient)" opacity="0.6"/>
</svg>`;
    
    const filePath = `android/app/src/main/res/${folder}/ic_launcher.svg`;
    fs.writeFileSync(filePath, svgContent);
    console.log(`✅ Создана иконка: ${filePath}`);
}

// Генерируем иконки для всех размеров
Object.entries(iconSizes).forEach(([folder, size]) => {
    try {
        createSimpleIcon(size, folder);
    } catch (error) {
        console.error(`❌ Ошибка создания иконки ${folder}:`, error.message);
    }
});

console.log('🎉 Все иконки созданы!');