# Sticky Scroll Section with Synchronized Content & Video Transitions

## Overview

This implementation creates a modern **sticky scrolling experience** where:

* An introductory section remains pinned while the user begins scrolling.
* A two-column sticky layout follows.
* The **left panel** displays descriptive content.
* The **right panel** displays synchronized videos.
* As the user scrolls, both the text and corresponding video transition smoothly.
* The entire interaction is powered using **GSAP ScrollTrigger**.

---

# Project Structure

```
HTML
├── Intro Section
│   └── Sticky Heading
│
└── Sticky Tabs Section
    ├── Left Content
    │   ├── Feature 1
    │   ├── Feature 2
    │   └── Feature 3
    │
    └── Right Media
        ├── Video 1
        ├── Video 2
        └── Video 3

CSS
├── Global Variables
├── Layout
├── Responsive Design
├── Sticky Positioning
├── Animations
└── Component Styling

JavaScript
├── GSAP ScrollTrigger
├── Intro Pinning
├── Scroll Detection
└── Text & Video Synchronization
```

---

# Features

### Sticky Intro Section

* Pins the introductory content while scrolling.
* Creates a smooth transition into the main sticky section.
* Uses GSAP `ScrollTrigger`.

---

### Sticky Tabs Layout

* Two-column responsive design.
* Left column contains feature descriptions.
* Right column contains synchronized videos.
* Entire component remains sticky while the page scrolls.

---

### Scroll-Based Content Switching

During scrolling:

* Current text fades in.
* Previous text fades out.
* Matching video becomes visible.
* Previous video disappears.

The transition occurs automatically based on the user's scroll position.

---

### Smooth Video Transitions

Videos transition using:

* Opacity animation
* Vertical translate animation
* CSS transitions
* Hardware acceleration (`translate3d`) for improved performance

---

### Responsive Design

Optimized for:

* Desktop
* Tablet
* Mobile

Includes responsive adjustments for:

* Layout
* Typography
* Section height
* Padding
* Video containers

---

# Technologies Used

* HTML5
* CSS3
* JavaScript (ES6)
* GSAP
* GSAP ScrollTrigger
* Google Fonts (Poppins)

---

# Folder Contents

## HTML

Contains:

* Intro wrapper
* Sticky tabs layout
* Left-side feature content
* Right-side videos
* CTA button
* Award badge

---

## CSS

Responsible for:

* Theme variables
* Responsive layouts
* Sticky positioning
* Typography
* Button animations
* Video styling
* Scroll effects
* Component appearance

---

## JavaScript

Responsible for:

### 1. Registering ScrollTrigger

Initializes the GSAP plugin.

### 2. Pinning the Intro Section

Keeps the intro heading fixed until the next section reaches the viewport.

### 3. Detecting Scroll Progress

Continuously tracks the user's scroll position.

### 4. Synchronizing Content

Automatically switches:

* Active text block
* Active video

based on the current scroll position.

### 5. Handling the Final Section

Ensures the last content block remains visible until the user scrolls beyond the section.

---

# Animation Flow

```
User Starts Scrolling
        │
        ▼
Intro Section Pins
        │
        ▼
Sticky Tabs Section Begins
        │
        ▼
Scroll Progress Detected
        │
        ▼
Current Section Calculated
        │
        ▼
Previous Content Hidden
        │
        ▼
New Content Displayed
        │
        ▼
Matching Video Activated
        │
        ▼
Continue Until Final Section
```

---

# Visual Behaviour

```
Scroll ↓

Feature 1  ─────────► Video 1

Scroll ↓

Feature 2  ─────────► Video 2

Scroll ↓

Feature 3  ─────────► Video 3
```

Only one text block and one video are visible at any given time.

---

# Performance Optimizations

This implementation includes:

* CSS hardware acceleration
* Sticky positioning instead of frequent DOM manipulation
* Lightweight JavaScript logic
* Opacity-based transitions
* GPU-friendly transforms
* Responsive media rendering

---

# Dependencies

Include the following libraries before the JavaScript code:

```html
GSAP
GSAP ScrollTrigger
```

Google Font:

```text
Poppins
```

---

# Files Included

```
HTML
CSS
JavaScript
```

Each section should be placed in its respective file:

```
index.html
style.css
script.js
```

---

# Expected Result

The final output provides a polished landing-page interaction where:

