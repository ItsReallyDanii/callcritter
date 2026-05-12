# Architecture - CallCritter

## Stack

- Next.js App Router
- React + TypeScript
- Browser `getUserMedia`
- HTML Canvas compositing/export
- Server-side OpenAI API routes
- Vercel deployment target

## Data Flow

```txt
User camera/demo scene
  -> client snapshot capture
  -> POST /api/analyze
  -> GPT-5.5 structured scene analysis
  -> visible scene readout
  -> POST /api/generate
  -> Image Gen companion image
  -> canvas overlay editor
  -> scene PNG or branded share-card PNG
```

## Key Files

```txt
src/app/page.tsx
src/app/api/health/route.ts
src/app/api/analyze/route.ts
src/app/api/generate/route.ts
src/components/CameraStage.tsx
src/components/DemoScenePicker.tsx
src/components/SceneReadout.tsx
src/components/CompanionPreview.tsx
src/components/CanvasEditor.tsx
src/components/BuiltWithFooter.tsx
src/lib/openai/client.ts
src/lib/openai/analyzeScene.ts
src/lib/openai/generateCompanion.ts
src/lib/prompts/sceneAnalysisPrompt.ts
src/lib/prompts/imagePromptTemplates.ts
src/lib/camera/captureFrame.ts
src/lib/canvas/compositeScene.ts
src/lib/canvas/exportCanvas.ts
src/lib/canvas/transform.ts
src/types/app.ts
src/types/scene.ts
```

## API Routes

### `GET /api/health`

Returns app health and current scope. Prompt 04 expects `prompt-04-submission-polish`.

### `POST /api/analyze`

Input: base64 image or image data URL plus companion mode.  
Output: validated scene analysis JSON.

### `POST /api/generate`

Input: image prompt, companion mode, and validated scene metadata.  
Output: base64/data URL companion image or clear JSON error.

## Security

- `OPENAI_API_KEY` lives server-side only.
- No `NEXT_PUBLIC_OPENAI_API_KEY`.
- No client-side direct OpenAI calls.
- No raw user images are logged.
- No accounts, database, or persistent gallery.

## Cost Control

The app currently has a one-successful-generation-per-session browser guard. Server-side IP/time-window throttling is still required before broad public launch.

## Canvas Export

The canvas compositor draws:

- captured/demo scene background
- optional tint around companion placement
- companion image
- soft shadow or sticker-frame fallback

Exports:

- raw composed scene PNG
- branded share card PNG with CallCritter, companion name, share caption, `Built with GPT-5.5 + Image Gen`, and `#OpenAIDevDay2026`
