# Risk Register - CallCritter

| Risk | Severity | Probability | Mitigation | Tripwire |
|---|---:|---:|---|---|
| Bad compositing / pasted PNG look | Critical | Medium | Soft shadow, opacity, tint, sticker-frame fallback, manual placement | Companion looks detached in first recording |
| Camera permission failure | High | High | Demo mode on first screen and camera-denial fallback | Judge cannot complete camera path |
| Image Gen latency | Medium | Medium | Clear loading states and fallback companion | Judge waits too long without feedback |
| Cost runaway | High | Medium | One-generation session guard now; server IP throttle before public launch | Unexpected spend spike |
| Scope creep | Critical | Medium | Explicitly exclude Zoom, OBS, virtual camera, true AR, auth, gallery | Tasks mention native/virtual camera |
| Generic sticker/filter perception | High | Medium | Visible GPT-5.5 scene readout and placement rationale | User cannot tell why GPT-5.5 matters |
| API key leakage | Critical | Low | Server-only routes and client-bundle checks | Key or env var appears in client bundle |
| Malformed model JSON | Medium | Medium | Zod validation and fallback scene analysis | `/api/analyze` returns invalid shape |
| Generated image background is not transparent | Medium | High | Sticker-frame fallback and share-card export | Companion has visible square background |
| Final submission confusion | Medium | Medium | README, JUDGES, SUBMISSION, FINAL_SMOKE_TEST docs | Live link or repo note missing at post time |
