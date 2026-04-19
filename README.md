# DocOracle

> **Turn any PDF into a deployable AI knowledge base — with chat, citations, diagrams, and a full website.**

DocOracle processes your PDF through a structured pipeline and produces a searchable, AI-powered knowledge base with page-level citations, visual asset retrieval, glossary, and section navigation. Unlike uploading a PDF to ChatGPT or Claude, DocOracle gives you a **permanent, structured, shareable product** — not a disposable chat session.

---

## Why DocOracle?

| | Uploading to ChatGPT / Claude | DocOracle |
|---|---|---|
| **Page citations** | Vague or missing | Exact page numbers on every answer |
| **Diagrams & images** | Ignored or poorly described | Analyzed by Gemini Vision; retrieved alongside answers |
| **Large documents (200+ pages)** | Context overflow → silent content loss | Every page processed individually; nothing dropped |
| **Consistency** | Different answer each time | Deterministic retrieval from structured JSON |
| **Reusability** | Locked in one chat session | Standard JSON files — power any app, RAG system, or website |
| **Structure** | None | Auto-generated glossary, section navigator, FAQ seeds |
| **Shareable** | Private thread | Deployable website for your team, readers, or students |

---

## How It Works

```
┌──────────┐    ┌──────────────────────────────────┐    ┌─────────────────────────┐
│          │    │  Pipeline (12 Python scripts)     │    │  AI Knowledge Base      │
│  PDF in  │───▶│  • Extract text  • Vision AI      │───▶│  Website (React +       │
│          │    │  • Glossary      • RAG chunks      │    │  Express + Gemini)      │
└──────────┘    └──────────────────────────────────┘    └─────────────────────────┘
   input/                   pipeline/                          website/
```

**Stage 1 — Pipeline:** 12 Python scripts run locally, processing your PDF page by page. Outputs 4 key JSON files.

**Stage 2 — Website:** A React + Express + tRPC app that serves the knowledge base with AI chat, glossary, and navigation.

---

## Who Is This For?

Choose your path based on technical level and goal:

