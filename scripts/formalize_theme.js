import fs from 'fs';
import path from 'path';

function updateFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  
  for (const [regex, replacement] of replacements) {
    newContent = newContent.replace(regex, replacement);
  }
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated ${filePath}`);
  }
}

// 1. Navigation
updateFile('./src/components/common/Navigation.jsx', [
  [/\{ href: '#about', kanji: '起', text: 'ORIGIN' \}/, "{ href: '#about', kanji: '', text: 'ABOUT' }"],
  [/\{ href: '#skills', kanji: '武', text: 'ARSENAL' \}/, "{ href: '#skills', kanji: '', text: 'SKILLS' }"],
  [/\{ href: '#projects', kanji: '任', text: 'MISSIONS' \}/, "{ href: '#projects', kanji: '', text: 'PROJECTS' }"],
  [/\{ href: '#experience', kanji: '歴', text: 'PATH' \}/, "{ href: '#experience', kanji: '', text: 'EXPERIENCE' }"],
  [/\{ href: '#contact', kanji: '召', text: 'SUMMON' \}/, "{ href: '#contact', kanji: '', text: 'CONTACT' }"]
]);

// 2. Hero
updateFile('./src/components/sections/Hero.jsx', [
  [/<div ref=\{kanjiRef\}.*?>[\s\S]*?<\/div>/, ""],
  [/\/\/\s*Animate Kanji watermark[\s\S]*?\.from/, ".from"]
]);
updateFile('./src/components/sections/Hero.module.css', [
  [/\.kanjiWatermark\s*\{[\s\S]*?\}/, ""],
  [/background-color:\s*var\(--color-bg\);/, "background-color: #FFF9E6;"]
]);

// 3. About
updateFile('./src/components/sections/About.jsx', [
  [/<div className=\{`\$\{styles.kanjiBg\} kanjiBgAbout`\}>起源<\/div>\s*\{\/\* Origin \*\/\}/, ""],
  [/The Origin/, "About Me"],
  [/Training Grounds/, "Education"],
  [/\/\/\s*gsap\.to\('\.kanjiBgAbout'[\s\S]*?\n\s*\}\);/g, ""]
]);
updateFile('./src/components/sections/About.module.css', [
  [/\.kanjiBg\s*\{[\s\S]*?\}/, ""],
  [/background-color:\s*#[a-f0-9]+;/, "background-color: #FFFAF0;"]
]);

// 4. Skills
updateFile('./src/components/sections/Skills.jsx', [
  [/<div className=\{`\$\{styles.kanjiBg\} kanjiBg`\}>武器<\/div>\s*\{\/\* Arsenal\/Weapons \*\/\}/, ""],
  [/The Arsenal/, "Skills & Expertise"],
  [/\/\/\s*Reveal the Kanji background on scroll[\s\S]*?\}\);/g, ""]
]);
updateFile('./src/components/sections/Skills.module.css', [
  [/\.kanjiBg\s*\{[\s\S]*?\}/, ""],
  [/background-color:\s*#[a-f0-9]+;/, "background-color: #FFF3E0;"],
  [/\.rune\s*\{/, ".rune {\n  background: var(--color-surface);"],
  [/background: linear-gradient.*?;\n/, ""]
]);

// 5. Projects
updateFile('./src/components/sections/Projects.jsx', [
  [/<div className=\{`\$\{styles.kanjiBg\} kanjiBgProject`\}>任務<\/div>\s*\{\/\* Missions \*\/\}/, ""],
  [/The Missions/, "Featured Projects"],
  [/gsap\.to\('\.kanjiBgProject'[\s\S]*?\}\);/g, ""]
]);
updateFile('./src/components/sections/Projects.module.css', [
  [/\.kanjiBg\s*\{[\s\S]*?\}/, ""],
  [/background-color:\s*#[a-f0-9]+;/, "background-color: #FFECB3;"],
  [/\.missionDossier\s*\{/, ".missionDossier {\n  background: var(--color-surface);\n  padding: 2rem;\n  border-radius: 8px;\n  box-shadow: 0 4px 20px rgba(255, 109, 0, 0.05);"],
  [/border-top: 2px solid var\(--color-gray-800\);\n\s*padding-top: 2rem;/, ""]
]);

// 6. Experience
updateFile('./src/components/sections/Experience.jsx', [
  [/<div className=\{`\$\{styles.kanjiBg\} kanjiBgExp`\}>経歴<\/div>\s*\{\/\* Experience\/History \*\/\}/, ""],
  [/The Path/, "Experience"],
  [/<div className=\{styles.timelineDivider\}><span>誉<\/span><\/div>\s*\{\/\* Honor \*\/\}/, "<div className={styles.timelineDivider}><span>Awards</span></div>"],
  [/gsap\.to\('\.kanjiBgExp'[\s\S]*?\}\);/g, ""]
]);
updateFile('./src/components/sections/Experience.module.css', [
  [/\.kanjiBg\s*\{[\s\S]*?\}/, ""],
  [/background-color:\s*#[a-f0-9]+;/, "background-color: #FFE0B2;"],
  [/\.timelineContent\s*\{/, ".timelineContent {\n  background: var(--color-surface);\n  padding: 1.5rem;\n  border-radius: 8px;\n  box-shadow: 0 4px 15px rgba(255, 109, 0, 0.05);"]
]);

// 7. Contact
updateFile('./src/components/sections/Contact.jsx', [
  [/<div className=\{`\$\{styles.kanjiBg\} kanjiBgContact`\}>召喚<\/div>\s*\{\/\* Summon \*\/\}/, ""],
  [/Summon/, "Get in Touch"],
  [/gsap\.to\('\.kanjiBgContact'[\s\S]*?\}\);/g, ""]
]);
updateFile('./src/components/sections/Contact.module.css', [
  [/\.kanjiBg\s*\{[\s\S]*?\}/, ""],
  [/background-color:\s*#[a-f0-9]+;/, "background-color: #FFCC80;"],
  [/\.contactItem\s*\{/, ".contactItem {\n  background: var(--color-surface);"],
  [/background: rgba\(0,0,0,0.02\);\n/, ""]
]);
