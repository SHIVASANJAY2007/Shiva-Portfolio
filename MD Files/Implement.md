# SKILL: Production-Grade 3D Model Caching Architecture

> Version: 1.0
> Priority: Critical
> Target Stack: React + Vite + React Three Fiber + Three.js + Vercel
> Target Model:
> https://huggingface.co/datasets/Shiva-Asta/portfolio-assets/resolve/main/knight.glb

---

# Objective

Implement a production-grade caching architecture for the Knight GLB model that minimizes loading time while keeping the original 85MB model unchanged.

The objective is NOT to compress the model.

Instead, optimize the loading pipeline so that:

- First visit downloads only once.
- Future visits never download again unless the model version changes.
- The model is parsed only once per browser session.
- Route changes are instant.
- Memory is managed correctly.
- Works flawlessly on Vercel.

---

# Current Situation

The portfolio currently loads a single GLB model hosted on Hugging Face.

Model URL:

https://huggingface.co/datasets/Shiva-Asta/portfolio-assets/resolve/main/knight.glb

Current behaviour:

User opens website
↓
React mounts Hero
↓
GLB downloaded
↓
GLTF parsed
↓
Textures uploaded to GPU
↓
Model appears after ~4 seconds

This delay is acceptable on first visit but not on future visits.

---

# Desired Behaviour

FIRST VISIT

Open Website

↓

Start downloading model immediately in background

↓

Store downloaded Blob inside IndexedDB

↓

Parse GLTF

↓

Store parsed THREE.Scene inside Memory Cache

↓

Render Hero


SECOND VISIT

Open Website

↓

Read Blob from IndexedDB

↓

Skip network request

↓

Parse once

↓

Store parsed Scene in Memory Cache

↓

Render


ROUTE CHANGE

Open Hero

↓

Memory Cache exists

↓

Clone cached scene

↓

Instant render

No download.

No parsing.

---

# Architecture

Use TWO levels of cache.

Level 1

Persistent Cache

Technology:

IndexedDB

Stores:

GLB Blob

Purpose:

Avoid downloading from Hugging Face again.

---

Level 2

Memory Cache

Stores:

Parsed THREE.Scene

Purpose:

Avoid parsing GLB repeatedly.

Memory cache lives until browser tab closes.

---

# Do NOT

Never store THREE.Scene inside IndexedDB.

Reason:

THREE.Scene contains

- GPU resources
- functions
- circular references

It cannot be serialized.

Only store:

Blob

---

# Folder Structure

Create:

src/

cache/

modelDB.js

modelLoader.js

memoryCache.js

constants.js

hooks/

useKnightModel.js

components/

Knight.jsx

providers/

ModelProvider.jsx

utils/

cloneScene.js

types/

(optional)

---

# Phase 1

Create Constants

Create constants.js

Contains

MODEL_URL

MODEL_CACHE_KEY

MODEL_VERSION

DATABASE_NAME

STORE_NAME

CACHE_VERSION

Changing MODEL_VERSION must automatically invalidate old cache.

---

# Phase 2

IndexedDB Layer

Create:

modelDB.js

Responsibilities:

Open database

Create object store

Save Blob

Read Blob

Delete Blob

Clear database

Database name:

PortfolioModelCache

Store:

models

Methods:

openDatabase()

saveBlob()

loadBlob()

deleteBlob()

clearDatabase()

Never expose IndexedDB implementation outside this file.

---

# Phase 3

Network Layer

Create:

modelLoader.js

Responsibilities:

Check IndexedDB

If Blob exists

Return Blob

Else

Download from Hugging Face

Store Blob

Return Blob

The downloader must:

show progress

handle fetch errors

support AbortController

retry 3 times

timeout after 30 seconds

---

# Phase 4

Object URL Manager

Never create Object URLs without revoking them.

Create helper:

createObjectURL()

revokeObjectURL()

Avoid memory leaks.

---

# Phase 5

Memory Cache

Create

memoryCache.js

Store

Parsed GLTF

Structure

Map

Example

Map

key

↓

GLTF

Memory cache must expose

has()

get()

set()

clear()

size()

Never parse the same model twice.

---

# Phase 6

GLTF Loader

Responsibilities

Receive Blob

↓

