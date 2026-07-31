import { ChatGroq } from "@langchain/groq";
import { ENV } from "../utils/env";
import { tools } from "../tools";

export const llmGroq = new ChatGroq({
  apiKey: ENV.GROQ_API_KEY,
  model: "openai/gpt-oss-120b",
  temperature: 0,
}).bindTools(tools);
