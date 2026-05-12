# Prompt 03 — Canvas Overlay Editor

Continue CallCritter after camera/demo and AI endpoints exist.

Goal:
Create the canvas overlay editor and export card.

Build:
1. Canvas scene renderer.
2. Companion overlay layer.
3. Drag behavior.
4. Scale behavior.
5. Rotate behavior.
6. Reset placement.
7. Soft shadow / opacity / sticker-frame fallback.
8. Export PNG card with:
   - scene
   - companion
   - companion name
   - GPT-generated caption
   - #OpenAIDevDay2026 footer
   - Built with GPT-5.5 + Image Gen note

Hard constraints:
- Do not implement true AR/depth/occlusion.
- Do not block export if masking/transparency is imperfect.
- Do not require login.

Acceptance criteria:
- User can place companion manually.
- Exported PNG looks like a shareable card.
- If image cutout is bad, sticker-frame fallback still looks intentional.
