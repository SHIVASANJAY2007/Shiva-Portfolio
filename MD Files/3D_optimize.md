# 3D_optimize.md — Runtime Rendering Performance Skill

## Purpose
This is a companion to `3D_Fix.md`. That file covers **getting large `.glb` models from Hugging Face into the app** (loading, CORS, caching). This file covers a *different* problem: **once a model is loaded, the scene renders slowly / drops frames / feels "dead slow at the core."**

If you are an AI agent reading this: loading speed and rendering speed are separate bottlenecks with separate fixes. Do not re-apply loading fixes (Draco, lazy-load, progress bars) and assume they'll fix FPS — they won't. Diagnose first (Section 1), then apply the specific fix for the specific bottleneck (Sections 2–6).

---

## 0. Ground Rule: Diagnose Before Optimizing

Never apply optimizations blindly. A slow scene has one of these root causes, and the fix for one can be irrelevant or even harmful for another:

| Symptom | Likely bottleneck | Section |
|---|---|---|
| Low FPS even when camera is still, scene is static | Too many draw calls / too much geometry | 2 |
| Low FPS gets worse as camera moves / lights change | Shadow maps / lighting cost | 3 |
| Long freeze on first render, then smooth | One-time CPU decode cost (Draco/GLTF parse), not a rendering problem — see `3D_Fix.md` instead | — |
| FPS fine in isolation, tanks when scrolling/animating page | JS main thread contention (GSAP/Framer Motion/Theatre.js competing with R3F's render loop) | 4 |
| GPU usage near 100%, fan spinning, tab crashes on mobile | Texture memory / resolution too high | 5 |
| Memory grows over time, tab eventually crashes | Resources not disposed on unmount | 6 |

**Required first step for the agent:** open the browser's Performance tab (or `r3f-perf` / `stats.js` overlay — see Section 1.1) and identify which row above actually matches before touching code.

### 1.1 Install a live performance overlay (do this first, remove before shipping)

```bash
npm install r3f-perf
```

```jsx
import { Perf } from "r3f-perf";

<Canvas>
  <Perf position="top-left" />
  {/* rest of scene */}
</Canvas>
```

This shows FPS, draw calls, triangle count, and GPU/CPU time live. **Do not guess at "the model has too many polygons" — read the actual triangle count and draw call count from this overlay first.**

---

## 1. Hard Rules (Failure Modes to Avoid)

1. **Never assume the model file itself is "just too big" without checking triangle count and draw calls via the overlay.** An 84MB file can be 84MB because of textures (fixable in-browser) or because of raw polygon count (needs re-export, not a code fix).
2. **Never add post-processing effects (bloom, SSAO, DOF) to a scene that's already dropping frames.** Post-processing is a GPU-cost multiplier — adding it to a struggling scene makes diagnosis impossible and performance worse.
3. **Never leave `frameloop="always"` (the R3F default) running for a mostly-static hero/portfolio scene.** If nothing is animating continuously, this burns GPU every frame for no visual benefit.
4. **Never leave shadows on for every light and every mesh by default.** Shadow maps are one of the most expensive things in the scene; they must be deliberately scoped.
5. **Never leave `<Canvas dpr={[1, 2]}>` unset on high-DPI (Retina) displays without capping it.** Rendering at full device pixel ratio on a 2x/3x screen can quietly triple or quadruple GPU load.
6. **Never skip disposal of geometries/textures/materials when a model's component unmounts** (e.g., navigating away from a section with a 150MB model). Three.js does not garbage-collect GPU memory automatically.
7. **Never run heavy JS (GSAP timelines, Theatre.js sequences, scroll listeners) without checking they aren't fighting the R3F render loop on the same thread.** Two animation systems both trying to drive 60fps updates independently is a common silent cause of jank.
8. **Do not decimate/simplify a model's geometry in-browser as a first fix.** In-browser simplification (e.g., via `SimplifyModifier`) is a last resort — it degrades visual quality and adds CPU cost. Prefer re-exporting the source model at a lower poly count, and flag this to the human if triangle count is the actual bottleneck.
9. **Do not attach `<OrbitControls>` (or similar) with default damping/autoRotate settings without checking their per-frame cost** — `enableDamping` + `autoRotate` together force continuous re-renders even when `frameloop="demand"` is set elsewhere, silently undoing that optimization.

---

## 2. Geometry & Draw Call Optimization

**Check via overlay:** if triangle count is in the millions or draw calls are in the hundreds for a single portfolio scene, this is the bottleneck.

- **Merge static meshes** that share a material using `BufferGeometryUtils.mergeGeometries` (three.js) to cut draw calls, instead of leaving a model as 50+ separate mesh nodes.
- **Use instancing** (`<Instances>` / `<Instance>` from drei) if the same model/prop repeats multiple times in a scene — never render N separate copies of the same geometry.
- **Frustum culling** is on by default in three.js — verify it hasn't been accidentally disabled (`mesh.frustumCulled = false` should not appear in the codebase unless there's a specific, documented reason).
- **LOD (Level of Detail):** for a hero model that's large/detailed, use drei's `<Detailed>` component to swap to a lower-poly version at distance, if a lower-poly variant exists. Do not fabricate a low-poly variant yourself — ask the human for one or flag that one is needed.

```jsx
import { Detailed } from "@react-three/drei";

<Detailed distances={[0, 10, 20]}>
  <HighPolyModel />
  <MedPolyModel />
  <LowPolyModel />
</Detailed>
```