* The introduction remains pinned while entering the experience.
* A sticky feature section occupies the viewport.
* Text and videos transition seamlessly based on scroll position.
* The interface feels smooth, modern, and engaging.
* The layout remains fully responsive across desktop and mobile devices.

---

# Source Code

The following sections contain the complete implementation:

* **HTML** – Structure and markup


  <div class="intro-wrapper">
    <div class="intro" style="display: flex; justify-content: center; align-items: center; position: relative; z-index: 1;">
      <div class="text-align-center" id="js-pin">
        <div class="max-width-small align-center">
          <div class="margin-bottom margin-small">
            <h2 class="heading-style-h3" ><span class="light-green-underline">149€/month</span> &amp; not a single worry</h2>
        </div>
        <p class="text-size-medium">
        We take care of registration, insurance, and maintenance to ensure you have 
        a hassle-free ride! <sup>*including theft coverage under certain conditions.</sup>
        </p>
      </div>
    </div>
  </div>
</div>
    
<section class="section_tabs" style="z-index: 2;">
   <div class="padding-section-large">
      <div class="tabs_height">
         <div class="tabs_sticky-wrapper">
            <div class="tabs_container">
               <div class="tabs_component">
                  <div class="tabs_left">
                     <div class="tabs_left-top">
                        <div class="tabs_let-content is-1">
                           <h2 class="heading-style-h4 text-color-gray100">Reinventing micro-mobility with <span class="text-color-green">Award winning</span> design</h2>
                           <div class="tabs_line"></div>
                           <p class="text-size-small text-color-gray400">Our mission is to close the gap between a scooter and a bike. Yoda is the lightest vehicle of its category, designed to be agile and fun for everyone to ride.</p>
                        </div>
                        <div class="tabs_let-content is-2">
                           <h2 class="heading-style-h4 text-color-gray100">Best in class energy management for <span class="text-color-green">optimal autonomy</span></h2>
                           <div class="tabs_line"></div>
                           <p class="text-size-small text-color-gray400">3 riding modes: 🌱 eco, ⚡️ normal & 🚀 boost - that offer up to 80 km range on one single charge with a swappable battery.</p>
                        </div>
                        <div class="tabs_let-content is-3">
                           <h2 class="heading-style-h4 text-color-gray100">Durable and effortless, <span class="text-color-green">all the way</span></h2>
                           <div class="tabs_line"></div>
                           <p class="text-size-small text-color-gray400">We spent years crafting Yoda, stripping away unnecessary components to deliver a <strong>simple</strong> and <strong>efficient</strong> mobility experience.</p>
                        </div>
                     </div>
                     <div class="tabs_left-bottom">
                        <div class="button is-green is-secondary">
                           <div class="button-text">Order today</div>
                           <div class="button-circle-wrapper">
                              <div class="button-icon _1 w-embed">
                                 <svg height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.66699 11.3332L11.3337 4.6665" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M4.66699 4.6665H11.3337V11.3332" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                                 </svg>
                              </div>
                              <div class="button-icon _2 w-embed">
                                 <svg height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.66699 11.3332L11.3337 4.6665" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M4.66699 4.6665H11.3337V11.3332" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path>
                                 </svg>
                              </div>
                           </div>
                           <div class="button-circlee background-color-green"></div>
                        </div>
                     </div>
                  </div>
                  <div class="tabs_right">
                     <div class="tabs_video is-1 w-background-video w-background-video-atom" style="display: flex; justify-content: flex-end; align-items: flex-start;">
                        <video id="video-1" autoplay="" loop="" muted="" playsinline="" data-object-fit="cover">
                           <source src="https://assets-global.website-files.com/65ae37af356fab4845432048/65be0fdac914d702e08f70ed_Yoda-Helmet_1-transcode.mp4" data-wf-ignore="true">
                           <source src="https://assets-global.website-files.com/65ae37af356fab4845432048/65be0fdac914d702e08f70ed_Yoda-Helmet_1-transcode.webm" data-wf-ignore="true">
                        </video>
                        <img src="https://assets-global.website-files.com/65ae37af356fab4845432048/65b0dc37d226a551affbf2ea_GDA24_HO_WINNER_MC_RGB.webp" loading="lazy" sizes="(max-width: 479px) 56px, 80px" srcset="https://assets-global.website-files.com/65ae37af356fab4845432048/65b0dc37d226a551affbf2ea_GDA24_HO_WINNER_MC_RGB-p-500.png 500w, https://assets-global.website-files.com/65ae37af356fab4845432048/65b0dc37d226a551affbf2ea_GDA24_HO_WINNER_MC_RGB.webp 1298w" alt="German design award winner 2024 logo." class="tabs_video-gda-badge">
                     </div>
                     <div class="tabs_video w-background-video w-background-video-atom">
                        <video id="video-2" autoplay="" loop="" muted="" playsinline="" data-object-fit="cover">
                           <source src="https://assets-global.website-files.com/65ae37af356fab4845432048/65ae37af356fab48454320ae_BatteryRemoval_Pingpong_001-transcode.mp4" data-wf-ignore="true">
                           <source src="https://assets-global.website-files.com/65ae37af356fab4845432048/65ae37af356fab48454320ae_BatteryRemoval_Pingpong_001-transcode.webm" data-wf-ignore="true">
                        </video>
                     </div>
                     <div class="tabs_video w-background-video w-background-video-atom">
                        <video id="video-3" autoplay="" loop="" muted="" playsinline="" data-object-fit="cover">
                           <source src="https://assets-global.website-files.com/65ae37af356fab4845432048/65be104f9aba74d774b7f4a3_Yoda-Exploded-50-transcode.mp4" data-wf-ignore="true">
                           <source src="https://assets-global.website-files.com/65ae37af356fab4845432048/65be104f9aba74d774b7f4a3_Yoda-Exploded-50-transcode.webm" data-wf-ignore="true">
                        </video>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   </div>
