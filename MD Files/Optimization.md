# Optimization.md
### Gemini (Antigravity) Skill — Zero-Tolerance Project Cleanup + Aggressive Performance Optimization + Auto Bug-Fix

**Target project:** Personal portfolio site deployed on Vercel (e.g. shivasanjay.vercel.app)
**Mode:** Strict / Exhaustive. No file, folder, asset, or package is skipped or assumed safe.

---

## 0. Why This Version Exists

A previous pass under-cleaned the project — the majority of unused files (3D models, images, videos, sample/reference source code, stray folders) were left behind, and performance stayed poor. This version removes all ambiguity from the cleanup process: instead of pattern-matching "likely unused" files, Gemini must **individually verify every single file in the project against actual usage**, with no default-to-keep behavior. Anything not proven to be used gets deleted immediately.

---

## 1. Role & Objective

You are acting as a **senior full-stack + performance engineer** doing a final pre-deployment pass on a personal portfolio site. Your job, in strict order:

1. **Exhaustively audit every file and folder** in the project (excluding only `node_modules`).
2. **Delete anything unused immediately** — no batching into a "maybe" pile, no leaving it "for the user to review" unless it fails a very narrow safety exception (Section 3.4).
3. **Aggressively optimize** the site for real-world speed (not just theoretical best practice) — this includes heavy assets like 3D models, images, and video, which are the most likely cause of a "slightly slow" portfolio site.
4. **Find and fix bugs** across the whole codebase.

This is a portfolio site — it almost certainly contains showcase assets (3D models, renders, screenshots, demo videos, reference/sample code copied in while building features) that are no longer wired into the live site. These are exactly the files that must be found and removed.

---

## 2. Ground Rules

- **No default-to-keep.** The previous run's failure mode was treating uncertain files as "safe to leave." Flip the default: if a file cannot be proven to be referenced anywhere in the live project, it is deleted. Uncertainty is not a reason to keep a file — it's a reason to search harder, and if the search comes up empty, delete it.
- **Every file, individually.** Do not reason in categories ("the images folder looks fine"). Walk the **entire file tree** and check **each file** on its own, one at a time. Categories hide stragglers; individual checks don't.
- **Verify before deleting, but verify fast and move on.** The check is: "does anything in the live project reference this file's path, filename, or exported symbol?" If no → delete. Don't overthink it or leave it pending.
- **Checkpoint first.** Before starting, note the current git state (or take a full manual file listing) so the whole operation is auditable and revertible if something goes wrong.
- **Rebuild after cleanup, before optimization, and after bug fixes.** Three build checkpoints minimum. If a build breaks, find exactly what was needed, restore only that, and continue.
- **Large binary assets are priority #1 for both cleanup and performance.** 3D models, images, and videos are almost always the biggest contributors to both unused disk bloat and slow load times on a portfolio site. Treat them with extra scrutiny, not less.

---

## 3. Phase 1 — Exhaustive File-by-File Audit

### 3.1 Build the full file list
- Recursively list **every single file and folder** in the project root, excluding only `node_modules` and version-control internals (`.git`).
- Do **not** exclude `public/`, `assets/`, `static/`, `models/`, `videos/`, `docs/`, `reference/`, or any other folder by name — everything gets checked, including build/config folders (just don't delete generated build output like `.next`/`dist` — those are regenerated, not source, so they're out of scope for deletion, only for exclusion from the audit).

### 3.2 Build a reference index
For the codebase, build a full map of:
- Every import statement (static and dynamic) and what file it resolves to.
- Every string literal that looks like a path (`"/models/car.glb"`, `"./assets/hero.png"`, `src="/videos/demo.mp4"`, CSS `url(...)`, `next/image` `src` props, `<source>` tags, JSON config referencing file paths, `manifest.json`, `sitemap`, `robots.txt`, favicon references in `<head>`/metadata).
- Every route/page file and what it renders.
- Every package imported anywhere (including config files, scripts in `package.json`, CI files).

### 3.3 The per-file check (apply to literally every file)
For each file in the full list (Section 3.1), one at a time:

1. Search the **entire project source** (not just "likely" folders) for any occurrence of:
   - The exact filename.
   - The file's relative or absolute path fragments.
   - The file's name without extension (assets are sometimes referenced by a base name that gets a suffix added dynamically).
2. If it's a code file (component/hook/util/type): confirm no other file imports it, re-exports it via a barrel/index file, or references its exported symbols.
3. If it's an asset (image/video/3D model/audio/font/document): confirm no `src`, `href`, `url()`, `import`, dynamic `fetch`, CMS/config reference, or metadata field points to it, in any file type (including `.json`, `.css`, `.scss`, `.mdx`, `.html`).
4. **Result:**
   - **Zero references found → delete immediately.** Do not defer, do not add to a "review later" list.
   - **At least one real reference found → keep**, and note briefly why (what references it).

