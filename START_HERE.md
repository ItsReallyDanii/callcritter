# START HERE — CallCritter Context Pack

This repository/context pack is the canonical handoff for building **CallCritter**, an OpenAI DevDay 2026 contest demo.

## One-sentence goal
Build a playable browser demo where a user opens a link, uses their webcam or a sample scene, captures a scene, lets GPT-5.5 analyze it, uses Image Gen to create a tiny scene-aware companion, places it on the scene with canvas controls, and exports a shareable card.

## Contest success condition
The app must be understandable in under 10 seconds and visibly use both:

- **GPT-5.5** for scene analysis, character concepting, placement logic, and structured JSON.
- **Image Gen / GPT Image 2** for the generated companion asset.

## Non-negotiables
- No login.
- No native Zoom integration.
- No OBS / virtual camera.
- No true AR/depth/occlusion claims.
- No unlimited public image generation.
- Must include camera fallback demo mode.
- Must show GPT-5.5 reasoning visibly in the UI.
- Must include export/share card.

## First thing a coding agent should do
Read these files in this order:

1. `START_HERE.md`
2. `AGENTS.md`
3. `docs/PROJECT_BRIEF.md`
4. `docs/PRODUCT_SPEC.md`
5. `docs/ARCHITECTURE.md`
6. `prompts/PROMPT_01_SCAFFOLD.md`

Then implement only the requested prompt scope. Do not build beyond the current prompt.