</section>
<div style="height:50vh;"></div>

* **CSS** – Styling, layout, responsiveness, and animations

@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');
:root {
	--gray-700: #424242;
	--gray-500: #737373;
	--black: black;
	--border-radius--tiny: .375rem;
	--light-grey: #f4f4f4;
	--border-radius--xtiny: .25rem;
	--gray-800: #292929;
	--gray-25: #fcfcfc;
	--gray-400: #a3a3a3;
	--gray-50: #fafafa;
	--gray-900: #141414;
	--dark-green: #25fabe;
	--green: #61ffc9;
	--nav--gray-800: #292929;
	--nav--gray-50: #fafafa;
	--gray-600: #525252;
	--white: white;
	--border-radius--xxsmall: .5rem;
	--gray-300: #d6d6d6;
	--gray-200: #e5e5e5;
	--gray-100: whitesmoke;
	--border-radius--xlarge: 2rem;
	--border-radius--xxtiny: .175rem;
	--border-radius--large-still: 1.75rem;
	--border-radius--0: 0rem;
	--border-radius--medium: 1.25rem;
	--border-radius--large-change: 1.75rem;
	--border-radius--xmedium: 1.5rem;
	--border-radius--xsmall: .75rem;
	--border-radius--small: 1rem;
	--border-radius--home-hero: 2rem;
	--nav--gray-700: #424242;
	--border-radius--about-image: 2rem;
	--border-radius--button-circle: 100vw;
	--nav--circle: #292929;
	--nav--y: #61ffc9;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
/*   overflow: hidden; */
  -webkit-overflow-scrolling: touch;
  touch-action: manipulation;
/*   scroll-behavior: smooth; */
}

body {
	margin: 0;
	height: 100%;
  font-family: "Poppins", sans-serif;
}
.intro-wrapper {
  position: relative;
  height: 90vh;
  background-color: #f8f8f8;
}
.intro {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  position: relative;
}
.text-align-center {
  max-width: 600px;
  text-align: center;
  position: absolute;
  top: 50px;
}
.text-align-center {
	text-align: center;
  scroll-behavior: smooth;
  height: 100%;
  will-change: transform, opacity;
}

.align-center {
	margin-left: auto;
	margin-right: auto;
}

.max-width-small {
	width: 100%;
	max-width: 30rem;
}

.margin-small {
	margin: 3.5rem;
	margin-bottom: 0;
}

.heading-style-h3 {
	letter-spacing: -.02em;
	font-size: 2.8125rem;
	font-weight: 500;
	line-height: 1;
}

.light-green-underline {
	box-shadow: none;
	display: inline-block;
}

p {
	color: var(--gray-500);
	margin-bottom: 5rem;
}

