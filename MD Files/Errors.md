installHook.js:1 The above error occurred in the <primitive> component:

    at primitive
    at group
    at KnightModel (http://localhost:3000/src/components/3D/Knight.jsx?t=1783273990351:23:24)
    at Knight (http://localhost:3000/src/components/3D/Knight.jsx?t=1783273990351:196:26)
    at Suspense
    at Suspense
    at ErrorBoundary (http://localhost:3000/node_modules/.vite/deps/chunk-FPASVA5V.js?v=947d84dd:15975:5)
    at FiberProvider (http://localhost:3000/node_modules/.vite/deps/chunk-FPASVA5V.js?v=947d84dd:17655:21)
    at Provider (http://localhost:3000/node_modules/.vite/deps/chunk-FPASVA5V.js?v=947d84dd:17264:3)

React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.

2
chunk-FPASVA5V.js?v=947d84dd:17761 Uncaught Error: R3F: Primitives without 'object' are invalid!
    at createInstance (chunk-FPASVA5V.js?v=947d84dd:15679:42)
    at completeWork (chunk-FPASVA5V.js?v=947d84dd:8419:34)
    at completeUnitOfWork (chunk-FPASVA5V.js?v=947d84dd:13695:24)
    at performUnitOfWork (chunk-FPASVA5V.js?v=947d84dd:13677:13)
    at workLoopSync (chunk-FPASVA5V.js?v=947d84dd:13609:13)
    at renderRootSync (chunk-FPASVA5V.js?v=947d84dd:13588:15)
    at recoverFromConcurrentError (chunk-FPASVA5V.js?v=947d84dd:13178:28)
    at performConcurrentWorkOnRoot (chunk-FPASVA5V.js?v=947d84dd:13126:30)
    at workLoop (chunk-FPASVA5V.js?v=947d84dd:279:42)
    at flushWork (chunk-FPASVA5V.js?v=947d84dd:258:22)
installHook.js:1 The above error occurred in the <ForwardRef(Canvas)> component:

    at Canvas (http://localhost:3000/node_modules/.vite/deps/chunk-FPASVA5V.js?v=947d84dd:17721:3)
    at FiberProvider (http://localhost:3000/node_modules/.vite/deps/chunk-FPASVA5V.js?v=947d84dd:17655:21)
    at CanvasWrapper
    at HeroErrorBoundary (http://localhost:3000/src/components/sections/Hero.jsx?t=1783273990351:32:5)
    at div
    at section
    at Hero (http://localhost:3000/src/components/sections/Hero.jsx?t=1783273990351:82:24)
    at div
    at div
    at ModuleScroller (http://localhost:3000/src/components/sections/ModuleScroller.jsx:23:34)
    at Suspense
    at main
    at div
    at ModelProvider (http://localhost:3000/src/providers/ModelProvider.jsx?t=1783272943842:21:33)
    at App (http://localhost:3000/src/App.jsx?t=1783273990351:41:3)

React will try to recreate this component tree from scratch using the error boundary you provided, HeroErrorBoundary.
installHook.js:1 Hero 3D Canvas Error: Error: R3F: Primitives without 'object' are invalid!
 
Object
 Error Component Stack
    at HeroErrorBoundary (Hero.jsx:23:5)
    at div (<anonymous>)
    at section (<anonymous>)
    at Hero (Hero.jsx:78:25)
    at div (<anonymous>)
    at div (<anonymous>)
    at ModuleScroller (ModuleScroller.jsx:8:34)
    at Suspense (<anonymous>)
    at main (<anonymous>)
    at div (<anonymous>)
    at ModelProvider (ModelProvider.jsx:6:33)
    at App (App.jsx:18:3)
vitals.js:6 [Web Vitals] CLS: 0.0000054258955045767005
chunk-J6UFAVIY.js?v=947d84dd:722 THREE.WebGLRenderer: Context Lost.
16
vitals.js:6 [Web Vitals] CLS: 0
vitals.js:6 [Web Vitals] CLS: 0.0011589644404135018
﻿

