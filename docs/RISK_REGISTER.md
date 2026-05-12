# Risk Register — CallCritter

| Risk | Severity | Probability | Mitigation | Tripwire |
|---|---:|---:|---|---|
| Bad compositing / pasted PNG look | Critical | Medium | Soft shadow, tint controls, sticker-frame fallback | Companion looks detached in first recording |
| Camera permission failure | High | High | Demo scene on first screen; auto fallback | Incognito/mobile cannot complete flow |
| Image Gen latency | Medium | Medium | Good loading states; demo video; fallback asset | Judge waits too long |
| Cost runaway | High | Medium | Session + IP rate limits | Unexpected spend spike |
| Scope creep | Critical | Medium | No Zoom/OBS/true AR until after contest | Tasks mention native/virtual camera |
| Generic sticker/filter perception | High | Medium | Visible GPT-5.5 reasoning; scene-aware language | User cannot tell why GPT-5.5 matters |
| API key leakage | Critical | Low | Server-side routes only | Key appears in client bundle |
