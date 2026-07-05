# 3D_Render.md — Particle Preloader for Hero 3D Model

## Purpose

This skill instructs an AI coding agent to build an **interactive particle-based preloader** for a large `.glb` hero model hosted on Hugging Face Hub, so the user never sees a blank/frozen hero section while the ~84 MB asset streams in. The visual reference is Tripo3D Studio's loading state: a cloud of small particles that assembles into a silhouette (a logo/wireframe shape) and a particle-text label ("Generating…"), with a thin progress bar underneath, all while gently animating (drifting, shimmering) rather than sitting static.

This file assumes the project already uses **React Three Fiber (R3F)**, **@react-three/drei**, **GSAP**, **Framer Motion**, and possibly **Theatre.js** / **Lenis** (per the existing portfolio stack). Read `3D_Fix.md` and `3D_optimize.md` first if present in the repo — this loader must not reintroduce the performance problems those files already fixed.

---

## 1. Diagnose Before Building (do not skip)

An animated loader hides the wait, it does not remove it. Before writing loader code, the agent MUST check and report on:

1. **File size at the source.** 84 MB for a hero-section `.glb` is too large regardless of loader quality. Confirm whether the model still has:
   - Uncompressed textures (should be KTX2/Basis compressed).
   - No Draco or Meshopt mesh compression.
   - Unused vertex data (uv2, unused morph targets, full-res normal maps for a small on-screen model).
2. **Where it's hosted.** Hugging Face Hub is not a CDN optimized for low-latency binary asset delivery to browsers the way Cloudflare R2 / Vercel Blob / a proper CDN is. Confirm whether requests are direct `resolve/main/model.glb` URLs (cacheable, range-request capable) and not going through a redirect chain.
3. **Compression recommendation to give the user** (do this even if out of scope for the loader task):
   - Run the model through `gltf-transform` CLI: `gltf-transform optimize input.glb output.glb --texture-compress webp --compress meshopt`.
   - Target: get hero model under 8–15 MB. A well-optimized hero model rarely needs to be more than that.
   - If textures are 4K/8K, downscale to 1K–2K for anything that isn't a close-up focal object.

State clearly to the user: **"The loader below will make the wait feel intentional, but the real fix is shrinking the file — I recommend doing both."**

---

## 2. Visual Spec (from reference screenshots)

Match these properties, not the exact brand mark:

- **Particle field**: hundreds to a couple thousand small circular/dot particles, off-white/light-grey (`#e8e8e8`–`#ffffff`) on a dark background (`#1a1a1a`–`#0d0d0d`), with slight opacity variance per particle so the cluster looks like static/noise rather than a flat fill.
- **Shape formation**: particles are not random — they sample points along the outline/silhouette of a shape (in the reference, a logo mark) and a text string ("Generating…"), so the loader forms a recognizable emblem made of dots.
- **Motion**: particles are never fully still. Apply small per-particle jitter (sine-based offset using time + a per-particle random seed) so the cloud shimmers continuously, like the reference GIFs.
- **Progress element**: a thin horizontal bar beneath the particle text, filling left-to-right, tied to actual load progress (not a fake timer).
- **Helper caption**: small muted text below the bar (in the reference: usage tips). For this project, use something like "Optimizing your experience…" or a rotating tip — see §5.
- **Exit transition**: when progress hits 100%, do not cut instantly. Fade/scale the particle cloud out (~500–800ms) while the real model fades/scales in, so the transition feels intentional rather than a hard swap.

---

## 3. Architecture

```
<HeroSection>
  <Suspense fallback={null}>
     <Canvas>
        <ModelLoaderGate>          // R3F-side: drives progress, hides model until ready
           <HeroModel url={...} /> // useGLTF, only rendered once ready or in background
        </ModelLoaderGate>
     </Canvas>
  </Suspense>

  <ParticlePreloaderOverlay        // plain HTML/CSS overlay, NOT inside the Canvas
     visible={!modelReady}
     progress={progress}
  />
</HeroSection>
```

