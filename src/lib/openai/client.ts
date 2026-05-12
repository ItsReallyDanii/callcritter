import "server-only";

import OpenAI from "openai";

export class MissingOpenAIKeyError extends Error {
  constructor() {
    super("OpenAI API key missing. Add OPENAI_API_KEY to .env.local.");
    this.name = "MissingOpenAIKeyError";
  }
}

let client: OpenAI | null = null;

export function hasOpenAIApiKey() {
  return Boolean(process.env.OPENAI_API_KEY?.trim());
}

export function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    throw new MissingOpenAIKeyError();
  }

  if (!client) {
    client = new OpenAI({ apiKey });
  }

  return client;
}

export function getSceneModel() {
  return process.env.OPENAI_SCENE_MODEL?.trim() || "gpt-5.5";
}

export function getImageModel() {
  return process.env.OPENAI_IMAGE_MODEL?.trim() || "gpt-image-2";
}
