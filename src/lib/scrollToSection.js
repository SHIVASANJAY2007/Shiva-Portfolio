/**
 * Advanced Navigation & Scroll Engine
 * Solves viewport calculation discrepancies caused by stacked sticky cards (StackScroller)
 * by computing true static layout Y offset targets and tracking visible sections dynamically.
 */

/**
 * Calculates the true absolute document Y coordinate for any section or element,
 * regardless of current sticky / transforms in the viewport.
 * @param {string} targetId - Section ID (with or without #)
 * @returns {number} The exact pixel offset to scroll to
 */
export function getSectionScrollTop(targetId) {
  if (!targetId) return 0;
  const cleanId = targetId.replace(/^#/, '');
  const element = document.getElementById(cleanId);
  if (!element) return 0;

  // If the section is contained within a StackScroller card (.card__conceal),
  // compute its exact position by summing the outer heights of all preceding stacked cards.
  const card = element.closest('.card__conceal');
  if (card && card.parentElement) {
    const container = card.parentElement; // .stack__conceal
    const siblings = Array.from(container.children);
    const cardIndex = siblings.indexOf(card);

    if (cardIndex !== -1) {
      let containerTop = 0;
      let curr = container;
      while (curr) {
        containerTop += curr.offsetTop || 0;
        curr = curr.offsetParent;
      }

      let precedingHeight = 0;
      for (let i = 0; i < cardIndex; i++) {
        const sibling = siblings[i];
        // offsetHeight accurately reflects total layout height without sticky distortions
        precedingHeight += sibling.offsetHeight || 0;
      }
      
      return containerTop + precedingHeight;
    }
  }

  // Fallback calculation for standard elements not wrapped in a sticky stack card
  let top = 0;
  let curr = element.closest('.card__conceal') || element;
  while (curr) {
    top += curr.offsetTop || 0;
    curr = curr.offsetParent;
  }
  return top;
}

/**
 * Smoothly navigates to any section using Lenis high-performance scroll or browser fallback.
 * @param {string} targetId - Section ID (with or without #)
 * @param {function} [callback] - Optional callback upon completion
 */
export function scrollToSection(targetId, callback) {
  const targetY = getSectionScrollTop(targetId);

  if (typeof window !== 'undefined' && window.lenis) {
    window.lenis.scrollTo(targetY, {
      offset: 0,
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      onComplete: () => {
        if (callback) callback();
      }
    });
  } else if (typeof window !== 'undefined') {
    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
    if (callback) {
      setTimeout(callback, 700);
    }
  }
}

/**
 * Accurately determines the currently active section based on true static layout scroll positions.
 * Bypasses false positive intersection measurements on sticky cards stacked at viewport top.
 * @returns {string} ID of the currently active section
 */
export function getActiveSection() {
  if (typeof window === 'undefined') return 'hero';
  const sectionIds = ['hero', 'about', 'skills', 'projects', 'experience', 'contact'];
  const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;
  const triggerPoint = currentScroll + window.innerHeight * 0.4;

  let activeId = 'hero';
  for (const id of sectionIds) {
    const sectionTop = getSectionScrollTop(id);
    if (triggerPoint >= sectionTop - 20) {
      activeId = id;
    }
  }
  return activeId;
}
