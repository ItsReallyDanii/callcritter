# AGENTS.md — Coding Agent Instructions

## Role
You are a senior frontend/product engineer building a scoped contest MVP. Prioritize reliability, judge clarity, visual polish, and cost control.

## Product
**CallCritter**: a scene-aware AI companion generator for a real camera scene.

## Core user flow
1. User opens playable link.
2. User chooses **Use My Camera** or **Try Demo Scene**.
3. User captures a scene.
4. GPT-5.5 analyzes the scene and returns structured JSON.
5. UI shows the scene readout.
6. Image Gen creates a companion from the GPT-5.5 prompt.
7. User drags/scales/rotates the companion on the scene.
8. User exports a shareable PNG card.

## Stack
- Next.js + React + TypeScript
- Browser `getUserMedia` for camera access
- HTML Canvas for compositing/export
- Server-side OpenAI API routes only
- Vercel deployment

## Hard rules
- Do not expose `OPENAI_API_KEY` to client code.
- Do not add auth, accounts, databases, payment, or galleries.
- Do not implement Zoom, OBS, virtual camera, native app, or WebXR.
- Do not claim true AR, depth sensing, auto-occlusion, or physical simulation.
- Do not allow unlimited public generations.
- Keep the app usable if camera permission is denied.

## Acceptance bar
A judge should be able to:

- Open the app without logging in.
- Use camera or demo mode.
- See GPT-5.5 analysis in the UI.
- Generate or load a companion.
- Move/resize it.
- Export/share a final scene card.

## Preferred file structure
Use the structure in `docs/ARCHITECTURE.md`. Keep components modular and small.

## Output behavior for coding agents
When modifying code, return full updated files, not patch fragments.
When adding a feature, include local validation steps.
When blocked, state the exact missing dependency or environment variable.
