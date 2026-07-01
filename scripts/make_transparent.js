import fs from 'fs';
import path from 'path';

function makeTransparent(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      makeTransparent(fullPath);
    } else if (fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Make background transparent for elements that were black
      // This is a bit aggressive but we want the Spline scene to show through.
      // We will only target the main section wrappers and cards to start.
      content = content.replace(/background:\s*var\(--color-black\);/g, 'background: rgba(0, 0, 0, 0.4);'); // semi-transparent instead of fully black so text is readable
      content = content.replace(/background-color:\s*var\(--color-black\);/g, 'background-color: rgba(0, 0, 0, 0.4);');
      
      fs.writeFileSync(fullPath, content);
      console.log(`Updated transparent ${fullPath}`);
    }
  }
}

makeTransparent('./src');
