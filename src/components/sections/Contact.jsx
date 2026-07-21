import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Contact.module.css';
import { resumeData } from '../../data/resume';

gsap.registerPlugin(ScrollTrigger);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.icon}>
    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
  </svg>
);

export const Contact = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.contactFade', {
        scrollTrigger: {
          trigger: `.${styles.contentGrid}`,
          start: 'top 85%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        clearProps: 'all',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="contact" className={styles.contactSection} ref={containerRef}>
      <div className={styles.headerContainer}>
        <h1 className={styles.bgTitle}>CONTACT</h1>
        <h2 className={styles.fgTitle}>GET IN TOUCH</h2>
      </div>

      <div className={styles.contentGrid}>
        <div className={`${styles.leftCol} contactFade`}>
          <h3 className={styles.shyTitle}>DON'T BE SHY</h3>
          <p className={styles.description}>
            Feel free to get in touch with me. I am always open to discussing new projects,
            creative ideas or opportunities to be part of your visions.
          </p>
          
          <div className={styles.contactInfoBlock}>
            <div className={styles.contactItem}>
              <MailIcon />
              <div className={styles.contactText}>
                <span className={styles.contactLabel}>Mail me</span>
                <a href={`mailto:${resumeData.personal.email}`} className={styles.contactValue}>
                  {resumeData.personal.email}
                </a>
              </div>
            </div>
            
            <div className={styles.contactItem}>
              <PhoneIcon />
              <div className={styles.contactText}>
                <span className={styles.contactLabel}>Call me</span>
                <a href={`tel:${resumeData.personal.phone || '+1 333 454 55 44'}`} className={styles.contactValue}>
                  {resumeData.personal.phone || '+1 333 454 55 44'}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.rightCol} contactFade`}>
          <form className={styles.contactForm}>
            <input type="text" placeholder="Enter your Name" className={styles.inputField} />
            <input type="email" placeholder="Enter a valid email address" className={styles.inputField} />
            <textarea placeholder="Enter your message" className={styles.textareaField} rows={5}></textarea>
            <button type="button" className={styles.submitBtn}>
              SUBMIT
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
