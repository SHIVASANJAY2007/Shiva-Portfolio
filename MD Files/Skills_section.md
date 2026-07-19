# Interactive Physics-Based Tool Card — Build Spec

## Concept
A rounded, dark bento-style card that showcases a set of tools/skills as floating logo icons on a dotted grid background. The logos idle-float with gentle random drift, and react to the user's cursor with smooth, physics-driven motion (attraction/repulsion + momentum + collision avoidance) when the cursor moves inside the card bounds. Below the icon area sits a title + subtitle text block on a solid dark footer.

Reference behavior: think "liquid magnetism" — icons should never snap or teleport; every movement is spring-damped and inertial, like objects floating in a fluid that responds to a nearby force field (the cursor).

---

## 1. Visual Structure

- Outer container: rounded-2xl card, dark background (`#0d0d0f` or similar near-black), subtle 1px border (`rgba(255,255,255,0.08)`), soft drop shadow.
- Top ~65% of card: "canvas" zone with a faint dot-grid background (radial-gradient dots, low opacity, ~24px spacing) — this is the physics playground.
- Bottom ~35%: solid dark footer panel (slightly different shade, e.g. `#000000`) containing:
  - Title (bold, white, ~16–18px) — e.g. "All Your AI Tools in One Place"
  - Subtitle (gray, ~13px, 2 lines max) — short descriptive text
- Icons are rendered as SVG/PNG logos of tools/skills, each in its own bounded hitbox, scattered at varied starting positions and sizes (do not grid-align them — natural scatter feels organic).

## 2. Data Model

Each item in the card should be data-driven:

```ts
type ToolItem = {
  id: string;
  name: string;        // e.g. "Claude", "VS Code", "Python"
  category: string;    // e.g. "AI Bots", "IDE", "Programming", "Automation"
  icon: string;         // SVG path, imported component, or image URL
  size?: number;         // optional override for icon scale
};
```

Pass in Shiva's actual tool/skill set (AI bots, IDEs, programming languages, automation tools like n8n, etc.) as this array — the card should be reusable for different tool groupings (e.g. one card per category, or one mixed card).

## 3. Physics / Motion Requirements

Use a lightweight physics-feel system — NOT a full physics engine unless truly needed. Prefer spring-based motion (Framer Motion `useSpring` / `useAnimationFrame`, or a custom RAF loop) over `matter.js` for performance, unless true rigid-body collision is required.

Required behaviors:

1. **Idle float**: When the cursor is NOT hovering, each icon should slowly drift in a small organic orbit (Perlin-noise or sine-based offset per icon, randomized phase/amplitude per icon so they don't move in sync).
2. **Cursor influence**: When the cursor enters the card bounds, nearby icons should react:
   - **Repel mode** (recommended for this look): icons within a radius (~120–160px) of the cursor get pushed away smoothly, with force falling off by distance (inverse-square or linear falloff).
   - Force should never cause instant jumps — apply as acceleration → velocity → position, with damping/friction each frame so motion settles naturally.
3. **Momentum & damping**: Each icon has velocity + friction coefficient (~0.90–0.95 per frame) so it decelerates smoothly after the cursor moves away, then eases back toward idle float.
4. **Boundary containment**: Icons must stay within the canvas zone — apply soft boundary repulsion near edges rather than hard clamping, so it feels like a bounded fluid rather than a wall collision.
5. **Mutual avoidance (optional, nice-to-have)**: Icons gently repel each other at close range so they don't overlap, using the same spring-repel logic as cursor interaction but with a smaller radius.
6. **Return-to-rest**: If the cursor leaves the card entirely, all icons should smoothly decay back into their idle-float behavior over ~1–2s, not snap back.

## 4. Tech Stack (match existing project conventions)

- **React** functional components + hooks
- **Framer Motion** for spring physics (`useMotionValue`, `useSpring`, `animate`) — preferred over GSAP here since this is 2D DOM-based, not 3D/WebGL
- `useAnimationFrame` (Framer Motion) or a custom `requestAnimationFrame` loop for the per-frame force calculation
- Track cursor position via `onMouseMove` on the card container, converted to local coordinates relative to the canvas zone
- Each icon is an absolutely positioned `motion.div` inside a `relative` canvas container
- Use `will-change: transform` and transform-only animation (translate, not top/left) for GPU-accelerated smoothness
- Debounce/guard so the effect is skipped entirely on touch devices or add a touch-drag fallback (icons respond to a finger/tap position instead of hover)

## 5. Performance Guardrails

- Cap the number of simultaneously animated icons to a sane count per card (~6–10) to avoid frame drops
- Use a single RAF loop for all icons rather than one per icon
- Throttle mousemove position updates using the RAF loop itself, not multiple listeners
- Avoid re-rendering React state every frame — mutate motion values directly (Framer Motion pattern) instead of `setState` in the animation loop

## 6. Suggested Component API

```tsx
<PhysicsToolCard
  title="All Your AI Tools in One Place"
  subtitle="Connect and use leading AI models from a single interface. Faster, simpler, and seamless."
  tools={toolsArray}
  interactionMode="repel" // "repel" | "attract" | "orbit"
  influenceRadius={140}
  className="max-w-sm"
/>
```

## 7. Deliverable

Build this as a single self-contained, reusable React component (`PhysicsToolCard.tsx`) with:
- No hard-coded tool data (accepts `tools` prop)
- Inline styles or Tailwind, matching the dark/near-black aesthetic in the reference image
- Comments explaining the force-calculation logic so it can be tuned later
- A short usage example at the bottom of the file

JSON : 
{
  "languages": [
    "Java",
    "JavaScript",
    "Python",
    "C",
    "SQL"
  ],
  "code_editors": [
    "Antigravity",
    "VS Code"
  ],
  "ai_workspace": [
    "ChatGPT",
    "Gemini",
    "NotebookLLM",
    "GitHub Copilot"
  ],
  "frontend": [
    "HTML5",
    "CSS3",
    "React",
    "Tailwind CSS",
    "Bootstrap"
  ],
  "backend": [
    "Node.js",
    "Express.js"
  ],
  "databases": [
    "MongoDB",
    "PostgreSQL",
    "pgAdmin",
    "MySQL"
  ],
  "other_tools_platforms": [
    "GitHub",
    "Notion",
    "Docker",
    "n8n",
    "Google Colab",
    "Microsoft Office"
  ],
  "crm_erp_platforms": [
    "Salesforce",
    "Odoo"
  ]
}