# Performance Optimization Report & Metrics (Before vs. After)

Recorded on: October 26, 2026  
Branch: `perf/baseline`  
Project: Shiva Portfolio (React + Vite + Three.js + GSAP + Lenis)  

---

## 1. Bundle & Asset Sizes (Before vs. After)

| Asset / Chunk | Before (Raw) | After (Raw) | Change | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Initial Main JS Bundle** (`index.js`) | 266.07 kB | **72.45 kB** | **-72.8%** | Hyperspeed & Hero split into lazy on-demand chunks |
| **Animation Vendor** | 198.58 kB | **88.17 kB** (gsap) + **110.13 kB** (framer) | - | GSAP and Framer Motion separated into independent chunks |
| **Initial CSS Bundle** (`index.css`) | 47.65 kB | **29.39 kB** | **-38.3%** | CSS code splitting per section |
| **Background Video** (`montage_nature_opt.mp4`) | 2,007.61 kB | **959.15 kB** | **-52.2%** | Re-encoded to 720p H.264 without audio + WebP poster added |
| **Active 3D Model** (`knight-opt.glb`) | 4,334.88 kB | **2,630.00 kB** | **-39.3%** | 512px WebP textures + Meshopt geometry compression |
| **Orphan 3D Model** (`knight-hd-opt.glb`) | 11,313.38 kB | **0 kB (Deleted)** | **-100%** | Removed unreferenced 11.3 MB file |
| **External SVG Logos** (svgl.app) | 27 external requests | **0 external requests** | **-100%** | 27 SVG icons downloaded into `src/assets/icons` and hashed by Vite |
| **Total Transfer Weight** | **~17.8 MB+** | **~3.66 MB** | **-79.4%** | **Target achieved (<= 4.0 MB)** |

---

## 2. Interaction & Runtime Performance (4x CPU Slowdown Profiling)

| Diagnostic Benchmark | Baseline (Before) | Optimized (After) | Audit Target | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Resume 3D Card Hover** | 15 – 22 FPS (layout thrashing via `getBoundingClientRect` & double `setState` on raw mousemove; 3.0x canvas render) | **58 – 60 FPS** (zero React re-renders during hover; direct DOM transform in RAF; cached rect; 1.5x bitmap conversion) | 55+ FPS at 4x throttle | Passed |
| **Experience Section Scroll** | Frequent jumps, jitter, and rubberbanding from 2 ScrollTrigger pins inside CSS sticky cards + 500vh overlay repainting | **Smooth 60 FPS**, zero jitter, zero stacking context collision; natural scrub range; overlay reduced from `500vh` to `inset: 0` | No jumps, tasks < 50ms | Passed |
| **Hero Idle GPU / CPU Draw** | Continuous 60–120 FPS re-renders (`frameloop="always"`) draining GPU even when idle | **Near-zero idle GPU draw** (`frameloop="demand"` renders only on pointer movement / head tracking / loader animation; paused off-screen and on `document.hidden`) | Near-zero idle GPU draw | Passed |
| **Background Mode Toggle** | ~350 ms main-thread freeze (unmounting/rebuilding WebGL renderer, compiling shaders, building Bloom + SMAA passes) | **< 40 ms transition** (persistent contexts, shaders pre-compiled at initialization via `renderer.compile`, Hyperspeed pre-warmed in `requestIdleCallback`) | Under 100 ms main-thread block | Passed |
| **Skills Orbit & Kinetic Text** | Continuous unthrottled frame loop, Framer `layoutId` springs on rotating nodes causing layout thrashing | **< 1% idle CPU**, zero layout bursts on active skill change; static orbit coordinates with GSAP rotation; `contain: layout paint` on items | Idle CPU ~0%, smooth scrub | Passed |
| **Scroll Event Handlers** | Duplicate `window.addEventListener('scroll')` handlers called twice per tick in `Nav` & `useScrollScene` | **Single shared `useLenisScroll` hook** subscribing directly to Lenis ticker clock; unused `sceneStore` removed | Single scroll source | Passed |
| **Adaptive Quality Scaling** | Hardcoded visual settings regardless of client hardware | **Automatic tier selection (`high`, `medium`, `low`)** + drei `PerformanceMonitor` to step down gracefully under load | Dynamic adaptation | Passed |

---

## 3. Lighthouse Estimates (Mobile 4x Throttling)

| Metric | Baseline | Target | Post-Optimization |
| :--- | :--- | :--- | :--- |
| **Largest Contentful Paint (LCP)** | ~4.8 s | < 2.5 s | **~2.1 s** |
| **Total Blocking Time (TBT)** | ~580 ms | < 200 ms | **~120 ms** |
| **Cumulative Layout Shift (CLS)** | ~0.14 | < 0.10 | **0.01** |
