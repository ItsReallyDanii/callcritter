# Prompt 02 — Core AI Endpoints

Continue CallCritter from the scaffold.

Goal:
Add server-side OpenAI integration for GPT-5.5 scene analysis and Image Gen companion creation.

Before coding, read:
- AGENTS.md
- docs/ARCHITECTURE.md
- prompts/GPT55_SCENE_ANALYSIS_SCHEMA.md
- prompts/IMAGE_GEN_PROMPT_TEMPLATES.md

Build:
1. Server-side OpenAI client.
2. POST `/api/analyze`.
3. POST `/api/generate`.
4. JSON schema validation for scene analysis.
5. Safe fallback if analysis JSON fails.
6. Error states that do not break the app.

Hard constraints:
- Do not expose API key client-side.
- Do not add auth/database.
- Do not allow repeated generation loops.
- Do not display hidden chain-of-thought; display only final structured scene readout.

Acceptance criteria:
- `/api/analyze` accepts a base64 image and mode, returns validated scene JSON.
- `/api/generate` accepts image prompt/mode and returns companion image data or a clear error.
- UI can display analysis output.
- Failure states are user-readable.
