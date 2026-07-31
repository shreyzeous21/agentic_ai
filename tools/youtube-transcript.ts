import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { YoutubeTranscript } from "youtube-transcript";

async function fetchTranscript(params: { videoId: string; lang?: string }) {
  try {
    const config = params.lang ? { lang: params.lang } : undefined;
    const transcript = await YoutubeTranscript.fetchTranscript(
      params.videoId,
      config,
    );

    return JSON.stringify({
      success: true,
      transcript: transcript.map((entry) => ({
        text: entry.text,
        offset: entry.offset,
        duration: entry.duration,
        lang: entry.lang,
      })),
    });
  } catch (err: any) {
    return JSON.stringify({
      success: false,
      error: err?.message ?? "Failed to fetch YouTube transcript.",
    });
  }
}

export const youtubeTranscriptTool = tool(fetchTranscript, {
  name: "youtube_transcript",
  description:
    "Fetch the transcript/captions of a YouTube video. Provide a video URL or video ID. Optionally specify a language code (e.g., 'en', 'es', 'fr').",
  schema: z.object({
    videoId: z
      .string()
      .describe("YouTube video URL or 11-character video ID"),
    lang: z
      .string()
      .optional()
      .describe("Optional language code (e.g., 'en', 'es')"),
  }),
});
