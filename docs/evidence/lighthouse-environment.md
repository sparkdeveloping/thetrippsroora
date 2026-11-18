# Lighthouse launcher limitation

The installed Lighthouse CLI was invoked against the real local production Next.js server. The server passed all 31 HTTP/asset checks. The initial launch could not create its default temporary directory. A workspace temporary directory resolved that path issue, but Chromium then terminated before opening a debugging port:

```text
FATAL:chrome/browser/process_singleton_posix.cc:297
Check failed: . socket() failed: Operation not permitted (1)
ptrace: Operation not permitted (1)
```

No Lighthouse score, Lighthouse trace, or Lighthouse Core Web Vitals result was produced. No elevated execution was requested. Deployed-browser PerformanceObserver and rAF results are separate laboratory evidence. `npm run test:performance` retains the reproducible command for a normal developer machine with Chromium.
