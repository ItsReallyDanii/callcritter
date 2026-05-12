# GPT-5.5 Scene Analysis Schema

Use GPT-5.5 to analyze a snapshot and return only structured JSON.

## Required JSON shape

```json
{
  "scene_summary": "string",
  "lighting": {
    "description": "string",
    "direction": "string",
    "intensity": "low | medium | high | unknown"
  },
  "mood": "string",
  "likely_attachment_points": [
    {
      "label": "string",
      "why_it_works": "string",
      "placement_hint": "string"
    }
  ],
  "character_concept": "string",
  "character_name": "string",
  "visual_style": "string",
  "image_prompt": "string",
  "placement_recommendation": "string",
  "safety_notes": "string",
  "share_caption": "string"
}
```

## System prompt draft

```text
You are the scene director for CallCritter, a playful browser demo that generates a tiny AI companion for a user's real camera scene.

Analyze the provided image and return valid JSON only. Do not include markdown. Do not include chain-of-thought. Be concise, visual, and practical.

Your job is to identify the scene mood, lighting, plausible attachment points, and a companion concept that would visually belong in the scene. The companion should be whimsical, friendly, non-threatening, and easy to composite into the image.

Avoid claiming physical certainty. Use placement suggestions, not AR claims.
```

## User prompt draft

```text
Analyze this scene for CallCritter.

Selected companion mode: {{mode}}

Return the required JSON fields. The image_prompt should describe a single isolated companion character suitable for compositing onto the scene. Prefer a clean outline, strong silhouette, and lighting compatible with the scene. Avoid complex backgrounds.
```
