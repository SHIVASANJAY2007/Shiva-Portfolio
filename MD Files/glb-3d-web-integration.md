---
name: glb-3d-web-integration
description: Use this skill whenever the user wants to import a .glb or .gltf 3D model into a website, place it within a page layout, control its size with casual terms like "small/medium/large/full-screen", or add animations, transitions, scroll effects, hover interactions, or camera movement to it. Trigger this for any request involving 3D assets, Three.js, React Three Fiber, model-viewer, or "put this 3D model in my hero/section/background", even if the user only gives loose, informal instructions (e.g. "make it medium sized in the top right, spinning slowly"). This skill translates vague placement/size/animation language into concrete code and handles loading, performance, and responsiveness for 3D-on-the-web work.
---

# GLB 3D Model Web Integration

A skill for taking a `.glb`/`.gltf` 3D asset and a casual, informal instruction ("put it in the hero, medium size, slowly spinning, fade in on scroll") and turning it into working, performant website code.

The user will usually describe things loosely — placement in plain English ("top right", "behind the text", "full screen background"), size in t-shirt terms ("small", "large"), and behavior in everyday words ("spin", "float", "zoom in when you scroll"). Your job is to interpret that intent, pick sane concrete values, and implement it — not to ask the user to specify pixel sizes or rotation speeds in radians/sec.

## Step 0: Pick the stack

