import { google } from "googleapis";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import readline from "node:readline/promises";
import { ENV } from "./env";

const TOKEN_PATH = path.join(
  os.homedir(),
  ".agentic_ai_node",
  "calendar-tokens.json",
);

const SCOPES = ["https://www.googleapis.com/auth/calendar"];

let _client: ReturnType<typeof getOAuthClient> | null = null;

function getOAuthClient() {
  const clientId = ENV.GOOGLE_CALENDAR_CLIENT_ID;
  const clientSecret = ENV.GOOGLE_CALENDAR_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Missing GOOGLE_CALENDAR_CLIENT_ID or GOOGLE_CALENDAR_CLIENT_SECRET in .env",
    );
  }

  return new google.auth.OAuth2(clientId, clientSecret, "urn:ietf:wg:oauth:2.0:oob");
}

export async function getCalendarClient() {
  if (_client) return _client;

  const client = getOAuthClient();

  try {
    const stored = await fs.readFile(TOKEN_PATH, "utf8");
    const tokens = JSON.parse(stored);
    client.setCredentials(tokens);
    _client = client;
    return client;
  } catch {
    const authUrl = client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES,
    });

    console.log("\n" + "=".repeat(70));
    console.log("Google Calendar — Authorize this app");
    console.log("=".repeat(70));
    console.log("1. Open this URL in your browser:\n");
    console.log("   " + authUrl);
    console.log("\n2. Sign in and grant access");
    console.log("3. Copy the authorization code and paste it below:\n");

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const code = await rl.question("   Code: ");
    rl.close();

    const { tokens } = await client.getToken(code.trim());
    client.setCredentials(tokens);

    await fs.mkdir(path.dirname(TOKEN_PATH), { recursive: true });
    await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens, null, 2));

    console.log("   ✓ Tokens saved to", TOKEN_PATH + "\n");
    _client = client;
    return client;
  }
}
