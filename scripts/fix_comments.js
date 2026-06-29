import fs from 'fs';
import path from 'path';

function fixComments(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixComments(fullPath);
    } else if (fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix HTML comments in JSX
      const original = content;
      content = content.replace(/<!--(.*?)-->/g, '{/*$1*/}');
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Fixed comments in ${fullPath}`);
      }
    }
  }
}

fixComments('./src/components/sections');
