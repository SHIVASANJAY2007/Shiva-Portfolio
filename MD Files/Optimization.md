---
name: portfolio-performance-optimization
description: Use this skill whenever working on Shiva's portfolio (React Three Fiber / Three.js, GSAP, Framer Motion, Theatre.js, Vercel) and touching anything related to performance, loading screens, 3D model integration, animation, bundle size, or Lighthouse scores. Trigger this proactively any time new 3D models, sections, animations, or transitions are added — not just when the user explicitly says "optimize." Covers concrete code patterns, not just checklists: Draco/KTX2 compression commands, R3F render-on-demand setup, GSAP/Framer Motion/Theatre.js coexistence rules, loading screen orchestration, and Vercel-specific config.
---

# Portfolio Performance Optimization

A working playbook for a 3D-heavy, animation-heavy personal portfolio (React Three Fiber + GSAP + Framer Motion + Theatre.js, deployed on Vercel). This isn't a generic checklist — every section has copy-pasteable patterns for *this* stack. Read the relevant section before adding a model, animation, or section; don't wait until "optimization day."

## How to use this file

1. If you're adding a new 3D model → read **3D Models & R3F Rendering**.
2. If you're adding/editing animation (GSAP, Framer Motion, Theatre.js) → read **Animation Stack Rules**.
3. If you're touching the loading screen or route transitions → read **Loading Screen Orchestration**.
4. If you're about to deploy or run Lighthouse → read **Pre-Deploy Gate** at the bottom and actually run through it, don't skim it.

---

## Target Numbers (non-negotiable, not aspirational)

| Metric | Target | Why it matters for a 3D portfolio |
|---|---|---|
| LCP | < 2.5s | Hero/3D canvas is usually the LCP element — see canvas LCP note below |
| INP | < 200ms | GSAP ScrollTrigger + R3F pointer events both compete for main thread |
| CLS | < 0.1 | Canvas + lazy sections are the #1 CLS source — always reserve space |
| TTI (interactive) | < 3.5s on 4G | Model/texture downloads shouldn't block interactivity |
| JS bundle (initial) | < 250KB gzipped | three.js + r3f + drei + gsap + framer-motion add up fast |
| Total GLB payload (above fold) | < 2MB | Everything else lazy-loads on scroll/interaction |
| Lighthouse Performance | 90+ mobile, 95+ desktop | Mobile is the honest number — test mobile first, not desktop |