Create Object URL

↓

Load GLTF

↓

Dispose Object URL

↓

Return GLTF

If loading fails

Revoke URL

Throw Error

---

# Phase 7

Scene Cloning

Never reuse original Scene.

Always clone.

If model has skeleton

Use

SkeletonUtils.clone()

Else

scene.clone(true)

Reason

Three.js cannot mount same scene twice.

---

# Phase 8

Custom Hook

Create

useKnightModel()

Returns

scene

loading

progress

error

reload()

clearCache()

Hook flow

Memory cache?

↓

YES

↓

Clone scene

↓

Return

NO

↓

IndexedDB?

↓

YES

↓

Load Blob

↓

Parse

↓

Memory Cache

↓

Clone

↓

Return

NO

↓

Download

↓

Save Blob

↓

Parse

↓

Memory Cache

↓

Clone

↓

Return

---

# Phase 9

Background Prefetch

As soon as App mounts

Immediately begin

download

↓

store Blob

↓

parse

↓

memory cache

Do NOT wait for Hero component.

Hero should receive already-loaded model whenever possible.

---

# Phase 10

Model Provider

Create

ModelProvider.jsx

Purpose

Initialize model once

Provide cached instance

Entire application shares same cache.

---

# Phase 11

Versioning

Store

MODEL_VERSION

inside IndexedDB metadata.

When version changes

Automatically

Delete old Blob

Download new Blob

Never require manual cache clearing.

---

# Phase 12

Error Handling

Handle

Network failure

IndexedDB unavailable

Quota exceeded

Corrupted Blob

GLTF parse failure

Timeout

Abort

Gracefully fallback

Download again

Never crash application.

---

# Phase 13

Performance

Measure

Download Time

Blob Read Time

GLTF Parse Time

Scene Clone Time

Total Hero Load Time

Print in Development

Never print in Production.

---

# Phase 14

SSR Compatibility

Never use

window

document

indexedDB

localStorage

during module initialization.

Only access browser APIs

inside

useEffect()

or

client-only functions.

Must deploy on Vercel without SSR errors.

---

# Phase 15

Memory Management

Dispose

Object URLs

Textures (when appropriate)

Unused scenes

Unused geometries

Avoid memory leaks.

---

# Phase 16

Development Logs

Development

✅ Downloading Knight...

✅ Reading from IndexedDB...

✅ Parsing GLTF...

✅ Loaded from Memory Cache...

✅ Cloning Scene...

✅ Finished.

Production

No console logs.

---

# Phase 17

Acceptance Criteria

First Visit

Download occurs exactly once.

Blob stored.

Hero renders.

Second Visit

No network request.

Blob loaded.

Hero renders.

Route Change

Instant.

No download.

No parsing.

Refresh

No download.

Read IndexedDB.

Model Version Changed

Old cache removed.

New downloaded automatically.

Offline

Previously cached model still loads.

---

# Phase 18

Code Quality

Requirements

Use async/await.

No callback hell.

No duplicate code.

Proper JSDoc.

Strong typing where possible.

Modular architecture.

No global mutable variables except dedicated Memory Cache.

Every function should have a single responsibility.

---

# Phase 19

Performance Goals

Target

First Visit

≈ Existing performance

Second Visit

Network

0 MB

Route Change

<100ms

Memory Cache Lookup

<5ms

Blob Read

<50ms

Scene Clone

<30ms

---

# Phase 20

Future Extensibility

Architecture must support

Model A

Model B

Model C

without modification.

Memory cache should be generic.

IndexedDB should support multiple models.

Only MODEL_URL and MODEL_CACHE_KEY should change.

---

# Deliverables

Generate fully working production-ready code for:

- constants.js
- modelDB.js
- modelLoader.js
- memoryCache.js
- cloneScene.js
- useKnightModel.js
- ModelProvider.jsx
- Knight.jsx

Integrate with React Three Fiber.

Integrate with @react-three/drei.

Use GLTFLoader.

Use SkeletonUtils where required.

Implement complete caching lifecycle.

Avoid unnecessary re-renders.

Ensure compatibility with React Strict Mode.

Ensure compatibility with Vercel deployment.

The generated implementation must be production-quality, modular, maintainable, and optimized for long-term scalability.