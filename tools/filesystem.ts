import { tool } from "@langchain/core/tools";
import { z } from "zod";
import fs from "node:fs/promises";
import pathModule from "node:path";

async function walk(dir: string, maxDepth = 5, depth = 0): Promise<string[]> {
  if (depth > maxDepth) return [];

  let entries: string[] = [];
  try {
    const items = await fs.readdir(dir, { withFileTypes: true });

    for (const item of items) {
      const full = pathModule.join(dir, item.name);
      if (item.isDirectory()) {
        entries = entries.concat(await walk(full, maxDepth, depth + 1));
      } else {
        entries.push(full);
      }
    }
  } catch {}

  return entries;
}

export const readFileTool = tool(
  async ({ path }) => {
    try {
      const content = await fs.readFile(path, "utf8");

      return content;
    } catch {
      return "Unable to read file.";
    }
  },
  {
    name: "read_file",
    description: "Read a text file.",
    schema: z.object({
      path: z.string(),
    }),
  },
);

export const writeFileTool = tool(
  async ({ path, content }) => {
    await fs.writeFile(path, content);

    return "File written successfully.";
  },
  {
    name: "write_file",
    description: "Write text to a file.",
    schema: z.object({
      path: z.string(),
      content: z.string(),
    }),
  },
);

export const listDirectoryTool = tool(
  async ({ path }) => {
    try {
      const files = await fs.readdir(path);

      return JSON.stringify(files);
    } catch {
      return "Directory not found.";
    }
  },
  {
    name: "list_directory",
    description: "List files inside a directory.",
    schema: z.object({
      path: z.string(),
    }),
  },
);

export const copyFileTool = tool(
  async ({ source, destination }) => {
    try {
      await fs.copyFile(source, destination);

      return `Copied ${source} to ${destination}.`;
    } catch (err: any) {
      return `Unable to copy file: ${err?.message ?? "unknown error"}`;
    }
  },
  {
    name: "copy_file",
    description: "Copy a file from one location to another.",
    schema: z.object({
      source: z.string(),
      destination: z.string(),
    }),
  },
);

export const moveFileTool = tool(
  async ({ source, destination }) => {
    try {
      await fs.rename(source, destination);

      return `Moved ${source} to ${destination}.`;
    } catch (err: any) {
      return `Unable to move file: ${err?.message ?? "unknown error"}`;
    }
  },
  {
    name: "move_file",
    description: "Move a file from one location to another.",
    schema: z.object({
      source: z.string(),
      destination: z.string(),
    }),
  },
);

export const renameFileTool = tool(
  async ({ path, newName }) => {
    try {
      const dir = path.substring(0, path.lastIndexOf("/"));
      const destination = dir ? `${dir}/${newName}` : newName;

      await fs.rename(path, destination);

      return `Renamed ${path} to ${destination}.`;
    } catch (err: any) {
      return `Unable to rename file: ${err?.message ?? "unknown error"}`;
    }
  },
  {
    name: "rename_file",
    description: "Rename a file.",
    schema: z.object({
      path: z.string(),
      newName: z.string(),
    }),
  },
);

export const deleteFileTool = tool(
  async ({ path }) => {
    try {
      await fs.unlink(path);

      return `Deleted ${path}.`;
    } catch (err: any) {
      return `Unable to delete file: ${err?.message ?? "unknown error"}`;
    }
  },
  {
    name: "delete_file",
    description: "Delete a file.",
    schema: z.object({
      path: z.string(),
    }),
  },
);

export const createDirectoryTool = tool(
  async ({ path, recursive }) => {
    try {
      await fs.mkdir(path, { recursive: recursive ?? true });

      return `Created directory ${path}.`;
    } catch (err: any) {
      return `Unable to create directory: ${err?.message ?? "unknown error"}`;
    }
  },
  {
    name: "create_directory",
    description: "Create a new directory.",
    schema: z.object({
      path: z.string(),
      recursive: z.boolean().optional(),
    }),
  },
);

export const deleteDirectoryTool = tool(
  async ({ path, recursive }) => {
    try {
      await fs.rm(path, { recursive: recursive ?? true, force: true });

      return `Deleted directory ${path}.`;
    } catch (err: any) {
      return `Unable to delete directory: ${err?.message ?? "unknown error"}`;
    }
  },
  {
    name: "delete_directory",
    description: "Delete a directory and its contents.",
    schema: z.object({
      path: z.string(),
      recursive: z.boolean().optional(),
    }),
  },
);

export const searchFilesTool = tool(
  async ({ path, pattern, maxDepth }) => {
    try {
      const root = path || process.cwd();
      const files = await walk(root, maxDepth ?? 5);

      const matched = pattern
        ? files.filter((f) => pathModule.basename(f).includes(pattern))
        : files;

      return JSON.stringify({
        count: matched.length,
        files: matched.slice(0, 100),
      });
    } catch (err: any) {
      return `Unable to search files: ${err?.message ?? "unknown error"}`;
    }
  },
  {
    name: "search_files",
    description:
      "Recursively search for files by name pattern inside a directory.",
    schema: z.object({
      path: z.string().optional().describe("Directory to search (default: cwd)"),
      pattern: z.string().optional().describe("Substring to match in file names"),
      maxDepth: z.number().optional().describe("Max recursion depth (default 5)"),
    }),
  },
);

export const findTextTool = tool(
  async ({ path, text, maxResults }) => {
    try {
      const root = path || process.cwd();
      const files = await walk(root, 5);

      const limit = maxResults ?? 20;
      const matches: { file: string; line: number; snippet: string }[] = [];

      for (const file of files.slice(0, 500)) {
        if (matches.length >= limit) break;

        try {
          const content = await fs.readFile(file, "utf8");
          const lines = content.split("\n");

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i] ?? "";
            const idx = line.toLowerCase().indexOf(text.toLowerCase());
            if (idx !== -1) {
              matches.push({
                file,
                line: i + 1,
                snippet: line.trim().slice(0, 200),
              });
              if (matches.length >= limit) break;
            }
          }
        } catch {}
      }

      return JSON.stringify({ count: matches.length, matches });
    } catch (err: any) {
      return `Unable to search text: ${err?.message ?? "unknown error"}`;
    }
  },
  {
    name: "find_text",
    description:
      "Search for a text string inside files within a directory. Returns file, line number, and snippet.",
    schema: z.object({
      path: z.string().optional().describe("Directory to search (default: cwd)"),
      text: z.string().describe("Text to search for"),
      maxResults: z.number().optional().describe("Max matches to return (default 20)"),
    }),
  },
);