### 3.4 The only exceptions (narrow — do not overuse)
Keep, even without a direct textual reference, only if the file is one of these specific cases:
- Framework-required special files by convention (e.g. `middleware.ts`, `instrumentation.ts`, `not-found.tsx`/`404` pages, `robots.txt`, `sitemap.xml`/`sitemap.ts`, `favicon.ico`, `manifest.json`/`site.webmanifest`, `layout` files) — these are loaded by the framework itself, not by explicit imports.
- Config files at the project root that tooling reads by convention (`next.config.js`, `tailwind.config.js`, `postcss.config.js`, `tsconfig.json`, `vercel.json`, `.eslintrc`, etc.).
- Files referenced only from `vercel.json`, deployment config, or CI/CD pipelines.
- `.env.example` and license/readme files.

Everything else follows the strict rule in 3.3: **no reference anywhere → gone.**

### 3.5 Specifically hunt these categories (typical portfolio bloat)
Go through the project specifically looking for, and applying 3.3 to, every item in each category — do not stop at the first few found in each:

- **3D models** — `.glb`, `.gltf`, `.fbx`, `.obj`, `.stl`, `.blend`, plus their associated texture files. Check every single model file against what's actually loaded in the live 3D scene(s). Old iterations of a model, test models, and unused texture maps are extremely common leftovers.
- **Images** — every `.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`, `.svg`, `.gif` in the entire project, not just `public/images`. Include old profile photos, unused project screenshots, duplicate exports at different resolutions, favicons from earlier branding, and design-tool exports (Figma/Photoshop exports someone dropped into the repo).
- **Videos** — every `.mp4`, `.webm`, `.mov` file. Demo reels, background videos, old hero videos replaced by a newer version.
- **Sample/reference source code** — folders like `reference/`, `sample/`, `examples/`, `old/`, `backup/`, `archive/`, `test-components/`, `_scratch/`, `playground/`, or stray files like `Component_old.tsx`, `page-v2.tsx`, `untitled.js`, copy-pasted snippets from tutorials that were never wired in. These are code, so also apply the import-check from 3.3.2.
- **Documents/misc** — PDFs (old resumes/CVs not linked from the live site), `.zip`/`.rar` archives, design files, spreadsheet exports, notes files, `.DS_Store`, editor swap files, stray `.log`/`.tmp` files.
- **Fonts** — unused font files/weights not referenced in any `@font-face`, `next/font` config, or Tailwind theme.
- **Packages** — every `dependencies`/`devDependencies` entry in `package.json`, checked against actual usage anywhere in source, config, and scripts. Uninstall unused ones and regenerate the lockfile.

