import fs from 'fs';
import path from 'path';

function removeBoxShadow(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      removeBoxShadow(fullPath);
    } else if (fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      // Remove all lines containing box-shadow
      const lines = content.split('\n');
      const newLines = lines.filter(line => !line.includes('box-shadow'));
      if (lines.length !== newLines.length) {
        fs.writeFileSync(fullPath, newLines.join('\n'));
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

removeBoxShadow('./src');