| # | You are… | You use… | You get… |
|---|----------|----------|----------|
| **1.1** | Anyone — no setup | [Live Demo](https://decca-oracle.manus.space) | Instant AI chat with your PDF |
| **1.2** | No-code builder (standalone site) | Pipeline + Lovable / Base44 | Your own AI knowledge base site |
| **1.3** | No-code builder (embed widget) | Pipeline + no-code tool | AI chat widget on your existing site |
| **2.1** | Full-stack developer | Pipeline + website template | Customizable AI knowledge base MVP |
| **2.2** | AI agent user (data only) | Copy-paste prompt → AI agent | Structured JSON files |
| **2.3** | AI agent user (full product) | Copy-paste prompt → AI agent | Complete deployed website |
| **2.4** | Backend / data engineer | Pipeline only | JSON data for your own system |
| **3.x** | Corporate / HR / Author | Pipeline + website (IT-assisted) | Internal or public knowledge base |
| **4–5** | Researcher / Educator | Pipeline + local website | Private AI document assistant |

> **Zero coding needed?** → Use the [Live Demo](https://decca-oracle.manus.space) (1.1) or an AI agent with the copy-paste prompts (2.2 / 2.3).

---

## Features

| Feature | Description |
|---------|-------------|
| **AI Chat with Citations** | Every answer cites exact page numbers from your document |
| **Gemini Vision Analysis** | Diagrams, tables, and photos are analyzed and indexed for retrieval |
| **Visual Asset Retrieval** | Relevant images appear automatically alongside chat responses |
| **Glossary Browser** | Alphabetical glossary with category badges and source page links |
| **Section Navigator** | Full chapter/section structure with summaries and keyword tags |
| **Image Explanation** | AI-generated visual summaries for complex answers |
| **Dark / Light Theme** | Toggle between display modes |
| **PDF Upload Demo** | Built-in interface to process and explore a new PDF |

---

## Quick Start (Developers)

> For **User Types 2.1 and 2.4**. Non-technical users: see [Who Is This For?](#who-is-this-for) above.

### Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| Python | 3.9+ | Pipeline scripts |
| Node.js | 18+ | Website |
| pdftotext (poppler-utils) | any | PDF text extraction |
| Gemini API Key | — | Vision + chat ([Get free key](https://aistudio.google.com/app/apikey)) |

### Steps

```bash
# 1. Clone and enter the repo
git clone https://github.com/dev-james0723/DocOracle.git
cd DocOracle

# 2. Place your PDF
cp /path/to/your/book.pdf input/

# 3. Install Python dependencies
pip install -r pipeline/requirements.txt

# 4. Set your API key
export GEMINI_API_KEY="your-gemini-api-key"

# 5. Run the full pipeline
bash pipeline/run_all.sh
```

**Processing time estimates:**

| Pages | Estimated Time |
|-------|----------------|
| 50    | ~15 min        |
| 200   | ~1 hour        |
| 500   | ~3 hours       |

```bash
# 6. Copy output files to the website and launch
cp output/05_retrieval/page_chunks.jsonl        website/server/data/
cp output/04_gold_master/glossary.json          website/server/data/
cp output/04_gold_master/sections.json          website/server/data/
cp output/10_visual_assets/visual_assets_index.json  website/server/data/visual_assets.json

cd website && npm install && npm run dev
# Open http://localhost:3000
```

---

## Using DocOracle with AI Agents

Prefer not to run scripts yourself? Copy a ready-made prompt into any capable AI agent and attach your PDF.

| Prompt | Use Case | File |
|--------|----------|------|
| **Prompt A** | Pipeline only → get JSON files | [`docs/PROMPT_PIPELINE_ONLY.md`](docs/PROMPT_PIPELINE_ONLY.md) |
| **Prompt B** | Pipeline + full website, end-to-end | [`docs/PROMPT_PIPELINE_AND_WEBSITE.md`](docs/PROMPT_PIPELINE_AND_WEBSITE.md) |

**Supported agents:** Manus AI, Claude (Projects / Artifacts), ChatGPT (Code Interpreter), Cursor, Open Claw, Claude Cowork.

For agents that support skill files (e.g. Manus AI), load [`SKILL.md`](SKILL.md) from the repo root.

---

## Pipeline Steps

12 Python scripts run sequentially via `run_all.sh`:

```
01 → Classify pages (text / diagram / photo / mixed)
02 → Generate per-page records with Gemini Vision
03 → Merge text extraction + vision analysis → gold-master records
04 → Build visual summaries for high-risk visual pages
05 → Build chapter/section structure + glossary
06 → Generate FAQ seeds
07 → Create RAG-optimized retrieval chunks
08 → Generate 80+ evaluation questions
09 → Identify all visual pages
10 → Extract visual assets as individual images
11 → Pair each visual asset with descriptive metadata
12 → Build URL mapping for web display
```

---

## Output Structure

```
output/
├── 04_gold_master/
│   ├── glossary.json            ← KEY: all technical terms
│   └── sections.json            ← KEY: chapter/section structure
├── 05_retrieval/
│   └── page_chunks.jsonl        ← KEY: searchable RAG chunks
└── 10_visual_assets/
    └── visual_assets_index.json ← KEY: diagram metadata + tags
```

These **4 key files** power the entire website. All other outputs are supplementary.

**Sample formats:**

```jsonc
// page_chunks.jsonl — one chunk per line
{ "page": 45, "chapter": "Chapter 2: Studio Techniques",
  "text": "The control room should ideally be...", "has_visual": false }

// glossary.json
{ "term": "Decca Tree", "definition": "A three-microphone array...",
  "category": "Microphone Techniques", "pages": [192, 193, 194] }

// visual_assets_index.json
{ "page": 120, "type": "diagram",
  "description": "Piano recording setup showing two spaced microphones...",
  "retrieval_tags": ["piano", "microphone placement", "spaced pair"] }
```

---

## Cost Estimate

| PDF Size | Gemini Free Tier | Gemini Paid | OpenAI GPT-4o |
|----------|-----------------|-------------|---------------|
| 50 pages | Free (within limits) | ~$1–2 | ~$3–5 |
| 200 pages | ~3–4 days (rate-limited) | ~$5–10 | ~$15–25 |
| 500 pages | ~9–10 days (rate-limited) | ~$10–20 | ~$30–50 |

> The Gemini free tier allows ~50 vision requests/day. Use the paid tier for faster processing.

---

## Configuration

Copy `pipeline/config.yaml` → `pipeline/config.local.yaml` and edit:

```yaml
llm:
  provider: "gemini"          # or "openai", "anthropic"
  api_key: ""                 # or set GEMINI_API_KEY env var
  vision_model: "gemini-2.5-flash"

pipeline:
  max_pages: 0                # 0 = process all pages
  image_dpi: 200
  concurrency: 5
```

---

## Integrating the JSON Output Into Your Own App

The pipeline output is standard JSON, readable by any language (Python, PHP, Java, Go, Ruby…).

| Integration point | File | Usage |
|-------------------|------|-------|
| Search | `page_chunks.jsonl` | Keyword or semantic search over chunks |
| Chat (RAG) | `page_chunks.jsonl` | Send matching chunks as LLM context |
| Visual retrieval | `visual_assets_index.json` | Find and display relevant diagrams |
| Glossary tooltips | `glossary.json` | Term definitions inline |
| Navigation | `sections.json` | Chapter / section structure |

---

## Project Structure

```
DocOracle/
├── pipeline/          # 12 Python scripts + run_all.sh + config.yaml
├── website/           # React (client) + Express/tRPC (server)
├── docs/              # Prompts and guides
│   ├── PROMPT_PIPELINE_ONLY.md
│   └── PROMPT_PIPELINE_AND_WEBSITE.md
├── sample_output/     # Example JSON outputs
├── input/             # Place your PDF here
├── SKILL.md           # AI agent instruction file
└── README.md
```

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m 'Add your feature'`
4. Push and open a Pull Request

Please open an issue first to discuss significant changes.

---

## License

MIT License — see [LICENSE](LICENSE).

> DocOracle is a tool for documents you have legal rights to process. Never upload copyrighted material without permission.

---

## Acknowledgements

Built with [Google Gemini](https://ai.google.dev/) · [React](https://react.dev/) · [Tailwind CSS](https://tailwindcss.com/) · [Express](https://expressjs.com/) · [tRPC](https://trpc.io/) · [poppler-utils](https://poppler.freedesktop.org/)

---

<p align="center"><strong>DocOracle</strong> — Because every document deserves to be understood.</p>