.text-size-medium {
	font-size: 1.125rem;
}

sup {
	top: 0em;
}

sub,
sup {
	vertical-align: baseline;
	font-size: 75%;
	line-height: 0;
	position: relative;
}

.section_tabs {
	z-index: 99;
	border-radius: var(--border-radius--xlarge);
	background-color: var(--gray-800);
	position: relative;
}

.padding-section-large {
	padding-top: 7rem;
	padding-bottom: 7rem;
	position: relative;
}
@media(max-width: 576px) {
  .padding-section-large {
    padding-top: 2rem;
    padding-bottom: 0rem;
  }
}

.tabs_height {
	height: 550vh;
}
@media(max-width: 576px) {
  .tabs_height {
    height: 600vh;
  }
}

.tabs_sticky-wrapper {
	height: 100vh;
	position: -webkit-sticky;
	position: sticky;
	top: 5vh;
}

.tabs_container {
	width: 100%;
	max-width: 120rem;
	margin-left: auto;
	margin-right: auto;
}

.tabs_component {
	height: 90vh;
	grid-column-gap: 1.5rem;
	grid-row-gap: 1.5rem;
	grid-template-rows: auto;
	grid-template-columns: .4fr 1fr;
	grid-auto-columns: 1fr;
	padding-left: 3.3%;
	padding-right: 3.3%;
	display: grid;
}
@media(max-width: 576px) {
  .tabs_component {
    grid-template-columns: 1fr;
  }
}

.tabs_left {
	border-radius: var(--border-radius--medium);
	background-color: var(--gray-700);
	flex-direction: column;
	justify-content: flex-end;
	align-items: stretch;
	padding: 1.5rem;
	display: flex;
}

.tabs_left-top {
	height: 100%;
	position: relative;
}

.tabs_let-content {
	width: 100%;
	height: 100%;
	text-align: center;
	flex-direction: column;
	justify-content: space-around;
	padding-top: 0%;
	padding-bottom: 0%;
	display: flex;
	position: absolute;
	opacity: 0;
	transition: opacity 0.5s;
}

.tabs_let-content.is-1 {
	opacity: 1;
}

.heading-style-h4 {
	letter-spacing: -.02em;
	font-size: 2.125rem;
	font-weight: 500;
	line-height: 1.05;
}
@media(max-width: 576px) {
  .heading-style-h4 {
    margin: 0;
    font-size: 20px;
  }
}

.text-color-gray100 {
	color: var(--gray-100);
}

.tabs_line {
	width: 100%;
	height: 1px;
	background-color: var(--gray-500);
}

.text-color-gray400 {
	color: var(--gray-400);
}

.text-size-small {
	font-size: 1rem;
}
@media(max-width: 576px) {
  .text-size-small {
    font-size: .875rem;
  }
}

.tabs_left-bottom {
	flex-direction: column;
	display: flex;
}

.button {
	grid-column-gap: .5rem;
	grid-row-gap: .5rem;
	border: 1px solid var(--gray-800);
	background-color: var(--gray-800);
	color: var(--gray-25);
	text-align: center;
	letter-spacing: .03em;
	text-transform: uppercase;
	cursor: pointer;
	border-radius: .6rem;
	justify-content: center;
	align-items: center;
	padding: .6rem 1.35rem;
	font-size: .875rem;
	text-decoration: none;
	transition: color .6s;
	display: flex;
	overflow: hidden;
}

.tabs_video,
.tabs_right,
.button {
	-webkit-backface-visibility: hidden;
	-moz-backface-visibility: hidden;
	-webkit-transform: translate3d(0, 0, 0);
	-moz-transform: translate3d(0, 0, 0);
}

.button.is-green {
	border-color: var(--green);
	background-color: var(--green);
	color: var(--gray-900);
}

.button.is-secondary {
	color: var(--gray-900);
	background-color: transparent;
	transition: border-color .6s, color .6s;
}

.button.is-green.is-secondary {
	color: var(--gray-25);
	background-color: rgba(97, 255, 201, 0);
}

.button-text {
	z-index: 2;
	position: relative;
}

.button-circle-wrapper {
	width: 1.25rem;
	height: 1.25rem;
	border-radius: 100vw;
	justify-content: center;
	align-items: center;
	display: flex;
	position: relative;
	overflow: hidden;
}

