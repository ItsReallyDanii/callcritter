# Product Spec — CallCritter

## MVP user flow

1. Landing screen
   - Hero explanation.
   - Buttons: `Use My Camera` and `Try Demo Scene`.
   - Built-with footer: `Built with GPT-5.5 + Image Gen`.

2. Camera/demo selection
   - Camera requests permission via `getUserMedia`.
   - Demo mode loads a local sample scene.
   - If camera fails or is denied, route to demo mode without dead end.

3. Snapshot
   - User captures a frame.
   - App stores local preview.

4. Scene analysis
   - POST snapshot to `/api/analyze`.
   - GPT-5.5 returns structured JSON.
   - UI displays scene summary, mood, lighting, attachment points, character concept, and placement recommendation.

5. Companion generation
   - POST image prompt to `/api/generate`.
   - Image Gen returns one companion image.
   - If generation fails, show sample companion fallback.

6. Overlay editor
   - User can drag, scale, rotate, reset.
   - Companion has soft shadow and/or sticker-frame fallback.

7. Export/share
   - Export PNG includes scene, companion, companion name, caption, and #OpenAIDevDay2026.

## Companion modes
Limit to 3 for MVP:

- Desk Critter
- Keyboard Pet
- Floating Familiar

## Must ship
- Playable browser link.
- No login.
- Camera + demo mode.
- GPT-5.5 structured analysis.
- Visible reasoning panel.
- Image Gen companion.
- Canvas overlay controls.
- Export card.
- Rate limit.
- Judge docs.

## Should ship
- Companion name.
- Share caption.
- Loading states.
- Error states.
- Simple idle animation.

## Do not build
- Zoom plugin.
- OBS/virtual camera.
- Native desktop/mobile app.
- True AR/depth/occlusion.
- Accounts/auth.
- Persistent gallery.
- Unlimited public generations.
