import "server-only";

import { getImageModel, getOpenAIClient } from "@/lib/openai/client";
import { buildCompanionImagePrompt } from "@/lib/prompts/imagePromptTemplates";
import type { CompanionMode, GeneratedCompanion, SceneAnalysis } from "@/types/scene";

export type GenerateCompanionInput = {
  imagePrompt: string;
  mode: CompanionMode;
  scene: SceneAnalysis;
};

export async function generateCompanion({
  imagePrompt,
  mode,
  scene
}: GenerateCompanionInput): Promise<GeneratedCompanion> {
  const model = getImageModel();
  const openai = getOpenAIClient();
  const prompt = buildCompanionImagePrompt({ imagePrompt, mode, scene });

  const response = await openai.images.generate({
    model,
    prompt,
    n: 1,
    size: "1024x1024",
    quality: "low",
    background: "auto",
    output_format: "png",
    moderation: "auto"
  });

  const image = response.data?.[0];

  if (!image?.b64_json) {
    throw new Error("Image generation returned no base64 image data.");
  }

  return {
    imageBase64: image.b64_json,
    imageDataUrl: `data:image/png;base64,${image.b64_json}`,
    model,
    revisedPrompt: image.revised_prompt
  };
}
