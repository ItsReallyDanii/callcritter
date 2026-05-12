# Build Notes - CallCritter

## Goal

Build a fast, playable DevDay contest demo where GPT-5.5 and Image Gen are visibly central to the user experience.

## Core Loop

1. User captures a webcam frame or local demo scene.
2. Frontend sends the image to `/api/analyze`.
3. GPT-5.5 returns structured scene JSON.
4. Frontend displays the GPT-5.5 scene readout.
5. Frontend sends the generated image prompt to `/api/generate`.
6. Image Gen returns one companion image.
7. Frontend overlays the companion on canvas.
8. User adjusts placement and exports a raw scene PNG or branded share card.

## Implementation Summary

- Next.js App Router with React and TypeScript.
- Browser `getUserMedia` for camera access.
- Local demo-scene fallback.
- Server-only OpenAI API routes.
- Zod validation for scene analysis JSON.
- One successful generation per browser session guard.
- Canvas compositor with drag, scale, rotate, opacity, shadow, sticker-frame, tint, reset, scene PNG export, and share-card export.

## Why Manual Placement

Manual placement avoids fake AR claims. GPT-5.5 provides placement recommendations and likely attachment points; the user makes the final composition with reliable canvas controls.

## Image Compositing Approach

Generated images may not have clean transparency. The app supports:

- generated companion preview
- soft shadow
- opacity adjustment
- subtle scene blend tint
- sticker-frame fallback mode
- share-card export that uses the current canvas composition

## Failure Handling

| Failure | Response |
|---|---|
| Camera denied | Demo mode remains usable |
| Missing API key | Clear missing-key message |
| GPT JSON malformed | Fallback scene analysis object |
| Image generation fails | Fallback companion preview remains usable |
| Generated image looks detached | Shadow, opacity, tint, and sticker-frame controls |
| Session generation already used | Clear one-generation-per-session message |

## Not Built

Zoom, OBS, virtual camera, true AR/depth/occlusion, auth, accounts, persistent storage, analytics, payments, and video generation are intentionally out of scope.
