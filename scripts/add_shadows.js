import fs from 'fs';

function addGlitchShadow(filePath, glitchColor) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Find the glitch color if not provided
  if (!glitchColor) {
    const match = content.match(/color:\s*(#[a-fA-F0-9]+);/);
    // actually, we know the glitch colors we injected.
  }
  
  // Just add text-shadow to the sectionTitle and other main text classes
  content = content.replace(/\.sectionTitle\s*\{/g, `.sectionTitle {\n  text-shadow: 3px 3px 0px ${glitchColor}, -1px -1px 0px ${glitchColor}55;`);
  content = content.replace(/\.expTitle\s*\{/g, `.expTitle {\n  text-shadow: 2px 2px 0px ${glitchColor};`);
  content = content.replace(/\.contactValue\s*\{/g, `.contactValue {\n  text-shadow: 2px 2px 0px ${glitchColor};`);
  content = content.replace(/\.projectName\s*\{/g, `.projectName {\n  text-shadow: 2px 2px 0px ${glitchColor};`);
  
  // For Hero
  if (filePath.includes('Hero')) {
      content = content.replace(/\.char\s*\{[\s\S]*?text-shadow:.*?;/g, `.char {\n  display: inline-block;\n  text-shadow: 4px 4px 0px ${glitchColor}, -2px -2px 0px ${glitchColor}55;`);
  }

  fs.writeFileSync(filePath, content);
  console.log(`Shadows added to ${filePath}`);
}

addGlitchShadow('./src/components/sections/Hero.module.css', '#FF0055');
addGlitchShadow('./src/components/sections/About.module.css', '#FF62BB');
addGlitchShadow('./src/components/sections/Skills.module.css', '#00E676');
addGlitchShadow('./src/components/sections/Projects.module.css', '#FF9100');
addGlitchShadow('./src/components/sections/Experience.module.css', '#D500F9');
addGlitchShadow('./src/components/sections/Contact.module.css', '#00E5FF');
