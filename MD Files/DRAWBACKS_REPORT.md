# 🔍 SHIVA Portfolio — Full Project Drawbacks Report

> **Audit Date:** June 4, 2026  
> **Scope:** Full static code analysis, build test, architecture review, UX, SEO, performance, and security audit.

---

## 🔴 CRITICAL ISSUES (Must Fix Before Deployment)

---

### 1. Build Failure — `terser` Not Installed
**File:** `vite.config.js` (line 13)

The production build **fails completely** because `terser` is specified as the minifier but is not installed as a dependency.

```
[vite:terser] terser not found. Since Vite v3, terser has become an optional dependency.
```

**Fix:** Either install terser, or switch to the built-in esbuild minifier:
```js
// vite.config.js
minify: 'esbuild', // instead of 'terser'
```
Or: `npm install --save-dev terser`

---

### 2. Broken GitHub URL — Underscore in Username
**Files:** `src/data/resume.js` (line 17), `src/components/common/Navigation.jsx` (line 86), `src/components/sections/Contact.jsx` (line 113)

GitHub usernames **cannot contain underscores**. The URL `https://github.com/Shiva_Sanjay` is invalid and will result in a 404 page.

```js
// resume.js — line 17
github: 'https://github.com/Shiva_Sanjay', // ❌ Invalid URL
```
**Fix:** Verify and correct the GitHub username (e.g., `ShivaSanjay` or `shiva-sanjay`).

---

### 3. Extremely Large 3D Model Assets — Bundle Size Crisis
**Location:** `public/models/` directory

The models folder contains gigantic GLB files that will make the site essentially unusable on any non-enterprise internet connection:

| Model | Size |
|---|---|
| `leaves_in_the_garden.glb` | **~97 MB** |
| `spartan_armour_mkv_-_halo_reach.glb` | **~130 MB** |
| `the_forgotten_knight.glb` | **~84 MB** |
| `silent_ash.glb` | **~37 MB** |
| `1970_dodge_charger_rt_fast__furious.glb` | **~7.8 MB** |

**Impact:** A user on a 10 Mbps connection would wait **~80+ seconds** just for the leaves background to load. Most users will abandon the site immediately.

**Fix:**
- Use Draco or MeshOpt compression to reduce GLB sizes by 70–90%
- Use progressive loading and LOD (Level of Detail) models
- Consider replacing with lower-poly alternatives

---

### 4. `three-mesh-bvh` Version Incompatibility Warning
**Source:** Build output

```
"BatchedMesh" is not exported by "node_modules/three/build/three.module.js"
```

The `three-mesh-bvh` package version is incompatible with the installed version of Three.js (`^0.158.0`). This is a silent breaking issue that may cause rendering errors on some 3D features.

**Fix:** Align `three` and `three-mesh-bvh` versions, or update Three.js to a version that exports `BatchedMesh`.

---

## 🟠 HIGH SEVERITY ISSUES

---

### 5. Contact Form Sends No Real Email — Mailto Fallback Only
**File:** `src/components/sections/Contact.jsx` (lines 25–37)

The contact form looks like a real form, but clicking "Send Message" simply opens the user's **local email client** via a `mailto:` link. This is a misleading UX pattern:
- The email address input is collected but **never included in the mailto body**
- Users without a default email client configured get a broken experience
- There is no server-side sending, no validation feedback, no copy is stored

**Fix:** Integrate a proper form backend (Formspree, EmailJS, Resend, or a custom serverless endpoint).

---

### 6. Memory Leaks — Multiple Concurrent WebGL Contexts
**Files:** `SilentAshModel.jsx`, `KnightModel.jsx`, `Dragon.jsx`, `BackgroundModel.jsx`, `CarScrollModel.jsx`

Each `<Canvas>` component from React Three Fiber creates a separate WebGL rendering context. Browsers cap WebGL contexts at **8–16 per page**. The portfolio has **at least 5 separate Canvases** running simultaneously.

**Impact:**
- GPU memory exhaustion leading to black/blank model renders
- Significant CPU/GPU overhead from parallel render loops
- Context loss errors on lower-end devices and mobile

