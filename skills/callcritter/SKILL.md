# Skill: CallCritter Project Execution

Use this skill when working on CallCritter, the OpenAI DevDay 2026 contest demo.

## Objective
Build a browser-first playable app where GPT-5.5 analyzes a user camera/demo scene and Image Gen creates a tiny companion that can be placed into the scene and exported.

## Core loop
1. Camera or demo scene.
2. Snapshot.
3. GPT-5.5 structured scene analysis.
4. Visible scene readout.
5. Image Gen companion.
6. Canvas overlay editor.
7. Export/share card.

## Project constraints
- No login.
- No native Zoom.
- No OBS.
- No virtual camera.
- No true AR/depth/occlusion claims.
- No persistent gallery.
- No unlimited generation.
- Server-side API key only.

## Quality bar
The demo must be understandable in under 10 seconds. The generated companion must not look like a lazy pasted PNG. If cutout quality is bad, use an intentional sticker-frame treatment.

## Required docs
Maintain:
- README.md
- docs/JUDGES.md
- docs/BUILD_NOTES.md
- docs/PRIVACY.md
- docs/COST_CONTROL.md
- docs/SUBMISSION.md

## Agent behavior
- Read `START_HERE.md` and `AGENTS.md` before changing files.
- Implement one prompt at a time.
- Return full files when editing code.
- State validation steps.
- Do not expand scope without explicit instruction.
