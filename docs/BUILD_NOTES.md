# Build Notes — CallCritter

## Goal
Build a fast, playable DevDay contest demo where GPT-5.5 and Image Gen are clearly central.

## Core loop
1. User captures webcam frame or sample scene.
2. Frontend sends image to `/api/analyze`.
3. GPT-5.5 returns structured JSON.
4. Frontend displays GPT-5.5 scene readout.
5. Frontend sends image prompt to `/api/generate`.
6. Image Gen returns companion image.
7. Frontend overlays companion on canvas.
8. User adjusts and exports.

## Why manual placement
Manual drag/scale/rotate is more reliable than fake auto-AR. GPT-5.5 can recommend placement, but the user makes the final visual decision.

## Image compositing approach
The product must not rely on perfect transparent PNG output. Use a fallback stack:

- Preferred: generated companion with usable transparency or strong edge separation.
- Fallback: chroma/luminance mask.
- Safe fallback: sticker-frame visual treatment with soft shadow.

## Failure handling

| Failure | Response |
|---|---|
| Camera denied | Switch to demo mode |
| GPT JSON malformed | Use fallback schema and show retry |
| Image generation fails | Load sample companion |
| Background removal bad | Use sticker-frame fallback |
| Rate limit hit | Let user use demo/sample asset only |

## Build order
1. Scaffold app.
2. Camera/demo mode.
3. Snapshot state.
4. GPT analysis endpoint.
5. Scene readout panel.
6. Image generation endpoint.
7. Canvas editor.
8. Export card.
9. Rate limit.
10. Docs + deploy + demo video.
