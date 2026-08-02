import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Nav.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export const Nav = () => {
  const containerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState("dark");

  // Dedicated Lenis JS Library & GSAP ScrollTrigger Color Changing Engine
  useEffect(() => {
    const checkActiveTheme = () => {
      let isOverLightSection = false;
      const sectionIds = ["hero", "about", "skills", "projects", "experience", "contact"];
      let topmostSectionId = "hero";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 80) {
            topmostSectionId = id;
          }
        }
      }

      if (topmostSectionId === "skills" || topmostSectionId === "experience") {
        isOverLightSection = true;
      }

      setActiveTheme(isOverLightSection && !isMenuOpen ? "light" : "dark");
    };

    if (window.lenis) {
      window.lenis.on("scroll", checkActiveTheme);
    }

    window.addEventListener("scroll", checkActiveTheme, { passive: true });
    window.addEventListener("resize", checkActiveTheme, { passive: true });
    const timer = setInterval(checkActiveTheme, 100);
    checkActiveTheme();

    return () => {
      if (window.lenis) window.lenis.off("scroll", checkActiveTheme);
      window.removeEventListener("scroll", checkActiveTheme);
      window.removeEventListener("resize", checkActiveTheme);
      clearInterval(timer);
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
          .fromTo(menuLinks, { x: 45, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: "power3.out" }, 0.22);
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
    const element = document.getElementById(targetId);
    if (element) {
      setTimeout(() => {
        if (window.lenis) {
          window.lenis.scrollTo(element, {
            offset: 0,
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          });
        } else {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 350);
    }
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
                {navItems.map((item, index) => (
                  <li key={item.href} className={`${styles.menuListItem} menu-list-item`}>
                    <a href={item.href} onClick={(e) => handleLinkClick(e, item.href)} className={`${styles.navLink} nav-link`}>
                      <div className={styles.navLinkLeft}>
                        <span className={styles.navIndex}>0{index + 1}</span>
                        <p className={styles.navLinkText}>{item.label}</p>
                      </div>
                      <span className={styles.navArrow}>↗</span>
                      <div className={styles.navLinkHoverBg}></div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
};

export default Nav;
