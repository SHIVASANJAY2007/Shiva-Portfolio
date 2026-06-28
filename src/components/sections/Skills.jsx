import React from 'react';
import { Section, SkillCard, AnimeStagger, AnimeProgress } from '../common';
import styles from './Skills.module.css';
import { resumeData } from '../../data/resume';

export const Skills = () => {
  return (
    <Section
      id="skills"
      title="Skills"
      subtitle="Technologies and expertise"
      className={styles.claySection}
    >
      <div className={styles.container}>
        {/* Programming Languages */}
        <div className={styles.category}>
          <h3 className={styles.categoryTitle}>Programming Languages</h3>
          <AnimeStagger className={styles.grid} stagger={50}>
            {resumeData.skills.programming.map((skill, idx) => (
              <div key={idx}>
                <SkillCard
                  name={skill.name}
                  level={skill.level}
                  category="programming"
                />
              </div>
            ))}
          </AnimeStagger>
        </div>

        {/* Other Skills */}
        <div className={styles.category}>
          <h3 className={styles.categoryTitle}>Other Expertise</h3>
          <AnimeStagger className={styles.tags} stagger={30}>
            {resumeData.skills.other.map((skill, idx) => (
              <span key={idx} className={styles.tag}>
                {skill}
              </span>
            ))}
          </AnimeStagger>
        </div>

        {/* Proficiency Breakdown */}
        <div className={styles.breakdown}>
          <h3 className={styles.categoryTitle}>Proficiency Overview</h3>
          <div className={styles.proficiencies}>
            <AnimeProgress label="Backend Development" targetPercentage={65} />
            <AnimeProgress label="Frontend Development" targetPercentage={70} />
            <AnimeProgress label="Workflow Automation" targetPercentage={80} />
            <AnimeProgress label="Problem Solving" targetPercentage={85} />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Skills;