.button-icon {
	z-index: 2;
	width: 1rem;
	height: 1rem;
	justify-content: center;
	align-items: center;
	display: flex;
	position: absolute;
}

.button-circlee {
  color: var(--white);
	width: 80%;
	aspect-ratio: 1 / 1;
	border-radius: var(--border-radius--button-circle);
	position: absolute;
	top: 0;
  transform: translate3d(0px, 0%, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
    transform-style: preserve-3d;
    height: 250px;
    transition: all .2s ease-in-out;
    will-change: transform, width, height, color;
    border: 1px solid transparent;
}
.button.is-green.is-secondary:hover {
  color: var(--gray-800);
  border-color: var(--green);
}
.button.is-green.is-secondary:hover .button-circlee {
	
	background-color: var(--green);
  transform: translate3d(0px, -43%, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
  width: 100%;
}

.tabs_right {
	width: 100%;
	height: 100%;
	border-radius: var(--border-radius--medium);
	position: relative;
	overflow: hidden;
	grid-area: span 1 / span 1 / span 1 / span 1;
}

.w-background-video {
	height: 500px;
	color: #fff;
	position: relative;
	overflow: hidden;
}

.tabs_video {
	width: 100%;
	height: 100%;
	border-radius: var(--border-radius--medium);
	object-fit: cover;
	position: absolute;
	opacity: 0;
	transition: opacity 0.5s;
}

.tabs_video.is-1 {
	opacity: 1;
}

audio,
canvas,
progress,
video {
	vertical-align: baseline;
	display: inline-block;
}

.w-background-video>video {
	width: 100%;
	height: 100%;
	object-fit: cover;
	z-index: -100;
	background-position: 50%;
	background-size: cover;
	margin: auto;
	position: absolute;
	top: -100%;
	bottom: -100%;
	left: -100%;
	right: -100%;
}

img {
	border: 0;
	max-width: 100%;
	vertical-align: middle;
	display: inline-block;
}

.tabs_video-gda-badge {
	width: 5rem;
	margin-bottom: 1.5rem;
	object-fit: cover;
	position: relative;
	z-index: 2;
	margin-top: 2rem;
	margin-right: 2rem;

}

.w-background-video {
	width: 100%;
	height: 100%;
	color: #fff;
	position: relative;
	overflow: hidden;
}

.video-container {
	width: 100%;
	height: 100%;
	position: relative;
}

.tabs_video {
	width: 100%;
	height: 100%;
	border-radius: var(--border-radius--medium);
	object-fit: cover;
	position: absolute;
	opacity: 0;
	transform: translateY(100%);
	transition: opacity 0.5s, transform 0.5s;
}

.tabs_video.is-1 {
	opacity: 1;
	transform: translateY(0);
}

* **JavaScript** – GSAP configuration, sticky behavior, and synchronized scroll interactions

gsap.registerPlugin(ScrollTrigger);

// Pin the intro text section
ScrollTrigger.create({
  trigger: ".intro-wrapper",
  start: "top top",
  end: "bottom top",
  pin: ".text-align-center",
  pinSpacing: false
});

// Handling the scroll for the tabs
document.addEventListener("scroll", function () {
  let scrollPosition = window.scrollY;
  let windowHeight = window.innerHeight + 550; // +550 = increasing the scroll distance before each class changes
  let sections = document.querySelectorAll('.tabs_let-content');
  let videos = document.querySelectorAll('.tabs_video');
  let lastSectionIndex = sections.length - 1;

  sections.forEach((section, index) => {
    if (scrollPosition >= (index * windowHeight) && scrollPosition < ((index + 1) * windowHeight)) {
      section.classList.add('is-1');
      videos[index].classList.add('is-1');
    } else {
      // Remove is-1 class from all sections except the last one
      if (index !== lastSectionIndex) {
        section.classList.remove('is-1');
        videos[index].classList.remove('is-1');
      }
    }
  });

  // Keep is-1 class on the last section until user scrolls past it
  if (scrollPosition > (lastSectionIndex * windowHeight)) {
    sections[lastSectionIndex].classList.add('is-1');
    videos[lastSectionIndex].classList.add('is-1');
  } else {
    sections[lastSectionIndex].classList.remove('is-1');
    videos[lastSectionIndex].classList.remove('is-1');
  }
});