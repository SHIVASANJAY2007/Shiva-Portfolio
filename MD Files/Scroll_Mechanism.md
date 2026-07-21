HTML : 
<main class="container__stack">

  <!-- Reveal stack container -->
  <section class="stack__reveal">

    <!-- Reveal cards -->
    <section class="card__reveal overlay__reveal">Reveal 1</section>
    <section class="card__reveal overlay__reveal">Reveal 2</section>
    <section class="card__reveal overlay__reveal">Reveal 3</section>
    <section class="card__reveal overlay__reveal">Reveal 4</section>

  </section>

  <!-- Conceal stack container -->
  <section class="stack__conceal">

    <!-- Conceal cards -->
    <section class="card__conceal overlay__conceal">Conceal 1</section>
    <section class="card__conceal overlay__conceal">Conceal 2</section>
    <section class="card__conceal overlay__conceal">Conceal 3</section>
    <section class="card__conceal overlay__conceal">Conceal 4</section>

  </section>

</main>
CSS : 
:root {
  /* Stack height = edit number of cards */
  --stack__cards: calc(4 * 100vh);
  /* Sibling overlay opacity */
  --overlay__opacity: .7;
  /* Colors */
  --color__dark: black;
  --color__light: white;
}

* {
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--color__light);
}

/* Card stacks
---------------------------------------- */

/* Containers */
.stack__reveal {

}
.stack__conceal {

}

/* Cards */
.card__reveal,
.card__conceal {
  /* Visual styles */
  position: sticky;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 4rem;
  color: var(--color__dark);
  background-color: var(--color__light);
}
/* Card reveal: scroll effect */
.card__reveal {
  bottom: 0;
}
/* Card conceal: scroll effect */
.card__conceal {
  top: 0;
}

.card {
  position: sticky;
  top: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 4rem;
  color: var(--color__dark);
  background-color: var(--color__light);
  z-index: -1;
}

/* Stacking order: reveal */
.card__reveal:nth-child(1) { z-index: 4; }
.card__reveal:nth-child(2) { z-index: 3; }
.card__reveal:nth-child(3) { z-index: 2; }
.card__reveal:nth-child(4) { z-index: 1; }

/* Stacking order: conceal */
.card__conceal:nth-child(1) { z-index: 5; }
.card__conceal:nth-child(2) { z-index: 6; }
.card__conceal:nth-child(3) { z-index: 7; }
.card__conceal:nth-child(4) { z-index: 8; }

/* Overlay reveal & conceal effects
---------------------------------------- */

/* Sibling overlay: invisible on load */
.overlay__reveal::after,
.overlay__reveal--visible::after,
.overlay__conceal::before,
.overlay__conceal--visible::before {
  left: 0;
  width: 100%;
  height: 100vh;
  opacity: 0;
  content: "";
  display: inline-block;
  position: absolute;
  background: var(--color__dark);
  transition: all 2s cubic-bezier(0.165, 0.84, 0.44, 1);
  pointer-events: none;
}

/* Reveal effect: after card */
.overlay__reveal::after,
.overlay__reveal--visible::after {
  top: 100%;
}

/* Conceal effect: before card */
.overlay__conceal::before,
.overlay__conceal--visible::before {
  bottom: 100%;
}

/* Sibling overlay: visibile when JS executes */
.overlay__reveal--visible::after,
.overlay__conceal--visible::before {
  opacity: var(--overlay__opacity);
}

JS : 
// Card rendering is setup to work if JS events doesn't fire

const observerOptions = {
  root: null, // Null = based on viewport
  rootMargin: "0px", // Margin for root
  threshold: 0.1 // Visibility percentage needed to execute function
};

function observerCallback(entries, observer) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Fadeing in reveal overlay when observed elements are in of view
      entry.target.classList.replace("overlay__reveal", "overlay__reveal--visible");
      entry.target.classList.replace("overlay__conceal", "overlay__conceal--visible");
    } else {
      // Fadeing out reveal overlay when observed elements are out of view
      entry.target.classList.replace("overlay__reveal--visible", "overlay__reveal");
      entry.target.classList.replace("overlay__conceal--visible", "overlay__conceal");
    }
  });
}

// Fetches card elements from DOM
const fadeOutElms = document.querySelectorAll(".card__reveal");
const fadeInElms = document.querySelectorAll(".card__conceal");

// Calls the function for each card element
const observer = new IntersectionObserver(observerCallback, observerOptions);
fadeOutElms.forEach((el) => observer.observe(el));
fadeInElms.forEach((el) => observer.observe(el));
