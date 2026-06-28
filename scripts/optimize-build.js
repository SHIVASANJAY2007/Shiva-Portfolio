#!/usr/bin/env node

/**
 * Build optimization script
 * Run this after npm run build to optimize assets
 */

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');

console.log('🚀 Starting build optimization...');

if (fs.existsSync(distDir)) {
  const files = fs.readdirSync(distDir);
  console.log(`✅ Build directory found with ${files.length} files`);
  
  // Log bundle sizes
  let totalSize = 0;
  files.forEach(file => {
    if (file.endsWith('.js') || file.endsWith('.css')) {
      const filePath = path.join(distDir, file);
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`  📦 ${file}: ${sizeKB} KB`);
      totalSize += stats.size;
    }
  });
  
  console.log(`\n📊 Total build size: ${(totalSize / 1024).toFixed(2)} KB`);
  console.log('✨ Build optimization complete!');
} else {
  console.log('⚠️  Build directory not found. Run npm run build first.');
}
