import { z } from "zod";

export const CompanionModeSchema = z.enum(["Desk Critter", "Keyboard Pet", "Floating Familiar"]);

export type CompanionMode = z.infer<typeof CompanionModeSchema>;

export const AttachmentPointSchema = z
  .object({
    label: z.string(),
    why_it_works: z.string(),
    placement_hint: z.string()
  })
  .strict();

export const SceneAnalysisSchema = z
  .object({
    scene_summary: z.string(),
    lighting: z
      .object({
        description: z.string(),
        direction: z.string(),
        intensity: z.enum(["low", "medium", "high", "unknown"])
      })
      .strict(),
    mood: z.string(),
    likely_attachment_points: z.array(AttachmentPointSchema),
    character_concept: z.string(),
    character_name: z.string(),
    visual_style: z.string(),
    image_prompt: z.string(),
    placement_recommendation: z.string(),
    safety_notes: z.string(),
    share_caption: z.string()
  })
  .strict();

export type SceneAnalysis = z.infer<typeof SceneAnalysisSchema>;

export type GeneratedCompanion = {
  imageDataUrl: string;
  imageBase64: string;
  model: string;
  revisedPrompt?: string;
};

function normalizeText(value: string, fallback: string, maxLength = 900) {
  const normalized = value.replace(/\s+/g, " ").trim();
  return (normalized || fallback).slice(0, maxLength);
}

export function normalizeSceneAnalysis(value: unknown, mode: CompanionMode): SceneAnalysis {
  const parsed = SceneAnalysisSchema.parse(value);
  const fallback = createFallbackSceneAnalysis(mode, "Scene details were incomplete.");
  const points = parsed.likely_attachment_points
    .map((point) => ({
      label: normalizeText(point.label, "Open surface", 80),
      why_it_works: normalizeText(point.why_it_works, "It gives the companion visual room.", 240),
      placement_hint: normalizeText(point.placement_hint, "Place the companion near a clear edge.", 240)
    }))
    .filter((point) => point.label.length > 0)
    .slice(0, 4);

  return {
    scene_summary: normalizeText(parsed.scene_summary, fallback.scene_summary),
    lighting: {
      description: normalizeText(parsed.lighting.description, fallback.lighting.description, 240),
      direction: normalizeText(parsed.lighting.direction, fallback.lighting.direction, 120),
      intensity: parsed.lighting.intensity
    },
    mood: normalizeText(parsed.mood, fallback.mood, 140),
    likely_attachment_points:
      points.length > 0 ? points : fallback.likely_attachment_points,
    character_concept: normalizeText(
      parsed.character_concept,
      fallback.character_concept,
      500
    ),
    character_name: normalizeText(parsed.character_name, fallback.character_name, 80),
    visual_style: normalizeText(parsed.visual_style, fallback.visual_style, 220),
    image_prompt: normalizeText(parsed.image_prompt, fallback.image_prompt, 1400),
    placement_recommendation: normalizeText(
      parsed.placement_recommendation,
      fallback.placement_recommendation,
      360
    ),
    safety_notes: normalizeText(parsed.safety_notes, fallback.safety_notes, 280),
    share_caption: normalizeText(parsed.share_caption, fallback.share_caption, 180)
  };
}

export function createFallbackSceneAnalysis(
  mode: CompanionMode,
  reason: string
): SceneAnalysis {
  return {
    scene_summary:
      "A usable camera or demo scene is ready, but the model response could not be fully validated.",
    lighting: {
      description: "Mixed ambient light with no reliable dominant direction.",
      direction: "unknown",
      intensity: "unknown"
    },
    mood: "playful and practical",
    likely_attachment_points: [
      {
        label: "Clear tabletop or open corner",
        why_it_works: "Open surfaces leave enough contrast around a small companion.",
        placement_hint: "Place the companion near a visible edge without covering key scene details."
      }
    ],
    character_concept:
      mode === "Floating Familiar"
        ? "A tiny floating familiar with a clean silhouette and soft glow."
        : mode === "Keyboard Pet"
          ? "A compact keyboard pet with a readable face and soft playful expression."
          : "A small desk critter that feels curious, friendly, and easy to composite.",
    character_name: "Pixel Sprout",
    visual_style: "clean sticker-like companion, simple silhouette, soft shadow",
    image_prompt:
      "Create one small friendly companion character with a clean silhouette, simple readable features, and no background scenery.",
    placement_recommendation:
      "Use a clear area near the lower third of the scene and avoid covering faces, screens, or important objects.",
    safety_notes: reason,
    share_caption: "A tiny AI companion moved into my scene."
  };
}
