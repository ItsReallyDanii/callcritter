# CallCritter

CallCritter is a browser-first OpenAI DevDay 2026 contest scaffold for a scene-aware AI companion generator. The intended full app uses GPT-5.5 for scene analysis and Image Gen for companion creation.

## Prompt 02 Scope

Prompt 02 adds the server-side AI layer and frontend integration:

- `POST /api/analyze` accepts a captured image and companion mode, then returns validated scene JSON.
- `POST /api/generate` accepts the GPT-created image prompt plus scene metadata, then returns a companion image data URL.
- The UI can analyze a camera/demo snapshot, display a scene readout, and show a generated companion preview.
- Missing API keys and OpenAI failures return user-readable JSON errors.
- A temporary client-side guard allows one successful companion generation per browser session.

Still not included: canvas drag/scale/rotate editor, export/share card, auth, accounts, persistent storage, Zoom, OBS, virtual camera, true AR, or video generation.

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

Health:

```bash
curl http://localhost:3000/api/health
```

Analyze:

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"image":"data:image/png;base64,...","mode":"Desk Critter"}'
```

Generate:

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"image_prompt":"tiny friendly desk critter, clean silhouette","mode":"Desk Critter","scene_metadata":{...}}'
```

With no `OPENAI_API_KEY`, both AI routes return:

```json
{
  "ok": false,
  "error": {
    "code": "missing_openai_api_key",
    "message": "OpenAI API key missing. Add OPENAI_API_KEY to .env.local."
  }
}
```

## Validation Checklist

- `npm install`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `GET /api/health` returns JSON.
- With no `OPENAI_API_KEY`, `/api/analyze` and `/api/generate` return helpful JSON errors.
- With `OPENAI_API_KEY`, camera or demo snapshots can be analyzed.
- GPT-5.5 scene readout appears in the UI.
- Generated companion preview appears in the UI.
- Canvas editor/export are not present yet.
