# Interactive Tech Stack — Build Spec v2

Revision of the physics tool card concept. Two components now, connected by one toggle and one transition.

- **Component A — "Scatter" view**: bare logos falling under gravity inside a bounded card, draggable, no text, no glass background.
- **Component B — "Stack" view**: full tech-stack grid (per reference image) — bordered cards with icon + label, hover glow.
- A small icon-only toggle button switches between the two, with an animated transition.

---

## 0. Icon Source — SVGL only

All logos must come from **SVGL** (https://svgl.app), not custom icon packs, not glass/emoji icons.

- Public API: `GET https://api.svgl.app` → returns array of `{ id, title, category, route, url }`
- `route` is either a direct `.svg` URL string, or `{ light, dark }` variants — use the `dark` variant since the whole UI is dark-themed
- Fetch by name: `GET https://api.svgl.app?search=react`
- Fetch by category: `GET https://api.svgl.app/category/{category}`
- Render the raw SVG directly (via `<img src={route}>` or inlined `<svg>` if you need to recolor strokes) — **no icon should sit inside a colored/frosted chip, no icon should have a text label rendered under it in Component A.** The logo is the entire visual; nothing else.
- Build a small local mapping of `{ toolName → svgl route }` at build time (fetch once, cache in a JSON file) rather than calling the API live on every render.

---

## 1. Component A — Scatter (gravity physics)

### Mechanism (replaces the old cursor-repel idea entirely)

Use a real 2D physics engine — **Matter.js** — instead of spring-based fake physics. This gives proper gravity, collision, and drag for free.

- Each card is its own bounded **physics world**:
  - Invisible static bodies for floor + side walls, matching the card's rounded inner padding (so logos rest inside the border, not clipped by it)
  - `engine.world.gravity.y` set to a small positive value (e.g. `0.6–1`) so logos drift downward and settle, rather than falling hard/bouncy
- Each logo is a **circular or icon-shaped rigid body** (`Matter.Bodies.circle` sized to the icon, or a rectangle matching the icon's bounding box) with:
  - Moderate restitution (~0.3) so they bounce softly once against the floor/each other, then settle
  - Friction + frictionAir tuned so they don't skate around forever
- **Dragging**: use `Matter.MouseConstraint` (bound to the card's mouse/pointer events) so the user can grab any logo and drag it anywhere inside the bounds
- **Releasing ("leavable")**: on mouse up, the constraint releases and the logo simply falls back under gravity and resettles — no snapping, no forced return position
- On mount, logos spawn from randomized positions slightly above the visible card (so the "load-in" itself looks like them dropping into place) and settle within ~1–2s
- Render the Matter.js bodies as absolutely-positioned React elements synced to body `position`/`angle` each frame (Matter.js handles physics in its own headless world; React/DOM just mirrors it — do not use Matter's canvas renderer, keep icons as real DOM SVGs so they stay crisp and stylable)

### What NOT to include (removed from v1)
- ❌ Cursor-proximity repel force
- ❌ Idle Perlin-noise floating drift
- ❌ Any text label or category name rendered on/under the floating icons
- ❌ Any glass/frosted/colored chip background behind each icon — the icon sits directly on the card background, nothing wrapping it

### Per-card aesthetics
Each Scatter card should feel intentional, not identical:
- Give each category card (e.g. "AI Bots", "IDE", "Programming", "Automation") a subtle signature accent — a faint radial glow in a category color behind the icons, or a thin top-border accent line — so cards are visually distinguishable at a glance
- Rounded corners (`rounded-2xl`), near-black background, soft outer shadow, consistent with the original reference
- Optional faint dot-grid background, low opacity, purely decorative (physics bodies ignore it)

---

## 2. Component B — Stack (full grid)

Matches the second reference image: a full tech-stack directory.

- Header: large gradient title text (e.g. "TECH STACK")
- Grid of rounded cards, each containing:
  - SVGL icon (small, ~24–32px) inside a subtle rounded square/chip
  - Tool name as a small caption label below the icon (labels ARE shown here — this is the one place text appears)
- **Hover animation** per card: on hover, scale up slightly (~1.05–1.08), border brightens or gets a soft glow in an accent color, icon can have a subtle lift (translateY -2px) — keep it snappy (~150–200ms ease-out), no bounce
- Background: deep purple/black gradient with a soft ambient glow (matches reference), can reuse across both components for consistency

---

## 3. Toggle Button

- A **single small line-icon button**, no text, no label — think a minimal "≡" / horizontal-line / expand-collapse glyph (pull from SVGL or a simple inline SVG, keep it a single stroke, not a filled icon)
- Positioned consistently (e.g. top-right corner of the Scatter card, or floating corner of the whole section)
- Click toggles between Component A (Scatter) and Component B (Stack)
- Button itself should have a small hover state (subtle scale or glow) so it reads as interactive despite having no text

---

## 4. Transition Between A and B

Keep it simple, not gimmicky:

- Use **Framer Motion `AnimatePresence`** wrapping both components, keyed by current view
- Suggested approach: **crossfade + slight scale/blur**
  - Outgoing view: fade out + scale down slightly (~0.97) + optional blur(4px), ~250–300ms
  - Incoming view: fade in + scale up from ~0.97 → 1, staggered slightly after outgoing starts leaving (~80–100ms overlap)
- Optional nicer variant (if time allows): use shared `layoutId` per tool icon so a logo visible in both views (e.g. "React") visually morphs/flies from its scattered position into its grid slot rather than just cross-fading — this is the "cool" version, but the plain crossfade+scale is a safe, always-good-looking fallback
- No hard cuts — every switch should feel like one continuous piece of UI, not two separate pages swapping

---

## 5. Suggested Component API

```tsx
<TechStackShowcase
  categories={[
    { name: "AI Bots", tools: aiToolsArray },
    { name: "IDE", tools: ideToolsArray },
    { name: "Programming", tools: langToolsArray },
    { name: "Automation", tools: automationToolsArray },
  ]}
  defaultView="scatter" // "scatter" | "stack"
/>
```

Where each tool entry is:

```ts
type Tool = {
  name: string;       // "React"
  svglRoute: string;   // resolved SVGL dark-variant URL, cached at build time
  category: string;    // "IDE" | "Programming" | "AI Bots" | ...
};
```

## 6. Deliverable

- `TechStackShowcase.tsx` — top-level component managing view state + toggle + transition
- `ScatterCard.tsx` — Matter.js-driven physics card (Component A)
- `StackGrid.tsx` — full grid view (Component B)
- `lib/svgl.ts` — small helper to fetch/cache SVGL routes by tool name at build time
- Comments explaining the Matter.js world setup (gravity, walls, mouse constraint) so physics tuning is easy later