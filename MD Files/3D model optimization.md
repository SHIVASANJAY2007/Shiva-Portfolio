---
name: fast-3d-model-vercel
description: Use when the 3D model (GLB) in the React Three Fiber portfolio renders instantly on localhost but is slow, stuck on loading, or never appears after deploying to Vercel. Diagnoses the real cause on the deployed site, then fixes asset size, hosting, caching, preloading and loader setup so the model appears fast on first visit and instantly on repeat visits.
---

# Skill: Fast 3D model rendering on Vercel

## Goal

The 3D model is the core feature of this portfolio. After deployment it must:

- Appear within about 2 seconds on a normal connection (first visit), and within 500 ms on repeat visits.
- Never block the rest of the page. Text and layout render first, the model fades in when ready.
- Never hang silently. If it fails, a fallback image shows and the console says why.

## Why localhost hides the problem

Localhost serves files from disk with no network, no CDN, no cache rules, and a case-insensitive file system on Windows/macOS. A deployed site on Vercel has a real network, Linux case-sensitive paths, a build step that only includes tracked files, and default cache headers that force revalidation. The same code can therefore work locally and fail or crawl in production.

## Operating rules

1. Diagnose first. Do not change code until Step 1 identifies which causes apply. Report findings in a short table.
2. Test against the deployed URL (or `npm run build && npm run preview`), never only against `npm run dev`.
3. Do not change how the model looks. Only change how and when it loads.
4. One fix per commit. Re-measure after each one.
5. Never remove the model or replace it with a different one without explicit approval.

---

## Step 1 - Diagnose (run every check, report each result)

### 1.1 Where is the model URL?

Search the code for the model path: `grep -rn "useGLTF\|GLTFLoader\|\.glb\|\.gltf" src`.

- If the URL is external (Hugging Face Hub, GitHub raw, Google Drive, Dropbox, another host): this is a probable main cause. Cross-origin hosts add DNS/TLS time, redirects (Hugging Face `resolve/main` redirects to a storage CDN), no long cache headers, rate limits, and CORS failures. Go to Step 3 and move the model onto the same origin.
- If the URL is local (`/models/...`): continue the checks.

### 1.2 Is the file really deployed?

- `git ls-files | grep -i -E "glb|gltf|hdr|ktx2"` must list every model/environment file. If a file is missing, it is git-ignored or untracked. Check `git check-ignore -v <file>`.
- `cat .gitattributes`. If the model is tracked by Git LFS (`filter=lfs`), Vercel may deploy only the tiny LFS pointer text file, which is not a valid GLB. Enable Git LFS in the Vercel project settings, or avoid LFS for this file.
- `ls dist/models` after `npm run build` must show the file with the right size.
- Check case: the filename in the code and on disk must match exactly (`Knight.glb` and `knight.glb` are different on Linux).

### 1.3 What does production actually serve?

Run against the deployed site (replace the URL):

```bash
curl -s -o /dev/null -D - https://YOUR-SITE.vercel.app/models/knight-opt.glb
curl -s https://YOUR-SITE.vercel.app/models/knight-opt.glb | head -c 4; echo
```

Check and record:

| Check | Good | Bad means |
| --- | --- | --- |
| Status | `200` | `404`/`403`: wrong path or file not deployed |
| `content-type` | `model/gltf-binary` or `application/octet-stream` | `text/html`: SPA rewrite is returning `index.html` instead of the model |
| First 4 bytes | `glTF` | Anything else: LFS pointer, HTML page, or corrupted file |
| `content-length` | 1.5 MB or less | Over 4 MB: file is too heavy (Step 2) |
| `cache-control` | `public, max-age=31536000, immutable` | `max-age=0, must-revalidate`: the model is revalidated on every visit (Step 4) |

### 1.4 What does the browser do?

Open the deployed site in Chrome DevTools, Network tab, with "Disable cache" ON and throttling set to "Fast 4G" with 4x CPU slowdown.

- Find the `.glb` request. Note its start time, wait time (TTFB), and download time.
- Look for a waterfall problem: does the model request start only after a large JS bundle has loaded and executed? If yes, that is a preload problem (Step 5).
- Look in the Console for: CORS errors, `404`, `Unexpected token <`, `THREE.GLTFLoader` errors, Draco/Meshopt decoder errors, or `WebGL context lost`.
- Look for extra requests to `gstatic.com`, `raw.githack`, `github`, or `cdn` domains: these are Draco decoder, HDR or environment preset downloads that are fetched at runtime (Steps 3 and 6).

