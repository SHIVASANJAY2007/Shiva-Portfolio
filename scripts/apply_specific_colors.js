import fs from 'fs';

function applyTheme(filePath, bg, text, glitch) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // 1. Replace background-color of the main section
  content = content.replace(/background-color:\s*#[a-fA-F0-9]+;.*?(\n| \/\*)/, `background-color: ${bg};$1`);
  
  // 2. Replace text colors
  content = content.replace(/var\(--color-text\)/g, text);
  content = content.replace(/var\(--color-gray-200\)/g, text);
  content = content.replace(/var\(--color-gray-300\)/g, text);
  content = content.replace(/var\(--color-gray-400\)/g, text);
  
  // 3. Replace glitch/accent colors
  content = content.replace(/var\(--color-primary\)/g, glitch);
  content = content.replace(/var\(--color-primary-dark\)/g, glitch);
  content = content.replace(/var\(--color-gray-500\)/g, glitch);

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
}

applyTheme('./src/components/sections/About.module.css', '#FBF5A7', '#B331F1', '#FF62BB');
applyTheme('./src/components/sections/Skills.module.css', '#9FA1FF', '#AEE2FF', '#D9F9DF');
applyTheme('./src/components/sections/Projects.module.css', '#D92243', '#F69D39', '#FFF5E5');
applyTheme('./src/components/sections/Experience.module.css', '#00F7FF', '#FF0087', '#FF7DB0');
applyTheme('./src/components/sections/Contact.module.css', '#00FF9C', '#87A2FF', '#C4D7FF');

// For Hero, just ensure it's white if it's not already
applyTheme('./src/components/sections/Hero.module.css', '#FFFFFF', 'var(--color-text)', 'var(--color-primary)');
