import { tool } from "@langchain/core/tools";
import { z } from "zod";
import * as wikipedia from "wikipedia";

export const wikipediaTool = tool(
  async ({ query }) => {
    try {
      const page = await wikipedia.default.page(query);
      const summary = await page.summary();

      return JSON.stringify({
        title: summary.title,
        summary: summary.extract,
        url: page.fullurl,
      });
    } catch {
      return JSON.stringify({
        error: "Wikipedia page not found.",
      });
    }
  },
  {
    name: "wikipedia",
    description:
      "Search Wikipedia for factual information about people, places, events, concepts, and organizations.",
    schema: z.object({
      query: z.string(),
    }),
  },
);
