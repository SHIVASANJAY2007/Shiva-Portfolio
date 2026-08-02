Create a premium portfolio-style scroll animation where a fixed heading automatically changes from black to white (and vice versa) depending on the background behind it, without manually changing the text color.

The effect should mimic modern Awwwards-winning websites and creative agency portfolios.

────────────────────────────
OBJECTIVE
────────────────────────────

Create a large fixed heading (for example "CONTACT", "ABOUT", or "SUJEETH") that stays fixed while the page scrolls underneath it.

The page should consist of alternating sections:

• White background
• Black background
• White background
• Black background

As each section scrolls beneath the fixed heading, the heading should automatically invert its color.

Examples:

White section
→ Text becomes Black

Black section
→ Text becomes White

The color transition should happen naturally using CSS blend modes instead of JavaScript color switching.

────────────────────────────
TECHNICAL REQUIREMENTS
────────────────────────────

Use:

• HTML5
• CSS3
• Vanilla JavaScript only if necessary

Do NOT use:

❌ jQuery
❌ Bootstrap
❌ Tailwind
❌ CSS frameworks

Optional:
GSAP may be used only for additional scroll animations, but the color inversion itself must rely on CSS.

────────────────────────────
CORE IMPLEMENTATION
────────────────────────────

The implementation must use

mix-blend-mode: difference;

The heading should use:

position: fixed;

or

position: sticky;

so that it remains stationary while the content scrolls.

The text color should initially be white.

The blend mode should automatically invert the color depending on whatever background is underneath.

────────────────────────────
LAYOUT
────────────────────────────

Create multiple full-screen sections.

Each section should be:

height:100vh;

Alternate colors like:

Section 1 → White

Section 2 → Black

Section 3 → White

Section 4 → Black

Center simple placeholder text inside every section.

────────────────────────────
TYPOGRAPHY
────────────────────────────

Large elegant serif heading.

Examples:

Playfair Display

Bodoni

Cormorant

Canela

Neue Montreal

or another premium font.

Font size:

Clamp between

80px and 180px

Weight:

Bold

Letter spacing:

Slightly negative.

────────────────────────────
ANIMATION
────────────────────────────

Smooth scrolling.

No flickering.

No opacity flashing.

No JavaScript color toggling.

The inversion should happen naturally because of CSS rendering.

────────────────────────────
EXTRA PREMIUM EFFECTS
────────────────────────────

Add subtle enhancements such as:

• Slight letter-spacing animation
• Fade-up section content
• Smooth scrolling
• Parallax background movement
• Sticky section transitions
• Mouse-following cursor (optional)
• Noise texture overlay (optional)
• Grain effect (optional)

Keep animations minimal and elegant.

────────────────────────────
RESPONSIVE
────────────────────────────

Desktop

Tablet

Mobile

The large heading should resize smoothly using clamp().

────────────────────────────
CODE QUALITY
────────────────────────────

Use semantic HTML.

Separate files:

index.html

style.css

script.js

Well-commented code.

Avoid unnecessary wrappers.

Use CSS variables.

Keep everything optimized.

────────────────────────────
BONUS (Optional)
────────────────────────────

Implement a reusable React component version.

OR

Create a reusable JavaScript class that can apply this effect to any heading.

────────────────────────────
EXPECTED RESULT
────────────────────────────

A premium landing page where a huge fixed heading continuously changes from white to black depending on the scrolling background, using CSS mix-blend-mode:difference exactly like modern Awwwards portfolio websites.

Yes! This effect is quite popular in modern portfolio websites and agency landing pages.

The effect you're referring to is generally called:

* **Color Inversion on Scroll**
* **Scroll-based Blend Mode Effect**
* **Difference Blend Mode Animation**
* **Dynamic Text Inversion**
* **Background-aware Text Color**

The most common CSS property used is:

```css
mix-blend-mode: difference;
```

---

## How it works

Normally:

```
Black Background
White Text
```

When the text overlaps a white section:

