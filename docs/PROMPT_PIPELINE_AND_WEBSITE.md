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

9. **Gemini Web Search Fallback** — CRITICAL FEATURE. See full specification below.

### Feature 9: Gemini Web Search Fallback (Detailed Specification)

This feature handles the case where the document does not contain enough information to answer the user's question. Instead of leaving the user with a dead end, the chat interface offers to search the web using Gemini's grounding/web search capability.

#### How It Works (User Flow)

Step 1 — The AI attempts to answer from the document as normal.

Step 2 — If the retrieved evidence is insufficient (confidence below threshold, or the answer explicitly states "the document does not specify" / "not mentioned in the text"), the chat UI automatically displays a consent prompt BELOW the document-based answer:

```
┌─────────────────────────────────────────────────────────────┐
│  The document doesn't fully cover this topic.               │
│                                                             │
│  Would you like me to search the web for related           │
│  information outside this document?                         │
│                                                             │
│  [  Search the Web  ]     [  No, thanks  ]                  │
│                                                             │
│  Note: Web results are from external sources and may        │
│  not reflect the views or accuracy of this document.        │
└─────────────────────────────────────────────────────────────┘
```

Step 3 — If the user clicks "Search the Web":
- Call Gemini API with `google_search` tool enabled (grounding)
- Pass both the original question AND a summary of what the document DID say as context
- The prompt to Gemini should be: "The user is reading [document title]. The document says: [brief summary of what was found]. The user wants to know: [original question]. Please search the web for related information and provide a helpful answer, noting which parts come from external sources."
- Display the web search result in a visually distinct panel (different background color or border) with a clear label: "From Web Search (External Sources)"
- Show the Gemini grounding citations (URLs) as clickable links

Step 4 — If the user clicks "No, thanks": dismiss the consent prompt and show nothing further.

#### Detection Logic (How to Detect "Document Cannot Answer")

The backend should flag a response as "insufficient" when ANY of the following are true:
- The LLM response contains phrases like: "the document does not specify", "not mentioned in the text", "the provided text does not", "no information about", "cannot be determined from", "not covered in this document"
- The retrieval search returns fewer than 3 matching chunks with confidence above 0.3
- The top-scoring chunk has a relevance score below 0.25

When flagged, set `webSearchAvailable: true` in the API response. The frontend reads this flag and renders the consent prompt.

#### Backend Implementation

Add a new API endpoint or tRPC procedure: `chat.searchWeb`

```
Input:
  - originalQuestion: string
  - documentContext: string  (what the document DID say, if anything)
  - documentTitle: string

Process:
  1. Construct a grounded search prompt combining document context + question
  2. Call Gemini API with tools: [{ googleSearch: {} }]
  3. Extract the response text and grounding metadata (source URLs, titles)
  4. Return: { answer: string, sources: [{title, url, snippet}] }

Output:
  - answer: string (Gemini's web-grounded response)
  - sources: array of { title: string, url: string, snippet: string }
  - disclaimer: "Results from external web sources. Verify independently."
```

#### Frontend Implementation

In the chat component, after receiving a response with `webSearchAvailable: true`:
1. Render the normal document-based answer first
2. Below it, render the consent card (styled differently — e.g., amber/yellow border)
3. On "Search the Web" click: show a loading spinner, call `chat.searchWeb`, then render the result in a distinct "Web Results" panel with a globe icon and source links
4. On "No, thanks" click: hide the consent card with a smooth fade-out animation

#### Visual Design Guidelines

- Document answer panel: normal chat bubble style
- Consent card: amber/yellow left border, subtle background, small text explaining the limitation
- Web search result panel: blue/teal left border, globe icon (🌐) in the header, "External Sources" badge
- Source links: displayed as small chips/pills below the answer, each showing the domain name

### Website Architecture

Frontend: React + Tailwind CSS (or similar modern framework)
Backend: Express + tRPC (or similar API framework)
LLM: Gemini API (REQUIRED for web search fallback feature — see API Key Setup below)

The backend must:
- Load the 4 key JSON files at startup
- Implement keyword-based search with weighted fields:
  - Retrieval tags (3x weight) — most important for visual asset matching
  - Keywords (2x weight)
  - Section path (1.5x weight)
  - Full text (1x weight)
- For each chat query: search for relevant chunks (top 8) + visual assets (top 4), construct a prompt with system prompt + evidence + question, send to LLM, return answer + citations + matched visuals + webSearchAvailable flag

### API Key Setup (IMPORTANT — Ask the User)

