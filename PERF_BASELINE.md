# Performance Baseline Metrics

Recorded on: October 26, 2026
Branch: `perf/baseline`
Environment: Vite Production Build (`npm run build`) & Production Preview (`npm run preview`)

## 1. Bundle & Asset Sizes (Before Optimization)

| Asset / Chunk | Size (Raw) | Size (Gzip) | Notes |
| :--- | :--- | :--- | :--- |
| `dist/assets/three-CdC3yhTs.js` | 1,144.29 kB | 322.23 kB | Monolithic Three.js bundle |
| `dist/assets/index-CFtWSsFJ.js` | 266.07 kB | 111.05 kB | Main bundle |
| `dist/assets/animationVendor-D1beMxcq.js` | 198.58 kB | 69.88 kB | GSAP / Framer Motion |
| `dist/assets/Experience-CcD60Py3.js` | 26.32 kB | 10.65 kB | Experience section |
| `dist/assets/Contact-DEx8GvXN.js` | 18.83 kB | 7.74 kB | Contact section |
| `dist/assets/About-ogJccEFe.js` | 12.50 kB | 4.55 kB | About section |
| `dist/assets/Skills-DZezcM9A.js` | 9.35 kB | 3.68 kB | Skills section |
| `dist/assets/Projects-8Xf1PpIu.js` | 6.07 kB | 2.07 kB | Projects section |
| `dist/assets/Knight-fQBn87vJ.js` | 2.11 kB | 0.98 kB | Knight component |
| `dist/assets/reactVendor-D--IONYe.js` | 0.07 kB | 0.08 kB | React vendor |
| `dist/assets/index-BjTwLiOb.css` | 47.65 kB | 11.86 kB | Main CSS |
| `montage_nature_opt.mp4` | 2,007.61 kB | - | Background video in dist |
| `knight-opt.glb` (public/models) | 4,334.88 kB | - | Active 3D model |
| `knight-hd-opt.glb` (src/components/3D) | 11,313.38 kB | - | Orphan unreferenced 3D model |
| `potsdamer_platz_1k.hdr` (public/models) | 1,540.68 kB | - | Environment map |
| External SVG icons (svgl.app) | 25+ requests | - | Uncached external network calls |
| **Total Initial Transfer** | **~9.8 MB** | - | **Audit Goal: <= 4.0 MB** |

## 2. Interaction & Runtime Performance (4x CPU Throttling Baseline)

| Diagnostic Test | Baseline Metric | Target |
| :--- | :--- | :--- |
| **Resume 3D Card Hover** | 15 – 22 FPS (layout thrashing via `getBoundingClientRect` + double `setState`) | 55+ FPS at 4x CPU throttle |
| **Experience Scroll** | Visible jumps, jitter, 500vh overlay repaint, tasks > 100ms | Smooth scroll, no jumps, tasks < 50ms |
| **Hero Idle GPU / CPU** | `frameloop="always"` 60-120 continuous re-renders; constant GPU drain | `frameloop="demand"`, near-zero idle GPU draw |
| **Background Mode Toggle** | ~350 ms main-thread freeze (re-compiles shaders & rebuilds postprocessing) | < 100 ms main-thread task |
| **Skills Orbit & Scroll Velocity** | Continuous unthrottled loop & layout thrashing on active skill | < 1% idle CPU, smooth orbit scrub |
| **Scroll Event Handlers** | Duplicate `window.addEventListener('scroll')` handlers | Single shared `useLenisScroll` hook |

## 3. Lighthouse Targets

| Metric | Baseline | Target |
| :--- | :--- | :--- |
| **LCP (Mobile)** | ~4.8 s | < 2.5 s |
| **TBT (Mobile)** | ~580 ms | < 200 ms |
| **CLS** | ~0.14 | < 0.10 |
