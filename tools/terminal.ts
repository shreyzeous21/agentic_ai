import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { exec } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

const execAsync = promisify(exec);

const WORKSPACE = process.cwd();

const ALLOWED_COMMANDS = [
  "pwd",
  "ls",
  "dir",
  "cat",
  "echo",

  "git",

  "node",
  "npm",
  "npx",

  "pnpm",
  "bun",
  "yarn",

  "tsc",

  "python",
  "python3",
];

export const terminalTool = tool(
  async ({ command }) => {
    try {
      const cmd = command.trim();

      if (!cmd) {
        return JSON.stringify({
          success: false,
          error: "Command cannot be empty.",
        });
      }

      const executable = cmd.split(/\s+/)[0];

      if (!ALLOWED_COMMANDS.includes(executable as any)) {
        return JSON.stringify({
          success: false,
          error: `Command "${executable}" is not allowed.`,
          allowedCommands: ALLOWED_COMMANDS,
        });
      }

      const { stdout, stderr } = await execAsync(cmd, {
        cwd: WORKSPACE,
        timeout: 30000,
        maxBuffer: 10 * 1024 * 1024,
      });

      return JSON.stringify({
        success: true,
        command: cmd,
        cwd: WORKSPACE,
        stdout,
        stderr,
      });
    } catch (err: any) {
      return JSON.stringify({
        success: false,
        command,
        cwd: WORKSPACE,
        error: err.message,
        stdout: err.stdout ?? "",
        stderr: err.stderr ?? "",
      });
    }
  },
  {
    name: "terminal",
    description:
      "Run safe terminal commands inside the current project directory. Useful for git, npm, node, pnpm, ls, pwd, cat, etc.",
    schema: z.object({
      command: z.string().describe("Terminal command to execute"),
    }),
  },
);