Default to **React Three Fiber (R3F) + @react-three/drei** for React projects (matches a typical Vite + React + GSAP/Framer Motion stack). Use **`<model-viewer>`** (Google's web component) only when the project is plain HTML/no React, or the ask is genuinely simple (single static product viewer, no custom scene).

| Situation | Use |
|---|---|
| React/Vite/Next project, custom scene, multiple effects, scroll-tied animation | React Three Fiber + drei |
| Plain HTML/vanilla JS site, simple "show this model, let user rotate it" | `<model-viewer>` |
| Need physically-based camera fly-throughs, particles, postprocessing | R3F + `@react-three/postprocessing` |

R3F packages to install: `three @react-three/fiber @react-three/drei`. Add `gsap` (with `ScrollTrigger`) or `framer-motion` if scroll/timeline animation is requested — both are fine, don't mix them in the same component.

## Step 1: Load the GLB correctly

Always wrap the model in `<Suspense>` with a fallback, and preload:

```jsx
import { useGLTF } from '@react-three/drei'
import { Suspense } from 'react'

function Model({ url, ...props }) {
  const { scene } = useGLTF(url)
  return <primitive object={scene} {...props} />
}
useGLTF.preload('/models/asset.glb')

// usage
<Canvas>
  <Suspense fallback={<ModelFallback />}>
    <Model url="/models/asset.glb" />
  </Suspense>
</Canvas>
```

- Put GLB files in `public/models/` (Vite/CRA) so they're served as static assets — never `import` a `.glb` like a JS module.
- If the file is large (>5-10MB) or the user mentions slow load, recommend/run Draco or Meshopt compression (`gltf-transform optimize input.glb output.glb`) before wiring it up. Mention this proactively rather than waiting for a complaint.
- `<ModelFallback>` should be a lightweight placeholder (a simple wireframe box, low-res poster image, or skeleton shimmer) — never block the whole page on the 3D asset; the rest of the layout should render immediately.
- For `<model-viewer>`: `<model-viewer src="/models/asset.glb" poster="/models/poster.webp" loading="lazy" reveal="auto">`.

## Step 2: Placement vocabulary → layout

Map the user's plain-English placement to one of these patterns. Ask only if genuinely ambiguous (e.g. "in the design" with no section named) — otherwise pick the closest match and proceed.

| User says | Pattern |
|---|---|
| "hero", "main banner", "top of the page" | Full-bleed `<Canvas>` as hero background or hero-right column, model centered, page content overlaid or beside it |
| "background", "behind everything" | `<Canvas>` as `position: fixed/absolute; inset:0; z-index:-1`, `pointer-events: none` unless interaction requested, content in normal flow on top |
| "corner", "floating badge", "bottom right" | Small fixed/sticky `<Canvas>` (e.g. `position: fixed; bottom: 24px; right: 24px`), transparent background |
| "next to the text", "side by side", "split section" | Two-column flex/grid section: text column + `<Canvas>` column, model framed to fill its column |
| "inline with content", "in a card" | `<Canvas>` inside a normal block element with defined height (e.g. `height: 400px`), `border-radius` matching the card if desired |
| "full screen", "takes over the page" | `<Canvas>` at `100vw / 100vh`, scroll-jacking or pinned section if combined with scroll animation |

Implementation notes:
- `<Canvas>` needs an ancestor with an explicit height (`%`, `vh`, or `px`) — it won't auto-size from content.
- For "behind the text" specifically, set `gl={{ alpha: true }}` on `<Canvas>` and keep the scene background transparent so the page's own background shows through.
- If the model should NOT intercept clicks/scroll meant for the page, set `pointer-events: none` on the canvas wrapper, and re-enable (`pointer-events: auto`) only on the model itself if hover/drag interaction is also requested.

## Step 3: Size vocabulary → concrete values

Size means two things at once: the **container** the Canvas sits in, and the **scale**/**camera framing** of the model within it. Translate t-shirt sizes using this table as a default, then adjust to the model's actual bounding box (a model loaded at scale `1` may be tiny or huge depending on how it was exported — always fit-to-frame rather than trusting a fixed scale number blindly):

| Size word | Container (desktop) | Typical use |
|---|---|---|
| tiny / icon | 80–120px | inline badge, cursor follower, nav logo |
| small | 200–320px | card accent, sidebar |
| medium | 400–600px | half-hero, section illustration |
| large | 70–90vh or full column | hero centerpiece |
| full / fullscreen | 100vw × 100vh | immersive landing, takeover section |

To fit a model to its frame regardless of its native scale, compute its bounding box and auto-fit rather than hardcoding scale:

```jsx
import { Center, Bounds } from '@react-three/drei'

<Bounds fit clip observe margin={1.2}>
  <Center>
    <Model url={url} />
  </Center>
</Bounds>
```

`Bounds` auto-frames the camera to the model regardless of size word — then you only need to change the *container* dimensions per the table above, and `Bounds` handles the rest. This avoids the common bug of "I set scale to 'large' but the model still looks tiny/huge."

Always make the container responsive: define mobile sizes (usually one tier down — "large" on desktop → "medium" container on mobile, or hide entirely behind a static poster image if performance is a concern on mobile).

## Step 4: Animation vocabulary → implementation

Distinguish **ambient/looping** animation (runs continuously, no user trigger) from **triggered** animation (scroll, hover, load-in).

### Ambient (use `useFrame`, not GSAP, for continuous loops — it's cheaper and frame-synced)

```jsx
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function Model({ url }) {
  const ref = useRef()
  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.3 // "slowly spinning"
    ref.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 // "gentle float"
  })
  return <primitive ref={ref} object={scene} />
}
```

| User says | Implementation |
|---|---|
| "spin / rotate slowly" | `rotation.y += delta * 0.2–0.4` |
| "spin fast" | `rotation.y += delta * 1–2` |
| "float / bob / hover in place" | sine wave on `position.y`, amplitude ~0.1–0.2 units, or use `<Float>` from drei (wraps this automatically: `<Float speed={1} rotationIntensity={0.4} floatIntensity={0.6}>`) |
| "breathe / pulse" | sine wave on uniform `scale`, small amplitude (1 ± 0.03) |
| "follow the cursor / look at mouse" | lerp rotation toward `state.pointer` in `useFrame` |
| "auto-rotate camera around it" | `<OrbitControls autoRotate autoRotateSpeed={...} enableZoom={false} />` from drei |

### Triggered — entrance / load-in

```jsx
// Using GSAP
useGSAP(() => {
  gsap.from(ref.current.scale, { x: 0, y: 0, z: 0, duration: 1.2, ease: 'back.out(1.7)' })
  gsap.from(ref.current.position, { y: -2, duration: 1, ease: 'power3.out' })
})
```
"Fade in" for 3D means animating opacity on the material(s) (requires `transparent: true` on the material) or animating scale/position — pure CSS opacity on the Canvas also works and is simpler if no other 3D motion is needed simultaneously.

### Triggered — scroll

Two solid approaches; pick one per project, don't mix:

1. **GSAP ScrollTrigger driving Three.js object transforms** (most control):
```jsx
gsap.registerPlugin(ScrollTrigger)
useGSAP(() => {
  gsap.to(modelRef.current.rotation, {
    y: Math.PI * 2,
    scrollTrigger: { trigger: '#section', start: 'top bottom', end: 'bottom top', scrub: true }
  })
})
```
2. **`@react-three/drei`'s `ScrollControls` + `useScroll`** for scroll-tied scenes fully inside the Canvas (good for pinned/immersive sections):
```jsx
<ScrollControls pages={3} damping={0.2}>
  <Scroll><ModelThatReactsToScrollOffset /></Scroll>
  <Scroll html><div>Normal page content</div></Scroll>
</ScrollControls>
```

| User says | Pattern |
|---|---|
| "rotates as you scroll" | ScrollTrigger `scrub: true` on rotation |
| "zooms in / camera moves in on scroll" | animate `camera.position.z` or `<Bounds>` margin via scroll progress |
| "appears/reveals on scroll" | IntersectionObserver or ScrollTrigger `start`/`once: true` triggering the entrance animation from above |
| "stays pinned while scrolling through a section" | ScrollTrigger `pin: true`, or drei `ScrollControls` |

### Triggered — hover / interaction

```jsx
const [hovered, setHovered] = useState(false)
<primitive
  object={scene}
  onPointerOver={() => setHovered(true)}
  onPointerOut={() => setHovered(false)}
  scale={hovered ? 1.1 : 1}
/>
```
Wrap scale/rotation changes in a `useFrame` lerp (`THREE.MathUtils.lerp`) rather than snapping directly, so hover feels smooth, not jumpy. Set `document.body.style.cursor = 'pointer'` on hover if the model is meant to feel clickable.

### Transitions between models / scenes

"Crossfade", "swap model", "transition to next" → fade out (opacity/scale to 0 or `AnimatePresence` if using `framer-motion-3d`) the old model, unmount, mount + fade in the new one. For full-page 3D-to-3D transitions tied to route changes, animate a shared camera/Canvas rather than unmounting the whole `<Canvas>`, to avoid a visible flash/reload.

## Step 5: Lighting & camera defaults

Don't leave the user with a flat/dark model. Default scene setup unless the design calls for something specific:

```jsx
<Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
  <ambientLight intensity={0.6} />
  <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
  <Environment preset="city" /> {/* drei — quick realistic reflections, swap preset to match mood: "studio", "sunset", "night", "warehouse" */}
  ...
