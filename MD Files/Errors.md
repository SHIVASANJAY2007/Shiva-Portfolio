Errors in Vercel dashboard of shivasanjay.vercel.app

02:11:44.463 Running build in Washington, D.C., USA (East) – iad1
02:11:44.464 Build machine configuration: 2 cores, 8 GB
02:11:44.596 Cloning github.com/SHIVASANJAY2007/Shiva-Portfolio (Branch: vercel, Commit: d5d024c)
02:11:47.753 Cloning completed: 3.157s
02:11:47.970 Restored build cache from previous deployment (59jKHpMpSyNmj6Kyacoqz3kSuRd8)
02:11:48.202 Running "vercel build"
02:11:48.215 Vercel CLI 58.1.0
02:11:49.048 Installing dependencies...
02:11:51.160 npm error code ERESOLVE
02:11:51.161 npm error ERESOLVE could not resolve
02:11:51.162 npm error
02:11:51.163 npm error While resolving: @lobehub/icons@5.15.0
02:11:51.163 npm error Found: react@18.3.1
02:11:51.163 npm error node_modules/react
02:11:51.164 npm error   react@"^18.2.0" from the root project
02:11:51.164 npm error   peer react@">=16.0.0" from @ant-design/cssinjs@2.1.2
02:11:51.164 npm error   node_modules/@ant-design/cssinjs
02:11:51.164 npm error     @ant-design/cssinjs@"^2.0.0" from antd-style@4.1.0
02:11:51.164 npm error     node_modules/antd-style
02:11:51.164 npm error       antd-style@"^4.1.0" from @lobehub/icons@5.15.0
02:11:51.164 npm error       node_modules/@lobehub/icons
02:11:51.165 npm error         @lobehub/icons@"^5.15.0" from the root project
02:11:51.165 npm error   26 more (@emotion/react, ...)
02:11:51.165 npm error
02:11:51.166 npm error Could not resolve dependency:
02:11:51.166 npm error peer @lobehub/ui@"^5.0.0" from @lobehub/icons@5.15.0
02:11:51.166 npm error node_modules/@lobehub/icons
02:11:51.166 npm error   @lobehub/icons@"^5.15.0" from the root project
02:11:51.166 npm error
02:11:51.166 npm error Conflicting peer dependency: react@19.2.8
02:11:51.166 npm error node_modules/react
02:11:51.166 npm error   peer react@"^19.0.0" from @lobehub/ui@5.27.0
02:11:51.166 npm error   node_modules/@lobehub/ui
02:11:51.166 npm error     peer @lobehub/ui@"^5.0.0" from @lobehub/icons@5.15.0
02:11:51.167 npm error     node_modules/@lobehub/icons
02:11:51.167 npm error       @lobehub/icons@"^5.15.0" from the root project
02:11:51.167 npm error
02:11:51.167 npm error Fix the upstream dependency conflict, or retry this command with --force or --legacy-peer-deps to accept an incorrect (and potentially broken) dependency resolution.
02:11:51.167 npm error
02:11:51.167 npm error
02:11:51.167 npm error For a full report see:
02:11:51.167 npm error /vercel/.npm/_logs/2026-08-03T20_41_49_429Z-eresolve-report.txt
02:11:51.167 npm error A complete log of this run can be found in: /vercel/.npm/_logs/2026-08-03T20_41_49_429Z-debug-0.log
02:11:51.204 Error: Command "npm install" exited with 1