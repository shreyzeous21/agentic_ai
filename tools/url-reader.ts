import { tool } from "@langchain/core/tools";
import { z } from "zod";
import * as cheerio from "cheerio";

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  $("script, style, nav, footer, header, aside, iframe, noscript").remove();

  const title = $("title").text().trim();
  const body = $("body")
    .text()
    .replace(/\s+/g, " ")
    .trim();

  return JSON.stringify({ title, url, content: body.slice(0, 10000) });
}

export const urlReaderTool = tool(fetchPage, {
  name: "url_reader",
  description:
    "Fetch and extract readable text content from a web page URL. Returns the page title and body text.",
  schema: z.object({
    url: z.string().url().describe("The URL of the web page to read"),
  }),
});
