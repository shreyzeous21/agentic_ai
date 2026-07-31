import { TavilySearch } from "@langchain/tavily";
import { ENV } from "../utils/env";

export const tavilyTool = new TavilySearch({
  tavilyApiKey: ENV.TAVILY_API_KEY,
  maxResults: 3,
  topic: "general",
});
