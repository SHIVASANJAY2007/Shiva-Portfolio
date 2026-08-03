import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Nav.module.css";
import { scrollToSection, getActiveSection } from "../../lib/scrollToSection";
import { resumeData } from "../../data/resume";
import resumePdf from "../../data/24BIR050 - Shiva Sanjay N D - Resume.pdf";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.263 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);

const CVIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
    <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 013.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875zm5.845 17.03a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V12a.75.75 0 00-1.5 0v4.19l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3z" clipRule="evenodd" />
    <path d="M14.25 5.25a2.25 2.25 0 00-2.25-2.25H12v1.875c0 1.036.84 1.875 1.875 1.875H16.5v-.375a2.25 2.25 0 00-2.25-2.25H14.25z" />
  </svg>
);

export const Nav = () => {
  const containerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState("dark");
  const [activeSection, setActiveSection] = useState("hero");

  // Dedicated Lenis JS Library & GSAP ScrollTrigger Color Changing Engine
  useEffect(() => {
    const checkActiveTheme = () => {
      const currentActive = getActiveSection();
      setActiveSection(currentActive);

      const isOverLightSection = currentActive === "skills" || currentActive === "experience";
      setActiveTheme(isOverLightSection && !isMenuOpen ? "light" : "dark");
    };

    window.lenis?.on("scroll", checkActiveTheme);
    window.addEventListener("scroll", checkActiveTheme, { passive: true });
    window.addEventListener("resize", checkActiveTheme, { passive: true });
    checkActiveTheme();

    return () => {
      window.lenis?.off("scroll", checkActiveTheme);
      window.removeEventListener("scroll", checkActiveTheme);
      window.removeEventListener("resize", checkActiveTheme);
    };
  }, [isMenuOpen]);

  // High-performance GSAP Open/Close Timeline Architecture for Glassmorphism Drawer
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const navWrap = containerRef.current.querySelector(".nav-overlay-wrapper");
      const menu = containerRef.current.querySelector(".menu-content");
      const overlay = containerRef.current.querySelector(".overlay");
      const bgPanels = containerRef.current.querySelectorAll(".backdrop-layer");
      const menuLinks = containerRef.current.querySelectorAll(".menu-list-item");
      const menuSocials = containerRef.current.querySelectorAll(".menu-social-btn");
      const menuButton = containerRef.current.querySelector(".nav-close-btn");
      const menuButtonTexts = menuButton ? menuButton.querySelectorAll("p") : [];
      const menuButtonIcon = menuButton ? menuButton.querySelector(".menu-button-icon") : null;

      const tl = gsap.timeline();

      if (isMenuOpen) {
        if (navWrap) navWrap.setAttribute("data-nav", "open");
        
        tl.set(navWrap, { display: "block" })
          .fromTo(menu, { xPercent: 102, x: 0 }, { xPercent: 0, x: 0, duration: 0.6, ease: "power3.out" }, 0)
          .fromTo(menuButtonTexts, { yPercent: 0 }, { yPercent: -100, stagger: 0.1, duration: 0.45, ease: "power2.out" }, 0)
          .fromTo(menuButtonIcon, { rotate: 0 }, { rotate: 315, duration: 0.5, ease: "back.out(1.5)" }, 0)
          .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45 }, 0)
          .fromTo(bgPanels, { xPercent: 102, opacity: 1 }, { xPercent: 0, stagger: 0.08, duration: 0.55, ease: "power3.out" }, 0.05)
          .to(bgPanels, { opacity: 0, duration: 0.35 }, 0.4)
          .fromTo(menuLinks, { x: 45, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: "power3.out" }, 0.22)
          .fromTo(menuSocials, { y: 25, opacity: 0, scale: 0.85 }, { y: 0, opacity: 1, scale: 1, stagger: 0.07, duration: 0.5, ease: "back.out(1.6)" }, 0.38);
      } else {
        if (navWrap) navWrap.setAttribute("data-nav", "closed");

        tl.to(overlay, { autoAlpha: 0, duration: 0.45, ease: "power2.inOut" }, 0)
          .to(menu, { xPercent: 120, duration: 0.55, ease: "power3.in" }, 0)
          .to(menuButtonTexts, { yPercent: 0, duration: 0.4, ease: "power2.inOut" }, 0)
          .to(menuButtonIcon, { rotate: 0, duration: 0.4, ease: "power2.inOut" }, 0)
          .set(navWrap, { display: "none" });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isMenuOpen]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    closeMenu();
    const targetId = href.slice(1);
    setTimeout(() => {
      scrollToSection(targetId);
    }, 220);
  };

  const navItems = [
    { href: "#hero", label: "Hero" },
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#projects", label: "Projects" },
    { href: "#experience", label: "Experience & Awards" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <div ref={containerRef} style={{ pointerEvents: "none" }}>
      <div className={`${styles.siteHeaderWrapper} ${isMenuOpen ? styles.headerMenuOpen : ""}`}>
        <header className={styles.header}>
          <div className={styles.navRow}>
            {!isMenuOpen && (
              <div className={styles.headerSocialIcons}>
                <a
                  href={resumeData.profiles?.github || "https://github.com/SHIVASANJAY2007/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.headerSocialBtn}
                  style={{ pointerEvents: "auto" }}
                  title="GitHub Profile"
                  aria-label="GitHub"
                >
                  <GitHubIcon />
                </a>
                <a
                  href={resumeData.profiles?.linkedin || "https://www.linkedin.com/in/shiva-sanjay-610512320/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.headerSocialBtn}
                  style={{ pointerEvents: "auto" }}
                  title="LinkedIn Profile"
                  aria-label="LinkedIn"
                >
                  <LinkedInIcon />
                </a>
              </div>
            )}
            <button
              role="button"
              className={`${styles.navCloseBtn} nav-close-btn`}
              onClick={toggleMenu}
              style={{ pointerEvents: "auto" }}
            >
              <div className={styles.menuButtonText}>
                <p className={styles.pLarge}>Menu</p>
                <p className={styles.pLarge}>Close</p>
              </div>
              <div className={styles.iconWrap}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" className={`${styles.menuButtonIcon} menu-button-icon`}>
                  <path d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z" fill="currentColor"></path>
                  <path d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z" fill="currentColor"></path>
                  <path d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z" fill="currentColor"></path>
                  <path d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z" fill="currentColor"></path>
                  <path d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z" fill="currentColor"></path>
                  <path d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z" fill="currentColor"></path>
                </svg>
              </div>
            </button>
          </div>
        </header>
      </div>

      <section className={styles.fullscreenMenuContainer}>
        <div data-nav="closed" className={`${styles.navOverlayWrapper} nav-overlay-wrapper`}>
          <div className={`${styles.overlay} overlay`} onClick={closeMenu}></div>
          <nav className={`${styles.menuContent} menu-content`}>
            <div className={styles.menuBg}>
              <div className={`${styles.backdropLayer} ${styles.backdropLayerFirst} backdrop-layer`}></div>
              <div className={`${styles.backdropLayer} ${styles.backdropLayerSecond} backdrop-layer`}></div>
            </div>

            <div className={styles.menuContentWrapper}>
              <ul className={styles.menuList}>
                {navItems.map((item, index) => {
                  const itemSectionId = item.href.slice(1);
                  const isCurrent = activeSection === itemSectionId;
                  return (
                    <li key={item.href} className={`${styles.menuListItem} ${isCurrent ? styles.activeItem : ""} menu-list-item`}>
                      <a href={item.href} onClick={(e) => handleLinkClick(e, item.href)} className={`${styles.navLink} nav-link`}>
                        <div className={styles.navLinkLeft}>
                          <span className={styles.navIndex}>0{index + 1}</span>
                          <p className={styles.navLinkText}>{item.label}</p>
                        </div>
                        <span className={styles.navArrow}>↗</span>
                        <div className={styles.navLinkHoverBg}></div>
                      </a>
                    </li>
                  );
                })}
              </ul>

              {/* Social Icons & CV under Contact in Menu Nav */}
              <div className={styles.menuSocials}>
                <a
                  href={resumeData.profiles?.github || "https://github.com/SHIVASANJAY2007/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.menuSocialBtn} menu-social-btn`}
                  title="GitHub Profile"
                  aria-label="GitHub Profile"
                >
                  <GitHubIcon />
                </a>
                <a
                  href={resumeData.profiles?.linkedin || "https://www.linkedin.com/in/shiva-sanjay-610512320/"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.menuSocialBtn} menu-social-btn`}
                  title="LinkedIn Profile"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedInIcon />
                </a>
                <a
                  href={resumeData.profiles?.instagram || "https://www.instagram.com/_.kho_kho._.shivuuu._?utm_source=qr&igsh=MXF4amFzYXUycDBrbg%3D%3D"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.menuSocialBtn} menu-social-btn`}
                  title="Instagram Profile"
                  aria-label="Instagram Profile"
                >
                  <InstagramIcon />
                </a>
                <a
                  href={resumePdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.menuSocialBtn} menu-social-btn`}
                  title="Download CV / Resume"
                  aria-label="Download CV / Resume"
                >
                  <CVIcon />
                </a>
              </div>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
};

export default Nav;
