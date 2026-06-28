import React, { useState } from 'react';
import { Section, Button, AnimeStagger, AnimeTextReveal } from '../common';
import styles from './Contact.module.css';
import { resumeData } from '../../data/resume';

export const Contact = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Construct mailto link with form data
    const mailtoLink = `mailto:${resumeData.personal.email}?subject=Contact from Portfolio - ${formState.name}&body=${encodeURIComponent(
      formState.message
    )}`;
    window.location.href = mailtoLink;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormState({ name: '', email: '', message: '' });
    }, 3000);
  };

  return (
    <Section id="contact" title="Get In Touch" subtitle="Let's collaborate and create something amazing">
      <AnimeStagger className={styles.container} stagger={100}>
        <div className={styles.content}>
          {/* Contact Info */}
          <div className={styles.info}>
            <h3>
              <AnimeTextReveal text="Contact Information" />
            </h3>
            <p>Feel free to reach out through any of these channels:</p>

            <AnimeStagger className={styles.contactItems} stagger={60}>
              <a
                href={`mailto:${resumeData.personal.email}`}
                className={styles.contactItem}
              >
                <span className={styles.icon}>✉</span>
                <div>
                  <p className={styles.label}>Email</p>
                  <p className={styles.value}>{resumeData.personal.email}</p>
                </div>
              </a>

              <a
                href={`tel:${resumeData.personal.phone.replace(/\s/g, '')}`}
                className={styles.contactItem}
              >
                <span className={styles.icon}>📞</span>
                <div>
                  <p className={styles.label}>Phone</p>
                  <p className={styles.value}>{resumeData.personal.phone}</p>
                </div>
              </a>

              <div className={styles.contactItem}>
                <span className={styles.icon}>📍</span>
                <div>
                  <p className={styles.label}>Location</p>
                  <p className={styles.value}>{resumeData.personal.location}</p>
                </div>
              </div>

              <a
                href={resumeData.profiles.github}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactItem}
              >
                <span className={styles.icon}>💻</span>
                <div>
                  <p className={styles.label}>GitHub</p>
                  <p className={styles.value}>github.com/Shiva_Sanjay</p>
                </div>
              </a>

              <a
                href={resumeData.profiles.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactItem}
              >
                <span className={styles.icon}>🔗</span>
                <div>
                  <p className={styles.label}>LinkedIn</p>
                  <p className={styles.value}>linkedin.com/in/shiva-sanjay-n-d</p>
                </div>
              </a>
            </AnimeStagger>
          </div>

          {/* Contact Form */}
          <div className={styles.formWrapper}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <h3>
                <AnimeTextReveal text="Send a Message" delay={200} />
              </h3>

              <div className={styles.formGroup}>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Your message..."
                  rows="6"
                  required
                />
              </div>

              <Button type="submit" size="lg">
                {submitted ? 'Opening email client...' : 'Send Message'}
              </Button>
            </form>
          </div>
        </div>
      </AnimeStagger>
    </Section>
  );
};

export default Contact;
