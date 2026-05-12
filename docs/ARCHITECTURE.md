# Architecture — CallCritter

## Recommended stack

- Next.js App Router
- React + TypeScript
- Tailwind or simple CSS modules
- Browser `getUserMedia` for camera
- HTML Canvas for compositing/export
- Server-side OpenAI API routes
- Vercel deployment

## Data flow

```txt
User camera/demo scene
  -> client snapshot capture
  -> POST /api/analyze
  -> GPT-5.5 scene analysis JSON
  -> UI scene readout
  -> POST /api/generate
  -> Image Gen companion image
  -> canvas overlay editor
  -> exported PNG scene card
```

## Proposed repo tree

```txt
callcritter/
├─ README.md
├─ AGENTS.md
├─ .env.example
├─ docs/
│  ├─ JUDGES.md
│  ├─ ARCHITECTURE.md
│  ├─ BUILD_NOTES.md
│  ├─ PRIVACY.md
│  ├─ COST_CONTROL.md
│  ├─ SUBMISSION.md
│  ├─ RISK_REGISTER.md
│  └─ DECISIONS.md
├─ public/
│  ├─ demo-assets/
│  │  ├─ desk-sample-01.jpg
│  │  ├─ room-sample-01.jpg
│  │  └─ call-frame-sample-01.jpg
│  └─ og-image.png
├─ src/
│  ├─ app/
│  │  ├─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ globals.css
│  │  └─ api/
│  │     ├─ health/route.ts
│  │     ├─ analyze/route.ts
│  │     └─ generate/route.ts
│  ├─ components/
│  │  ├─ CameraStage.tsx
│  │  ├─ DemoScenePicker.tsx
│  │  ├─ CompanionOverlay.tsx
│  │  ├─ OverlayControls.tsx
│  │  ├─ SceneReadout.tsx
│  │  ├─ ExportCard.tsx
│  │  ├─ LoadingState.tsx
│  │  ├─ ErrorBanner.tsx
│  │  └─ BuiltWithFooter.tsx
│  ├─ lib/
│  │  ├─ openai/client.ts
│  │  ├─ openai/analyzeScene.ts
│  │  ├─ openai/generateCompanion.ts
│  │  ├─ prompts/sceneAnalysisPrompt.ts
│  │  ├─ prompts/imagePromptTemplates.ts
│  │  ├─ canvas/captureFrame.ts
│  │  ├─ canvas/compositeExport.ts
│  │  ├─ canvas/transform.ts
│  │  ├─ rateLimit/sessionLimit.ts
│  │  └─ rateLimit/ipLimit.ts
│  └─ types/scene.ts
```

## API routes

### `GET /api/health`
Returns app health and confirms server routes work.

### `POST /api/analyze`
Input: base64 image, selected companion mode.
Output: validated scene analysis JSON.

### `POST /api/generate`
Input: image prompt, mode, optional style constraints.
Output: base64 image or image URL.

## Security
- `OPENAI_API_KEY` lives server-side only.
- No `NEXT_PUBLIC_OPENAI_API_KEY`.
- No client-side direct OpenAI calls.
- Public generation should be gated.

## Known technical issue
Generated images may not have clean transparency. Use fallback styles:

1. Ask for isolated character on simple high-contrast background.
2. Attempt client-side background removal/masking.
3. If masking looks bad, display companion as a designed sticker/card with shadow.
