const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create directory if it doesn't exist
const iconDir = path.join(__dirname, '..', 'build', 'icons');
if (!fs.existsSync(iconDir)) {
  fs.mkdirSync(iconDir, { recursive: true });
}

// Create icon sizes needed for Windows
const sizes = [16, 24, 32, 48, 64, 128, 256];

function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#6366f1'); // Indigo
  gradient.addColorStop(1, '#8b5cf6'); // Purple
  
  // Fill background
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // Draw a polaroid frame
  const margin = size * 0.1;
  const frameWidth = size - margin * 2;
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(margin, margin, frameWidth, frameWidth);
  
  // Draw the photo area (slightly darker)
  const photoMargin = size * 0.15;
  const photoWidth = size - photoMargin * 2;
  const photoHeight = size * 0.6;
  
  ctx.fillStyle = '#242339'; // Dark background color
  ctx.fillRect(photoMargin, photoMargin, photoWidth, photoHeight);
  
  // Draw a "flash" effect
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.arc(size * 0.25, size * 0.25, size * 0.1, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;
  
  // Save the image to the build/icons directory
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(iconDir, `${size}x${size}.png`), buffer);
  console.log(`Created ${size}x${size} icon`);
}

// Generate all sizes
sizes.forEach(createIcon);

// Also create a 512x512 version for other platforms
createIcon(512);

console.log('Icon generation complete!');