**Fix:** Consolidate all 3D scenes into a single shared `<Canvas>`, using portals or multiple scenes within one renderer.

---

### 7. No Mobile Hamburger Menu
**File:** `src/components/common/Navigation.jsx`

On mobile (`<768px`), the navigation renders all links in a horizontal row with no hamburger menu or drawer. The nav becomes visually broken and overlapping on small screens.

**Fix:** Implement a responsive hamburger menu with a mobile drawer.

---

### 8. No Error Boundaries Around 3D Components
**Files:** All `3D/` components

If a GLTF model fails to load (network error, 404, corrupted file) or WebGL is unavailable, the entire page crashes with a blank white screen. There are no `ErrorBoundary` wrappers providing fallback UI.

**Fix:** Wrap all `<Canvas>` and `<Suspense>` components in `<ErrorBoundary>` components with graceful fallback displays.

---

### 9. `CarScrollModel` References Unused/Unmounted Model
**File:** `src/components/3D/CarScrollModel.jsx` (line 48)

```js
const { scene } = useGLTF('/car_model/car.gltf');
```

The `CarScrollModel` loads `/car_model/car.gltf` (Apollo car), but this component is **never imported or used** in `App.jsx` or any section component. However, `useGLTF.preload('/car_model/car.gltf')` is still called at module level (line 413), meaning the ~11 MB `scene.bin` is **preloaded for no reason**, wasting bandwidth.

**Fix:** Either integrate `CarScrollModel` into the portfolio or remove it and its preload call.

---

### 10. `Dragon.jsx` is Orphaned — Never Used
**File:** `src/components/3D/Dragon.jsx`

The `Dragon.jsx` component (271 lines) is defined and exported but **never imported anywhere** in the application. It references Three.js geometry but has dead code that is still being bundled.

**Fix:** Either integrate the component or remove it from the codebase.

---

### 11. `BackgroundModel.jsx` is Also Orphaned
**File:** `src/components/3D/BackgroundModel.jsx`

`BackgroundModel` is defined but **never imported or rendered**. It references `leaves_in_the_garden.glb` (97 MB), but `LeavesBackground.jsx` also references the same model. Both exist in parallel with duplicated camera rig logic.

**Fix:** Consolidate into one component or remove the unused one.

---

## 🟡 MEDIUM SEVERITY ISSUES

---

### 12. `previousScrollY` Declared Inside `useFrame` Callback — Recreated Every Frame
**File:** `src/components/3D/CarScrollModel.jsx` (line 77)

```js
let previousScrollY = 0;
useFrame((state) => {
  // ...
  const velocity = sy - previousScrollY; // ❌ always 0 or wrong
  previousScrollY = sy;                  // ❌ resets every frame
```

`previousScrollY` is declared inside `useFrame`'s parent closure but outside `useRef`. It's reset on every module re-execution and may not persist correctly across frames in strict mode. This should be a `useRef`.

---

### 13. `position` State Declared but Never Used in `Magnetic.jsx`
**File:** `src/components/common/Magnetic.jsx` (line 6)

```js
const [position, setPosition] = useState({ x: 0, y: 0}); // ❌ never used
```

This `useState` is declared but `position` is never referenced. This is dead state that causes unnecessary re-renders.

---

### 14. `useEffect` Missing from `DragonScene` Camera Setup
**File:** `src/components/3D/Dragon.jsx` (lines 210–214)

```js
useEffect(() => {
  camera.position.z = 4;
  camera.fov = 75;
}, [camera]);
```

`updateProjectionMatrix()` is never called after setting `camera.fov`, meaning the FOV change may not take effect.

---

### 15. Inline Styles Mixed with CSS Modules Inconsistently
**Files:** `Loader.jsx`, `AbstractBackground.jsx`, `SilentAshModel.jsx`, `KnightModel.jsx`, `LeavesBackground.jsx`

Several components use heavy inline styles (entire positioning, colors, font sizes) while the rest of the codebase uses CSS modules. This makes theming, maintenance, and responsive design much harder.

---

### 16. Variant Animations Redefined Inside Component Functions
**Files:** `Projects.jsx`, `Skills.jsx`, `Experience.jsx`, `Contact.jsx`