**Key decision: render the preloader as an HTML overlay, not as a Three.js scene**, unless the user explicitly wants the particle effect to be a literal 3D object. Reasons:
- It can mount and animate immediately, before the WebGL context / Canvas has even initialized.
- It avoids competing with the real model for GPU/draw calls during the heaviest phase of loading.
- CSS/SVG/Canvas2D particles are cheaper than a second Three.js scene running concurrently with model decode.

Only build the loader as an actual `<Points>` R3F mesh if the user wants the particle shape to literally be the 3D model's own low-poly point cloud (sampled from its vertices) forming before the textured mesh appears — this is a valid, more literal interpretation of "resemble the model's border" (see §6 Variant B).

---

## 4. Tracking Real Progress

Do not fake the progress bar with a `setInterval`. Wire it to actual fetch/decode progress:

- If using `useGLTF` from drei, pair it with drei's `useProgress` hook (backed by `THREE.DefaultLoadingManager`), which reports `{ progress, loaded, total, item }` across all in-flight R3F loaders.
- Because the model is fetched cross-origin from Hugging Face, confirm the response allows `Content-Length` (needed for percentage) — check via network tab; if HF strips it, fall back to an indeterminate mode (loop the particle animation without claiming a % complete, or estimate using `loaded` bytes against the known ~84 MB / post-compression size).
- Preload early: call `useGLTF.preload(modelUrl)` as soon as the hero section mounts (or even before, e.g. on route/module load) so fetching starts immediately rather than waiting for the component that renders the mesh.

```jsx
import { useProgress } from '@react-three/drei'

function useHeroModelProgress() {
  const { progress, loaded, total, active } = useProgress()
  return { progress, active }
}
```

---

## 5. Overlay Implementation Outline (Variant A — HTML/Canvas2D, recommended default)

