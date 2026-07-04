# 3D_Fix.md — Large 3D Model Loading & Rendering Skill

## Purpose
This file is an **agent-instruction document**. It directs any AI coding agent (Antigravity Gemini, Claude Code, etc.) on how to correctly load, cache, and render large `.glb` 3D models hosted externally on Hugging Face Hub, inside this React Three Fiber portfolio project — **without guessing URLs, without bloating the Vercel build, and without breaking on 84MB–200MB files.**

If you are an AI agent reading this: follow the rules exactly. Do not "improve" the URL pattern, do not skip verification steps, and do not assume defaults that aren't stated here.

---

## 1. Current Known State (do not re-derive, just use this)

- Hosting provider: **Hugging Face Hub**, dataset repo `Shiva-Asta/portfolio-assets`
- Working example model: `knight.glb` — **84MB**
- Verified working resolve URL:
  ```
  https://huggingface.co/datasets/Shiva-Asta/portfolio-assets/resolve/main/knight.glb
  ```
- URL pattern (use this exact template for ALL future models, only swapping the filename):
  ```
  https://huggingface.co/datasets/Shiva-Asta/portfolio-assets/resolve/main/<FILENAME>.glb
  ```
- Future models will range **20MB to 200MB**. Assume every new model is large. Never treat any model in this project as "small enough to inline."

⚠️ **Never use `/blob/` in place of `/resolve/`.** `/blob/` returns an HTML preview page, not binary data, and will silently break `GLTFLoader` with a cryptic parse error. `/resolve/` returns the raw binary with correct headers.

---

## 2. Hard Rules (Failure Modes to Avoid)

These are based on observed agent failure patterns. Treat each as a blocking rule, not a suggestion.

1. **Never commit `.glb` files into the git repo or `/public` folder for Vercel deployment.** Files this large will blow up build size and git history. All models load client-side from the Hugging Face URL at runtime.
2. **Never invent or guess a Hugging Face URL.** If a new model is added, the human must supply the exact filename. Only substitute `<FILENAME>` in the verified template above — do not change the repo name, the `/resolve/main/` path, or the domain.
3. **Never load every model eagerly on app mount.** Each model is loaded only when its section/route is about to become visible (lazy, on-demand). A homepage with 3 models × 100MB each must not fetch 300MB on first paint.
4. **Never skip a network verification step before wiring a new model into code.** Run the `curl -I` check in Section 5 first. If it fails (404, wrong content-type, no CORS header), stop and report — don't proceed to write loader code against a broken URL.
5. **Never leave the screen blank while an 84MB–200MB file downloads.** Every model load must show a progress indicator (percentage or spinner) via `useProgress` from `@react-three/drei`. A blank canvas for 10–40 seconds reads as a broken site.
6. **Never duplicate model-loading logic per component.** All models go through one shared hook and one shared registry file (Section 3). If you need a new model, add one entry to the registry — do not write a new bespoke `useGLTF` call inline in a component.
7. **Do not assume Draco/Meshopt compression is present.** Check the actual file first (Section 5.2). If a model IS Draco-compressed, the `DRACOLoader` must be attached or it will fail to parse. If it's NOT compressed, attaching `DRACOLoader` is harmless but unnecessary — don't skip the check either way, since guessing wrong in either direction breaks the load.
8. **Never hardcode the Draco decoder version without pinning it.** Use the exact CDN path in Section 4.2. Do not swap in a different unpkg/jsdelivr version "because it's newer."
9. **Do not silently fail on load errors.** Every model load must have an `onError` path that logs the failing URL and shows a visible fallback (e.g., low-poly placeholder or retry button) — never a silently frozen scene.
10. **Do not re-download a model the user already has cached this session.** Use `useGLTF.preload()` and let `three.js`'s built-in loader cache do its job; don't fight it by adding cache-busting query params unless a model file is actually being replaced.

---

## 3. Architecture Pattern

Create/maintain exactly these three pieces. Do not scatter model logic elsewhere.

