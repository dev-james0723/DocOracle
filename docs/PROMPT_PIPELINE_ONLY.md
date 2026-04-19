# DocOracle — AI Agent Prompt: Pipeline Only

> **What this prompt does:** When you paste this prompt into an AI agent (ChatGPT, Claude, Manus AI, Open Claw, etc.) and attach your PDF, the agent will execute the full DocOracle pipeline and produce a `PDF_PROJECT_OUTPUT/` folder containing all structured JSON data files — page chunks, glossary, sections, visual assets, evaluation questions, and a system prompt.
>
> **What this prompt does NOT do:** It does not build a website. If you also want a website, use [`PROMPT_PIPELINE_AND_WEBSITE.md`](PROMPT_PIPELINE_AND_WEBSITE.md) instead.

---

## How to Use

1. Open your preferred AI agent (ChatGPT with Code Interpreter, Claude with Projects, Manus AI, Open Claw, etc.)
2. Copy the entire prompt below (everything inside the code fence)
3. Paste it as your first message
4. Attach your PDF file to the same message
5. Send and wait for the agent to complete the pipeline

---

## The Prompt

Copy everything below this line and paste it into your AI agent:

---

```
You are an autonomous document-ingestion agent. Your job is to take the attached PDF and execute the complete DocOracle pipeline end-to-end, producing a structured `PDF_PROJECT_OUTPUT/` folder with all deliverables.

## Your Mission

Turn the attached PDF into a high-fidelity, citation-ready, multimodal knowledge base. The output must be able to:

1. Answer user questions grounded in the PDF with page-level citations
2. Retrieve and display relevant diagrams, tables, and images alongside answers
3. Generate a reusable system prompt for any LLM
4. Provide structured JSON data readable by any programming language

## Non-Negotiable Rules

1. Fidelity over elegance — preserve the source material exactly as it appears
2. Citability over fluency — every claim must trace back to a specific page
3. Completeness over prettiness — process EVERY page, even difficult ones
4. Never invent missing content — if it is not in the PDF, do not fabricate it
5. Maintain page boundaries — never merge content across pages
6. Use vision models for visual content — text extraction alone is insufficient for diagrams
7. Work autonomously — do not stop until the entire pipeline is complete

## Output Structure

Create the following folder structure:

PDF_PROJECT_OUTPUT/
├── 00_source/
│   ├── source.pdf                    # Copy of the original PDF
│   └── document_manifest.json        # Metadata: filename, total_pages, document_type, language, visual_density, risks
├── 01_inventory/
│   └── page_inventory.json           # One object per page: page_number, page_type, has_diagram, has_table, has_photo, extraction_risk, short_observation
├── 02_page_records/
│   ├── page_0001.json                # Per-page record: raw_text, markdown, tables, captions, visual_description, keywords, summary
│   ├── page_0002.json
│   └── ...                           # One file per page (zero-padded)
├── 03_visual_reviews/
│   └── high_risk_pages_summary.md    # Visual analysis for diagram/photo/table pages
├── 04_gold_master/
│   ├── glossary.json                 # Technical terms with definitions, categories, and page references
│   ├── sections.json                 # Chapter/section hierarchy with page ranges, summaries, keywords
│   └── faq_seeds.json                # 30+ realistic user questions with relevant pages and answerability
├── 05_retrieval/
│   ├── page_chunks.jsonl             # One JSON object per line — page-level chunks for RAG
│   └── section_chunks.jsonl          # Section-level chunks for broader context retrieval
├── 06_eval/
│   └── eval_questions.json           # 80+ evaluation questions covering all question types
├── 07_skill/
│   ├── document_skill.md             # Role definition, retrieval rules, citation rules, refusal rules
│   └── document_skill_system_prompt.txt  # Production-ready system prompt for any LLM
└── 10_visual_assets/
    ├── visual_assets_index.json      # Master index of all visual assets with descriptions and retrieval tags
    ├── diagrams/                     # Extracted diagram images + paired metadata JSON
    ├── tables/                       # Extracted table images + paired metadata JSON
    ├── photos/                       # Extracted photo images + paired metadata JSON
    └── mixed/                        # Mixed content images + paired metadata JSON

## Processing Steps (Execute in Order)

### Step 1: Source Ingestion
Save the PDF to `00_source/`. Create `document_manifest.json` with: filename, total_pages, estimated_document_type, detected_languages, visual_density_overview, extraction_risk_overview, likely_structure, handling_strategy.

### Step 2: Page Inventory
For EVERY page, classify it and create one entry in `page_inventory.json` with: page_number, page_type (text/diagram/photo/mixed/table/chart/cover/toc/appendix), has_table, has_chart, has_diagram, has_photo, extraction_risk (low/medium/high), short_observation.

### Step 3: Page-Level Records
For EVERY page, create `page_NNNN.json` with: page_number, page_type, section_heading_guess, raw_text_full, layout_preserving_markdown, tables_extracted, captions, footnotes, observed_visual_description, interpreted_page_meaning, uncertainties, keywords, page_summary_strict.

### Step 4: Visual Review
For every page with medium/high extraction risk OR visual content, perform vision model analysis. Focus on spatial relationships, embedded labels, handwritten content, table structures, and diagram flow. Document findings in `high_risk_pages_summary.md`.

### Step 5: Gold-Master Consolidation
Merge inventory + page records + visual reviews into authoritative per-page records. Build `glossary.json` (terms, definitions, categories, pages), `sections.json` (hierarchy, page ranges, summaries, keywords), and `faq_seeds.json`.

### Step 6: Retrieval Layer
Create `page_chunks.jsonl` — one JSON line per page with: chunk_id, page_number, section_path, keywords, chunk_text, has_visual. Create `section_chunks.jsonl` for section-level retrieval.

### Step 7: Evaluation Set
Generate 80+ evaluation questions in `eval_questions.json` covering: direct fact lookup, cross-page reasoning, image/diagram interpretation, table reading, glossary definitions, and refusal/no-evidence scenarios.

### Step 8: System Prompt
Generate `document_skill.md` (role definition, rules) and `document_skill_system_prompt.txt` (production-ready prompt that forces citation, prevents hallucination, handles uncertainty).

### Step 9: Visual Asset Extraction
For every page with diagrams, tables, charts, or photos: extract the page as a high-resolution image, analyze it with a vision model, create a paired metadata JSON with: page_number, visual_type, description, spatial_relationships, keywords, retrieval_tags, confidence_level. Build `visual_assets_index.json` as the master index.

## Key Data Formats

### page_chunks.jsonl (one JSON object per line):
{"chunk_id": "page_045", "page_number": 45, "section_path": "Chapter 2 > Studio Techniques", "keywords": ["control room", "acoustics"], "chunk_text": "The control room should ideally be...", "has_visual": false}

### glossary.json:
[{"term": "Decca Tree", "definition": "A three-microphone array...", "category": "Microphone Techniques", "pages": [192, 193, 194]}]

### visual_assets_index.json:
[{"page": 120, "type": "diagram", "description": "Piano recording setup...", "retrieval_tags": ["piano", "microphone placement", "spaced pair"], "confidence": "high"}]

## Operating Instructions

- Work autonomously from start to finish. Do not stop after inventory or summary.
- Process in parallel batches where possible (page extraction, visual analysis).
- Use text extraction first (pdftotext or equivalent), then vision model for visual-heavy pages.
- If context limits are reached, continue in batches and merge at the end.
- Prioritize visual analysis for high-risk pages before text-heavy pages.
- When finished, provide: (1) a summary of what was completed, (2) the location of the output folder, (3) top 5 pages requiring human review, (4) the recommended next step.
```

---

## After the Pipeline Completes

The AI agent will produce a `PDF_PROJECT_OUTPUT/` folder. The **4 key files** you need for most use cases are:

| File | Location | Purpose |
|------|----------|---------|
| `page_chunks.jsonl` | `05_retrieval/` | Searchable text chunks with page citations |
| `glossary.json` | `04_gold_master/` | Technical terms with definitions and page references |
| `sections.json` | `04_gold_master/` | Chapter/section hierarchy with summaries |
| `visual_assets_index.json` | `10_visual_assets/` | Diagram/table/photo metadata with retrieval tags |

These files are standard JSON and can be read by any programming language or imported into any system.