`containerVariants` and `itemVariants` objects are redeclared inside the component function body on every render, causing unnecessary object allocations:

```js
export const Projects = () => {
  const containerVariants = { ... }; // ❌ recreated on every render
  const itemVariants = { ... };      // ❌ recreated on every render
```

**Fix:** Move these to module-level constants (as correctly done in `Hero.jsx` and `About.jsx`).

---

### 17. `useScramble` Has No Cleanup for `requestAnimationFrame`
**File:** `src/hooks/useScramble.js` (lines 14–35)

The `tick` function uses recursive `requestAnimationFrame` calls with no cancellation token. If the component unmounts during the scramble animation, the RAF continues running in the background, causing memory leaks and potential state-update-on-unmounted-component warnings.

---

### 18. `Lenis` RAF Loop Not Integrated with Three.js `useFrame`
**File:** `src/App.jsx` (lines 25–30)

Lenis has its own `requestAnimationFrame` loop running separately from React Three Fiber's render loop. This can cause subtle scroll synchronization issues, especially with the `CarScrollModel` which reads `window.scrollY` directly inside `useFrame`.

**Fix:** Use Lenis's documented integration with R3F where Lenis is ticked inside the R3F `useFrame`.

---

### 19. No `rel="noopener noreferrer"` on Several External Links
**File:** `src/components/common/Navigation.jsx` (line 85–93)

The GitHub link in the nav has `target="_blank"` but is missing `rel="noopener noreferrer"`:

```jsx
<motion.a href="https://github.com/Shiva_Sanjay" target="_blank" // ❌ missing rel
```

This is a security vulnerability (reverse tabnapping).

---

### 20. Proficiency Bars Are Hardcoded, Not Data-Driven
**File:** `src/components/sections/Skills.jsx` (lines 86–139)

The "Proficiency Overview" bars (`Backend: 65%`, `Frontend: 70%`, etc.) are fully hardcoded in JSX rather than being driven by data from `resume.js`. If skills data changes, this section must be manually updated separately.

---

### 21. The `useSceneStore` `showAnnotations` State is Never Used
**File:** `src/store/sceneStore.js` (lines 12–13)

```js
showAnnotations: true,
setShowAnnotations: (val) => set({ showAnnotations: val }),
```

These store fields are defined but never read or set by any component. This is dead store state.

---

## 🟢 LOW SEVERITY / IMPROVEMENT SUGGESTIONS

---

### 22. No `favicon.ico` in `public/`
**File:** `public/` directory

There is no favicon defined for the site. Browsers will show the default favicon (or a broken icon tab). The `index.html` doesn't include a `<link rel="icon">` tag either.

---

### 23. No `og:image` or Social Share Meta Tags
**File:** `index.html`

The `<head>` is missing Open Graph and Twitter Card meta tags:
- `og:image` — no preview image when shared on social media
- `og:type`, `og:url`, `og:title`
- `twitter:card`, `twitter:image`

This hurts discoverability and professionalism when the portfolio link is shared.

---

### 24. `About` Section Has Hardcoded Stat Numbers
**File:** `src/components/sections/About.jsx` (lines 94–98)

```jsx
<span className={styles.number}>4</span><p>Awards</p>
<span className={styles.number}>2+</span><p>Languages</p>
<span className={styles.number}>2</span><p>Projects</p>
```

These numbers are hardcoded and do not automatically reflect the actual counts in `resumeData`. If you add a new project or award, this section won't update automatically.

---

### 25. `useScrollScene` Observer May Miss Fast Scrolls
**File:** `src/hooks/useScrollScene.js`

The `IntersectionObserver` has a `rootMargin: '-30% 0px -30% 0px'` which means only sections in the middle 40% of the viewport trigger. Very fast scrolling can skip sections entirely, causing the background camera to stay on a stale mode.

---

### 26. No Loading Fallback for 3D Models
**Files:** `SilentAshModel.jsx`, `KnightModel.jsx`, `BackgroundModel.jsx`

All use `<Suspense fallback={null}>`, meaning while the model loads (which given the file sizes could take minutes), the user sees **absolutely nothing** in the model area — no spinner, no placeholder, no skeleton UI.

