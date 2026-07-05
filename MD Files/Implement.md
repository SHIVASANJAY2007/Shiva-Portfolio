Uncaught TypeError: Cannot read properties of undefined (reading 'geometry')
    at KnightModel (Knight.jsx:113:65)
    at renderWithHooks (chunk-FPASVA5V.js?v=947d84dd:5897:26)
    at mountIndeterminateComponent (chunk-FPASVA5V.js?v=947d84dd:9380:21)
    at beginWork (chunk-FPASVA5V.js?v=947d84dd:10363:22)
    at HTMLUnknownElement.callCallback2 (chunk-FPASVA5V.js?v=947d84dd:10594:22)
    at Object.invokeGuardedCallbackDev (chunk-FPASVA5V.js?v=947d84dd:10619:24)
    at invokeGuardedCallback (chunk-FPASVA5V.js?v=947d84dd:10651:39)
    at beginWork$1 (chunk-FPASVA5V.js?v=947d84dd:14205:15)
    at performUnitOfWork (chunk-FPASVA5V.js?v=947d84dd:13669:20)
    at workLoopSync (chunk-FPASVA5V.js?v=947d84dd:13609:13)
installHook.js:1 The above error occurred in the <KnightModel> component:

    at KnightModel (http://localhost:3000/src/components/3D/Knight.jsx?t=1783272979443:23:24)
    at Knight (http://localhost:3000/src/components/3D/Knight.jsx?t=1783272979443:207:26)
    at Suspense
    at Suspense
    at ErrorBoundary (http://localhost:3000/node_modules/.vite/deps/chunk-FPASVA5V.js?v=947d84dd:15975:5)
    at FiberProvider (http://localhost:3000/node_modules/.vite/deps/chunk-FPASVA5V.js?v=947d84dd:17655:21)
    at Provider (http://localhost:3000/node_modules/.vite/deps/chunk-FPASVA5V.js?v=947d84dd:17264:3)

React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.
overrideMethod @ installHook.js:1
2chunk-FPASVA5V.js?v=947d84dd:17761 Uncaught TypeError: Cannot read properties of undefined (reading 'geometry')
    at KnightModel (Knight.jsx:113:65)
    at renderWithHooks (chunk-FPASVA5V.js?v=947d84dd:5897:26)
    at mountIndeterminateComponent (chunk-FPASVA5V.js?v=947d84dd:9380:21)
    at beginWork (chunk-FPASVA5V.js?v=947d84dd:10363:22)
    at beginWork$1 (chunk-FPASVA5V.js?v=947d84dd:14193:22)
    at performUnitOfWork (chunk-FPASVA5V.js?v=947d84dd:13669:20)
    at workLoopSync (chunk-FPASVA5V.js?v=947d84dd:13609:13)
    at renderRootSync (chunk-FPASVA5V.js?v=947d84dd:13588:15)
    at recoverFromConcurrentError (chunk-FPASVA5V.js?v=947d84dd:13178:28)
    at performConcurrentWorkOnRoot (chunk-FPASVA5V.js?v=947d84dd:13126:30)
installHook.js:1 The above error occurred in the <ForwardRef(Canvas)> component:

    at Canvas (http://localhost:3000/node_modules/.vite/deps/chunk-FPASVA5V.js?v=947d84dd:17721:3)
    at FiberProvider (http://localhost:3000/node_modules/.vite/deps/chunk-FPASVA5V.js?v=947d84dd:17655:21)
    at CanvasWrapper
    at HeroErrorBoundary (http://localhost:3000/src/components/sections/Hero.jsx?t=1783273214053:32:5)
    at div
    at section
    at Hero (http://localhost:3000/src/components/sections/Hero.jsx?t=1783273214053:82:24)
    at div
    at div
    at ModuleScroller (http://localhost:3000/src/components/sections/ModuleScroller.jsx:23:34)
    at Suspense
    at main
    at div
    at ModelProvider (http://localhost:3000/src/providers/ModelProvider.jsx?t=1783272943842:21:33)
    at App (http://localhost:3000/src/App.jsx?t=1783273214053:41:3)

React will try to recreate this component tree from scratch using the error boundary you provided, HeroErrorBoundary.
overrideMethod @ installHook.js:1
installHook.js:1 Hero 3D Canvas Error: TypeError: Cannot read properties of undefined (reading 'geometry')
    at KnightModel (Knight.jsx:113:65)
    at renderWithHooks (chunk-FPASVA5V.js?v=947d84dd:5897:26)
    at mountIndeterminateComponent (chunk-FPASVA5V.js?v=947d84dd:9380:21)
    at beginWork (chunk-FPASVA5V.js?v=947d84dd:10363:22)
    at beginWork$1 (chunk-FPASVA5V.js?v=947d84dd:14193:22)
    at performUnitOfWork (chunk-FPASVA5V.js?v=947d84dd:13669:20)
    at workLoopSync (chunk-FPASVA5V.js?v=947d84dd:13609:13)
    at renderRootSync (chunk-FPASVA5V.js?v=947d84dd:13588:15)
    at recoverFromConcurrentError (chunk-FPASVA5V.js?v=947d84dd:13178:28)
    at performConcurrentWorkOnRoot (chunk-FPASVA5V.js?v=947d84dd:13126:30) Object Error Component Stack
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