import fs from 'fs';
import path from 'path';

function replaceVarsInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceVarsInDir(fullPath);
    } else if (fullPath.endsWith('.module.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let newContent = content
        .replace(/var\(--color-black\)/g, 'var(--color-bg)')
        .replace(/var\(--color-white\)/g, 'var(--color-text)')
        // For cards or inner containers, we might want surface
        .replace(/rgba\(255,255,255,/g, 'rgba(0,0,0,') // invert semi-transparent white to semi-transparent black
        .replace(/rgba\(255,\s*255,\s*255,/g, 'rgba(0,0,0,');
        
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Updated colors in ${fullPath}`);
      }
    }
  }
}

replaceVarsInDir('./src/components');
