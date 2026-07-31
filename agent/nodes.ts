import type { MessagesAnnotation } from "@langchain/langgraph";
import { llmGroq } from "../llm/groq";
import { llmOpenRouter } from "../llm/openrouter";
import { llmGoogle } from "../llm/google";
import { logger } from "../utils/logger";
import { formatErrorBrief } from "../utils/error-handler";

const providers = [
  { name: "Groq", llm: llmGroq },
  { name: "OpenRouter", llm: llmOpenRouter },
  { name: "Google", llm: llmGoogle },
];

export async function agentNode(state: typeof MessagesAnnotation.State) {
  let lastError: unknown;

  for (const { name, llm } of providers) {
    try {
      logger.info(`Trying ${name}...`);

      const response = await llm.invoke(state.messages);

      logger.success(`${name} succeeded.`);

      return {
        messages: [response],
      };
    } catch (error) {
      logger.error(`✗ ${name} failed: ${formatErrorBrief(error)}`);
      lastError = error;
    }
  }

  throw lastError ?? new Error("All AI providers failed.");
}