---

## 3. Lighting & Shadow Optimization

**Check via overlay:** if FPS drops specifically when lights/shadows are visible or camera moves near shadow-casting objects, this is the bottleneck.

- Set `shadow-mapSize` deliberately — never leave it at engine defaults for a hero scene; excessive resolution (e.g., 4096×4096) on multiple lights is a common silent killer:
  ```jsx
  <directionalLight castShadow shadow-mapSize={[1024, 1024]} />
  ```
- Only the lights that actually need to cast shadows should have `castShadow` — don't enable it on every light "just in case."
- Only meshes that are visibly relevant should have `receiveShadow`/`castShadow` — not the entire scene graph by default.
- Prefer **baked lighting** (baked-in textures/lightmaps from the modeling tool) over real-time dynamic shadows for a mostly-static portfolio piece. This is a modeling-pipeline decision — flag it to the human rather than trying to "bake" lighting in-browser.
- Consider `<Environment>` (drei) with a preset HDRI for ambient lighting instead of stacking multiple manual point/spot lights.

---

## 4. Render Loop & Main Thread Contention

**Check via overlay + Performance tab:** if FPS is fine when the 3D scene is isolated but tanks during scroll/GSAP animations elsewhere on the page, this is the bottleneck.

- Set `frameloop="demand"` on `<Canvas>` for scenes that don't need continuous animation, and manually call `invalidate()` (from `useThree`) only when something actually changes (camera move, model swap):
  ```jsx
  <Canvas frameloop="demand">
  ```
- If GSAP/Framer Motion/Theatre.js are driving camera or object transforms, make sure each animation frame calls `invalidate()` once — don't leave the canvas on `frameloop="always"` AND run heavy animation libraries simultaneously; that's double the work for the same visual result.
- Avoid `useFrame` callbacks that do expensive work (state updates, array allocations, `.getBoundingClientRect()`, etc.) every frame. `useFrame` runs up to 60x/sec — anything inside it must be cheap.
- Debounce/throttle scroll-linked 3D updates (e.g., scroll-driven camera moves) rather than recalculating on every scroll event at full frequency.

---

## 5. Texture & Material Optimization

**Check via overlay/GPU tab:** if GPU memory usage is high and/or the tab struggles specifically on mobile/lower-end GPUs, this is the bottleneck.

- Check actual texture resolution being used vs. actual on-screen size. A 4096×4096 texture on a model element that renders at 200×200px on screen is pure waste — flag to the human for re-export at a sane resolution (1024 or 2048 is usually enough for portfolio-scale work).
- Prefer **KTX2/Basis-compressed textures** over raw PNG/JPG embedded in the glb — this is a modeling-pipeline/export change, not something fixable purely in loader code. If textures are the dominant cost, tell the human this needs to happen at export time.
- Avoid unnecessary transparency (`transparent: true`) on materials that don't need it — transparent materials disable certain GPU optimizations (early z-rejection) and cost more to render.
- Reuse materials across meshes where visually appropriate instead of creating a new `MeshStandardMaterial` per mesh instance.

---

## 6. Memory & Disposal

**Check via overlay/memory tab:** if memory climbs steadily during a session (e.g., navigating between sections with different models) and the tab eventually crashes or the browser warns about memory, this is the bottleneck.

- On component unmount, dispose of geometries, materials, and textures that won't be reused:
  ```jsx
  useEffect(() => {
    return () => {
      gltf.scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
          materials.forEach((m) => {
            Object.values(m).forEach((val) => val?.isTexture && val.dispose());
            m.dispose();
          });
        }
      });
    };
  }, [gltf]);
  ```
- Do not call `useGLTF.clear(url)` unless you actually intend to force a full reload later — clearing drei's cache defeats the caching benefit described in `3D_Fix.md` and should only be done deliberately (e.g., a "reload model" debug action).
- If multiple sections each load a different 150–200MB model, verify only one (or a small bounded number) is resident in GPU memory at a time — don't let five unmounted-but-undisposed models silently accumulate.

---

## 7. Verification Checklist Before Calling It "Fixed"

- [ ] `r3f-perf` overlay shows stable FPS (target: 50–60fps on desktop, note actual number if lower and why) with the scene idle.
- [ ] FPS stays stable while scrolling the page and while any GSAP/Theatre.js animation is running concurrently.
- [ ] Draw call count and triangle count are noted and reported to the human, not just "it feels faster."
- [ ] Shadow map sizes and which lights cast shadows are documented (don't leave this implicit in code).
- [ ] `frameloop` setting is explicit (`"always"` or `"demand"`) and justified by the scene's actual animation needs, not left as an unexamined default.
- [ ] Navigating away from a model-heavy section and checking the memory tab shows GPU memory being released, not accumulating.
- [ ] Remove or hide the `r3f-perf` overlay behind a dev-only flag before considering the task complete — it should not ship visible to end users.

---

## 8. What This Skill Does NOT Cover

- Re-exporting/decimating source `.glb` files in Blender or similar — that's a modeling-pipeline task. This skill flags when it's needed but does not perform it.
- Loading, hosting, CORS, or Hugging Face URL concerns — see `3D_Fix.md`.
- Network-level compression (gzip/brotli) of the model transfer — that's a hosting/CDN concern, not a rendering one.