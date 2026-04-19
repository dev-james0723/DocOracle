# PDF-to-AI Knowledge Base Pipeline — Open Source Prompt v2.0

> **Project**: Turn any technical PDF into a production-ready, citation-grounded, multimodal AI knowledge base with a live demo website.
>
> **Origin**: Refined through a complete end-to-end run on a 445-page professional book, processing 251 visual assets, generating 80+ evaluation questions, and deploying a live Gemini-powered chat interface.
>
> **License**: This prompt and workflow are open source. The content of the PDF you process is subject to its own copyright — see the Copyright Safety section below.

---

## Table of Contents

1. [Core Mission](#core-mission)
2. [Copyright Safety for Open Source](#copyright-safety-for-open-source)
3. [Non-Negotiable Rules](#non-negotiable-rules)
4. [Output Structure](#output-structure)
5. [Task 1: Source Ingestion](#task-1-source-ingestion)
6. [Task 2: Page Inventory](#task-2-page-inventory)
7. [Task 3: Page-Level Canonical Records](#task-3-page-level-canonical-records)
8. [Task 4: Visual Review for High-Risk Pages](#task-4-visual-review-for-high-risk-pages)
9. [Task 5: Gold-Master Page Consolidation](#task-5-gold-master-page-consolidation)
10. [Task 6: Section Map, Glossary, FAQ Seeds](#task-6-section-map-glossary-faq-seeds)
11. [Task 7: Retrieval Layer](#task-7-retrieval-layer)
12. [Task 8: Evaluation Set](#task-8-evaluation-set)
13. [Task 9: Skill / System Prompt Generation](#task-9-skill--system-prompt-generation)
14. [Task 10: Visual Asset Extraction and Indexing](#task-10-visual-asset-extraction-and-indexing)
15. [Task 11: Website-Ready Knowledge Architecture](#task-11-website-ready-knowledge-architecture)
16. [Task 12: AI Chat Website with RAG](#task-12-ai-chat-website-with-rag)
17. [Task 13: Final Report](#task-13-final-report)
18. [Operating Instructions](#operating-instructions)
19. [Lessons Learned from v1 Run](#lessons-learned-from-v1-run)

---

## Core Mission

You are an autonomous document-ingestion and knowledge-system agent. Your job is to take ONE PDF and complete the entire pipeline end-to-end with the least possible manual intervention.

Turn the attached PDF into a **high-fidelity, citation-ready, multimodal knowledge base** that can:

1. Answer user questions grounded in the PDF with page-level citations
2. Retrieve and display relevant diagrams, tables, and images alongside answers
3. Generate a reusable document skill / system prompt for any LLM
4. Power a live, interactive AI chat website with visual asset retrieval

You must NOT stop at a generic summary. You must complete the full pipeline.

---

## Copyright Safety for Open Source

> **Critical**: If you plan to publish this project on GitHub, you MUST separate "code and tools" from "copyrighted content."

### What you CAN publish openly

- This prompt document (your workflow instructions)
- All Python/TypeScript scripts used for PDF parsing, extraction, and processing
- The website source code (frontend + backend)
- The system prompt / skill definition you generate
- Architecture diagrams and documentation you create
- The evaluation question set (questions only, not book excerpts)

### What you MUST NOT publish

- The original PDF
- JSON files containing the book's full text (page_chunks, gold_master records)
- Verbatim glossary definitions copied from the book
- Scanned/screenshot images of book pages

### Recommended Open Source Strategy

Use the **"Bring Your Own Document" (BYOD)** model:

1. Publish the **processing pipeline** (scripts, prompts, website code) as open source
2. In your README, instruct users to legally obtain their own copy of the PDF
3. Provide a one-command script that processes the user's own PDF into the knowledge base
4. The live demo website can use one of these approaches:
   - **BYOD upload**: User uploads their own PDF, system processes it in real-time
   - **Public domain data**: Use freely available content (Wikipedia articles, open-access papers) as the demo knowledge base
   - **Preset Q&A showcase**: Hardcode 3-5 sample questions with paraphrased answers to demonstrate the system's capabilities
   - **Screen recording**: Record a demo video showing the full system in action

---

## Non-Negotiable Rules

1. **Fidelity over elegance.** Preserve the source material exactly as it appears.
2. **Citability over fluency.** Every claim must trace back to a specific page.
3. **Completeness over prettiness.** Process every page, even difficult ones.
4. **Preserve ambiguity instead of guessing.** If something is unclear, say so.
5. **Treat the PDF as multimodal.** Process text, images, charts, tables, infographics, diagrams, hand-drawn sketches, captions, and footnotes.
6. **Separate direct observation from interpretation.** What you see vs. what you think it means.
7. **Never invent missing content.** If it is not in the PDF, do not fabricate it.
8. **Mark uncertainty explicitly.** Unreadable, ambiguous, or partially extracted content must be flagged.
9. **Maintain page boundaries.** Never merge content across pages.
10. **Preserve page references everywhere.** Every piece of extracted content must carry its source page number.
11. **Auto-batch large documents.** If the PDF exceeds processing limits, split into internal batches and merge outputs.
12. **Minimize human intervention.** Do not ask follow-up questions unless the file is actually unreadable or missing.
13. **Use vision models for visual content.** Text extraction alone is insufficient for diagrams, charts, and images — use multimodal AI (e.g., Gemini Vision, GPT-4V) to analyze visual elements directly.

---

## Output Structure

```
PDF_PROJECT_OUTPUT/
  00_source/                    # Original PDF + manifest
  01_inventory/                 # Page-by-page classification
  02_page_records/              # Per-page canonical JSON records
  03_visual_reviews/            # Visual analysis for diagram/photo pages
  04_gold_master/               # Merged authoritative records
    pages/
  05_retrieval/                 # Chunked data for RAG
  06_eval/                      # 80+ evaluation questions
  07_skill/                     # System prompt + skill definition
  08_visual_assets/             # Extracted diagrams/images + metadata
  09_website/                   # Website specification + data contract
  10_final_report/              # Completion report + deployment guide
```

---

## Task 1: Source Ingestion

Save the source PDF into `00_source/`.

Create `00_source/document_manifest.json` with these fields:

| Field | Description |
|-------|-------------|
| `filename` | Original filename |
| `file_size_if_available` | File size in bytes |
| `total_pages` | Total page count |
| `estimated_document_type` | Book, manual, report, etc. |
| `detected_language_or_languages` | Primary and secondary languages |
| `visual_density_overview` | How many pages contain significant visual content |
| `extraction_risk_overview` | Overall difficulty assessment |
| `likely_structure_overview` | Chapters, sections, appendices |
| `major_processing_risks` | Handwriting, dense diagrams, poor scan quality, etc. |
| `handling_strategy` | How you plan to process this specific document |

Also create `00_source/document_manifest.md` — a human-readable summary explaining what kind of document this is, why it is easy or hard to process, and what special handling is needed.

---

## Task 2: Page Inventory

Create `01_inventory/page_inventory.json` — one object per page with:

| Field | Type | Description |
|-------|------|-------------|
| `page_number` | int | 1-indexed page number |
| `page_type` | enum | `cover`, `toc`, `text`, `mixed`, `table`, `chart`, `infographic`, `diagram`, `sketch`, `photo`, `appendix`, `form`, `other` |
| `has_small_text` | bool | Contains text below ~8pt |
| `has_handwriting` | bool | Contains handwritten content |
| `has_table` | bool | Contains tabular data |
| `has_chart` | bool | Contains charts or graphs |
| `has_infographic` | bool | Contains infographics |
| `has_diagram` | bool | Contains technical diagrams |
| `has_photo` | bool | Contains photographs |
| `has_caption` | bool | Contains figure/table captions |
| `has_footnote` | bool | Contains footnotes |
| `has_dense_layout` | bool | Complex multi-column or overlapping layout |
| `extraction_risk` | enum | `low`, `medium`, `high` |
| `short_observation` | string | One-line description of page content |
| `special_notes` | string | Any processing concerns |

Also create `01_inventory/page_inventory.md` — a readable audit summary organized by page ranges and notable high-risk pages.

### Processing Strategy (Learned from v1)

- **Use text extraction first** (e.g., `pdftotext`) to get raw text for all pages
- **Classify pages by text density**: Pages under 100 bytes of extracted text are likely visual-heavy
- **Use vision model** (Gemini, GPT-4V) for pages classified as visual-heavy to get accurate page type classification
- **Process in parallel batches** of 30-50 pages for efficiency

---

## Task 3: Page-Level Canonical Records

For EVERY page, create one JSON file: `02_page_records/page_0001.json` (zero-padded).

Each page JSON must include:

| Field | Description |
|-------|-------------|
| `page_number` | Page number |
| `page_type` | Classification from inventory |
| `section_heading_guess` | Best guess at which section this page belongs to |
| `raw_text_full` | Faithfully preserved text extraction |
| `layout_preserving_markdown` | Reconstructed page structure in readable markdown |
| `tables_extracted` | Any tables found, preserved in structured format |
| `captions` | Figure/table captions |
| `footnotes` | Footnote text |
| `observed_visual_description` | ONLY what is directly visible (no interpretation) |
| `interpreted_page_meaning` | Conservative explanation of likely meaning |
| `uncertainties` | Anything unreadable, ambiguous, inferred, or partially extracted |
| `keywords` | Key terms and concepts on this page |
| `page_summary_strict` | Compact summary grounded in this page only |

**Rules**: Never merge pages. Do not omit difficult pages. If a page is mostly visual, still produce a full record. If text is unreadable, say so explicitly.

Also create `02_page_records/extraction_log.md` documenting any pages that were hard to read or required special handling.

---

## Task 4: Visual Review for High-Risk Pages

For every page that is medium/high extraction risk OR contains charts, tables, infographics, diagrams, sketches, handwriting, or dense visual content, create a dedicated review file: `03_visual_reviews/page_0001_visual_review.json`.

Each visual review JSON must include:

| Field | Description |
|-------|-------------|
| `page_number` | Page number |
| `visual_elements_detected` | List of visual elements found |
| `readable_text_in_visuals` | Any text embedded in the visual elements |
| `observed_structure` | Layout and spatial organization |
| `likely_meaning` | Conservative interpretation |
| `uncertainties` | Ambiguous elements |
| `confidence_level` | `low`, `medium`, `high` |
| `review_notes` | Additional observations |

### Critical: Use Vision Models

**Do NOT rely solely on text extraction for visual pages.** Convert each page to a high-resolution image (300 DPI PNG) and analyze it with a multimodal vision model. Focus on:

- **Spatial relationships**: Distances, angles, heights, relative positions
- **Labels and annotations**: Text embedded in diagrams
- **Handwritten content**: Notes, markings, corrections
- **Table structures**: Row/column organization, merged cells
- **Diagram flow**: Arrows, connections, hierarchies

Also create `03_visual_reviews/high_risk_pages_summary.md` listing all reviewed pages, why they are risky, and whether the visual review reduced uncertainty.

---

## Task 5: Gold-Master Page Consolidation

Create final trusted per-page records in `04_gold_master/pages/page_0001.json`.

Each final page JSON merges inventory data + canonical page record + visual review (if present) and must include:

| Field | Description |
|-------|-------------|
| `page_number` | Page number |
| `page_type` | Final classification |
| `section_path` | Full section hierarchy path |
| `raw_text_full` | Preserved text |
| `layout_preserving_markdown` | Structured markdown |
| `figures` | Figure descriptions |
| `tables` | Extracted tables |
| `captions` | Captions |
| `footnotes` | Footnotes |
| `observed_visual_description` | Direct visual observations |
| `interpreted_page_meaning` | Conservative interpretation |
| `uncertainties` | All flagged uncertainties |
| `page_summary_strict` | Page-level summary |
| `keywords` | Key terms |
| `citation_ready_excerpt_candidates` | Quotable passages |

Also create `04_gold_master/gold_master_index.json` mapping page_number → file_path, section_path, page_type, key_topics.

---

## Task 6: Section Map, Glossary, FAQ Seeds

Create three files in `04_gold_master/`:

**`sections.json`**: Inferred section hierarchy with page ranges, summaries, and key concepts per section.

**`glossary.json`**: Important terms, entities, concepts, and frameworks — defined ONLY based on evidence from the document, with supporting page references.

**`faq_seeds.json`**: Realistic future user questions, each with:
- `question`, `question_type`, `relevant_pages`, `relevant_sections`, `answerability_level`
- Question types must include: direct fact lookup, cross-page synthesis, visual interpretation, table/chart lookup, glossary/definition, uncertainty/no-evidence

---

## Task 7: Retrieval Layer

Create in `05_retrieval/`:

| File | Purpose |
|------|---------|
| `page_chunks.jsonl` | Page-level chunks preserving citation fidelity |
| `section_chunks.jsonl` | Section-level chunks for semantic retrieval |
| `retrieval_manifest.json` | Metadata about the chunking strategy |
| `retrieval_strategy.md` | How page vs. section retrieval should work |

Every chunk must include: `chunk_id`, `source_type`, `page_number` or `page_range`, `section_path`, `keywords`, `uncertainty_flags`, `chunk_text`.

The retrieval strategy document must explain how a future QA system should choose between page evidence and section evidence, and how visual-content questions should be handled.

---

## Task 8: Evaluation Set

Create in `06_eval/`:

**`eval_questions.json`**: At least 80 evaluation questions covering:
- Direct factual lookup
- Cross-page reasoning
- Section-level understanding
- Image/diagram interpretation
- Table/chart reading
- Handwriting/sketch ambiguity
- Refusal / no-evidence behavior
- Uncertainty-sensitive questions

Each item: `eval_id`, `question`, `question_type`, `expected_behavior`, `relevant_pages`, `relevant_sections`, `evidence_strength`.

**`eval_notes.md`**: What kinds of failure are most likely, which page types are hardest, which question categories are highest risk.

---

## Task 9: Skill / System Prompt Generation

Create in `07_skill/`:

**`document_skill.md`**: Role definition, allowed evidence sources, retrieval rules, citation rules, uncertainty handling, answer formatting, refusal rules, visual interpretation rules.

**`document_skill_system_prompt.txt`**: A production-ready system prompt that forces the assistant to:
- Answer only from retrieved evidence
- Cite page numbers in every response
- Distinguish direct observation from interpretation
- Explicitly mention uncertainty when present
- Avoid hallucinating missing information
- Preserve original wording where useful
- Refuse unsupported claims

**`document_skill_usage_notes.md`**: How to use the skill with different LLM providers.

---

## Task 10: Visual Asset Extraction and Indexing

> **New in v2**: This task was added based on the v1 experience, where visual assets proved essential for answering spatial/technical questions.

For every page containing a diagram, table, chart, photo, infographic, or sketch:

1. **Extract the page as a high-resolution image** (300 DPI PNG)
2. **Analyze the image with a vision model** to produce a detailed description
3. **Create a paired metadata JSON** for each visual asset

Organize into `08_visual_assets/`:

```
08_visual_assets/
  diagrams/
    page_0042.png
    page_0042.json
  tables/
    page_0085.png
    page_0085.json
  photos/
    page_0120.png
    page_0120.json
  mixed/
    page_0055.png
    page_0055.json
  visual_assets_index.json
  README.md
```

Each metadata JSON must include:

| Field | Description |
|-------|-------------|
| `page_number` | Source page |
| `visual_type` | `diagram`, `table`, `photo`, `chart`, `mixed` |
| `image_file` | Relative path to the PNG |
| `section` | Which section of the book |
| `caption` | Figure caption if present |
| `description` | Detailed description of what the image shows |
| `spatial_relationships` | Distances, angles, heights, relative positions |
| `table_content` | For tables: structured content |
| `handwritten_annotations` | Any handwritten notes |
| `keywords` | Searchable terms |
| `retrieval_tags` | Tags for matching user queries to this asset |
| `confidence_level` | How confident the analysis is |

**`visual_assets_index.json`**: Master index of all visual assets with their metadata, enabling search and retrieval.

---

## Task 11: Website-Ready Knowledge Architecture

Create in `09_website/`:

**`website_spec.md`**: Product purpose, information architecture, required pages, search behavior, chat behavior, citation display, figure browser, glossary page, FAQ page.

**`data_contract.json`**: Structured data model for pages, sections, glossary entries, FAQ seeds, retrieval chunks, citations, and visual assets.

---

## Task 12: AI Chat Website with RAG

> **New in v2**: Build a live, interactive website powered by the knowledge base.

### Required Features

1. **LLM-powered chat interface** grounded in the full knowledge base, with page-level citations in every answer
2. **Visual asset retrieval**: When a relevant diagram/table/image exists, automatically display it alongside the answer
3. **Suggested prompt buttons**: Pre-configured example questions that users can click to start a conversation
4. **"Turn into image explanation" button**: Appears after complex answers, uses AI image generation to create a visual summary
5. **Interactive UI**: Animated message bubbles, typing indicators, smooth scroll, dark/light theme toggle
6. **Glossary browser**: Alphabetical filtering with category badges
7. **Section navigator**: Book structure with summaries
8. **Structured data API**: Serves page_chunks, visual_assets_index, glossary, and sections for real-time retrieval

### Architecture

```
┌─────────────────────────────────────────────┐
│                  Frontend                    │
│  Landing Page → Chat UI → Glossary/Sections │
│  (React + Tailwind + Framer Motion)         │
└──────────────────┬──────────────────────────┘
                   │ tRPC / API calls
┌──────────────────▼──────────────────────────┐
│                  Backend                     │
│  Knowledge Base Loader → Search Engine       │
│  Chat Endpoint (LLM + Retrieval + Citations)│
│  Image Generation Endpoint                   │
│  Glossary / Sections / Visual Assets API     │
└──────────────────┬──────────────────────────┘
                   │ reads at startup
┌──────────────────▼──────────────────────────┐
│              Data Layer                      │
│  page_chunks.jsonl  section_chunks.jsonl     │
│  visual_assets.json  glossary.json           │
│  sections.json  system_prompt.txt            │
└─────────────────────────────────────────────┘
```

### Search Implementation

Use keyword-based scoring with weighted fields:

- **Retrieval tags** (3x weight) — most important for visual asset matching
- **Keywords** (2x weight) — extracted terms from each chunk
- **Section path** (1.5x weight) — structural context
- **Full text** (1x weight) — content matching

Search across all data sources simultaneously: page chunks, section chunks, visual assets, and glossary.

### Chat Prompt Construction

For each user question:
1. Search the knowledge base for relevant page chunks (top 8)
2. Search for relevant visual assets (top 4)
3. Construct a prompt with: system prompt + retrieved evidence + visual asset descriptions + user question
4. Send to LLM (Gemini, GPT-4, Claude, etc.)
5. Parse response for citations and complexity assessment
6. Return answer + citations + matched visual assets

---

## Task 13: Final Report

Create in `10_final_report/`:

| File | Contents |
|------|----------|
| `final_report.md` | What was completed, partially completed, difficult, uncertain, and what the knowledge base can now do |
| `output_file_index.md` | All created outputs and their purposes |
| `top_risky_pages.md` | Top 10-20 pages most likely to benefit from human review |
| `deployment_next_steps.md` | Fastest path to deploy as an assistant, website, or internal knowledge asset |

---

## Operating Instructions

- Work autonomously. Continue until the entire workflow is complete.
- If context or processing limits are encountered, continue in internal batches and merge everything at the end.
- Do not stop after inventory. Do not stop after summary. Do not stop after extraction. Finish the whole pipeline.
- Use parallel processing where possible (page extraction, visual analysis, chunk generation).
- Prioritize visual analysis for high-risk pages before processing text-heavy pages.

### Recommended Processing Order

1. **Extract text** from all pages first (fast, establishes baseline)
2. **Classify pages** by text density to identify visual-heavy pages
3. **Convert all pages to images** (300 DPI PNG for vision model analysis)
4. **Process high-risk pages first** with vision model (diagrams, photos, setup sheets)
5. **Process medium-risk pages** with vision model (mixed content, tables)
6. **Process low-risk pages** with text analysis (text-heavy pages)
7. **Merge all results** into gold master records
8. **Build retrieval layer** from gold master data
9. **Generate evaluation set** and skill/system prompt
10. **Extract and index visual assets** with paired metadata
11. **Build website** with chat, glossary, sections, and visual asset retrieval
12. **Write final report**

---

## Lessons Learned from v1 Run

These insights come from processing a 445-page classical recording guide with 251 visual assets:

### What Worked Well

1. **Three-tier page classification** (high/medium/low risk) enabled efficient parallel processing — vision model resources were focused where they mattered most.
2. **Vision model analysis of diagrams** captured spatial relationships (microphone distances, angles, heights) that text extraction completely missed.
3. **Retrieval tag system** for visual assets enabled accurate matching of user questions to relevant diagrams (e.g., "piano recording setup" → piano microphone placement diagram).
4. **Keyword-based search with weighted fields** provided fast, accurate retrieval without requiring embedding models or vector databases.
5. **Paired image + metadata JSON** format made visual assets both human-browsable and machine-searchable.

### What Was Difficult

1. **Handwritten annotations** in appendices were partially captured but often ambiguous — these should always be flagged as uncertain.
2. **Dense technical diagrams** with overlapping labels required multiple analysis passes — budget extra time for these.
3. **Table extraction** from complex multi-column layouts sometimes lost cell boundaries — always verify table structure with vision model.
4. **Cross-page content** (diagrams spanning two pages, tables continuing across pages) required manual stitching — flag these in the inventory.

### Key Metrics from v1

| Metric | Value |
|--------|-------|
| Total pages processed | 445 |
| Visual assets extracted | 251 |
| Page chunks generated | 445 |
| Section chunks generated | 33 |
| Glossary entries | 84 |
| Evaluation questions | 80+ |
| Processing time (full pipeline) | ~4 hours |
| Final output size | ~20 MB (data) + ~93 MB (visual assets) |

---

## Final Chat Response Format

When you are done, respond with:

1. A short plain-English summary of what was completed
2. The location of the final output folder or archive
3. The top 5 pages requiring human review
4. The single best next step to deploy the result
5. A link or instructions to access the live demo website (if built)

Do not give a generic explanation of what you plan to do. Actually do the work.
