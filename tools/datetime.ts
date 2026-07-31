import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const dateTimeTool = tool(
  async ({ timezone }) => {
    try {
      const now = new Date();

      return JSON.stringify({
        currentTime: now.toLocaleString("en-US", {
          timeZone: timezone || "UTC",
        }),
        timezone: timezone || "UTC",
        iso: now.toISOString(),
      });
    } catch {
      return JSON.stringify({
        error: "Invalid timezone.",
      });
    }
  },
  {
    name: "datetime",
    description: "Get the current date and time for a specific timezone.",
    schema: z.object({
      timezone: z.string().optional(),
    }),
  },
);
