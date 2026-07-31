#!/usr/bin/env bun
import path from "node:path";
import { parseArgs } from "node:util";
import { startChat, runOnce } from "./utils/chat";

const USAGE = `🤖 Agentic AI Assistant — run from any project

USAGE
  agentic [options] ["question"]
  echo "question" | agentic [options]
  agentic                       Start interactive chat

OPTIONS
  -c, --context   Give the agent context about the current project
                  (cwd, git status, file tree, package.json)
  -d, --cwd <dir> Run as if started from <dir> (default: current dir)
  -h, --help      Show this help message
  -v, --version   Show the version

EXAMPLES
  agentic                         # interactive chat in this folder
  agentic "explain this repo" -c  # one-shot with project context
  agentic "run git status" -c     # ask the agent to inspect the repo
  cat README.md | agentic         # pipe content as the question
`;

function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
  });
}

async function getVersion(): Promise<string> {
  try {
    const pkgPath = path.join(import.meta.dir, "package.json");
    const pkg = JSON.parse(await Bun.file(pkgPath).text());
    return pkg.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

async function main() {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: {
      help: { type: "boolean", short: "h" },
      version: { type: "boolean", short: "v" },
      context: { type: "boolean", short: "c" },
      cwd: { type: "string", short: "d" },
    },
    allowPositionals: true,
  });

  if (values.help) {
    console.log(USAGE);
    process.exit(0);
  }

  if (values.version) {
    console.log(await getVersion());
    process.exit(0);
  }

  if (values.cwd) {
    process.chdir(values.cwd);
  }

  if (!process.stdin.isTTY) {
    const piped = await readStdin();
    if (piped.trim()) {
      await runOnce(piped.trim(), { context: values.context });
      process.exit(0);
    }
  }

  const prompt = positionals.join(" ").trim();

  if (prompt) {
    await runOnce(prompt, { context: values.context });
    process.exit(0);
  }

  await startChat();
}

main();
