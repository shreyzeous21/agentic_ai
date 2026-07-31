import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const calculatorTool = tool(
  async ({ expression }) => {
    try {
      const result = Function(`"use strict"; return (${expression})`)();

      return JSON.stringify({
        success: true,
        expression,
        result,
      });
    } catch {
      return JSON.stringify({
        success: false,
        message: "Invalid mathematical expression.",
      });
    }
  },
  {
    name: "calculator",
    description:
      "Evaluate mathematical expressions. Use for arithmetic, percentages, powers, etc.",
    schema: z.object({
      expression: z.string().describe("The mathematical expression."),
    }),
  },
);
