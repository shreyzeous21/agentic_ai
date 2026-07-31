import os from "node:os";
import path from "node:path";
import fs from "node:fs";
import dotenv from "dotenv";

export const GLOBAL_CONFIG_DIR = path.join(os.homedir(), ".config", "agentic");
const GLOBAL_ENV_PATH = path.join(GLOBAL_CONFIG_DIR, ".env");
const PROJECT_ENV_PATHS = [".env", ".env.local"];

for (const envPath of [GLOBAL_ENV_PATH, ...PROJECT_ENV_PATHS]) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false, quiet: true });
  }
}

function get(...keys: string[]): string | undefined {
  for (const key of keys) {
    const value = process.env[key];
    if (value) return value;
  }

  return undefined;
}

export const ENV = {
  GROQ_API_KEY: get("GROQ_API_KEY")!,
  TAVILY_API_KEY: get("WEB_SEARCH_API", "TAVILY_API_KEY")!,
  OPENROUTER_API_KEY: get("OPENROUTER_API_KEY")!,
  GOOGLE_API_KEY: get("GOOGLE_API_KEY")!,
  GMAIL_USER: get("NODEMAILER_USER", "GMAIL_USER")!,
  GMAIL_APP_PASSWORD: get("NODEMAILER_APP_PASSWORD", "GMAIL_APP_PASSWORD")!,
  GOOGLE_CALENDAR_CLIENT_ID: get("GOOGLE_CALENDAR_CLIENT_ID")!,
  GOOGLE_CALENDAR_CLIENT_SECRET: get("GOOGLE_CALENDAR_CLIENT_SECRET")!,
};
