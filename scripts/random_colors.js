import fs from 'fs';

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

updateFile('./src/components/sections/About.module.css', [
  [/background-color:\s*#[a-fA-F0-9]+;/, "background-color: #E3F2FD; /* Light Blue */"]
]);

updateFile('./src/components/sections/Skills.module.css', [
  [/background-color:\s*#[a-fA-F0-9]+;/, "background-color: #E8F5E9; /* Light Green */"]
]);

updateFile('./src/components/sections/Projects.module.css', [
  [/background-color:\s*#[a-fA-F0-9]+;/, "background-color: #F3E5F5; /* Light Purple */"]
]);

updateFile('./src/components/sections/Experience.module.css', [
  [/background-color:\s*#[a-fA-F0-9]+;/, "background-color: #FCE4EC; /* Light Pink */"]
]);

updateFile('./src/components/sections/Contact.module.css', [
  [/background-color:\s*#[a-fA-F0-9]+;/, "background-color: #E0F7FA; /* Light Cyan */"]
]);