### 1.5 Does the app wait for the model?

Search for the preloader and loading state. If the preloader, hero text or page layout is blocked until the model finishes, a slow model makes the whole site look broken. Note it for Step 7.

---

## Step 2 - Shrink the model (largest single win)

Target: model file 1.5 MB or less, 1.0 MB if possible. Run on the source file, keep the original untouched in a folder outside `public/`.

```bash
npm i -D @gltf-transform/cli
npx gltf-transform optimize public/models/knight.glb public/models/knight-opt.glb \
  --compress meshopt --texture-compress webp --texture-size 1024
```

Rules:

- Prefer Meshopt compression. drei's `useGLTF` supports it with no decoder file to download. Use Draco only if Meshopt is not possible, and then self-host the decoder (Step 6).
- Texture size: 1024 for the main model. Use 512 for secondary textures. Never ship 4K textures for a model that fills less than half the screen.
- If textures are still large, use KTX2 (`--texture-compress etc1s` or `uastc`, needs `toktx`) and self-host the Basis transcoder.
- Remove unused animations, cameras, lights and extra UV sets (`gltf-transform prune` and `dedup` run inside `optimize`).
- Open the result in a glTF viewer or in the site and compare it with the original. If it looks different, raise texture size or reduce simplification, but keep the file small.
- If the model is far over budget (for example tens of MB), decimate the mesh: `gltf-transform simplify --ratio 0.5` and check the look. Aim for under about 100k triangles for a hero model.

Optional two-stage load for the best first impression: also produce `knight-lite.glb` (500 KB or less, 512 px textures), show it first, then swap to the full model silently when it finishes.

---

## Step 3 - Host the model on the same origin

