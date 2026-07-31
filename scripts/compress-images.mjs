import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const dir = './public/projects';

async function compressImages() {
  try {
    const files = await fs.readdir(dir);
    for (const file of files) {
      if (file.endsWith('.png')) {
        const inputPath = path.join(dir, file);
        const outputPath = path.join(dir, file.replace('.png', '.webp'));
        
        console.log(`Converting ${inputPath} to ${outputPath}...`);
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);
          
        console.log(`Deleted ${inputPath}`);
        await fs.unlink(inputPath);
      }
    }
    console.log('All images compressed to WebP.');
  } catch (error) {
    console.error('Error compressing images:', error);
  }
}

compressImages();
