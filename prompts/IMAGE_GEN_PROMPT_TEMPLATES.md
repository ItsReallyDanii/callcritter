# Image Gen Prompt Templates

## Global constraints
Append these constraints to every image prompt:

```text
Create one single companion character only. Make it whimsical, friendly, and visually readable at small size. Use a clean silhouette and avoid clutter. The character should be suitable for compositing over a webcam snapshot. Do not include text, logos, UI, hands, humans, or background scenery. Use a simple high-contrast plain background if transparency is unavailable.
```

## Desk Critter

```text
Create a tiny desk critter that looks like it naturally lives near keyboards, coffee mugs, and monitors. It should feel curious, friendly, and slightly mischievous. Match this scene mood: {{mood}}. Match this lighting: {{lighting}}. Visual style: {{visual_style}}. Character concept: {{character_concept}}.
```

## Keyboard Pet

```text
Create a small keyboard pet designed to sit between keys or rest near the edge of a laptop. It should have a compact body, readable face, and soft playful expression. Match this scene mood: {{mood}}. Match this lighting: {{lighting}}. Visual style: {{visual_style}}. Character concept: {{character_concept}}.
```

## Floating Familiar

```text
Create a tiny floating familiar or holographic companion that can hover near a webcam or monitor. It should have a soft glow and a clean silhouette, but not overpower the scene. Match this scene mood: {{mood}}. Match this lighting: {{lighting}}. Visual style: {{visual_style}}. Character concept: {{character_concept}}.
```

## Fallback sticker-frame style
If background removal looks bad, render as an intentional sticker/card:

```text
Create a polished collectible sticker-style companion icon with soft drop shadow and clean border, suitable for overlaying on a webcam scene.
```