```
White Background
Black Text
```

Instead of changing the text color with JavaScript, CSS calculates the difference between the text and whatever is behind it.

For example:

```
Background: Black
Text: White

↓

Background: White
Text automatically becomes Black
```

Exactly like your screenshots.

---

# CSS Example

```html
<h1 class="title">SUJEETH</h1>
```

```css
.title{
    position: fixed;
    color: white;
    mix-blend-mode: difference;
    font-size: 90px;
    font-weight: bold;
}
```

That's literally the main trick.

---

# Another method

Some websites don't use blend modes.

Instead they use:

```
Intersection Observer

↓

Detect which section is behind

↓

Toggle class

↓

transition: color .4s;
```

Example

```css
.title{
    color:white;
    transition:.4s;
}

.title.dark{
    color:black;
}
```

---

# Popular Libraries

There isn't a library specifically for this effect because it's mostly CSS.

But these animation libraries are commonly paired with it:

### GSAP

```js
gsap.to(...)
ScrollTrigger
```

Perfect for scroll animations.

---

### Lenis

Smooth scrolling

```
Lenis + mix-blend-mode
```

Very common.

---

### Locomotive Scroll

Another smooth scrolling library.

---

### Framer Motion (React)

```
<motion.h1 />
```

Used for React portfolios.

---

### Motion One

A lightweight alternative to GSAP.

---

# If you want even smoother transitions

Some websites animate a white overlay instead.

```
██████████
White Section moves

↓

Text inverts

↓

Looks magical
```

Usually done using

```
clip-path

mask-image

SVG mask

mix-blend-mode
```

---

# Keywords to search

Search these on YouTube or Google:

* `mix-blend-mode difference tutorial`
* `scroll color invert text`
* `text changes color on scroll css`
* `background aware text css`
* `blend mode portfolio animation`
* `dynamic text inversion css`
* `gsap mix blend mode`
* `lenis portfolio animations`

---

# Similar effects you might like

### 1. Text Reveal on Scroll

Letters reveal as you scroll.

```
█████████

HELLO
```

---

### 2. Clip-path Reveal

```
████████

CONTACT

↓

█████
CONTACT
```

---

### 3. Mask Animation

Apple-like reveal effects using SVG masks.

---

### 4. Magnetic Text

Text follows the cursor slightly.

---

### 5. Liquid Cursor + Blend Mode

Cursor acts like a spotlight while the text inverts beneath it.

---

### 6. SVG Text Mask

Instead of changing the text color, the text becomes a "window" that reveals the background through it.

---

## Your screenshots

From the images you shared, the effect looks like:

* A **fixed heading** (`position: fixed` or `sticky`)
* Alternating **black and white page sections**
* The heading uses **`mix-blend-mode: difference`**
* As the page scrolls beneath the fixed heading, the text automatically inverts from black to white (and vice versa) depending on the background.

This is one of the signature UI techniques used by modern creative studios like Awwwards-winning portfolios, Locomotive-powered sites, and agencies such as Studio Freight, Active Theory, and Locomotive.

If you're building your own portfolio or landing page, `mix-blend-mode: difference` combined with `position: fixed` is the simplest and most performant way to achieve this effect—no JavaScript is required unless you want additional animations.

Create an Awwwards-level hero section inspired by Studio Freight, Locomotive, Cuberto, and Active Theory.

Include:

• Fixed blend-mode heading
• mix-blend-mode:difference
• Lenis smooth scrolling
• GSAP ScrollTrigger animations
• Parallax images
• Floating SVG shapes
• Section reveal animations
• Text masking
• Clip-path transitions
• Cursor follower
• Noise/grain overlay
• Magnetic buttons
• Smooth typography animations
• Staggered text reveals
• Responsive design
• 120 FPS optimized animations
• Zero layout shift
• Accessible HTML
• High-performance CSS
• Modular, reusable code

The result should feel like a premium creative agency portfolio rather than a typical landing page.