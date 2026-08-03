/**
 * Advanced Navigation & Scroll Engine
 * Solves viewport calculation discrepancies caused by stacked sticky cards (StackScroller)
 * by computing true static layout Y offset targets and tracking visible sections dynamically.
 */

/**
 * Recursively sums offsetTop values up the offsetParent chain.
 * @param {HTMLElement} element - Target element
 * @returns {number} Absolute top offset
 */
function getElementTop(element) {
  let top = 0;
  let curr = element;
  while (curr) {
    top += curr.offsetTop || 0;
    curr = curr.offsetParent;
  }
  return top;
}

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
      const containerTop = getElementTop(container);
      // offsetHeight accurately reflects total layout height without sticky distortions
      const precedingHeight = siblings
        .slice(0, cardIndex)
        .reduce((sum, sibling) => sum + (sibling.offsetHeight || 0), 0);
      
      return containerTop + precedingHeight;
    }
  }

  // Fallback calculation for standard elements not wrapped in a sticky stack card
  return getElementTop(element.closest('.card__conceal') || element);
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
        callback?.();
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

// Performance Cache: Prevents forced reflow / layout thrashing during scroll events
let sectionTopCache = {};
let lastCacheTime = 0;
const CACHE_TTL = 2000; // Refresh cache at most once every 2 seconds

if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    sectionTopCache = {};
    lastCacheTime = 0;
  }, { passive: true });
}

function getCachedSectionTop(id) {
  const now = Date.now();
  if (now - lastCacheTime > CACHE_TTL) {
    sectionTopCache = {};
    lastCacheTime = now;
  }
  if (sectionTopCache[id] === undefined) {
    sectionTopCache[id] = getSectionScrollTop(id);
  }
  return sectionTopCache[id];
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
    const sectionTop = getCachedSectionTop(id);
    if (triggerPoint >= sectionTop - 20) {
      activeId = id;
    }
  }
  return activeId;
}
