import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Skills.module.css';
import { resumeData } from '../../data/resume';

gsap.registerPlugin(ScrollTrigger);

import PhysicsToolCard from '../common/PhysicsToolCard';

const skillsData = {
  "Languages": ["Java", "JavaScript", "Python", "C", "SQL"],
  "Code Editors": ["Antigravity", "VS Code"],
  "AI Workspace": ["ChatGPT", "Gemini", "NotebookLLM", "GitHub Copilot"],
  "Frontend": ["HTML5", "CSS3", "React", "Tailwind CSS", "Bootstrap"],
  "Backend": ["Node.js", "Express.js"],
  "Databases": ["MongoDB", "PostgreSQL", "pgAdmin", "MySQL"],
  "Other Tools": ["GitHub", "Notion", "Docker", "n8n", "Google Colab", "Microsoft Office"],
  "CRM & ERP": ["Salesforce", "Odoo"]
};

export const Skills = () => {
  const containerRef = useRef(null);

  return (
    <section id="skills" className={styles.arsenalSection} ref={containerRef}>
      <div className={styles.content}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.redSlash}>/</span> Skills & Expertise
        </h2>
        
        <div className={styles.cardGrid}>
          {Object.entries(skillsData).map(([category, tools]) => (
            <PhysicsToolCard 
              key={category}
              title={category} 
              subtitle={`Explore my ${category.toLowerCase()} toolkit`}
              tools={tools} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