**Canvas-as-LCP trap:** if your `<Canvas>` is the largest element on first paint, Lighthouse may flag it as the LCP element even though nothing has rendered yet (it's an empty `<canvas>` tag). Fix by giving the loading screen / poster image actual paintable content until the first frame renders — don't rely on the canvas element itself to "count" as LCP.

---

## 3D Models & R3F Rendering

### Asset pipeline (do this before the model ever touches React)

```bash
# 1. Compress geometry with Draco
gltf-transform draco input.glb output-draco.glb

# 2. Compress textures to KTX2 (much bigger win than Draco for texture-heavy models)
gltf-transform ktx compress output-draco.glb output-final.glb --slots "baseColor" --lossy

# 3. Resize + dedupe + prune in one pass (gltf-transform CLI)
gltf-transform optimize input.glb output.glb \
  --texture-compress webp \
  --texture-size 1024x1024 \
  --simplify \
  --instance

# 4. Sanity check the result
gltf-transform inspect output.glb
```

Budget per model: hero/centerpiece models **< 1.5MB** compressed, secondary/background models **< 500KB**. If `gltf-transform inspect` shows a model over budget, cut polygon count or texture resolution before shipping — don't just hope compression fixes it.

### Loading in React Three Fiber

```jsx
// Always preload critical models, always use Suspense boundaries per-model
// (not one giant Suspense around the whole scene — that blocks everything)
import { useGLTF } from '@react-three/drei'

function DragonModel() {
  const { scene } = useGLTF('/models/dragon-draco.glb')
  return <primitive object={scene} />
}
useGLTF.preload('/models/dragon-draco.glb')

// In the scene:
<Suspense fallback={<ModelPlaceholder />}>
  <DragonModel />
</Suspense>
```

- **Never** wrap the entire `<Canvas>` in a single `<Suspense>` with no fallback — you get a blank canvas with no feedback, which reads as broken, not loading.
- Dispose geometries/materials on unmount for any model that isn't persistent across routes:
```jsx
useEffect(() => {
  return () => {
    scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose()
      if (obj.material) obj.material.dispose?.()
    })
  }
}, [scene])
```

### Render-on-demand (the single biggest R3F perf win for a portfolio)

A portfolio scene is mostly static — no reason to render 60fps when nothing's moving.

```jsx
<Canvas frameloop="demand" dpr={[1, 2]}>
```

Then invalidate manually when something actually changes (camera move, animation tick, model swap):
```jsx
import { useThree } from '@react-three/fiber'
const invalidate = useThree((s) => s.invalidate)
// call invalidate() inside GSAP/Theatre.js onUpdate callbacks
```

This is critical because GSAP/Theatre.js animations run outside R3F's own render loop — if you don't invalidate, the canvas won't visually update even though your animation library thinks it's running.

### Other R3F-specific rules

- Cap pixel ratio: `dpr={[1, Math.min(window.devicePixelRatio, 2)]}` — never let a Retina/4K display force 3x rendering.
- Merge static meshes with `mergeGeometries` (three-stdlib) instead of rendering 20 separate `<mesh>` for one static prop.
- Use `<Bvh>` from drei for raycasting-heavy scenes (hover interactions on complex geometry) instead of raw raycasting against every mesh.
- Lights: cap at 2–3 dynamic lights max; bake ambient occlusion / lighting into textures where the model is static.
- Pause the render loop entirely on tab blur:
```jsx
useEffect(() => {
  const onVisibility = () => {
    gl.setAnimationLoop(document.hidden ? null : renderLoop)
  }
  document.addEventListener('visibilitychange', onVisibility)
  return () => document.removeEventListener('visibilitychange', onVisibility)
}, [])
```

---

## Animation Stack Rules

You're running **three** animation systems (GSAP, Framer Motion, Theatre.js) plus R3F's own loop. The #1 risk isn't any one of them being slow — it's them fighting over the same properties or the same frame.

### Division of labor (pick one owner per concern, don't overlap)

| Use case | Owner | Why |
|---|---|---|
| Scroll-triggered DOM animation (text reveal, section pinning) | GSAP + ScrollTrigger | Best scroll-perf primitives, `will-change` handling built in |
| UI micro-interactions (buttons, cards, page transitions) | Framer Motion | Declarative, integrates with React unmount/exit animations |
| Cinematic 3D camera paths / choreographed model sequences | Theatre.js | Built for keyframed 3D timelines, scrubbable in Studio |
| Per-frame 3D object animation (idle rotation, shaders) | R3F `useFrame` | Runs inside the render loop itself, no cross-library sync issues |

**Never** animate the same DOM element or the same 3D property from two different libraries — you'll get last-write-wins flicker and wasted work. If GSAP is pinning a section, Framer Motion should not also be animating `y` on children inside it.

### Hard rules for all three

- Animate only `transform` and `opacity` on DOM. Never animate `width`, `height`, `top`, `left`, `margin` — these force layout recalculation every frame (this holds even more here than in the original checklist, since you're already spending frame budget on the 3D canvas).
- `will-change: transform` only on elements actively animating, removed after animation completes — leaving it on permanently bloats GPU memory.
- Kill/pause GSAP ScrollTriggers and Theatre.js sequences on route unmount:
```jsx
useEffect(() => {
  return () => {
    ScrollTrigger.getAll().forEach(t => t.kill())
  }
}, [])
```
- Respect `prefers-reduced-motion` at the top level — disable camera fly-throughs and parallax, not just fade durations:
```js
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (reduce) { /* skip Theatre.js camera sequence, use instant cuts */ }
```
- Framer Motion: use `LazyMotion` + `domAnimation` feature bundle instead of the full `motion` import to cut ~30KB from the bundle if you're not using layout animations.

---

## Loading Screen Orchestration

For a 3D-heavy site the loading screen isn't cosmetic — it's the thing standing between a blank canvas and a real Core Web Vitals hit. Treat it as a state machine, not a spinner.

```jsx
// Track combined progress across ALL heavy assets, not just one model
const [progress, setProgress] = useState({ models: 0, textures: 0, fonts: 0 })
const overallReady = progress.models === 1 && progress.textures === 1 && progress.fonts === 1

useProgress() // from @react-three/drei — hook into this for GLTF/texture progress
```

Rules:
- Show real progress (asset-driven percentage), not a fake timed animation — a fake loader that finishes before assets are ready causes a jank/freeze right after "100%."
- Preload only what's needed for the **first viewport**. Everything below the fold (secondary models, later sections) loads lazily on scroll/intersection, not during the initial loading screen.
- Use `<link rel="preload">` for the hero GLB and the primary webfont only — preloading everything defeats the purpose.
- Once `overallReady` is true, don't just hide the loader — explicitly call `invalidate()` (if using `frameloop="demand"`) so the first real frame actually paints.
- Cross-fade the loader out over ~300–400ms rather than a hard cut; an instant unmount right as heavy JS executes is a common CLS/jank spot.

---

## Bundle Splitting (R3F-specific)

- Route-split any page/section that isn't the landing view: `const AboutScene = lazy(() => import('./AboutScene'))`.
- three.js itself is large — verify you're not importing the entire `three` namespace when you only need a few modules; drei and fiber tree-shake reasonably well but custom imports don't always.
- Split Theatre.js Studio (the visual editor) out of the production bundle entirely — it should only load in dev:
```js
if (import.meta.env.DEV) {
  const studio = (await import('@theatre/studio')).default
  studio.initialize()
}
```
- Check actual impact with `vite-bundle-visualizer` or `rollup-plugin-visualizer` after adding any new heavy dependency — don't guess.

---

## Vercel-Specific Config

- Serve GLB/KTX2/WOFF2 with long-cache immutable headers via `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/models/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
```
- Use Vercel's built-in image optimization for any 2D images (`next/image` if Next.js; otherwise serve pre-converted AVIF/WebP with `<picture>` fallback).
- Check the Vercel build output analyzer after each deploy for unexpected bundle growth — a new `npm install` for a "quick" library is the most common silent regression.
- Enable Speed Insights / Web Vitals reporting so regressions show up per-deploy, not just when you remember to run Lighthouse manually.

---

## Pre-Deploy Gate

Run through this before every deploy that touches models, animation, or sections — not just at the end of a big feature:

- [ ] Every new GLB run through `gltf-transform optimize` (Draco + KTX2), under budget (1.5MB hero / 500KB secondary)
- [ ] `frameloop="demand"` still in place; new animations call `invalidate()`
- [ ] No two animation libraries touching the same property
- [ ] Loading screen shows real progress and cross-fades out cleanly (no white flash / layout jump)
- [ ] `prefers-reduced-motion` respected for camera/parallax, not just fades
- [ ] Route-level code splitting still working (check Network tab — later sections shouldn't be in the initial JS payload)
- [ ] Theatre.js Studio excluded from prod build (check bundle for `@theatre/studio`)
- [ ] Mobile Lighthouse run (not just desktop) — Performance 90+, CLS < 0.1
- [ ] Tab-blur pause verified (switch tabs, check GPU/CPU usage drops)
- [ ] No console errors, no orphaned `ScrollTrigger`/Theatre.js instances after route changes (check for memory growth on repeated navigation)

---

## Everything Else (still applies, unchanged from general web perf practice)

The general practices below aren't 3D/animation-specific but still apply as baseline hygiene: semantic HTML and accessible forms, alt text and ARIA where relevant, HTTPS/security headers/CSP, sitemap/robots.txt/Open Graph metadata, Brotli/Gzip compression, WOFF2 fonts with `font-display: swap`, and standard responsive testing across breakpoints. Treat these as the floor, not the differentiator — the sections above are where this portfolio's actual performance risk lives.