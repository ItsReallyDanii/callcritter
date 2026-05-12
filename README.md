# CallCritter

CallCritter is a browser-first OpenAI DevDay 2026 demo that turns a real or demo camera scene into a tiny scene-aware AI companion composition.

Live demo: `[VERCEL_LIVE_DEMO_URL]`  
Repository / build notes: `[REPO_OR_BUILD_NOTES_URL]`

## What It Does

1. Capture a scene with camera mode or demo mode.
2. Send the snapshot to a server-side GPT-5.5 scene-analysis route.
3. Show a concise scene readout: summary, lighting, mood, attachment points, character concept, placement recommendation, and share caption.
4. Generate a companion image with Image Gen from the GPT-created prompt.
5. Place the companion on a canvas with drag, scale, rotate, opacity, shadow, sticker-frame, and blend controls.
6. Export either the raw scene PNG or a branded share card with `#OpenAIDevDay2026`.

## How GPT-5.5 Is Used

`POST /api/analyze` forwards the user-selected snapshot to OpenAI from a server-only route. GPT-5.5 returns structured JSON that is validated before it is shown in the UI. The app displays only concise user-facing fields, not private chain-of-thought.

## How Image Gen Is Used

`POST /api/generate` takes the validated scene analysis and GPT-created `image_prompt`, then calls Image Gen to create one companion asset. The browser receives image data for preview and canvas placement.

## Local Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

Create `.env.local` from `.env.example`:

```bash
cp .env.example .env.local
```

Set the server-only key:

```bash
OPENAI_API_KEY=sk-proj-your-key
```

Optional server-side model overrides:

```bash
OPENAI_SCENE_MODEL=gpt-5.5
OPENAI_IMAGE_MODEL=gpt-image-2
```

Do not add `NEXT_PUBLIC_OPENAI_API_KEY`. The client never calls OpenAI directly.

## API Routes

```bash
curl http://localhost:3000/api/health
```

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/png;base64,...","mode":"Desk Critter"}'
```

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"image_prompt":"tiny friendly desk critter, clean silhouette","mode":"Desk Critter","scene_metadata":{...}}'
```

With no `OPENAI_API_KEY`, both AI routes return a clear missing-key error instead of crashing.

## Validation Checklist

- `npm install`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm audit --audit-level=moderate`
- `GET /api/health` returns `prompt-04-submission-polish`.
- App opens without login.
- Demo mode works without camera permission.
- Missing-key analyze/generate errors are readable.
- With a valid key, scene analysis appears in the UI.
- With a valid key, generated companion preview appears in the UI.
- Canvas editor opens.
- Drag, scale, rotate, opacity, reset, sticker-frame, shadow, and tint controls update the canvas.
- `Download Scene PNG` exports scene + companion only.
- `Export Share Card` exports composed scene, companion name, caption, CallCritter branding, `Built with GPT-5.5 + Image Gen`, and `#OpenAIDevDay2026`.

## Known Limitations

- This is not true AR, depth sensing, occlusion, Zoom, OBS, virtual camera, native app, or video generation.
- Public launch still needs server-side IP/time-window rate limiting; the current app has a one-generation-per-session browser guard.
- Generated images may not have clean transparency, so the canvas includes soft shadow and sticker-frame fallback controls.
- No accounts, persistent gallery, analytics, payments, or storage are included.

## Privacy And Cost Notes

- Camera access starts only after `Use My Camera`.
- Demo mode works when camera permission is denied.
- Snapshots are sent to the server only when the user clicks `Analyze Scene`.
- User snapshots are not stored in a database.
- `OPENAI_API_KEY` is server-side only.
- Image generation is the main cost driver; keep public links gated until server-side rate limiting is active.

## Contest Submission

Use `docs/SUBMISSION.md` for final post copy and `docs/FINAL_SMOKE_TEST.md` for the final pre-submit checklist. Do not post the final submission until the live demo URL, repo/build notes URL, production env vars, and production smoke test are complete.
