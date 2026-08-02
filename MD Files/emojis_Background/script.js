/**
 * ============================================================================
 * INTERACTIVE ANIMATED EMOJIS MATRIX ENGINE
 * ============================================================================
 * Allows developers to test custom image/SVG asset paths on the fly via direct paste.
 * Preloaded by default with the 57 local vector emojis in the ./emojis folder.
 */

(function () {
  'use strict';

  /* --- COMPONENT PARAMETERS --- */
  const CONFIG = {
    rowsCount: 15,         // Total horizontal streaming rows
    iconsPerSet: 22,       // Number of icons per repeated marquee sequence
    randomizePerRow: true  // Organic shuffling per row
  };

  /**
   * Generates the default list of 57 project asset paths pointing directly to ./emojis
   */
  function getDefaultProjectPaths() {
    const paths = ["emojis/lllook.svg"];
    for (let i = 1; i <= 56; i++) {
      paths.push(`emojis/lllook (${i}).svg`);
    }
    return paths;
  }

  /**
   * Fisher-Yates array shuffling algorithm for randomized icon distribution
   */
  function shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /**
   * Parses raw user input from the textarea into a clean array of image URLs / file paths
   */
  function parsePathsFromText(text) {
    if (!text || !text.trim()) return [];
    
    // Split by newlines or commas, remove whitespace and empty strings
    return text
      .split(/[\n,]+/)
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }

  /**
   * Builds and inserts the animated matrix into the DOM based on active icon paths
   */
  function buildMatrix(iconPaths) {
    const container = document.getElementById("animatedEmojiGrid");
    const statusBadge = document.getElementById("statusIndicator");
    
    if (!container) return;

    if (!iconPaths || iconPaths.length === 0) {
      if (statusBadge) statusBadge.textContent = "0 icons detected";
      container.innerHTML = "";
      return;
    }

    // Clear previous matrix if regenerating
    container.innerHTML = "";
    
    if (statusBadge) {
      statusBadge.textContent = `Loaded: ${iconPaths.length} icon${iconPaths.length === 1 ? '' : 's'}`;
    }

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < CONFIG.rowsCount; i++) {
      const rowElem = document.createElement("div");
      rowElem.className = "emoji-row";

      const marqueeElem = document.createElement("div");
      marqueeElem.className = "emoji-marquee";

      // Select and expand icon pattern to fill horizontal bandwidth
      const sequence = CONFIG.randomizePerRow ? shuffleArray(iconPaths) : iconPaths;
      const expandedSequence = [];
      while (expandedSequence.length < CONFIG.iconsPerSet) {
        expandedSequence.push(...sequence);
      }
      const activeSlice = expandedSequence.slice(0, CONFIG.iconsPerSet);

      // Duplicate sequence twice to allow seamless CSS keyframe loop
      for (let loopIdx = 0; loopIdx < 2; loopIdx++) {
        const setElem = document.createElement("div");
        setElem.className = "emoji-set";

        activeSlice.forEach(src => {
          const img = document.createElement("img");
          img.src = src;
          img.className = "emoji-icon";
          img.alt = "";
          img.setAttribute("aria-hidden", "true");
          img.loading = "lazy";
          
          // Fallback handling: silently hide broken links to preserve marquee structure
          img.onerror = function() {
            this.style.display = "none";
          };

          setElem.appendChild(img);
        });

        marqueeElem.appendChild(setElem);
      }

      rowElem.appendChild(marqueeElem);
      fragment.appendChild(rowElem);
    }

    container.appendChild(fragment);
  }

  /**
   * Application initializer
   */
  function init() {
    const inputField = document.getElementById("iconPathsInput");
    
    // Load defaults from local emojis/ directory
    const defaultPaths = getDefaultProjectPaths();
    
    if (inputField) {
      inputField.value = defaultPaths.join("\n");

      // Automatic real-time live updates as the user pastes or types new paths
      let debounceTimer = null;
      inputField.addEventListener("input", () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          const customPaths = parsePathsFromText(inputField.value);
          buildMatrix(customPaths);
        }, 350); // Small 350ms debounce ensures smooth typing without re-render spam
      });
    }

    // Render initial matrix with local project emojis
    buildMatrix(defaultPaths);
  }

  // Run on DOM load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
