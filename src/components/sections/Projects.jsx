import React from 'react';
import { Section, ProjectCard, AnimeStagger } from '../common';
import styles from './Projects.module.css';
import { resumeData } from '../../data/resume';

export const Projects = () => {
  return (
    <Section
      id="projects"
      title="Projects"
      subtitle="Work and accomplishments"
      className={styles.brutalistSection}
    >
      <AnimeStagger className={styles.container} stagger={150}>
        {resumeData.projects.map((project, idx) => (
          <div key={project.id}>
            <ProjectCard
              name={project.name}
              year={project.year}
              description={project.description}
              highlights={project.highlights}
            />
          </div>
        ))}
      </AnimeStagger>
    </Section>
  );
};

export default Projects;
