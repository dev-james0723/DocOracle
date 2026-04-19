# DocOracle — AI Agent Skill Definition

> **Purpose:** This file provides structured instructions for AI agents (Manus AI, Open Claw, Claude Cowork, etc.) to understand and execute the DocOracle pipeline. Load this file as a skill or system instruction to enable autonomous PDF-to-Knowledge-Base processing.

---

## Skill Metadata

| Field | Value |
|-------|-------|
| **Skill Name** | DocOracle Pipeline |
| **Version** | 2.0 |
| **Description** | Transform any PDF into a structured, citation-ready AI knowledge base with visual asset analysis |
| **Input** | One PDF file (any size, any language) |
| **Output** | `PDF_PROJECT_OUTPUT/` folder with structured JSON data files |
| **Required Tools** | File system access, Python 3.9+, pdftotext (poppler-utils), Gemini API key (or equivalent vision model) |
| **Estimated Time** | 15 min (50 pages) to 4 hours (500 pages) |
| **License** | MIT |

---

## When to Use This Skill

Activate this skill when the user:

- Asks to "process a PDF" or "build a knowledge base from a PDF"
- Uploads a PDF and asks for structured data extraction
- Wants to create an AI-powered Q&A system from a document
- Mentions "DocOracle" by name
- Asks for page-level citations, glossary extraction, or visual asset analysis from a PDF

---

## Core Principles

1. **Fidelity over elegance** — Preserve the source material exactly as it appears in the PDF.
2. **Citability over fluency** — Every extracted claim must trace back to a specific page number.
3. **Completeness over prettiness** — Process every single page, including difficult ones with handwriting, dense diagrams, or poor scan quality.
4. **Never invent content** — If information is not in the PDF, do not fabricate it. Mark uncertainty explicitly.
5. **Maintain page boundaries** — Never merge content from different pages into a single record.
6. **Multimodal processing** — Use vision models (Gemini Vision, GPT-4V) for pages containing diagrams, tables, charts, photos, or any visual content. Text extraction alone is insufficient.

---

## Pipeline Steps

Execute these steps in order. Do not skip any step. Do not stop until all steps are complete.

### Step 1: Source Ingestion
- Save the PDF to `PDF_PROJECT_OUTPUT/00_source/source.pdf`
- Create `document_manifest.json` with: filename, total_pages, estimated_document_type, detected_languages, visual_density_overview, extraction_risk_overview, likely_structure, handling_strategy

### Step 2: Page Inventory
- For EVERY page, create one entry in `01_inventory/page_inventory.json`
- Fields: page_number, page_type (text/diagram/photo/mixed/table/chart/cover/toc/appendix), has_table, has_chart, has_diagram, has_photo, extraction_risk (low/medium/high), short_observation
- Use text extraction to get raw text, then classify by text density (pages under 100 bytes are likely visual-heavy)

### Step 3: Page-Level Records
- For EVERY page, create `02_page_records/page_NNNN.json` (zero-padded)
- Fields: page_number, page_type, section_heading_guess, raw_text_full, layout_preserving_markdown, tables_extracted, captions, footnotes, observed_visual_description, interpreted_page_meaning, uncertainties, keywords, page_summary_strict

### Step 4: Visual Review
- For every page with medium/high extraction risk OR visual content, perform vision model analysis
- Focus on: spatial relationships, embedded labels, handwritten content, table structures, diagram flow
- Save findings in `03_visual_reviews/high_risk_pages_summary.md`

### Step 5: Gold-Master Consolidation
- Merge inventory + page records + visual reviews into authoritative records
- Build `04_gold_master/glossary.json`: terms with definitions, categories, page references
- Build `04_gold_master/sections.json`: chapter/section hierarchy with page ranges, summaries, keywords
- Build `04_gold_master/faq_seeds.json`: 30+ realistic user questions with relevant pages

