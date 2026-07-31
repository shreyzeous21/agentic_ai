# agentic_ai_node

A terminal-based AI agent powered by **LangChain** + **LangGraph** that can browse the web, run code, read/write files, fetch YouTube transcripts, read PDFs, and more — all from your command line.

It installs as a **global CLI** (`agentic`) so you can run it from **any project** on your machine and use the file/terminal tools against that project's folder.

## Features

- **Web Search** — Ask about current events (powered by Tavily)
- **URL Reader** — Fetch and extract text from any web page
- **PDF Reader** — Read PDFs from a local file or remote URL
- **Gmail** — Send emails via Gmail SMTP (Google App Password required)
- **Google Calendar** — Create events and list upcoming events (OAuth2)
- **YouTube Transcript** — Get captions from any YouTube video
- **Calculator** — Solve math expressions
- **File System** — Read, write, and list files on your machine
- **Terminal** — Run safe commands (git, npm, bun, ls, node, etc.)
- **Wikipedia** — Look up factual information
- **Date/Time** — Get current time in any timezone
- **Memory** — Conversation state is preserved across messages
- **LLM Fallback** — Auto-fails over across Groq, OpenRouter (9 models), and Google Gemini
- **Error Handling** — Clear messages for API errors, rate limits, etc.

## Prerequisites

- [Bun](https://bun.sh) installed
- At least one API key from:
  - **Groq** — `GROQ_API_KEY`
  - **OpenRouter** — `OPENROUTER_API_KEY`
  - **Google Gemini** — `GOOGLE_API_KEY`
- **Tavily** — `TAVILY_API_KEY` for web search
- **Gmail** — `GMAIL_USER` + `GMAIL_APP_PASSWORD` (Google Account App Password)
- **Google Calendar** — `GOOGLE_CALENDAR_CLIENT_ID` + `GOOGLE_CALENDAR_CLIENT_SECRET` (see Calendar Setup below)

## Setup

```bash
git clone <your-repo-url>
cd agentic_ai_node
bun install
```

Create a `.env` file in the project root:

```env
GROQ_API_KEY="your_groq_api_key"
TAVILY_API_KEY="your_tavily_api_key"
OPENROUTER_API_KEY="your_openrouter_api_key"
GOOGLE_API_KEY="your_google_api_key"
GMAIL_USER="your.email@gmail.com"
GMAIL_APP_PASSWORD="your_16_char_app_password"
```

> Note: the original key names `WEB_SEARCH_API`, `NODEMAILER_USER`, and `NODEMAILER_APP_PASSWORD` are also accepted.

### Install as a global CLI

To use `agentic` from any project folder on your machine:

```bash
bun link
```

Then put your API keys in a global config file so they're available in every project (a project's own `.env` overrides it if present):

```bash
mkdir -p ~/.config/agentic
cp .env ~/.config/agentic/.env   # or create it manually with the keys above
```

You can now run `agentic` from anywhere. It is **not** added to your project — run it inside a project folder and it works on that folder, then just stop using it there. To remove it from your machine entirely:

```bash
bun unlink agentic_ai_node
```

## Usage

```bash
agentic                              # interactive chat in the current folder
agentic "explain this repo" -c       # one-shot question with project context
agentic -c                           # interactive chat with project context
echo "question" | agentic            # pipe a question / file content
agentic --cwd /path/to/project "..." # run as if inside another folder
agentic --help                       # all options
```

The `-c`/`--context` flag injects the current directory, git branch/status, top-level files, and `package.json` summary so the agent can understand any repo.

Running `agentic` (or `bun run index.ts`) gives you an interactive prompt:

```
🤖 AI Assistant
----------------------------
Press Esc or Ctrl+C to exit.

You:
```

Type your question and the agent will decide which tools to use:

### Example prompts per tool

| Tool | Example prompt |
|---|---|
| **Web Search** | `what's the latest news about AI?` |
| **URL Reader** | `read the content of https://example.com` |
| **PDF Reader** | `extract text from ./document.pdf` or `read this PDF: https://example.com/doc.pdf` |
| **YouTube Transcript** | `get the transcript of https://youtube.com/watch?v=dQw4w9WgXcQ` |
| **Gmail** | `send an email to john@example.com saying the project is done` |
| **Calendar** | `schedule a meeting tomorrow at 2pm for 1 hour called "Sprint Review"` or `list my upcoming events` |
| **Calculator** | `calculate 15% of 340` |
| **File System** | `list files in the current directory` or `read src/index.ts` |
| **Terminal** | `run git status` or `show me the node version` |
| **Wikipedia** | `what is the capital of France?` |
| **Date/Time** | `what time is it in Tokyo?` |

Press **Esc** or **Ctrl+C** to exit.

## Project Structure

```
agentic_ai_node/
├── index.ts                # CLI entry point (chat / one-shot / stdin / context)
├── agent/                  # LangGraph agent graph
│   ├── conditions.ts       # Conditional edge logic (tool routing)
│   ├── graph.ts            # State graph definition
│   ├── index.ts            # Compiled agent export
│   └── nodes.ts            # Agent node (LLM call with provider fallback)
├── llm/
│   ├── groq.ts             # Groq LLM (openai/gpt-oss-120b)
│   ├── openrouter.ts       # OpenRouter (9 free model fallbacks)
│   └── google.ts           # Google Gemini 2.5 Flash
├── tools/
│   ├── index.ts            # Tool registry (14 tools)
│   ├── calculator.ts       # Math expression evaluator
│   ├── calendar.ts         # Google Calendar (create/list events)
│   ├── datetime.ts         # Date/time by timezone
│   ├── filesystem.ts       # Read/write/list files
│   ├── gmail.ts            # Send emails via Gmail SMTP
│   ├── pdf-reader.ts       # PDF text extraction (local/URL)
│   ├── tavily.ts           # Web search (Tavily API)
│   ├── terminal.ts         # Sandboxed terminal (whitelisted commands)
│   ├── url-reader.ts       # Web page content fetcher
│   ├── wikipedia.ts        # Wikipedia lookup
│   └── youtube-transcript.ts # YouTube caption fetcher
├── utils/
│   ├── chat.ts             # invokeAgent / runOnce / interactive chat loop
│   ├── checkpointer.ts     # MemorySaver checkpointing
│   ├── env.ts              # Env loader (global config + project .env)
│   ├── project-context.ts  # cwd / git / file-tree context builder
│   └── error-handler.ts    # HTTP error code formatter
├── .env                    # API keys (not committed)
├── package.json            # bin: agentic, scripts
└── tsconfig.json
```

## Google Calendar Setup

1. Go to https://console.cloud.google.com/ → Create a project (or select existing)
2. Enable **Google Calendar API** → APIs & Services → Library → search "Calendar"
3. Go to **Credentials** → Create Credentials → **OAuth 2.0 Client ID**
   - Application type: **Desktop app**
   - Name: `agentic_ai_node`
4. Copy the **Client ID** and **Client Secret**
5. Add to `.env`:

```env
GOOGLE_CALENDAR_CLIENT_ID="your_client_id.apps.googleusercontent.com"
GOOGLE_CALENDAR_CLIENT_SECRET="your_client_secret"
```

On first use of any Calendar tool, the agent will print a URL — open it, authorize, and paste back the code. Tokens are cached in `~/.agentic_ai_node/calendar-tokens.json`.

## Configuration

The LLM model and parameters can be changed in `llm/groq.ts`. Currently uses `openai/gpt-oss-120b` with temperature 0.

## License

MIT
