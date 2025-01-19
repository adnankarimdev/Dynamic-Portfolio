import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";

const openai = createOpenAI({
  // custom settings, e.g.
  compatibility: "strict", // strict mode, enable when using the OpenAI API
  apiKey: process.env.OPEN_AI_API_KEY,
});

const llmModel = openai("gpt-4o-mini", {
  structuredOutputs: true,
});

export function useOpenAi() {
  return { llmModel, generateObject };
}
