import { tavilyTool } from "./tavily";
import { calculatorTool } from "./calculator";
import { dateTimeTool } from "./datetime";
import {
  readFileTool,
  writeFileTool,
  listDirectoryTool,
  copyFileTool,
  moveFileTool,
  renameFileTool,
  deleteFileTool,
  createDirectoryTool,
  deleteDirectoryTool,
  searchFilesTool,
  findTextTool,
} from "./filesystem";
import { terminalTool } from "./terminal";
import { wikipediaTool } from "./wikipedia";
import { urlReaderTool } from "./url-reader";
import { pdfReaderTool } from "./pdf-reader";
import { youtubeTranscriptTool } from "./youtube-transcript";
import { gmailTool } from "./gmail";
import { createEventTool, listEventsTool } from "./calendar";

export const tools = [
  tavilyTool,
  calculatorTool,
  dateTimeTool,
  readFileTool,
  writeFileTool,
  listDirectoryTool,
  copyFileTool,
  moveFileTool,
  renameFileTool,
  deleteFileTool,
  createDirectoryTool,
  deleteDirectoryTool,
  searchFilesTool,
  findTextTool,
  terminalTool,
  wikipediaTool,
  urlReaderTool,
  pdfReaderTool,
  youtubeTranscriptTool,
  gmailTool,
  createEventTool,
  listEventsTool,
];