Before building the website, ask the user the following question:

"This website uses the Gemini API for two features:
  1. AI chat answers grounded in your document
  2. Web search fallback when the document cannot answer a question (Feature 9)

Do you have a Gemini API key? You can get one for free at https://aistudio.google.com/app/apikey

If you have a key, please provide it now so I can configure the website. If you are using an AI agent that already includes Gemini API access natively (such as Manus AI), you may not need to provide a key — I will use the built-in API access instead."

Then:
- If the user provides a key: store it in a `.env` file as `GEMINI_API_KEY=<key>` and add `.env` to `.gitignore`
- If the user is on an agent with native Gemini access (e.g., Manus AI): use the built-in API helper without requiring a key
- If the user has no key and no native access: set up the website with a placeholder and show a clear setup instruction in the README

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
- Ask the user about their Gemini API key BEFORE building the website (see API Key Setup above).
- After building the website, verify it works by testing at least 3 different questions — including at least one question that the document cannot answer, to confirm the web search fallback triggers correctly.
- When finished, provide: (1) summary of what was completed, (2) location of the output folder, (3) URL or instructions to access the website, (4) top 5 pages requiring human review, (5) 3 example questions you tested and their results (including one web search fallback test).
```

---

## After Completion

The AI agent will produce:

1. **`PDF_PROJECT_OUTPUT/` folder** — All structured JSON data files from the pipeline
2. **A working website** — An interactive AI knowledge base with chat, glossary, sections, visual asset retrieval, and Gemini web search fallback

The 4 key JSON files that power the website are:

| File | Location | Purpose |
|------|----------|---------|
| `page_chunks.jsonl` | `05_retrieval/` | Searchable text chunks with page citations |
| `glossary.json` | `04_gold_master/` | Technical terms with definitions and page references |
| `sections.json` | `04_gold_master/` | Chapter/section hierarchy with summaries |
| `visual_assets_index.json` | `10_visual_assets/` | Diagram/table/photo metadata with retrieval tags |

---

## Feature Summary: What the Website Includes

| # | Feature | Description |
|---|---------|-------------|
| 1 | Landing Page | Professional design with navigation and 5 suggested prompts |
| 2 | AI Chat | Answers grounded in document with page citations |
| 3 | Visual Asset Retrieval | Relevant diagrams/tables shown alongside answers |
| 4 | Glossary Browser | A-Z filtering with category badges and page references |
| 5 | Section Navigator | Chapter hierarchy with summaries and keyword tags |
| 6 | Image Explanation | AI-generated visual summary of complex answers |
| 7 | Dark/Light Theme | Toggle between themes |
| 8 | Responsive Design | Works on desktop and mobile |
| **9** | **Gemini Web Search Fallback** | **When document cannot answer, offers to search the web with user consent** |

---

## About the Gemini Web Search Fallback

This feature addresses a common limitation of document-based AI systems: the document simply does not contain the answer to every possible question.

**Example scenario** (as shown in the screenshot below):

> **User asks:** "What are the brands of the mics that are recommended?"
>
> **Document-based answer:** "The provided text does not specify particular brands of microphones recommended for recording cello. It only recommends types of microphones, such as condenser, cardioid, and omnidirectional microphones (p. 90; p. 163)."
>
> **Web search fallback triggers:** The system detects the phrase "does not specify" and displays a consent card asking the user if they want to search the web for microphone brand recommendations.
>
> **If the user consents:** Gemini searches the web and returns brand-specific recommendations (e.g., Neumann, DPA, Schoeps) with source links, clearly labeled as external information.

The key principle is **user consent first** — the system never searches the web without explicitly asking the user. This respects the user's intent (they may only want information from the document) and makes the source of every answer transparent.

---

## Tips for Best Results

Different AI agents have different strengths. Here are recommendations:

| AI Agent | Recommendation |
|----------|---------------|
| **Manus AI** | Best for end-to-end execution. Includes native Gemini API access — no key needed. Can handle both pipeline and website deployment autonomously. |
| **Claude Cowork** | Excellent at following structured prompts. Will need user to provide Gemini API key for web search fallback. May need manual deployment step. |
| **Open Claw** | Good for pipeline execution. Website building depends on available tools. |
| **Cursor** | Best used after the pipeline is complete — paste the JSON files and ask it to build the website. Will prompt user for Gemini API key. |
| **ChatGPT** | Can execute the pipeline with Code Interpreter. Website building is limited — consider using the pipeline output with a separate tool. |
