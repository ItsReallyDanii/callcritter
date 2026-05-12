import type { CompanionMode, SceneAnalysis } from "@/types/scene";

const globalImageConstraints = `Create one single companion character only. Make it whimsical, friendly, and visually readable at small size. Use a clean silhouette and avoid clutter. The character should be suitable for compositing over a webcam snapshot. Do not include text, logos, UI, hands, humans, or background scenery. Use a simple high-contrast plain background if transparency is unavailable.`;

const modeTemplates: Record<CompanionMode, string> = {
  "Desk Critter":
    "Create a tiny desk critter that looks like it naturally lives near keyboards, coffee mugs, and monitors. It should feel curious, friendly, and slightly mischievous.",
  "Keyboard Pet":
    "Create a small keyboard pet designed to sit between keys or rest near the edge of a laptop. It should have a compact body, readable face, and soft playful expression.",
  "Floating Familiar":
    "Create a tiny floating familiar or holographic companion that can hover near a webcam or monitor. It should have a soft glow and a clean silhouette, but not overpower the scene."
};

export function buildCompanionImagePrompt({
  imagePrompt,
  mode,
  scene
}: {
  imagePrompt: string;
  mode: CompanionMode;
  scene: SceneAnalysis;
}) {
  return [
    modeTemplates[mode],
    `Scene mood: ${scene.mood}.`,
    `Scene lighting: ${scene.lighting.description}; direction: ${scene.lighting.direction}; intensity: ${scene.lighting.intensity}.`,
    `Visual style: ${scene.visual_style}.`,
    `Character concept: ${scene.character_concept}.`,
    `Model-created image prompt: ${imagePrompt}.`,
    globalImageConstraints
  ].join("\n\n");
}
