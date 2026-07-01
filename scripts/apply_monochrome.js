import fs from 'fs';

function applyMonochromeTheme(filePath, bg, text, glitch) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace background-color of the main section
  content = content.replace(/background-color:\s*#[a-fA-F0-9]+;.*?(\n| \/\*)/, `background-color: ${bg};$1`);
  
  // Replace text colors (hex patterns from previous script)
  // The previous script hardcoded hexes, so we need to match hexes and replace with new text color.
  // Actually, let's just do a blanket replace of the old text hexes with the new text hexes.
  // About text was #B331F1
  // Skills text was #AEE2FF
  // Projects text was #F69D39
  // Experience text was #FF0087
  // Contact text was #87A2FF
  
  const oldTexts = ['#B331F1', '#AEE2FF', '#F69D39', '#FF0087', '#87A2FF', 'var(--color-text)', '#2C1E16'];
  oldTexts.forEach(old => {
    content = content.split(old).join(text);
  });
  
  const oldGlitches = ['#FF62BB', '#D9F9DF', '#FFF5E5', '#FF7DB0', '#C4D7FF', 'var(--color-primary)'];
  oldGlitches.forEach(old => {
    content = content.split(old).join(glitch);
  });

  // Ensure backgrounds of cards/components match the bg
  // Some used var(--color-surface) which is #FFFFFF. We should update them to `bg`
  content = content.replace(/background:\s*var\(--color-surface\);/g, `background: ${bg};`);
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
}

const BLACK = '#050505';
const WHITE = '#FFFFFF';

// Alternating Pattern
applyMonochromeTheme('./src/components/sections/Hero.module.css', WHITE, BLACK, '#FF0055');
applyMonochromeTheme('./src/components/sections/About.module.css', BLACK, WHITE, '#FF62BB');
applyMonochromeTheme('./src/components/sections/Skills.module.css', WHITE, BLACK, '#00E676');
applyMonochromeTheme('./src/components/sections/Projects.module.css', BLACK, WHITE, '#FF9100');
applyMonochromeTheme('./src/components/sections/Experience.module.css', WHITE, BLACK, '#D500F9');
applyMonochromeTheme('./src/components/sections/Contact.module.css', BLACK, WHITE, '#00E5FF');