1. **Canvas2D particle field**: a full-bleed `<canvas>` positioned absolutely over the hero section, `z-index` above the R3F `<Canvas>`, `pointer-events: none` except where interactivity is wanted (see §7).
2. **Shape sampling**: draw the target shape (an SVG path of a simplified version of the portfolio's logo/monogram, or literally a low-res render of the hero model's silhouette) onto an offscreen canvas, read `getImageData`, and collect coordinates of opaque pixels above an alpha threshold. Downsample to N target particles (e.g. 800–1500) by picking a stride through the coordinate list.
3. **Particle objects**: `{ x, y, targetX, targetY, size, alpha, seed }`. On mount, spawn particles at random positions and animate them toward `targetX/targetY` with an eased tween (GSAP `gsap.to` per-particle, or a single `requestAnimationFrame` loop lerping all particles — prefer the rAF loop for particle counts above ~300 to avoid GSAP tween overhead).
4. **Idle jitter**: once near target, each particle oscillates: `x = targetX + Math.sin(time * 0.001 + seed) * 1.5`.
5. **Text particles**: render the loading label to the offscreen canvas with `ctx.fillText`, sample its pixels the same way as the shape, and merge into the same particle set (or a second pass) — this reproduces the "particles forming letters" look from the reference.
6. **Progress bar**: a simple absolutely-positioned `div` with a `width: ${progress}%` inner bar, `transition: width 200ms linear` for smoothing between progress ticks.
7. **Exit**: when `progress >= 100` (and ideally also gated on the model's first frame having rendered, not just bytes downloaded), trigger:
   - `gsap.to(particles, { alpha: 0, ... })` or scale/blur the canvas out via CSS.
   - Cross-fade the real `<Canvas>` in (`opacity 0 → 1`, `scale 0.96 → 1`).
   - Unmount the overlay canvas after the transition completes to free the rAF loop.

---

## 6. Variant B — Literal Point-Cloud of the Actual Model (optional, more literal to "resemble the model")

If the user wants the loader shape to be the real model rather than a stand-in logo:

1. Ship alongside the 84 MB `.glb` a **tiny pre-extracted point cloud** (a few KB–low hundreds KB) sampled from the model's own vertices at build time (e.g. via a one-off Node/gltf-transform script using `MeshSurfaceSampler` from `three/examples/jsm/math/MeshSurfaceSampler.js`). This point cloud loads near-instantly and can be rendered as `<Points>` inside the real R3F `<Canvas>` while the full textured model streams in behind it.
2. Render this `<Points>` cloud with a `PointsMaterial` or a small custom `ShaderMaterial` giving per-point size/alpha jitter (same idle-jitter idea as Variant A, but as a vertex shader `sin(time + aSeed)` offset instead of CPU-side math — much cheaper at scale).
3. Cross-fade: when the full model's `onLoad` fires, fade `<Points>` opacity to 0 and the real mesh's material opacity to 1 over ~600ms.
4. This variant is more work but directly satisfies "the loader should resemble the model's border/color" literally, since it *is* the model's own geometry, just sparse and unlit.

Use Variant A by default (faster to implement, matches the reference screenshots' style, decoupled from model internals). Only build Variant B if the user explicitly confirms they want the loader to be derived from the actual mesh.

---

## 7. Interactivity (per user's requirement: "the loader itself is interactive")

Pick one of these, confirm with the user which they want before implementing both:

- **Pointer parallax**: particles near the cursor repel/attract slightly (offset target position by a falloff function of distance to `mousemove` coordinates). Cheap and reads as "alive."
- **Drag-to-scatter**: on `pointerdown` + drag, particles under the cursor scatter outward and re-settle after release — matches the "magic brush" affordance hinted at in the reference screenshots' caption text.
- Keep `pointer-events` enabled only on the canvas region, and make sure this doesn't block scroll/nav interactions on mobile — throttle to pointer/mouse, disable drag-scatter on touch devices, parallax only.

---

## 8. Failure Modes to Avoid

- **Do not block the main thread** sampling pixels from a large offscreen canvas on every render — sample shape coordinates **once** on mount/resize, not per frame.
- **Do not leak the rAF loop** — always `cancelAnimationFrame` in a cleanup function when the overlay unmounts.
- **Do not tie the exit transition purely to a fixed timeout** — always gate on real `progress === 100` (and ideally `gl.info.render` having produced a frame), so slow connections still see an accurate wait and fast connections aren't held artificially.
- **Do not run two heavy WebGL contexts** if using Variant B and the user is also mid-implementing other 3D_optimize.md fixes — check GPU cost with the browser's performance panel before shipping.
- **Do not forget mobile**: cap particle count adaptively (e.g. `window.innerWidth < 768 ? 400 : 1200`) and detect `prefers-reduced-motion` — if set, show a static shape + progress bar with no jitter/parallax.
- **Do not regress LCP**: the overlay must paint immediately (no waiting on the `.glb` fetch to start rendering the loader) — mount it synchronously, start the model preload in parallel.
- **Dispose properly** (Variant B): call `.dispose()` on the temporary `BufferGeometry`/`Material` used for the point cloud once swapped out, so it doesn't linger in memory.

---

## 9. Testing Checklist

- [ ] Loader appears instantly on page load, before any network request for the `.glb` resolves.
- [ ] Progress bar reflects real download progress (verify by throttling network in DevTools to "Slow 3G" and confirming the bar moves gradually, not in one jump).
- [ ] Particle shape is legible as a shape/text, not visual noise, at both desktop and mobile viewport sizes.
- [ ] Exit transition only fires after the model is actually ready to render (no flash of an unlit/untextured model).
- [ ] No dropped frames on mid-tier hardware — check via Chrome Performance tab during the loader's active phase.
- [ ] Cleanup verified — navigating away mid-load or reloading doesn't leave a dangling animation frame loop (check via `chrome://inspect` / no console warnings).
- [ ] `prefers-reduced-motion` respected.
- [ ] Confirm final compressed model size and report the before/after MB figure to the user.

---

## 10. Deliverable Format for the Agent

When implementing against this skill, produce:
1. `src/components/HeroModelLoader.tsx` (or `.jsx`) — the overlay component (Variant A) or `<Points>` component (Variant B).
2. A short note in the PR/commit description with the before/after model size and hosting recommendation from §1.
3. No inline hardcoded shape data — the sampled shape source (SVG path or reference image) should live in `src/assets/` so it's swappable later.