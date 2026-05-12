# Judges Guide - CallCritter

## 10-Second Explanation

CallCritter turns a real camera or demo scene into a tiny AI companion composition. GPT-5.5 reads the scene and writes a structured readout plus image prompt. Image Gen creates the companion. The user places it on a canvas and exports a share card.

## Fast Test Path

1. Open `[VERCEL_LIVE_DEMO_URL]`.
2. Choose `Try Demo Scene` if camera access is inconvenient.
3. Capture the scene.
4. Click `Analyze Scene`.
5. Review the visible GPT-5.5 scene readout.
6. Click `Generate Companion`.
7. Open the canvas editor.
8. Drag, scale, rotate, or adjust opacity.
9. Download the scene PNG or share card.

## What GPT-5.5 Does

GPT-5.5 analyzes the captured image and returns validated JSON containing:

- scene summary
- lighting
- mood
- likely attachment points
- character concept and name
- visual style
- Image Gen prompt
- placement recommendation
- safety notes
- share caption

The UI displays concise final fields only. It does not show private chain-of-thought.

## What Image Gen Does

Image Gen creates one companion asset from the GPT-5.5-generated prompt and scene metadata. The generated asset appears in the app, then the user places it manually on the scene.

## Why Manual Placement

Manual drag/scale/rotate is intentional. It is more reliable than pretending to provide true AR, depth sensing, or occlusion. GPT-5.5 recommends placement; the user makes the final composition.

## Export Outputs

- `Download Scene PNG`: scene plus companion only.
- `Export Share Card`: composed scene, companion name, share caption, CallCritter label, `Built with GPT-5.5 + Image Gen`, and `#OpenAIDevDay2026`.

## Intentional Limitations

No login, accounts, persistent gallery, Zoom, OBS, virtual camera, true AR/depth/occlusion, analytics, payments, or video generation are included.
