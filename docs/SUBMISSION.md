# Submission - OpenAI DevDay 2026

## Final Post Copy

```text
#OpenAIDevDay2026

Built CallCritter: a playable browser demo that generates a tiny AI companion for your real scene.

GPT-5.5 analyzes the captured scene, lighting, mood, and placement points, then writes the companion concept and Image Gen prompt. Image Gen creates the companion, and the canvas editor lets you drag, scale, rotate, blend, and export it as a share card.

Playable demo: [VERCEL_LIVE_DEMO_URL]
Repo / build notes: [REPO_OR_BUILD_NOTES_URL]
```

## Required Links

- Playable demo: `[VERCEL_LIVE_DEMO_URL]`
- Repo/build notes: `[REPO_OR_BUILD_NOTES_URL]`
- Optional demo video: `[DEMO_VIDEO_URL]`

## Submission Checklist

- [ ] Playable link works without login.
- [ ] Vercel env vars are set: `OPENAI_API_KEY`, optional model overrides.
- [ ] `GET /api/health` returns `prompt-04-submission-polish`.
- [ ] Demo mode works if camera is denied.
- [ ] GPT-5.5 readout is visible.
- [ ] Image Gen output appears in the app.
- [ ] Canvas editor opens.
- [ ] Drag, scale, rotate, reset, opacity, shadow, sticker-frame, and tint controls work.
- [ ] `Download Scene PNG` works.
- [ ] `Export Share Card` works and includes `#OpenAIDevDay2026`.
- [ ] Missing-key behavior is readable in local/staging checks.
- [ ] Server-side rate limiting decision is understood before public posting.
- [ ] README, JUDGES.md, BUILD_NOTES.md, PRIVACY.md, COST_CONTROL.md, and RISK_REGISTER.md are current.
- [ ] No final submission has been posted from this repo automation.

## Final Smoke Test

Run the full checklist in `docs/FINAL_SMOKE_TEST.md` immediately before posting.
