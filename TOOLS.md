# Agentic AI Node - Tools Documentation

This document describes all the tools available to the Agentic AI Node, explaining their purpose and how they can be used.

---

## 1. Web Search (Tavily)

**Purpose:** A search engine optimized for comprehensive, accurate, and trusted results. Useful for when you need to answer questions about current events.

**Function:** `default_api.tavily_search`

**Arguments:**
*   `query` (string, required): Search query to look up.
*   `excludeDomains` (list of strings, optional): A list of domains to exclude from search results.
*   `includeDomains` (list of strings, optional): A list of domains to restrict search results to.
*   `includeImages` (boolean, optional): Determines if the search returns relevant images along with text results.
*   `searchDepth` ('basic' or 'advanced', optional): Controls search thoroughness and result comprehensiveness.
*   `timeRange` ('day', 'week', 'month', 'year', optional): Limits results to content published within a specific timeframe.
*   `topic` ('general', 'news', 'finance', optional): Specifies search category for optimized results.

---

## 2. Calculator

**Purpose:** Evaluate mathematical expressions for arithmetic, percentages, powers, etc.

**Function:** `default_api.calculator`

**Arguments:**
*   `expression` (string, required): The mathematical expression to evaluate.

---

## 3. Date and Time

**Purpose:** Get the current date and time for a specific timezone.

**Function:** `default_api.datetime`

**Arguments:**
*   `timezone` (string, optional): The timezone for which to get the date and time.

---

## 4. Read File

**Purpose:** Read the text content of a local file.

**Function:** `default_api.read_file`

**Arguments:**
*   `path` (string, required): The path to the file to read.

---

## 5. Write File

**Purpose:** Write text content to a local file.

**Function:** `default_api.write_file`

**Arguments:**
*   `path` (string, required): The path where the file will be written.
*   `content` (string, required): The text content to write into the file.

---

## 6. List Directory

**Purpose:** List files and directories within a specified directory.

**Function:** `default_api.list_directory`

**Arguments:**
*   `path` (string, required): The path to the directory to list.

---

## 7. Copy File

**Purpose:** Copy a file from one location to another.

**Function:** `default_api.copy_file`

**Arguments:**
*   `source` (string, required): The path to the source file.
*   `destination` (string, required): The path where the file should be copied.

---

## 8. Move File

**Purpose:** Move a file from one location to another.

**Function:** `default_api.move_file`

**Arguments:**
*   `source` (string, required): The path to the source file.
*   `destination` (string, required): The path where the file should be moved.

---

## 9. Rename File

**Purpose:** Rename a local file.

**Function:** `default_api.rename_file`

**Arguments:**
*   `path` (string, required): The current path of the file.
*   `newName` (string, required): The new name for the file.

---

## 10. Delete File

**Purpose:** Delete a local file.

**Function:** `default_api.delete_file`

**Arguments:**
*   `path` (string, required): The path to the file to delete.

---

## 11. Create Directory

**Purpose:** Create a new directory.

**Function:** `default_api.create_directory`

**Arguments:**
*   `path` (string, required): The path for the new directory.
*   `recursive` (boolean, optional): If `true`, creates parent directories as needed.

---

## 12. Delete Directory

**Purpose:** Delete a directory and its contents.

**Function:** `default_api.delete_directory`

**Arguments:**
*   `path` (string, required): The path to the directory to delete.
*   `recursive` (boolean, optional): If `true`, deletes non-empty directories.

---

## 13. Search Files

**Purpose:** Recursively search for files by name pattern inside a directory.

**Function:** `default_api.search_files`

**Arguments:**
*   `maxDepth` (number, optional): Max recursion depth (default 5).
*   `path` (string, optional): Directory to search (default: current working directory).
*   `pattern` (string, optional): Substring to match in file names.

---

## 14. Find Text

**Purpose:** Search for a text string inside files within a directory. Returns file, line number, and snippet.

**Function:** `default_api.find_text`

**Arguments:**
*   `text` (string, required): Text to search for.
*   `maxResults` (number, optional): Max matches to return (default 20).
*   `path` (string, optional): Directory to search (default: current working directory).

---

## 15. Terminal

**Purpose:** Run safe terminal commands inside the current project directory. Useful for git, npm, node, pnpm, ls, pwd, cat, etc.

**Function:** `default_api.terminal`

**Arguments:**
*   `command` (string, required): The terminal command to execute.

---

## 16. Wikipedia

**Purpose:** Search Wikipedia for factual information about people, places, events, concepts, and organizations.

**Function:** `default_api.wikipedia`

**Arguments:**
*   `query` (string, required): The search query for Wikipedia.

---

## 17. URL Reader

**Purpose:** Fetch and extract readable text content from a web page URL. Returns the page title and body text.

**Function:** `default_api.url_reader`

**Arguments:**
*   `url` (string, required): The URL of the web page to read.

---

## 18. PDF Reader

**Purpose:** Read a PDF file from a local file path or a URL. Extracts all text content from the document.

**Function:** `default_api.pdf_reader`

**Arguments:**
*   `source` (string, required): Local file path or HTTP/HTTPS URL to the PDF document.

---

## 19. YouTube Transcript

**Purpose:** Fetch the transcript/captions of a YouTube video.

**Function:** `default_api.youtube_transcript`

**Arguments:**
*   `videoId` (string, required): YouTube video URL or 11-character video ID.
*   `lang` (string, optional): Optional language code (e.g., 'en', 'es').

---

## 20. Gmail

**Purpose:** Send an email via Gmail SMTP. Requires `GMAIL_USER` and `GMAIL_APP_PASSWORD` in `.env`.

**Function:** `default_api.gmail`

**Arguments:**
*   `to` (string, required): Recipient email address.
*   `subject` (string, required): Email subject line.
*   `body` (string, required): Plain text email body.
*   `cc` (string, optional): CC recipient email address.

---

## 21. Calendar - Create Event

**Purpose:** Create a Google Calendar event. Requires OAuth2 setup. Times must be ISO 8601.

**Function:** `default_api.calendar_create_event`

**Arguments:**
*   `summary` (string, required): Event title.
*   `startTime` (string, required): Start time in ISO 8601 format (e.g. `2025-01-15T14:00:00Z`).
*   `endTime` (string, required): End time in ISO 8601 format.
*   `attendees` (string, optional): Comma-separated email addresses of attendees.
*   `description` (string, optional): Event description.
*   `location` (string, optional): Event location.

---

## 22. Calendar - List Events

**Purpose:** List upcoming Google Calendar events.

**Function:** `default_api.calendar_list_events`

**Arguments:**
*   `maxResults` (number, optional): Max events to return (default 10).