```
src/
  config/
    models.js            # registry: single source of truth for all model URLs + metadata
  hooks/
    useModelLoader.js     # shared hook wrapping useGLTF + progress + error handling
  components/
    3D/
      ModelViewer.jsx     # generic <Suspense> + <ModelViewer modelKey="knight" /> component
```

### 3.1 `config/models.js` — Registry (single source of truth)

```javascript
// config/models.js
// Add a new model by adding ONE entry here. Never hardcode URLs elsewhere.

export const MODEL_REGISTRY = {
  knight: {
    url: "https://huggingface.co/datasets/Shiva-Asta/portfolio-assets/resolve/main/knight.glb",
    sizeMB: 84,
    section: "hero", // which page section triggers load
    isDracoCompressed: false, // set true only after verifying (Section 5.2)
  },
  // Example for a future model — fill in real values, don't guess:
  // samurai: {
  //   url: "https://huggingface.co/datasets/Shiva-Asta/portfolio-assets/resolve/main/samurai.glb",
  //   sizeMB: 150,
  //   section: "about",
  //   isDracoCompressed: true,
  // },
};
```

### 3.2 `hooks/useModelLoader.js` — Shared loading hook

```javascript
// hooks/useModelLoader.js
import { useGLTF, useProgress } from "@react-three/drei";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { MODEL_REGISTRY } from "../config/models";

// Pinned Draco decoder version — do not change without re-testing.
const DRACO_DECODER_PATH = "https://www.gstatic.com/draco/versioned/decoders/1.5.6/";

export function useModelLoader(modelKey) {
  const entry = MODEL_REGISTRY[modelKey];

  if (!entry) {
    throw new Error(
      `[useModelLoader] No registry entry for "${modelKey}". Add it to config/models.js — do not hardcode a URL inline.`
    );
  }

  const gltf = useGLTF(entry.url, entry.isDracoCompressed ? DRACO_DECODER_PATH : undefined, undefined, (loader) => {
    if (entry.isDracoCompressed) {
      const draco = new DRACOLoader();
      draco.setDecoderPath(DRACO_DECODER_PATH);
      loader.setDRACOLoader(draco);
    }
  });

  return { gltf, meta: entry };
}

// Call this from a route/section BEFORE it's likely to be viewed,
// e.g. on hover of a nav link, or when a section enters the viewport (IntersectionObserver).
export function preloadModel(modelKey) {
  const entry = MODEL_REGISTRY[modelKey];
  if (entry) useGLTF.preload(entry.url);
}

export function useModelProgress() {
  return useProgress(); // { active, progress, loaded, total }
}
```

### 3.3 `components/3D/ModelViewer.jsx` — Generic viewer with progress + error boundary

```jsx
// components/3D/ModelViewer.jsx
import { Suspense, useState } from "react";
import { useModelLoader, useModelProgress } from "../../hooks/useModelLoader";

function LoadingOverlay() {
  const { progress } = useModelProgress();
  return (
    <div className="model-loading-overlay">
      Loading model… {Math.round(progress)}%
    </div>
  );
}

function ModelInner({ modelKey, onError }) {
  try {
    const { gltf } = useModelLoader(modelKey);
    return <primitive object={gltf.scene} />;
  } catch (err) {
    onError?.(err);
    return null;
  }
}

export default function ModelViewer({ modelKey }) {
  const [error, setError] = useState(null);

  if (error) {
    return (
      <div className="model-error-fallback">
        Couldn't load this model. <button onClick={() => setError(null)}>Retry</button>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingOverlay />}>
      <ModelInner modelKey={modelKey} onError={setError} />
    </Suspense>
  );
}
```

Usage in a section:
```jsx
<ModelViewer modelKey="knight" />
```

---

## 4. Performance Notes for 20MB–200MB Files

### 4.1 Lazy-load per section, not per app
Trigger `preloadModel(key)` only when:
- The relevant section is about to scroll into view (IntersectionObserver, ~200–400px before entering viewport), OR
- The user hovers/clicks a nav item pointing to that section.