</Canvas>
```
Match `Environment` preset to the aesthetic if the user has a stated visual direction (e.g. a moody/dark theme → `"night"` or `"warehouse"`; a clean product showcase → `"studio"`).

## Step 6: Performance & responsiveness checklist

Run through this before calling the integration done:
- [ ] GLB is Draco/Meshopt-compressed if >5MB
- [ ] `<Suspense>` fallback in place; page doesn't block on 3D load
- [ ] `useGLTF.preload()` called outside the component for instant reuse if the model appears in multiple places
- [ ] `dpr` capped on `<Canvas dpr={[1, 2]}>` to avoid melting low-end/mobile GPUs
- [ ] Heavy scenes (postprocessing, many lights, `autoRotate` + `ScrollTrigger` together) get a simplified or static-image fallback on mobile/`prefers-reduced-motion`
- [ ] `<Canvas frameloop="demand">` considered for static/rarely-animated scenes to save battery — switch to `"always"` only where continuous animation is actually needed
- [ ] Dispose of geometries/textures on unmount if models are swapped frequently (R3F handles most of this automatically via its reconciler, but verify no leaks in dev tools if testing reveals issues)

## Quick request → action cheat sheet

Use this to move fast on casual one-line instructions:

> "Put the dragon model medium-sized in the hero, slowly spinning, fade in when the page loads, and let it rotate faster on hover"

→ Hero section pattern (Step 2) + medium container/Bounds fit (Step 3) + ambient slow `rotation.y` spin (Step 4) + GSAP scale-in entrance (Step 4) + hover state lerping rotation speed up (Step 4) + standard lighting (Step 5).

Don't ask for clarification on numeric specifics the table above already covers — only ask if the *section/page location itself* is unclear (e.g. multiple plausible "hero" candidates) or if the user references a model/section that doesn't exist yet in the codebase.