---

### 27. `Loader.jsx` Uses a Fake Progress Bar
**File:** `src/components/common/Loader.jsx` (lines 17–27)

The loader fakes progress with random intervals (`current += Math.random() * 15`), unrelated to actual asset loading. The actual Three.js `useProgress` is tracked but mixed with the fake counter in a confusing way. This can hide genuine loading problems.

---

### 28. No `aria-label` on Icon-Only Buttons
**Files:** `Navigation.jsx`, `ProjectCard.jsx`

Navigation links and the project card toggle arrow (↓) have no `aria-label` attributes, making the site inaccessible to screen reader users.

---

### 29. `AbstractBackground` is Completely Empty
**File:** `src/components/common/AbstractBackground.jsx`

This component renders only a simple radial gradient background div. Given the complexity of the rest of the 3D scene, this component does essentially nothing and could be replaced with a single CSS rule on `body` or removed entirely.

---

### 30. Missing `key` Props on Stable Values — Array Index Anti-pattern
**Files:** `About.jsx`, `Skills.jsx`, `Experience.jsx`, `Contact.jsx`

All list renders use `idx` (array index) as the React `key`. While the data is static, this is considered a React anti-pattern as it disables reconciliation optimization and can cause subtle animation bugs with Framer Motion's `layoutId`.

---

## 📋 SUMMARY TABLE

| # | Issue | Severity | Category |
|---|---|---|---|
| 1 | Build fails — terser missing | 🔴 Critical | Build |
| 2 | Broken GitHub URL (underscore) | 🔴 Critical | Data |
| 3 | Gigantic 3D model sizes (97–130 MB each) | 🔴 Critical | Performance |
| 4 | `three-mesh-bvh` version mismatch | 🔴 Critical | Build |
| 5 | Contact form doesn't send email | 🟠 High | Functionality |
| 6 | Multiple WebGL contexts — memory leak risk | 🟠 High | Performance |
| 7 | No mobile hamburger menu | 🟠 High | UX / Responsive |
| 8 | No error boundaries on 3D components | 🟠 High | Stability |
| 9 | CarScrollModel loaded but unused | 🟠 High | Code Quality |
| 10 | Dragon.jsx never used (dead code) | 🟠 High | Code Quality |
| 11 | BackgroundModel.jsx orphaned | 🟠 High | Code Quality |
| 12 | `previousScrollY` inside closure bug | 🟡 Medium | Correctness |
| 13 | Unused `position` state in Magnetic | 🟡 Medium | Code Quality |
| 14 | Missing `updateProjectionMatrix()` in Dragon | 🟡 Medium | Correctness |
| 15 | Inline styles vs CSS modules inconsistency | 🟡 Medium | Maintainability |
| 16 | Animation variants redeclared inside components | 🟡 Medium | Performance |
| 17 | `useScramble` RAF has no cleanup/cancellation | 🟡 Medium | Memory Leak |
| 18 | Lenis not integrated with R3F `useFrame` | 🟡 Medium | Correctness |
| 19 | Missing `rel="noopener noreferrer"` on nav link | 🟡 Medium | Security |
| 20 | Proficiency bars hardcoded instead of data-driven | 🟡 Medium | Maintainability |
| 21 | `showAnnotations` store state never used | 🟡 Medium | Code Quality |
| 22 | No favicon | 🟢 Low | UX |
| 23 | No Open Graph / social share meta tags | 🟢 Low | SEO |
| 24 | About section stats hardcoded | 🟢 Low | Maintainability |
| 25 | `IntersectionObserver` may miss fast scroll | 🟢 Low | UX |
| 26 | `<Suspense fallback={null}>` — no loading UI | 🟢 Low | UX |
| 27 | Loader uses fake/random progress bar | 🟢 Low | UX |
| 28 | No `aria-label` on icon elements | 🟢 Low | Accessibility |
| 29 | `AbstractBackground` does almost nothing | 🟢 Low | Code Quality |
| 30 | Array index used as React `key` | 🟢 Low | Code Quality |

---

*Report generated by full static analysis of all source files in `src/`, build test with `vite build`, and architecture review.*
