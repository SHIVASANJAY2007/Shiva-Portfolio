# Prompt B: Antigravity IDE Build Spec

You are tasked with building a modern, interactive 3D portfolio website from scratch. Follow this specification exactly. Do not use any placeholders in the final code except where explicitly pulling from the CONTENT INPUT SCHEMA.

## 1. Tech Stack & Environment
- **Framework & Build:** React 18.2.0, Vite 5.0.0
- **Package Manager:** npm
- **Core Dependencies:**
  - `react`: ^18.2.0
  - `react-dom`: ^18.2.0
  - `three`: ^0.185.0
  - `@react-three/fiber`: ^8.18.0
  - `@react-three/drei`: ^9.122.0
  - `gsap`: ^3.15.0
  - `framer-motion`: ^10.16.0
  - `lenis`: ^1.3.23
  - `@theatre/core`: ^0.7.2
  - `@theatre/studio`: ^0.7.2
  - `zustand`: ^4.5.7
  - `svgl-react`: ^1.1.4
- **Vite Config:** 
  - Enable `react()` plugin.
  - Set `assetsInclude: ['**/*.glb', '**/*.gltf']`.
  - Server port `3000`.
  - Build `outDir: 'dist'`, `sourcemap: false`, `minify: 'esbuild'`.
  - Define `manualChunks` in rollupOptions: `reactVendor` (react, react-dom), `three` (three, r3f, drei), `vendor` (framer-motion, gsap).
- **Deployment (Vercel):**
  - Add `vercel.json` with headers for `source: "/models/(.*)"` setting `Cache-Control: public, max-age=31536000, immutable`.
- **TypeScript:** Use `.jsx` but include a basic `tsconfig.json` for ESNext/ES2020 module resolution if preferred, though raw `.jsx` is standard for this build.

## 2. Directory Architecture
Scaffold the `src` directory with this structure:
```text
src/
 ├─ components/
 │   ├─ 3D/ (HeroLoader, Knight, ModelViewer)
 │   ├─ common/ (ClickSpark, Loader, Navigation, Footer, Magnetic, Section)
 │   └─ sections/ (Hero, About, Skills, Projects, Experience, Contact, ModuleScroller)
 ├─ config/
 ├─ data/ (resume.js - populated from CONTENT INPUT SCHEMA)
 ├─ hooks/ (useScrollScene)
 ├─ providers/ (ModelProvider)
 ├─ styles/ (globals.css, plus module CSS for components)
 ├─ utils/ (TheatreStudio)
 ├─ App.jsx
 └─ main.jsx
```

## 3. Design System & Tokens
Implement `src/styles/globals.css` using these exact CSS Variables:
- **Colors:**
  - `--color-bg: #050505;`
  - `--color-text: #FFFFFF;`
  - `--color-text-muted: #A0A0A0;`
  - `--color-primary: [INSERT_PREFERRED_ACCENT_COLOR];`
  - `--color-surface: #111111;`
  - `--color-border: #333333;`
- **Typography:**
  - `--font-primary: 'Syne', sans-serif;`
  - `--font-secondary: 'Space Mono', monospace;`
  - `--font-heading: 'Syne', sans-serif;`
  - Scales: `--text-h1: 64px`, `h2: 48px`, `h3: 36px`, `h4: 28px`, `h5: 24px`, `h6: 20px`, `body-lg: 18px`, `body: 16px`, `body-sm: 14px`.
  - Line Heights: `tight: 1.2`, `normal: 1.5`, `relaxed: 1.8`.
- **Spacing (8px base):**
  - `space-1: 4px` to `space-24: 96px`.
- **Easings:**
  - `--easing-ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);`
  - `--easing-ease-in: cubic-bezier(0.42, 0, 0.58, 1);`

## 4. Animation & Interaction Mechanisms
Replicate these exact mechanics without hardcoding content into them:
1. **Lenis Smooth Scroll:** Initialize in `App.jsx` with `duration: 1.2`, `easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))`, `smoothWheel: true`.
2. **GSAP ScrollTrigger (Hero):**
   - Entrance stagger: `opacity: 0, x: -30` and `x: 30`, duration `0.8s`, ease: `cubic-bezier(0.215, 0.61, 0.355, 1)`.
   - Parallax blobs: `y: -80` (scrub 1.2) and `y: -50` (scrub 1.8).
   - Scroll fade-out: Content drifts `y: -60`, `opacity: 0` (scrub 1).
