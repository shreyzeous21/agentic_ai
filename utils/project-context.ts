import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const SKIP = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  ".nuxt",
  ".cache",
  ".venv",
  "venv",
  "__pycache__",
  ".DS_Store",
  "coverage",
]);

export function getProjectContext(): string {
  const cwd = process.cwd();
  const lines: string[] = [];

  lines.push(`You are working inside the project located at: ${cwd}`);

  try {
    const branch = execSync("git rev-parse --abbrev-ref HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();

    lines.push(`Git branch: ${branch}`);
  } catch {}

  try {
    const status = execSync("git status --short", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();

    if (status) {
      lines.push(`Git status:\n${status}`);
    }
  } catch {}

  try {
    const entries = fs
      .readdirSync(cwd, { withFileTypes: true })
      .filter((e) => !SKIP.has(e.name) && !e.name.startsWith("."))
      .map((e) => (e.isDirectory() ? `${e.name}/` : e.name));

    lines.push(
      `Top-level files & directories:\n${
        entries.slice(0, 60).join("\n") || "(empty)"
      }`,
    );
  } catch {}

  const pkgPath = path.join(cwd, "package.json");

  if (fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
      const summary: string[] = [];

      if (pkg.name) summary.push(`name: ${pkg.name}`);
      if (pkg.scripts) summary.push(`scripts: ${Object.keys(pkg.scripts).join(", ")}`);
      if (pkg.dependencies) {
        summary.push(`dependencies: ${Object.keys(pkg.dependencies).join(", ")}`);
      }
      if (pkg.devDependencies) {
        summary.push(`devDependencies: ${Object.keys(pkg.devDependencies).join(", ")}`);
      }

      if (summary.length) {
        lines.push(`package.json:\n${summary.join("\n")}`);
      }
    } catch {}
  }

  return lines.join("\n");
}
