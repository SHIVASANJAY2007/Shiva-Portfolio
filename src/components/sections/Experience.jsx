import React, { useEffect, useRef, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Experience.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * Reusable Interactive Timeline Carousel with Dual Drag + Scroll synchronization
 * Inspired by high-contrast editorial design (Obsidian Black Active vs Silver Inactive cards)
 */
const TimelineCarousel = ({ kicker, title, items, direction = 'ltr' }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: 'center',
    containScroll: false, // Ensure zero edge clamping so first and last cards center perfectly
    duration: 24,
    direction: direction,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const sectionRef = useRef(null);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reinit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reinit', onSelect);
    };
  }, [emblaApi, onSelect]);

  // Lock (pin) section in viewport during scrolling until all cards have been viewed sequentially
  useEffect(() => {
    if (!emblaApi || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'center center',
        end: () => `+=${items.length * 650}`,
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          if (!emblaApi) return;
          const snaps = emblaApi.scrollSnapList();
          if (snaps && snaps.length > 0) {
            // Symmetrical math guarantees progress transitions fully to the very last slide index
            const idx = Math.round(self.progress * (snaps.length - 1));
            if (idx !== emblaApi.selectedScrollSnap()) {
              emblaApi.scrollTo(idx);
            }
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [emblaApi, items.length]);

  return (
    <div className={styles.carouselSection} ref={sectionRef}>
      {/* Editorial Header */}
      <div className={styles.headerContainer}>
        <div className={styles.kicker}>{kicker}</div>
        <h2 className={styles.headline}>
          <span className={styles.redSlash}>/</span> {title}
        </h2>
      </div>

      {/* Interactive Horizontal Timeline Axis */}
      <div className={styles.timelineTrackWrapper} style={{ direction: direction }}>
        <div className={styles.timelineTrack} style={{ direction: direction }}>
          <div className={styles.timelineLine} aria-hidden="true" />
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              className={`${styles.timelineNode} ${idx === selectedIndex ? styles.timelineNodeActive : ''}`}
              style={{ direction: 'ltr' }}
              onClick={() => emblaApi && emblaApi.scrollTo(idx)}
            >
              <span className={`${styles.nodeDot} ${idx === selectedIndex ? styles.nodeDotActive : ''}`} />
              {item.year || item.date}
            </button>
          ))}
        </div>
      </div>

      {/* Draggable Embla Cards Viewport */}
      <div className={styles.embla} style={{ direction: direction }}>
        <div className={styles.emblaViewport} ref={emblaRef} style={{ direction: direction }}>
          <div className={styles.emblaContainer} style={{ direction: direction }}>
            {items.map((item, idx) => (
              <div key={idx} className={styles.emblaSlide} style={{ direction: direction }}>
                <div
                  className={`${styles.card} ${idx === selectedIndex ? styles.cardActive : styles.cardInactive}`}
                  style={{ direction: 'ltr' }}
                >
                  <div className={styles.cardTop}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <span className={styles.cardYear}>{item.year || item.date}</span>
                  </div>
                  <div className={styles.cardBody}>
                    {item.organization && <div className={styles.cardOrg}>{item.organization}</div>}
                    <p className={styles.cardDesc}>{item.description || item.focus || item.achievement}</p>
                  </div>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardTagline}>
                      {item.tagline || 'START SMALL. THINK BIG.'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Experience = () => {
  const containerRef = useRef(null);

  // Ascending chronological order: 2024 -> 2025 -> 2026
  const experienceItems = [
    {
      title: 'Class Representative',
      organization: 'Kongu Engineering College',
      year: '2024',
      description: 'Serving as the primary academic interface between engineering faculty and student body in Erode, maintaining organizational discipline and leadership.',
      tagline: 'ACADEMIC EXCELLENCE.'
    },
    {
      title: 'Kho Kho Team Captain',
      organization: 'Kongu Engineering College',
      year: '2024',
      description: 'Actively leading the collegiate athletic team with agility, athletic resilience, speed, strategic coordination, and competitive teamwork.',
      tagline: 'TEAM LEADERSHIP.'
    },
    {
      title: 'Former Joint Secretary',
      organization: 'Kongu Engineering College',
      year: '2025',
      description: 'Coordinating high-impact national technical symposia, practical leadership workshops, and student community innovation initiatives.',
      tagline: 'EVENT LEADERSHIP.'
    },
    {
      title: 'Software Intern',
      organization: 'Xenovex Technologies',
      year: '2026',
      description: 'Hands-on full-stack engineering development and practical digital solutions within an intensive enterprise technology environment in Chennai.',
      tagline: 'CHENNAI. TECH INTERN.'
    }
  ];

  // Ascending chronological order: 2024 -> 2025 -> 2026
  const awardItems = [
    {
      title: 'State Kho Kho Winner',
      organization: 'Colleges around Tamilnadu',
      date: '2024-2027',
      description: 'Multiple athletic tournament victories in State Level Kho Kho Tournaments across Tamilnadu, demonstrating endurance and peak perseverance.',
      tagline: 'STATE TOURNAMENTS.'
    },
    {
      title: 'Proof of Concept (1st Prize)',
      organization: 'Kongu Engineering College',
      date: '2025',
      description: 'Awarded first prize in POC for Fitlee — an innovative fitness web application featuring an NFT-based reward system and AI interactive chatbot.',
      tagline: 'POC WINNER. INNOVATION.'
    },
    {
      title: 'Xackathon 2k25 Winner',
      organization: 'Xenovex Technologies',
      date: '2025',
      description: 'Team-developed AI travel assistant built using n8n workflows to automate custom trip planning and real-time WhatsApp Business itineraries.',
      tagline: 'AI AUTOMATION WINNER.'
    },
    {
      title: 'Marketing Event Winner',
      organization: 'KEC Faculty',
      date: '2025',
      description: 'Achieved back-to-back victories in competitive technology marketing and product strategy exhibitions, showcasing clear product communication.',
      tagline: 'MARKETING VICTORIES.'
    },
    {
      title: 'Oracle Certified Associate',
      organization: 'Oracle',
      date: '2026',
      description: 'Successfully earned the Java Certified Foundations Associate credential from Oracle, solidifying enterprise programming architecture expertise.',
      tagline: 'ORACLE CERTIFIED.'
    }
  ];

  return (
    <section id="experience" className={styles.pathSection} ref={containerRef}>
      <div className={styles.content}>
        {/* Section 1: Experience Timeline Carousel */}
        <TimelineCarousel
          kicker="EXPERIENCE"
          title="Where bold leadership meets practical technical execution"
          items={experienceItems}
        />

        {/* Section 2: Awards & Recognition Carousel */}
        <TimelineCarousel
          kicker="AWARDS"
          title="Celebrating milestone victories and innovative breakthroughs"
          items={awardItems}
          direction="rtl"
        />
      </div>
    </section>
  );
};

export default Experience;
