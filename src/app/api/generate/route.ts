import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { generateCompanion } from "@/lib/openai/generateCompanion";
import { MissingOpenAIKeyError } from "@/lib/openai/client";
import { CompanionModeSchema, SceneAnalysisSchema } from "@/types/scene";

const GenerateRequestSchema = z
  .object({
    image_prompt: z.string().trim().min(12).max(2000),
    mode: CompanionModeSchema.default("Desk Critter"),
    scene_metadata: SceneAnalysisSchema
  })
  .strict();

export async function POST(request: NextRequest) {
  const body = await readJson(request);
  const parsed = GenerateRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "invalid_request",
          message: "Provide image_prompt, mode, and validated scene_metadata."
        }
      },
      { status: 400 }
    );
  }

  try {
    const companion = await generateCompanion({
      imagePrompt: parsed.data.image_prompt,
      mode: parsed.data.mode,
      scene: parsed.data.scene_metadata
    });

    return NextResponse.json({
      ok: true,
      image: {
        data_url: companion.imageDataUrl,
        base64_png: companion.imageBase64,
        model: companion.model,
        revised_prompt: companion.revisedPrompt
      }
    });
  } catch (error) {
    return NextResponse.json(
      toApiError(error, "Generation failed. Try demo mode or retry."),
      {
        status: error instanceof MissingOpenAIKeyError ? 503 : 502
      }
    );
  }
}

async function readJson(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function toApiError(error: unknown, fallbackMessage: string) {
  if (error instanceof MissingOpenAIKeyError) {
    return {
      ok: false,
      error: {
        code: "missing_openai_api_key",
        message: error.message
      }
    };
  }

  if (isOpenAIStatusError(error)) {
    return {
      ok: false,
      error: {
        code: `openai_${error.status}`,
        message: error.status === 401 ? "OpenAI request was not authenticated." : fallbackMessage
      }
    };
  }

  return {
    ok: false,
    error: {
      code: "generation_failed",
      message: fallbackMessage
    }
  };
}

function isOpenAIStatusError(error: unknown): error is { status: number } {
  return typeof error === "object" && error !== null && "status" in error;
}
