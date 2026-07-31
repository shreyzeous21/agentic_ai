import { emitKeypressEvents } from "node:readline";
import readline from "node:readline/promises";
import chalk from "chalk";
import boxen from "boxen";
import ora from "ora";

import { app } from "../agent";
import { handleAgentError } from "./error-handler";

export async function startChat() {
  emitKeypressEvents(process.stdin);

  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function exit() {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }

    process.stdin.removeAllListeners("keypress");
    rl.close();

    console.log(chalk.red("\n👋 Goodbye!\n"));
    process.exit(0);
  }

  process.stdin.on("keypress", (_, key) => {
    if (key.name === "escape") exit();
    if (key.ctrl && key.name === "c") exit();
  });

  console.clear();

  console.log(
    boxen(
      `${chalk.cyan.bold("🤖 Agentic AI Assistant")}

${chalk.gray("• Press Esc or Ctrl+C to exit")}
${chalk.gray("• Multi Provider (Groq → OpenRouter → Gemini)")}`,
      {
        padding: 1,
        borderStyle: "round",
        borderColor: "cyan",
      },
    ),
  );

  while (true) {
    const input = await rl.question(
      chalk.blueBright("❯ You ") + chalk.gray("› "),
    );

    if (!input.trim()) continue;

    const spinner = ora({
      text: chalk.yellow("Thinking..."),
      spinner: "dots",
    }).start();

    try {
      const result = await app.invoke(
        {
          messages: [
            {
              role: "user",
              content: input,
            },
          ],
        },
        {
          configurable: {
            thread_id: "1",
          },
        },
      );

      spinner.stop();

      const response = result.messages.at(-1)?.content ?? "No response";

      console.log(
        boxen(chalk.white(response), {
          title: chalk.green("🤖 AI"),
          titleAlignment: "left",
          borderStyle: "round",
          borderColor: "green",
          padding: 1,
          margin: {
            top: 1,
            bottom: 1,
          },
        }),
      );
    } catch (error) {
      spinner.fail(chalk.red("Request failed"));
      handleAgentError(error);
    }
  }
}
