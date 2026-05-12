# Privacy - CallCritter

## Camera Access

Camera access is requested only after the user clicks `Use My Camera`. If permission is denied, the app remains usable through demo mode.

## Snapshot Handling

The browser keeps snapshots local until the user clicks `Analyze Scene`. At that point the selected image is sent to the server-side `/api/analyze` route and forwarded to OpenAI for scene analysis.

## Storage

CallCritter does not add accounts, persistent profiles, databases, galleries, analytics, or tracking. User snapshots and generated companions are not stored by the app.

## OpenAI Data Flow

- `/api/analyze`: receives the selected snapshot and sends it to OpenAI from the server.
- `/api/generate`: receives the validated scene metadata and image prompt, then asks Image Gen for one companion.
- The browser receives the generated image data for preview, canvas placement, and export.

## Key Handling

`OPENAI_API_KEY` must remain server-side. Do not create `NEXT_PUBLIC_OPENAI_API_KEY`.

## User-Facing Reasoning

The app shows concise structured scene fields only. It does not show private chain-of-thought.
