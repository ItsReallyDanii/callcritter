# Prompt 01 — Scaffold

You are building the first scaffold for CallCritter, a browser-first OpenAI DevDay 2026 demo.

Goal:
Create a clean Next.js + React app scaffold for a playable web app where users can use camera mode or demo-scene mode, then later generate an AI companion using GPT-5.5 and Image Gen.

Do NOT implement the full AI pipeline yet.

Build only:
1. Next.js app structure.
2. Landing page with the product framing.
3. Two primary buttons:
   - Use My Camera
   - Try Demo Scene
4. Camera permission flow using getUserMedia.
5. Demo scene fallback using a local image placeholder.
6. Snapshot capture placeholder.
7. Basic app state machine:
   - idle
   - camera_requested
   - camera_ready
   - demo_ready
   - snapshot_captured
   - error
8. Server-safe `.env.example` with `OPENAI_API_KEY`.
9. Placeholder API route:
   - GET `/api/health`
10. README.md with local run instructions.

Hard constraints:
- No Zoom integration.
- No OBS.
- No virtual camera.
- No account system.
- No real OpenAI API call yet.
- No API key in client bundle.
- TypeScript preferred.
- Keep components clean and modular.

Expected files:
- src/app/page.tsx
- src/app/layout.tsx
- src/app/api/health/route.ts
- src/components/CameraStage.tsx
- src/components/DemoScenePicker.tsx
- src/components/BuiltWithFooter.tsx
- src/components/ErrorBanner.tsx
- src/lib/camera/captureFrame.ts
- src/types/app.ts
- .env.example
- README.md

Acceptance criteria:
- `npm install` works.
- `npm run dev` works.
- User can choose camera or demo mode.
- Camera denial does not crash the app.
- Demo mode works without camera.
- Snapshot state is represented in UI.
- README explains this is a GPT-5.5 + Image Gen contest scaffold.
