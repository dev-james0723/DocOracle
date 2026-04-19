# DocOracle — AI Agent Prompt: Pipeline + Website (End-to-End)

> **What this prompt does:** When you paste this prompt into an AI agent (Manus AI, Open Claw, Claude Cowork, etc.) and attach your PDF, the agent will execute the full DocOracle pipeline AND build a complete, deployable AI knowledge base website — all in one session.
>
> **If you only need the JSON data files** (no website), use [`PROMPT_PIPELINE_ONLY.md`](PROMPT_PIPELINE_ONLY.md) instead.

---

## How to Use

1. Open a capable AI agent that can create files and build web applications (Manus AI, Open Claw, Claude Cowork, Cursor, etc.)
2. Copy the entire prompt below (everything inside the code fence)
3. Paste it as your first message
4. Attach your PDF file to the same message
5. Send and wait for the agent to complete both the pipeline and the website

---

## The Prompt

Copy everything below this line and paste it into your AI agent:

---

```
You are an autonomous document-ingestion and web-development agent. Your job is to take the attached PDF and complete TWO major tasks end-to-end:

TASK A: Execute the full DocOracle pipeline to transform the PDF into structured JSON data.
TASK B: Build a complete, interactive AI knowledge base website powered by that data.

Do not stop after Task A. You must complete both tasks.

## TASK A: Pipeline (PDF → Structured JSON)

Turn the attached PDF into a high-fidelity, citation-ready, multimodal knowledge base.

### Non-Negotiable Rules

1. Fidelity over elegance — preserve the source material exactly as it appears
2. Citability over fluency — every claim must trace back to a specific page
3. Completeness over prettiness — process EVERY page, even difficult ones
4. Never invent missing content — if it is not in the PDF, do not fabricate it
5. Maintain page boundaries — never merge content across pages
6. Use vision models for visual content — text extraction alone is insufficient for diagrams
7. Work autonomously — do not stop until both tasks are complete

### Pipeline Output Structure

Create the following folder structure:

PDF_PROJECT_OUTPUT/
├── 00_source/
│   ├── source.pdf
│   └── document_manifest.json
├── 01_inventory/
│   └── page_inventory.json
├── 02_page_records/
│   ├── page_0001.json ... page_NNNN.json
├── 03_visual_reviews/
│   └── high_risk_pages_summary.md
├── 04_gold_master/
│   ├── glossary.json                 # KEY FILE: terms, definitions, categories, pages
│   ├── sections.json                 # KEY FILE: chapter hierarchy, summaries, keywords
│   └── faq_seeds.json
├── 05_retrieval/
│   ├── page_chunks.jsonl             # KEY FILE: one JSON line per page chunk
│   └── section_chunks.jsonl
├── 06_eval/
│   └── eval_questions.json           # 80+ evaluation questions
├── 07_skill/
│   ├── document_skill.md
│   └── document_skill_system_prompt.txt
└── 10_visual_assets/
    ├── visual_assets_index.json      # KEY FILE: all visual assets with retrieval tags
    ├── diagrams/
    ├── tables/
    ├── photos/
    └── mixed/

### Pipeline Steps (Execute in Order)

1. **Source Ingestion**: Save PDF, create document_manifest.json with metadata
2. **Page Inventory**: Classify every page (text/diagram/photo/mixed/table), assess extraction risk
3. **Page Records**: For every page, create a JSON record with raw_text, markdown, tables, captions, visual_description, keywords, summary
4. **Visual Review**: Analyze visual-heavy pages with vision model for spatial relationships, labels, structures
5. **Gold-Master**: Merge all data, build glossary.json, sections.json, faq_seeds.json
6. **Retrieval Layer**: Create page_chunks.jsonl and section_chunks.jsonl for RAG
7. **Evaluation Set**: Generate 80+ evaluation questions
8. **System Prompt**: Generate document_skill_system_prompt.txt
9. **Visual Assets**: Extract images, create paired metadata JSON, build visual_assets_index.json

### Key Data Formats

page_chunks.jsonl (one JSON per line):
{"chunk_id": "page_045", "page_number": 45, "section_path": "Chapter 2 > Studio Techniques", "keywords": ["control room", "acoustics"], "chunk_text": "The control room should...", "has_visual": false}

glossary.json:
[{"term": "Term Name", "definition": "Definition...", "category": "Category", "pages": [10, 11, 12]}]

visual_assets_index.json:
[{"page": 120, "type": "diagram", "description": "Detailed description...", "retrieval_tags": ["tag1", "tag2"], "confidence": "high"}]

---

## TASK B: Website (JSON Data → Interactive AI Knowledge Base)

After completing the pipeline, build a full-stack web application that serves the knowledge base.

### Required Website Features

1. **Landing Page** — Introduce the knowledge base with a professional design. Include navigation to Chat, Glossary, and Sections pages. Show 5 suggested prompt buttons that users can click to start a conversation.

2. **AI Chat Interface** — The core feature. Users type questions and receive answers that are:
   - Grounded in the document (using retrieved page chunks as context)
   - Cited with specific page numbers (e.g., "According to page 45...")
   - Accompanied by relevant diagrams/tables when available (matched via retrieval tags from visual_assets_index.json)

3. **Visual Asset Retrieval** — When a user's question matches a diagram, table, or photo (via retrieval tag matching), display the visual asset alongside the answer. This is critical for spatial/technical questions.

4. **Glossary Browser** — Display all terms from glossary.json with:
   - Alphabetical filtering (A-Z letter buttons)
   - Category badges
   - Page references for each term

5. **Section Navigator** — Display the book structure from sections.json with:
   - Chapter and section hierarchy
   - Summaries for each section
   - Keyword tags

6. **"Turn into Image Explanation" Button** — After complex answers, show a button that uses AI image generation to create a visual summary of the answer.

7. **Dark/Light Theme Toggle** — Support both themes with a toggle button.

8. **Responsive Design** — Work on desktop and mobile.

### Website Architecture

Frontend: React + Tailwind CSS (or similar modern framework)
Backend: Express + tRPC (or similar API framework)
LLM: Use any available LLM API (Gemini, GPT-4, Claude, etc.)

The backend must:
- Load the 4 key JSON files at startup
- Implement keyword-based search with weighted fields:
  - Retrieval tags (3x weight) — most important for visual asset matching
  - Keywords (2x weight)
  - Section path (1.5x weight)
  - Full text (1x weight)
- For each chat query: search for relevant chunks (top 8) + visual assets (top 4), construct a prompt with system prompt + evidence + question, send to LLM, return answer + citations + matched visuals

### Website Data Files

The website needs these 4 files from the pipeline output:
- page_chunks.jsonl → load as the searchable text corpus
- glossary.json → load for the glossary page and term tooltips
- sections.json → load for the section navigator
- visual_assets_index.json → load for visual asset retrieval in chat

Plus the system prompt:
- document_skill_system_prompt.txt → use as the system prompt for chat

### Suggested Prompts

Generate 5 suggested prompt buttons based on the document's content. These should be interesting, representative questions that showcase the knowledge base's capabilities. Display them on the landing page and/or the chat page.

## Operating Instructions

- Work autonomously from start to finish. Complete BOTH Task A and Task B.
- Process the pipeline in parallel batches where possible.
- Use text extraction first, then vision model for visual-heavy pages.
- If context limits are reached, continue in batches and merge at the end.
- After building the website, verify it works by testing at least 3 different questions.
- When finished, provide: (1) summary of what was completed, (2) location of the output folder, (3) URL or instructions to access the website, (4) top 5 pages requiring human review, (5) 3 example questions you tested and their results.
```