- Move the optimized model to `public/models/` (served by Vercel's CDN from the same domain), or import it so Vite fingerprints it: `import modelUrl from './knight-opt.glb?url'`.
- Use absolute paths from the site root (`/models/knight-opt.glb`), never `./models/...`, so nested routes do not break.
- If `vite.config.js` has a `base` option, make sure paths respect it.
- Do not load the model from Hugging Face, GitHub raw, Drive or Dropbox in production. If the original file is too large for the Git repo, optimize it first (Step 2). The optimized file should be small enough to commit.
- Vercel limits: individual static files must stay well under 100 MB, and a large repo slows builds. An optimized 1.5 MB model is far inside these limits.

---

## Step 4 - Cache headers and rewrites

Create or edit `vercel.json` in the project root:

```json
{
  "headers": [
    {
      "source": "/models/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/draco/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ],
  "rewrites": [
    { "source": "/((?!models/|draco/|assets/|.*\\..*).*)", "destination": "/index.html" }
  ]
}
```

Notes:

- `immutable` is safe only if a changed file gets a new name. When you replace the model, rename it (for example `knight-opt.v2.glb`) and update the code. Files imported through Vite (`?url`) get a content hash automatically.
- The rewrite rule must never catch real files. A catch-all rewrite that returns `index.html` for a missing `.glb` makes the loader fail with a confusing parse error. The pattern above excludes anything with a file extension.
- If the project has no client-side routes, the rewrite block can be removed.
- After deploying, re-run the `curl` check from Step 1.3 and confirm `cache-control` now shows the long value.

---

## Step 5 - Start the download early (preload)

The model must start downloading at the same time as the JavaScript, not after it.

1. In `index.html` inside `<head>`:

```html
<link rel="preload" href="/models/knight-opt.glb" as="fetch" type="model/gltf-binary" crossorigin="anonymous">
```

The URL and `crossorigin` mode must match the loader's request exactly, or the browser downloads the file twice.

2. In the 3D component module (top level, outside any component):

```js
import { useGLTF } from '@react-three/drei'
useGLTF.preload('/models/knight-opt.glb')
```

3. Make sure the Three.js code is a separate lazy chunk, but start loading it immediately on page load (not on scroll). Use `import()` in an effect or idle callback at app start, so the chunk and the model download in parallel.
4. Add `<link rel="preconnect">` only for hosts you still must use. After Step 3 there should be none for the model.

---

## Step 6 - Remove hidden runtime downloads

Look for anything that fetches from another domain while the scene starts:

- **Environment/HDR**: drei `<Environment preset="...">` downloads an HDR from a public CDN at runtime. Replace it with a local small file (`files="/models/env-512.hdr"`, 512 px or smaller, 300 KB or less) or, best, a procedural environment with no download at all:

```jsx
<Environment resolution={256}>
  <Lightformer form="rect" intensity={2} position={[0, 5, -5]} scale={[10, 5, 1]} />
  <Lightformer form="rect" intensity={1} position={[-5, 1, 2]} scale={[6, 3, 1]} />
</Environment>
```

- **Draco decoder**: if Draco is used, copy the decoder files into `public/draco/` and call `useGLTF.setDecoderPath('/draco/')`. Never rely on the default gstatic URL.
- **KTX2 transcoder**: same, self-host it and set the transcoder path.
- **Fonts, textures, other models** loaded inside the scene: confirm each is local, small, and cached.

---

## Step 7 - Never block the page on the model

- Render the page layout and hero text immediately. The model lives inside `<Suspense fallback={...}>`.
- The fallback should be a pre-rendered image (WebP, 100 KB or less) of the model in the same pose and position, so the layout does not jump and the user sees the design right away.
- If a preloader exists, cap it: finish when the model is ready or after about 1.5 seconds, whichever comes first. Never let it wait indefinitely.
- Fade the canvas in with a CSS opacity transition once the first frame has rendered.
- Wrap the canvas in an error boundary. On error, keep the fallback image and log the real error to the console.
- Mount the heavy scene only when needed, for example when the Hero is in view.

---

## Step 8 - Renderer settings that avoid slow or failed starts

- `<Canvas dpr={[1, 1.5]} gl={{ antialias: true, powerPreference: 'high-performance' }}>`. High device pixel ratios multiply the fill cost on weak GPUs.
- Use `frameloop="demand"` and call `invalidate()` when something moves (see the performance methodology).
- Pre-compile shaders during load, before the first visible frame: `gl.compileAsync(scene, camera)`, or drei `<Preload all />` inside the canvas.
- Handle WebGL failure: listen for `webglcontextlost` and for a failed context creation, and show the fallback image instead of a blank area.
- Dispose of geometries, materials and textures on unmount so repeated mounting does not leak memory.
- Add a quality tier (low-end device or `saveData`): smaller dpr, no shadows, no post-processing, and optionally the lite model.

---

## Step 9 - Verify on the real deployment

Deploy a preview on Vercel, then test the preview URL with DevTools (disable cache, Fast 4G, 4x CPU):

| Metric | Target |
| --- | --- |
| Model file size over the network | 1.5 MB or less |
| Model request starts | Within the first 300 ms of page load |
| First visit: model visible | 2 s or less on Fast 4G |
| Repeat visit: model visible | 500 ms or less (served from cache, `from disk cache` in Network) |
| Requests to other domains for the scene | 0 |
| Console errors | 0 |
| Preloader or layout blocked by model | No |

Also test: a hard refresh, a deep link, a phone on mobile data, and an incognito window on a different computer.

---

## Failure-mode quick reference

| Symptom on Vercel | Likely cause | Fix |
| --- | --- | --- |
| Loads forever, no error | Model on a slow or blocked external host, or an LFS pointer file | Steps 1.1, 1.2, 3 |
| `Unexpected token <` in console | Rewrite returns `index.html` for the model path | Steps 1.3, 4 |
| Works only after a second refresh | Large file plus no preload, or revalidation on each load | Steps 2, 4, 5 |
| 404 only in production | Case mismatch, git-ignored file, wrong base path | Steps 1.2, 3 |
| Model appears but very late | Download starts after the JS bundle runs | Step 5 |
| Works on your PC, black canvas elsewhere | WebGL context failure, heavy dpr, no fallback | Steps 7, 8 |
| Slow only on mobile | Large textures, high dpr, post-processing | Steps 2, 8 |

## Final report format

Reply with: (1) the diagnosis table from Step 1 with the causes you found, (2) what you changed per step, (3) before and after numbers from Step 9, (4) anything you could not do and why. Do not mark the task done until Step 9 passes on the deployed preview.