3. **ClickSpark:** A canvas overlay (`mixBlendMode: 'difference'`, pointerEvents: 'none'). On click, emits 8 radial lines of length `10px`, traveling outward by `15px`, duration `400ms`, easing out, drawn dynamically with `ctx.lineTo`.
4. **3D Scene Pipeline (R3F):**
   - Canvas settings: `shadows`, `alpha: true`, `ACESFilmicToneMapping`, `toneMappingExposure: 1.1`, dpr `[1.5, 2]`.
   - Lighting: Ambient `0.6`, Directional `[5, 5, 5]` intensity `1.2` (castShadow `mapSize={[2048, 2048]}`, `bias={-0.0001}`), secondary directional `[-5, 3, -5]` intensity `0.5`. Environment preset: `"city"`.
   - Camera Rig: LookAt target `Vector3(0.035, 2.047, 0.157)`, Spherical orbit `(3.705, 1.602, -0.002)`.
   - Loading Strategy: Use `@react-three/drei` `useProgress` wrapped in a custom `ModelProvider` context to drive a global DOM-based preloader until `progress === 100`, then mount the `<Suspense>` bounded model.

## 5. CONTENT INPUT SCHEMA
*Before generating code, populate these values from the user, or prompt the user for them if left blank.*
- `NAME`: [User Name]
- `ROLE_PRIMARY`: [e.g., Full-Stack Developer]
- `ROLE_SECONDARY`: [e.g., AI Engineer]
- `EMAIL`: [Email Address]
- `PHONE`: [Phone Number]
- `LOCATION`: [Location]
- `BIO_SUMMARY`: [Professional Summary]
- `SOCIAL_LINKEDIN`: [URL]
- `SOCIAL_GITHUB`: [URL]
- `EDUCATION`: [{ institution, degree, status/score, date }]
- `PROJECTS`: [{ name, year, description, highlights }]
- `SKILLS`: [{ category, items }]
- `EXPERIENCE`: [{ title, organization, focus, achievements }]
- `PREFERRED_ACCENT_COLOR`: [Hex Code, e.g. #E8696A]
- `3D_MODEL_URL`: [Absolute URL or /models/filename.glb]

## 6. Large 3D Asset Handling
The 3D model asset is too large to generate inline. 
1. Instruct the user to place their `.glb` file in the `public/models/` directory (e.g., `public/models/hero-model.glb`).
2. Use `useGLTF(3D_MODEL_URL)` in the 3D component.
3. Apply draco/meshopt compression dynamically if the GLTF contains it (standard Drei `useGLTF` behavior).

## 7. Build Order execution
Execute the build in these strict phases:
1. **Scaffold:** Initialize `package.json`, Vite config, Vercel config, and install all dependencies.
2. **Design Tokens:** Create `globals.css` with the exact variables.
3. **Layout/Sections:** Create basic components (`App.jsx`, Navigation, Footer, Section wrappers).
4. **Content Wiring:** Populate `src/data/resume.js` and wire it into the layout components.
5. **Animation Mechanisms:** Implement `ClickSpark.jsx`, `Lenis` in App, and GSAP ScrollTriggers in the Hero/Sections.
6. **3D Scene:** Implement `ModelProvider`, the `HeroCanvas`, `CameraRig`, and the Suspense model loader.
7. **Deploy:** Verify the build script works successfully locally.

## 8. Acceptance Checklist
- [ ] Vite dev server runs without errors.
- [ ] Global styling respects the dark theme and font scales.
- [ ] Lenis smooth scrolling functions globally.
- [ ] Clicking creates the canvas spark effect.
- [ ] The 3D model loads, displays shadows, respects ACESFilmic tone mapping, and sits at the specified camera spherical orbit.
- [ ] Scroll triggers animate opacity and Y-axis drifts accurately.
- [ ] No hardcoded placeholder text remains (all driven by the Content Input Schema).