Do not call `preloadModel` for every registry entry on app start.

### 4.2 Draco decoder — pinned CDN
Always use:
```
https://www.gstatic.com/draco/versioned/decoders/1.5.6/
```
This is Google's official hosted decoder. Do not substitute a jsdelivr/unpkg mirror unless gstatic is confirmed unreachable in testing — and if you do, pin an exact version there too.

### 4.3 Caching across visits (optional but recommended for 100MB+ files)
Browser HTTP cache alone may not persist reliably for very large files. For a real second-visit speed-up, consider caching the raw ArrayBuffer in **IndexedDB** using `idb-keyval`, keyed by model URL + a version/hash:

```javascript
import { get, set } from "idb-keyval";

async function fetchModelWithCache(url) {
  const cached = await get(url);
  if (cached) return cached;

  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  await set(url, buffer);
  return buffer;
}
```
Only add this if load times in testing are actually a problem — don't add caching complexity speculatively.

### 4.4 Texture size
If a model's textures (not just geometry) are large contributors to file size, and Draco compression alone doesn't help, consider requesting **KTX2/Basis-compressed textures** from whoever exports the model — this is a modeling-pipeline change, not something the loader code can fix after the fact. Flag this to the human rather than attempting texture recompression in-browser.

---

## 5. Verification Steps (run BEFORE wiring any new model into code)

### 5.1 Confirm the URL resolves to real binary data
```bash
curl -sI "https://huggingface.co/datasets/Shiva-Asta/portfolio-assets/resolve/main/<FILENAME>.glb"
```
Expected: `HTTP/2 200`, and `content-type` should NOT be `text/html`. If you see `text/html`, the URL is wrong (likely used `/blob/` instead of `/resolve/`, or the file doesn't exist at that path).

### 5.2 Check for CORS header
Same `curl -I` output should include an `access-control-allow-origin` header. If it's missing, the browser fetch will fail with a CORS error even though `curl` succeeds — report this to the human before proceeding, since it means the model may need to be re-hosted or proxied.

### 5.3 Check if the file is Draco-compressed
Quick way: try loading it with plain `useGLTF(url)` (no Draco loader attached). If it throws a parse error mentioning Draco/compression, set `isDracoCompressed: true` in the registry and re-test with the DRACOLoader attached. Do not assume either way.

### 5.4 Confirm file size matches expectations
```bash
curl -sI "<url>" | grep -i content-length
```
Sanity-check this against the size the human told you (e.g., "84MB", "~150MB"). A big mismatch means wrong file or wrong URL.

---

## 6. Adding a New Model — Checklist for the Agent

When the human says "add model X, here's the Hugging Face link":

- [ ] Run Section 5.1–5.4 verification against the exact URL given (do not modify it).
- [ ] Add one entry to `config/models.js` with the verified `url`, `sizeMB`, `section`, and `isDracoCompressed`.
- [ ] Do NOT touch `useModelLoader.js` or `ModelViewer.jsx` unless the new model needs genuinely new behavior (e.g., animations, multiple meshes) — the shared hook should already handle it.
- [ ] Wire `<ModelViewer modelKey="X" />` into the intended section only.
- [ ] Add a lazy-trigger (IntersectionObserver or hover-preload) for that section — do not eager-load.
- [ ] Test: throttle network in devtools (e.g., "Fast 3G") and confirm the progress overlay shows and updates, and the error fallback appears if you kill the connection mid-load.
- [ ] Report back the verified content-type, content-length, and whether Draco was needed — don't just say "done."

---

## 7. Things This Skill Does NOT Cover

- Compressing or re-exporting the actual `.glb` source files (that's a Blender/pipeline task, not a web-loading task).
- Changing Hugging Face repo visibility/permissions.
- Server-side proxying of the model through a Vercel API route — with client-side `fetch`/`useGLTF` working directly against Hugging Face, a proxy is unnecessary and would just add latency and hit Vercel's serverless payload/timeout limits on 100MB+ files. Do not introduce one unless CORS verification (5.2) actually fails.