# Final Smoke Test - CallCritter

Run this immediately before submitting.

## Local Checks

- [ ] `npm install`
- [ ] `npm run lint`
- [ ] `npm run typecheck`
- [ ] `npm run build`
- [ ] `npm audit --audit-level=moderate`
- [ ] `GET /api/health` returns `prompt-04-submission-polish`
- [ ] Client bundle search does not expose `OPENAI_API_KEY` or secret values

## No-Key Checks

- [ ] Start app without `.env.local`
- [ ] Demo mode works
- [ ] `Analyze Scene` shows clear missing-key error
- [ ] `/api/analyze` returns JSON error, not stack trace
- [ ] `/api/generate` returns JSON error, not stack trace

## Live-Key Checks

- [ ] `OPENAI_API_KEY` is set server-side in local or Vercel
- [ ] Demo scene can be analyzed
- [ ] GPT-5.5 readout appears
- [ ] Companion generation succeeds
- [ ] One-session generation guard prevents a second successful generation

## Canvas Checks

- [ ] Canvas editor opens after companion preview
- [ ] Drag works
- [ ] Scale works
- [ ] Rotate works
- [ ] Reset placement works
- [ ] Opacity works
- [ ] Shadow toggle works
- [ ] Sticker-frame fallback works
- [ ] Scene blend tint toggle works
- [ ] `Download Scene PNG` contains scene + companion
- [ ] `Export Share Card` contains composed scene, companion name, share caption, CallCritter, `Built with GPT-5.5 + Image Gen`, and `#OpenAIDevDay2026`

## Production Checks

- [ ] Vercel env vars set
- [ ] Live URL opens without login
- [ ] Camera-denied path falls back to demo mode
- [ ] Demo path completes
- [ ] No final submission has been posted until this checklist passes
