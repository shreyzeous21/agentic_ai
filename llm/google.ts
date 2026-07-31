import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tools } from "../tools";
import { ENV } from "../utils/env";

export const llmGoogle = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: ENV.GOOGLE_API_KEY,
}).bindTools(tools);
