import type { BaseLanguageModelInput } from "@langchain/core/language_models/base";
import { ChatOpenRouter } from "@langchain/openrouter";
import { tools } from "../tools";
import { ENV } from "../utils/env";
import { logger } from "../utils/logger";
import { formatErrorBrief } from "../utils/error-handler";

const MODELS = [
  "nvidia/nemotron-3-ultra-550b-a55b:free",
  "inclusionai/ling-3.0-flash:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
  "poolside/laguna-s-2.1:free",
  "cohere/north-mini-code:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "google/gemma-4-26b-a4b-it:free",
];

function createModel(model: string) {
  return new ChatOpenRouter({
    model,
    apiKey: ENV.OPENROUTER_API_KEY,
  }).bindTools(tools);
}

export const llmOpenRouter = {
  async invoke(input: BaseLanguageModelInput) {
    let lastError: unknown;

    for (const model of MODELS) {
      try {
        logger.info(`Trying model: ${model}`);
        const llm = createModel(model);
        return await llm.invoke(input);
      } catch (error) {
        logger.error(`✗ ${model} failed: ${formatErrorBrief(error)}`);
        lastError = error;
      }
    }

    throw lastError ?? new Error("All models failed.");
  },
};