### Step 6: Retrieval Layer
- Create `05_retrieval/page_chunks.jsonl`: one JSON line per page with chunk_id, page_number, section_path, keywords, chunk_text, has_visual
- Create `05_retrieval/section_chunks.jsonl`: section-level chunks for broader context

### Step 7: Evaluation Set
- Generate 80+ questions in `06_eval/eval_questions.json`
- Cover: direct fact lookup, cross-page reasoning, image interpretation, table reading, glossary definitions, refusal/no-evidence

### Step 8: System Prompt
- Generate `07_skill/document_skill.md`: role definition, retrieval rules, citation rules, refusal rules
- Generate `07_skill/document_skill_system_prompt.txt`: production-ready system prompt

### Step 9: Visual Asset Extraction
- For every page with diagrams, tables, charts, or photos:
  - Extract the page as a high-resolution image (300 DPI PNG)
  - Analyze with vision model to produce detailed description
  - Create paired metadata JSON with: page_number, visual_type, description, spatial_relationships, keywords, retrieval_tags, confidence_level
- Organize into `10_visual_assets/` with subdirectories: diagrams/, tables/, photos/, mixed/
- Build `10_visual_assets/visual_assets_index.json` as the master index

---

## Key Output Files

The 4 most important output files (used by the website and most integrations):

| File | Path | Format | Description |
|------|------|--------|-------------|
| Page Chunks | `05_retrieval/page_chunks.jsonl` | JSONL (one object per line) | Searchable text chunks with page citations |
| Glossary | `04_gold_master/glossary.json` | JSON array | Technical terms with definitions, categories, pages |
| Sections | `04_gold_master/sections.json` | JSON array | Chapter/section hierarchy with summaries |
| Visual Assets | `10_visual_assets/visual_assets_index.json` | JSON array | All visual assets with descriptions and retrieval tags |

---

## Search Implementation (for Website or RAG Integration)

When building a search/retrieval system on top of the output, use keyword-based scoring with weighted fields:

| Field | Weight | Source |
|-------|--------|--------|
| Retrieval tags | 3x | visual_assets_index.json |
| Keywords | 2x | page_chunks.jsonl |
| Section path | 1.5x | page_chunks.jsonl |
| Full text | 1x | page_chunks.jsonl |

Search across all data sources simultaneously: page chunks, section chunks, visual assets, and glossary.

---

## Chat Prompt Construction (for AI Chat Integration)

For each user question:

1. Search the knowledge base for relevant page chunks (top 8 matches)
2. Search for relevant visual assets (top 4 matches)
3. Construct a prompt: system prompt + retrieved evidence + visual asset descriptions + user question
4. Send to LLM (Gemini, GPT-4, Claude, etc.)
5. Parse response for citations and complexity
6. Return: answer + page citations + matched visual assets

---

## Error Handling

- If a page is unreadable, create a record with `uncertainties` field explaining what could not be extracted
- If the vision model fails on a page, fall back to text-only extraction and flag the page for human review
- If the PDF exceeds processing limits, split into batches and merge outputs at the end
- Never silently skip pages — every page must have a record in the output

---

## Completion Checklist

Before reporting completion, verify:

- [ ] Every page has an entry in page_inventory.json
- [ ] Every page has a record in 02_page_records/
- [ ] glossary.json contains at least 20 terms (for documents over 100 pages)
- [ ] sections.json reflects the document's actual structure
- [ ] page_chunks.jsonl has one entry per page
- [ ] eval_questions.json has 80+ questions
- [ ] visual_assets_index.json indexes all visual pages
- [ ] document_skill_system_prompt.txt is a valid, production-ready prompt

---

## References

- **Full Pipeline Documentation:** See `docs/PIPELINE_PROMPT.md` in the DocOracle repository
- **Website Source Code:** See `website/` directory for a reference implementation
- **Sample Output:** See `sample_output/` directory for example data formats
- **Repository:** [github.com/dev-james0723/DocOracle](https://github.com/dev-james0723/DocOracle)
