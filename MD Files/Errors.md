
installHook.js:1 GSAP target .kanjiBgAbout not found. https://gsap.com Error Component Stack
    at About (About.jsx:10:24)
    at div (<anonymous>)
    at div (<anonymous>)
    at ModuleScroller (ModuleScroller.jsx:8:34)
    at Suspense (<anonymous>)
    at main (<anonymous>)
    at div (<anonymous>)
    at App (App.jsx:17:3)
overrideMethod @ installHook.js:1
installHook.js:1 GSAP target .kanjiBgAbout not found. https://gsap.com
overrideMethod @ installHook.js:1
vitals.js:6 [Web Vitals] LCP: 1012
vitals.js:6 [Web Vitals] CLS: 9.604799231380493e-7
installHook.js:1 You seem to have imported '@theatre/studio' but haven't initialized it. You can initialize the studio by:
```
import studio from '@theatre/studio'
studio.initialize()
```

* If you didn't mean to import '@theatre/studio', this means that your bundler is not tree-shaking it. This is most likely a bundler misconfiguration.

* If you meant to import '@theatre/studio' without showing its UI, you can do that by running:

```
import studio from '@theatre/studio'
studio.initialize()
studio.ui.hide()
```

overrideMethod @ installHook.js:1
vitals.js:6 [Web Vitals] CLS: 0.000001306252695467747
installHook.js:1 THREE.Clock: This module has been deprecated. Please use THREE.Timer instead. Error Component Stack
    at Canvas (chunk-ZGCSFGVV.js?v=dd31be29:17774:3)
    at FiberProvider (chunk-ZGCSFGVV.js?v=dd31be29:17708:21)
    at CanvasWrapper (<anonymous>)
    at div (<anonymous>)
    at section (<anonymous>)
    at Hero (Hero.jsx:166:24)
    at div (<anonymous>)
    at div (<anonymous>)
    at ModuleScroller (ModuleScroller.jsx:8:34)
    at Suspense (<anonymous>)
    at main (<anonymous>)
    at div (<anonymous>)
    at App (App.jsx:17:3)
overrideMethod @ installHook.js:1
2chunk-ZGCSFGVV.js?v=dd31be29:15672 Uncaught Error: Could not load /models/knight.glb: Unexpected token '<', "<!doctype "... is not valid JSON
    at chunk-ZGCSFGVV.js?v=dd31be29:17015:39
    at _onError (@react-three_drei.js?v=dd31be29:30629:9)
    at Object.onLoad (@react-three_drei.js?v=dd31be29:30655:11)
    at chunk-J6UFAVIY.js?v=dd31be29:23960:39
installHook.js:1 The above error occurred in the <KnightModel> component:

    at KnightModel (http://localhost:3000/src/components/sections/Hero.jsx:28:24)
    at Suspense
    at Suspense
    at ErrorBoundary (http://localhost:3000/node_modules/.vite/deps/chunk-ZGCSFGVV.js?v=dd31be29:16028:5)
    at FiberProvider (http://localhost:3000/node_modules/.vite/deps/chunk-ZGCSFGVV.js?v=dd31be29:17708:21)
    at Provider (http://localhost:3000/node_modules/.vite/deps/chunk-ZGCSFGVV.js?v=dd31be29:17317:3)

React will try to recreate this component tree from scratch using the error boundary you provided, ErrorBoundary.
overrideMethod @ installHook.js:1
2chunk-ZGCSFGVV.js?v=dd31be29:17814 Uncaught Error: Could not load /models/knight.glb: Unexpected token '<', "<!doctype "... is not valid JSON
    at chunk-ZGCSFGVV.js?v=dd31be29:17015:39
    at _onError (@react-three_drei.js?v=dd31be29:30629:9)
    at Object.onLoad (@react-three_drei.js?v=dd31be29:30655:11)
    at chunk-J6UFAVIY.js?v=dd31be29:23960:39
installHook.js:1 The above error occurred in the <ForwardRef(Canvas)> component:

    at Canvas (http://localhost:3000/node_modules/.vite/deps/chunk-ZGCSFGVV.js?v=dd31be29:17774:3)
    at FiberProvider (http://localhost:3000/node_modules/.vite/deps/chunk-ZGCSFGVV.js?v=dd31be29:17708:21)
    at CanvasWrapper
    at div
    at section
    at Hero (http://localhost:3000/src/components/sections/Hero.jsx:167:24)
    at div
    at div
    at ModuleScroller (http://localhost:3000/src/components/sections/ModuleScroller.jsx:23:34)
    at Suspense
    at main
    at div
    at App (http://localhost:3000/src/App.jsx:40:3)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
overrideMethod @ installHook.js:1
chunk-TBL4OAGS.js?v=dd31be29:19413 Uncaught Error: Could not load /models/knight.glb: Unexpected token '<', "<!doctype "... is not valid JSON
    at chunk-ZGCSFGVV.js?v=dd31be29:17015:39
    at _onError (@react-three_drei.js?v=dd31be29:30629:9)
    at Object.onLoad (@react-three_drei.js?v=dd31be29:30655:11)
    at chunk-J6UFAVIY.js?v=dd31be29:23960:39
chunk-J6UFAVIY.js?v=dd31be29:722 THREE.WebGLRenderer: Context Lost.
vitals.js:6 [Web Vitals] INP: 0.20000000018626451
5vitals.js:6 [Web Vitals] INP: 0