import { tool } from "@langchain/core/tools";
import { z } from "zod";
import fs from "node:fs/promises";
import path from "node:path";
import { PDFParse } from "pdf-parse";

async function readPdf(params: { source: string }) {
  try {
    let parser: PDFParse;

    if (
      params.source.startsWith("http://") ||
      params.source.startsWith("https://")
    ) {
      parser = new PDFParse({ url: params.source });
    } else {
      const resolved = path.resolve(params.source);
      const buffer = await fs.readFile(resolved);
      parser = new PDFParse({ data: new Uint8Array(buffer) });
    }

    const result = await parser.getText({});
    await parser.destroy();

    return JSON.stringify({
      success: true,
      pageCount: result.total,
      text: result.text,
    });
  } catch (err: any) {
    return JSON.stringify({
      success: false,
      error: err?.message ?? "Failed to read PDF.",
    });
  }
}

export const pdfReaderTool = tool(readPdf, {
  name: "pdf_reader",
  description:
    "Read a PDF file from a local file path or a URL. Extracts all text content from the document.",
  schema: z.object({
    source: z
      .string()
      .describe(
        "Local file path or HTTP/HTTPS URL to the PDF document",
      ),
  }),
});