### 3.6 Execute
- Delete every file/folder that failed to produce a reference under 3.3, across every category in 3.5, in one pass — don't leave any category partially done.
- Remove unused packages, reinstall to refresh the lockfile.
- **Run the build.** If something breaks, identify the actual dependency that was missed, restore only that file, re-verify it under 3.3 (you'll find the reference you missed), and re-run the build.
- Report exact counts: files deleted per category (models / images / videos / code / docs / fonts), packages removed, and total disk space freed.

---

## 4. Phase 2 — Aggressive Performance Optimization

The site being "slightly slow" after a first optimization pass usually means the *big* offenders (heavy 3D/video/image assets, blocking JS) weren't addressed. Apply these at high intensity — target measurable Core Web Vitals, not just "best practice applied."

### 4.1 Targets (verify against these numbers, not vibes)
- Largest Contentful Paint (LCP): **under 2.5s**
- Cumulative Layout Shift (CLS): **under 0.1**
- Interaction to Next Paint (INP): **under 200ms**
- Total JS shipped to the client on first load: as low as the framework allows — flag anything over ~200-300KB gzipped for the initial route.
- Lighthouse Performance score: **90+** on both mobile and desktop simulated runs.

### 4.2 3D content (highest-impact area for this type of site)
- Compress every retained `.glb`/`.gltf` model with Draco or Meshopt compression.
- Convert textures to compressed GPU formats (KTX2/Basis) instead of raw PNG/JPG where the pipeline supports it.
- Reduce polygon count / apply LOD (level of detail) for models not viewed up close.
- Never load the 3D canvas/scene eagerly on initial page load if it's not the very first thing above the fold — lazy-load it (dynamic `import()`, `React.lazy`/`Suspense`, or "load on scroll into view").
- Disable or reduce heavy post-processing effects (bloom, SSAO, high-sample shadows) on mobile/low-end devices; detect device capability and degrade gracefully.
- Ensure the 3D library itself (three.js/react-three-fiber/etc.) and its addons are tree-shaken — import only the specific modules used, not the entire library barrel.
- Show a lightweight placeholder/poster (static image or skeleton) while the 3D scene initializes, so LCP isn't blocked on the 3D engine.

### 4.3 Images
- Convert every retained image to WebP or AVIF.
- Resize every image to the actual maximum display dimensions used on the site — never ship a 4000px source image for a 400px display slot.
- Use the framework's optimized image component (`next/image` or equivalent) everywhere, with correct `width`/`height` to prevent layout shift, and `priority`/eager loading only for the actual LCP image — everything else lazy-loaded.
- Strip unused metadata/EXIF from retained images.

### 4.4 Video
- Compress all retained videos (H.264/H.265 or VP9), target the lowest bitrate that keeps visual quality acceptable for a background/demo clip.
- Never autoplay a large video above the fold without a compressed poster frame shown first.
- Lazy-load videos that are below the fold; don't let them block initial page load.
- Consider replacing decorative background videos with a compressed looping WebM or, where visually acceptable, an animated but much smaller alternative.

### 4.5 JavaScript & rendering
- Convert as many components as possible to Server Components (if using a framework that supports them) — ship interactivity only where actually needed.
- Code-split every heavy, below-the-fold, or rarely-interacted-with component (contact form modals, project detail panels, 3D viewers, chart/animation libraries).
- Remove all animation/utility libraries that are imported but barely used — check if a lighter alternative or native CSS can replace them.
- Eliminate barrel imports that pull in entire libraries (`import * as Icons from 'react-icons'` → import only the specific icons used).
- Strip all `console.log`/debug code and dead feature flags.
- Defer/async all non-critical third-party scripts (analytics, embeds); never let them block first paint.

### 4.6 Rendering & caching strategy
- Use Static Generation for all pages that don't need per-request data (which, for a portfolio, is almost everything).
- Set appropriate cache-control/revalidation on any dynamic data fetches.
- Prefetch internal links likely to be visited next; don't prefetch everything indiscriminately.
- Self-host and preload fonts (`next/font` or equivalent) with only the actual weights/subsets used — drop unused weights.
- Inline critical above-the-fold CSS; defer the rest.

### 4.7 Build & deployment hygiene (Vercel)
- Run a bundle analyzer pass; identify and address the single largest contributors to bundle size.
- Confirm `vercel.json` sets sensible caching headers for static assets (long cache + immutable for hashed filenames).
- Confirm `.vercelignore`/`.gitignore` excludes any large dev-only files from ever reaching the deployed bundle.
- Re-verify after cleanup (Phase 1) that no now-broken asset paths remain (a very common issue right after aggressive deletion).

### 4.8 Verify
- Run a production build and, where tooling allows, a local Lighthouse/PageSpeed pass; record before/after numbers for LCP, CLS, INP, total JS size, and total page weight in the report.
- If any target in 4.1 isn't met, identify the specific remaining offender (usually one specific asset or script) and address it before finishing this phase — don't move on with a known unmet target.

---

## 5. Phase 3 — Bug & Issue Detection + Auto-Fix

### 5.1 Detection sweep
- Run the linter and type checker project-wide; collect every error and warning.
- Run any existing test suite; note failures.
- Specifically re-check for **broken references caused by Phase 1 deletions** — broken imports, missing assets, 404ing routes, images/models/videos that no longer resolve. This is the most likely new bug source after an aggressive cleanup pass, so check it explicitly, not just generically.
- Scan for standard issues: unhandled promise rejections, missing `key` props, incorrect hook dependency arrays, null/undefined access without guards, broken internal links, hydration mismatches, missing `alt` text, invalid HTML nesting, console errors/warnings at runtime.

### 5.2 Fix protocol
- Fix all unambiguous issues directly (lint/type errors, broken imports/paths, missing keys, obvious null-checks, accessibility basics, broken asset references from cleanup).
- For anything with unclear intended behavior, fix only if correct behavior is evident from context; otherwise flag with file, line, and reasoning for manual review — don't guess at business logic.
- Re-run lint/type-check/tests/build after each fix batch to confirm no regression.

### 5.3 Final verification
- Full clean install and full production build must pass with zero errors.
- Lint and type-check clean (or only pre-existing, explicitly flagged items remain).
- Manually confirm (via code, not assumption) that every route and every retained asset actually resolves — no dangling references left from the cleanup phase.

---

## 6. Reporting

Produce a final report with:

1. **Cleanup summary** — exact file/folder counts deleted, broken down by category (3D models, images, videos, sample/reference code, docs, fonts, packages), plus total size freed.
2. **Performance summary** — before/after Lighthouse or PageSpeed metrics (LCP, CLS, INP, total JS size, total page weight), and a list of specific changes made per category (3D, images, video, JS, caching).
3. **Bugs found & fixed** — file, description, fix applied.
4. **Flagged items** — the very small number of things kept under the narrow exceptions in 3.4, or anything genuinely ambiguous, with reasoning.
5. **Build/test status** — confirmation everything passes after all changes.

---

## 7. Execution Order (Summary)

```
Phase 1: Exhaustive Audit  → list every file (except node_modules)
                           → build full reference index
                           → check EVERY file individually against it
                           → delete anything with zero references (no exceptions except 3.4)
                           → reinstall → build check

Phase 2: Aggressive Optimize → 3D assets → images → video → JS/rendering → caching → Vercel config
                              → build check → Lighthouse check against targets in 4.1

Phase 3: Fix Bugs           → lint/type-check/test sweep (incl. cleanup-caused breakage)
                            → fix → re-verify → final clean build

Report                      → full before/after summary
```

Do not skip the per-file check in Phase 1 by reasoning at the folder/category level — that is exactly what caused files to be missed last time. Every file, checked individually, no default-to-keep.