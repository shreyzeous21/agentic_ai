import { randomUUID } from "node:crypto";
import { emitKeypressEvents } from "node:readline";
import readline from "node:readline/promises";
import chalk from "chalk";
import boxen from "boxen";
import ora from "ora";

import { app } from "../agent";
import { handleAgentError } from "./error-handler";
import { getProjectContext } from "./project-context";

export interface AgentOptions {
  context?: boolean;
  threadId?: string;
}

export async function invokeAgent(
  prompt: string,
  options: AgentOptions = {},
): Promise<string> {
  const messages: { role: string; content: string }[] = [];

  if (options.context) {
    messages.push({
      role: "system",
      content: getProjectContext(),
    });
  }

  messages.push({ role: "user", content: prompt });

  const result = await app.invoke(
    {
      messages,
    },
    {
      configurable: {
        thread_id: options.threadId ?? randomUUID(),
      },
    },
  );

  const content = result.messages.at(-1)?.content;

  return content == null ? "No response" : String(content);
}

export async function runOnce(prompt: string, options: AgentOptions = {}) {
  const spinner = ora({
    text: chalk.yellow("Thinking..."),
    spinner: "dots",
  }).start();

  try {
    const response = await invokeAgent(prompt, options);

    spinner.stop();

    if (process.stdout.isTTY) {
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
    } else {
      console.log(response);
    }
  } catch (error) {
    spinner.fail(chalk.red("Request failed"));
    handleAgentError(error);
    process.exitCode = 1;
  }
}

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
${chalk.gray(`• Working in: ${chalk.white(process.cwd())}`)}
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
      const response = await invokeAgent(input, { threadId: "1" });

      spinner.stop();

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
