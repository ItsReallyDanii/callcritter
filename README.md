# CallCritter

CallCritter is a browser-first OpenAI DevDay 2026 contest scaffold for a scene-aware AI companion generator. The intended full app will use GPT-5.5 for scene analysis and Image Gen for companion creation, but this Prompt 01 build intentionally stops before any OpenAI API calls.

## Prompt 01 Scope

- Next.js App Router scaffold with React and TypeScript.
- Landing screen with `Use My Camera` and `Try Demo Scene`.
- Browser `getUserMedia` camera permission flow.
- Local demo-scene fallback when camera is unavailable or denied.
- Snapshot state for camera and demo scenes.
- `GET /api/health` placeholder route.
- Server-safe `.env.example` with `OPENAI_API_KEY`.

Not included yet: GPT-5.5 analysis, Image Gen, rate limiting, overlay editing, export cards, auth, accounts, persistent storage, Zoom, OBS, virtual cameras, true AR, or video generation.

## Local Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Optional health check:

```bash
curl http://localhost:3000/api/health
```

Expected response:

```json
{"ok":true,"service":"callcritter","scope":"prompt-01-scaffold"}
```

## Environment

Copy `.env.example` to `.env.local` before later API work:

```bash
cp .env.example .env.local
```

`OPENAI_API_KEY` must remain server-side only. Prompt 01 does not read or require it.

## Validation Checklist

- App loads without login.
- `Use My Camera` asks for camera permission.
- Camera denial shows an error banner and leaves demo mode usable.
- `Try Demo Scene` works without camera permission.
- Capturing from camera or demo mode moves the UI into `snapshot_captured`.
- `GET /api/health` returns JSON.
- No client code references `OPENAI_API_KEY`.
