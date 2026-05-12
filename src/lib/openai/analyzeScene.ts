import "server-only";

import { zodTextFormat } from "openai/helpers/zod";
import { getOpenAIClient, getSceneModel } from "@/lib/openai/client";
import {
  createFallbackSceneAnalysis,
  normalizeSceneAnalysis,
  type CompanionMode,
  type SceneAnalysis,
  SceneAnalysisSchema
} from "@/types/scene";
import {
  buildSceneAnalysisUserPrompt,
  sceneAnalysisSystemPrompt
} from "@/lib/prompts/sceneAnalysisPrompt";

export type AnalyzeSceneInput = {
  image: string;
  mode: CompanionMode;
};

export type AnalyzeSceneResult = {
  analysis: SceneAnalysis;
  model: string;
  usedFallback: boolean;
};

export async function analyzeScene({
  image,
  mode
}: AnalyzeSceneInput): Promise<AnalyzeSceneResult> {
  const model = getSceneModel();
  const imageDataUrl = normalizeImageForVisionInput(image);
  const openai = getOpenAIClient();

  const response = await openai.responses.parse({
    model,
    input: [
      {
        role: "system",
        content: sceneAnalysisSystemPrompt
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: buildSceneAnalysisUserPrompt(mode)
          },
          {
            type: "input_image",
            image_url: imageDataUrl,
            detail: "low"
          }
        ]
      }
    ],
    text: {
      format: zodTextFormat(SceneAnalysisSchema, "callcritter_scene_analysis")
    },
    max_output_tokens: 1200
  });

  if (!response.output_parsed) {
    return {
      analysis: createFallbackSceneAnalysis(mode, "Scene analysis returned no parsed JSON."),
      model,
      usedFallback: true
    };
  }

  try {
    return {
      analysis: normalizeSceneAnalysis(response.output_parsed, mode),
      model,
      usedFallback: false
    };
  } catch {
    return {
      analysis: createFallbackSceneAnalysis(
        mode,
        "Scene analysis JSON was returned but did not pass validation."
      ),
      model,
      usedFallback: true
    };
  }
}

function normalizeImageForVisionInput(image: string) {
  const trimmed = image.trim();

  if (trimmed.startsWith("data:image/")) {
    return trimmed;
  }

  return `data:image/png;base64,${trimmed}`;
}
