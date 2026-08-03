GET http://localhost:3000/node_modules/.vite/deps/@lobehub_icons_es_NotebookLM.js?v=aa6ddcb9 net::ERR_ABORTED 504 (Outdated Optimize Dep)
2chunk-I773Y2XN.js?v=7dabfc35:903 Uncaught TypeError: Failed to fetch dynamically imported module: http://localhost:3000/src/components/sections/Skills.jsx?t=1785742104682
installHook.js:1 The above error occurred in one of your React components:

    at Lazy
    at section
    at StickyCard (http://localhost:3000/src/components/sections/StackScroller.jsx:20:23)
    at section
    at main
    at StackScroller (http://localhost:3000/src/components/sections/StackScroller.jsx:76:33)
    at Suspense
    at main
    at div
    at ModelProvider (http://localhost:3000/src/providers/ModelProvider.jsx:21:33)
    at App (http://localhost:3000/src/App.jsx?t=1785742104682:42:3)

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
overrideMethod @ installHook.js:1
console.error @ chunk-ZGCSFGVV.js?v=7dabfc35:17705
logCapturedError @ chunk-TBL4OAGS.js?v=7dabfc35:14032
update.callback @ chunk-TBL4OAGS.js?v=7dabfc35:14052
callCallback @ chunk-TBL4OAGS.js?v=7dabfc35:11248
commitUpdateQueue @ chunk-TBL4OAGS.js?v=7dabfc35:11265
commitLayoutEffectOnFiber @ chunk-TBL4OAGS.js?v=7dabfc35:17093
commitLayoutMountEffects_complete @ chunk-TBL4OAGS.js?v=7dabfc35:17980
commitLayoutEffects_begin @ chunk-TBL4OAGS.js?v=7dabfc35:17969
commitLayoutEffects @ chunk-TBL4OAGS.js?v=7dabfc35:17920
commitRootImpl @ chunk-TBL4OAGS.js?v=7dabfc35:19353
commitRoot @ chunk-TBL4OAGS.js?v=7dabfc35:19277
finishConcurrentRender @ chunk-TBL4OAGS.js?v=7dabfc35:18760
performConcurrentWorkOnRoot @ chunk-TBL4OAGS.js?v=7dabfc35:18718
workLoop @ chunk-TBL4OAGS.js?v=7dabfc35:197
flushWork @ chunk-TBL4OAGS.js?v=7dabfc35:176
performWorkUntilDeadline @ chunk-TBL4OAGS.js?v=7dabfc35:384
postMessage
schedulePerformWorkUntilDeadline @ chunk-TBL4OAGS.js?v=7dabfc35:407
performWorkUntilDeadline @ chunk-TBL4OAGS.js?v=7dabfc35:387
postMessage
schedulePerformWorkUntilDeadline @ chunk-TBL4OAGS.js?v=7dabfc35:407
requestHostCallback @ chunk-TBL4OAGS.js?v=7dabfc35:418
unstable_scheduleCallback @ chunk-TBL4OAGS.js?v=7dabfc35:330
scheduleCallback$1 @ chunk-TBL4OAGS.js?v=7dabfc35:19826
ensureRootIsScheduled @ chunk-TBL4OAGS.js?v=7dabfc35:18652
retryTimedOutBoundary @ chunk-TBL4OAGS.js?v=7dabfc35:19619
resolveRetryWakeable @ chunk-TBL4OAGS.js?v=7dabfc35:19650
Promise.then
(anonymous) @ chunk-TBL4OAGS.js?v=7dabfc35:17654
attachSuspenseRetryListeners @ chunk-TBL4OAGS.js?v=7dabfc35:17641
commitMutationEffectsOnFiber @ chunk-TBL4OAGS.js?v=7dabfc35:17839
recursivelyTraverseMutationEffects @ chunk-TBL4OAGS.js?v=7dabfc35:17685
commitMutationEffectsOnFiber @ chunk-TBL4OAGS.js?v=7dabfc35:17737
recursivelyTraverseMutationEffects @ chunk-TBL4OAGS.js?v=7dabfc35:17685
commitMutationEffectsOnFiber @ chunk-TBL4OAGS.js?v=7dabfc35:17737
recursivelyTraverseMutationEffects @ chunk-TBL4OAGS.js?v=7dabfc35:17685
commitMutationEffectsOnFiber @ chunk-TBL4OAGS.js?v=7dabfc35:17896
recursivelyTraverseMutationEffects @ chunk-TBL4OAGS.js?v=7dabfc35:17685
commitMutationEffectsOnFiber @ chunk-TBL4OAGS.js?v=7dabfc35:17699
recursivelyTraverseMutationEffects @ chunk-TBL4OAGS.js?v=7dabfc35:17685
commitMutationEffectsOnFiber @ chunk-TBL4OAGS.js?v=7dabfc35:17699
recursivelyTraverseMutationEffects @ chunk-TBL4OAGS.js?v=7dabfc35:17685
commitMutationEffectsOnFiber @ chunk-TBL4OAGS.js?v=7dabfc35:17896
recursivelyTraverseMutationEffects @ chunk-TBL4OAGS.js?v=7dabfc35:17685
commitMutationEffectsOnFiber @ chunk-TBL4OAGS.js?v=7dabfc35:17794
commitMutationEffects @ chunk-TBL4OAGS.js?v=7dabfc35:17663
commitRootImpl @ chunk-TBL4OAGS.js?v=7dabfc35:19347
commitRoot @ chunk-TBL4OAGS.js?v=7dabfc35:19277
finishConcurrentRender @ chunk-TBL4OAGS.js?v=7dabfc35:18783
performConcurrentWorkOnRoot @ chunk-TBL4OAGS.js?v=7dabfc35:18718
workLoop @ chunk-TBL4OAGS.js?v=7dabfc35:197
flushWork @ chunk-TBL4OAGS.js?v=7dabfc35:176
performWorkUntilDeadline @ chunk-TBL4OAGS.js?v=7dabfc35:384
postMessage
schedulePerformWorkUntilDeadline @ chunk-TBL4OAGS.js?v=7dabfc35:407
requestHostCallback @ chunk-TBL4OAGS.js?v=7dabfc35:418
unstable_scheduleCallback @ chunk-TBL4OAGS.js?v=7dabfc35:330
scheduleCallback$1 @ chunk-TBL4OAGS.js?v=7dabfc35:19826
ensureRootIsScheduled @ chunk-TBL4OAGS.js?v=7dabfc35:18652
scheduleUpdateOnFiber @ chunk-TBL4OAGS.js?v=7dabfc35:18562
updateContainer @ chunk-TBL4OAGS.js?v=7dabfc35:20776
ReactDOMHydrationRoot.render.ReactDOMRoot.render @ chunk-TBL4OAGS.js?v=7dabfc35:21116
(anonymous) @ main.jsx:9
chunk-TBL4OAGS.js?v=7dabfc35:19413 Uncaught TypeError: Failed to fetch dynamically imported module: http://localhost:3000/src/components/sections/Skills.jsx?t=1785742104682