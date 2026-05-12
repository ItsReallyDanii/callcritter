import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { analyzeScene } from "@/lib/openai/analyzeScene";
import { MissingOpenAIKeyError } from "@/lib/openai/client";
import { CompanionModeSchema } from "@/types/scene";

const AnalyzeRequestSchema = z
  .object({
    image: z.string().trim().min(32).max(14_000_000),
    mode: CompanionModeSchema.default("Desk Critter")
  })
  .strict();

export async function POST(request: NextRequest) {
  const body = await readJson(request);
  const parsed = AnalyzeRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "invalid_request",
          message: "Provide a base64 image or image data URL and a valid companion mode."
        }
      },
      { status: 400 }
    );
  }

  try {
    const result = await analyzeScene(parsed.data);

    return NextResponse.json({
      ok: true,
      analysis: result.analysis,
      model: result.model,
      used_fallback: result.usedFallback
    });
  } catch (error) {
    return NextResponse.json(toApiError(error, "Scene analysis failed. Try demo mode or retry."), {
      status: error instanceof MissingOpenAIKeyError ? 503 : 502
    });
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
      code: "analysis_failed",
      message: fallbackMessage
    }
  };
}

function isOpenAIStatusError(error: unknown): error is { status: number } {
  return typeof error === "object" && error !== null && "status" in error;
}