---

## After Completion

The AI agent will produce:

1. **`PDF_PROJECT_OUTPUT/` folder** — All structured JSON data files from the pipeline
2. **A working website** — An interactive AI knowledge base with chat, glossary, sections, and visual asset retrieval

The 4 key JSON files that power the website are:

| File | Location | Purpose |
|------|----------|---------|
| `page_chunks.jsonl` | `05_retrieval/` | Searchable text chunks with page citations |
| `glossary.json` | `04_gold_master/` | Technical terms with definitions and page references |
| `sections.json` | `04_gold_master/` | Chapter/section hierarchy with summaries |
| `visual_assets_index.json` | `10_visual_assets/` | Diagram/table/photo metadata with retrieval tags |

---

## Tips for Best Results

Different AI agents have different strengths. Here are recommendations:

| AI Agent | Recommendation |
|----------|---------------|
| **Manus AI** | Best for end-to-end execution. Can handle both pipeline and website deployment autonomously. |
| **Claude Cowork** | Excellent at following structured prompts. May need manual deployment step. |
| **Open Claw** | Good for pipeline execution. Website building depends on available tools. |
| **Cursor** | Best used after the pipeline is complete — paste the JSON files and ask it to build the website. |
| **ChatGPT** | Can execute the pipeline with Code Interpreter. Website building is limited — consider using the pipeline output with a separate tool. |
