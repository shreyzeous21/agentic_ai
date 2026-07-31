# Using `agentic` in any project

`agentic` is a global CLI AI assistant. It is **not** installed inside your project — you run it from inside any project folder, and it works on that folder's files, git state, and terminal commands. When you're done, you just stop using it; nothing is added to your project.

---

## 1. Install it once (one-time setup)

From the `agentic_ai_node` folder:

```bash
bun install
bun link        # makes the `agentic` command available everywhere
```

Verify it works from anywhere:

```bash
agentic --version   # prints 1.0.0
```

---

## 2. Set up your API keys (one-time setup)

Keys are read from (highest priority first):

1. Your shell environment variables
2. The current project's `.env`
3. The global file `~/.config/agentic/.env`

The recommended setup is the global file, so keys work in every project:

```bash
mkdir -p ~/.config/agentic
cp agentic_ai_node/.env ~/.config/agentic/.env   # edit with your real keys
```

Example `~/.config/agentic/.env`:

```env
GROQ_API_KEY="your_groq_api_key"
TAVILY_API_KEY="your_tavily_api_key"        # or WEB_SEARCH_API
OPENROUTER_API_KEY="your_openrouter_api_key"
GOOGLE_API_KEY="your_google_api_key"
GMAIL_USER="your.email@gmail.com"           # or NODEMAILER_USER
GMAIL_APP_PASSWORD="your_app_password"      # or NODEMAILER_APP_PASSWORD
GOOGLE_CALENDAR_CLIENT_ID="..."
GOOGLE_CALENDAR_CLIENT_SECRET="..."
```

> If a project has its own `.env`, its values take priority over the global file for that folder.

---

## 3. Use it in any project

`cd` into the project you want the agent to work on, then run:

```bash
cd /path/to/my-project

agentic                                  # interactive chat in this folder
agentic "explain this repo" -c           # one-shot question with project context
agentic -c                               # interactive chat with project context
echo "question" | agentic                # pipe a question or file content
cat src/App.tsx | agentic "explain this" # pipe a file and ask about it
agentic --cwd /other/project "question"  # work on a different folder without cd
agentic --help                           # all options
```

### What the `-c` / `--context` flag does

Injects a summary of the current project into the prompt:

- current directory path
- git branch and `git status`
- top-level files and directories
- `package.json` name, scripts, and dependencies

### Example: use the agent inside a real project

```bash
cd ~/Desktop/projects/my-app

# Ask it to inspect and explain the repo
agentic "what does this project do and how is it structured?" -c

# Ask it to do things with files/terminal in THIS folder
agentic "list all TODO comments in the src folder" -c
agentic "run git status and summarize what changed" -c
agentic "fix the lint errors, then run the tests" -c
```

The file and terminal tools always operate on the folder you run `agentic` from, not on the agent's own folder.

---

## 4. Interactive chat

```bash
agentic
```

You'll see:

```
🤖 Agentic AI Assistant
---------------------------
• Press Esc or Ctrl+C to exit
• Working in: /path/to/my-project
• Multi Provider (Groq → OpenRouter → Gemini)

❯ You ›
```

Type naturally. The agent decides which tools to use. Press **Esc** or **Ctrl+C** to exit.

---

## 5. Remove it when you don't need it anymore

Nothing is stored in your project, so there's nothing to clean up there. To uninstall the tool from your machine entirely:

```bash
bun unlink agentic_ai_node
rm -rf ~/.config/agentic
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `Tavily API key not found` | Add `TAVILY_API_KEY` (or `WEB_SEARCH_API`) to `~/.config/agentic/.env` |
| `Missing GROQ_API_KEY...` | Same — keys live in `~/.config/agentic/.env`, not in the project |
| `Rate limit exceeded` on OpenRouter | Free daily quota exhausted; the agent auto-falls back to Groq/Gemini |
| `command not found: agentic` | Run `bun link` again inside the `agentic_ai_node` folder |
| Calendar tools fail | Complete the Google Calendar OAuth setup once (tokens cached in `~/.agentic_ai_node/calendar-tokens.json`) |
