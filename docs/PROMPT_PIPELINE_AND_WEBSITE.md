# DocOracle — AI Agent Prompt: Pipeline + Website (End-to-End)

> **What this prompt does:** When you paste this prompt into an AI agent (Manus AI, Open Claw, Claude Cowork, etc.) and attach your PDF, the agent will execute the full DocOracle pipeline AND build a complete, deployable AI knowledge base website — all in one session.
>
> **If you only need the JSON data files** (no website), use [`PROMPT_PIPELINE_ONLY.md`](PROMPT_PIPELINE_ONLY.md) instead.

---

## How to Use

1. Open a capable AI agent that can create files and build web applications (Manus AI, Open Claw, Claude Cowork, Cursor, etc.)
2. Copy the entire prompt below using the copy button at the top-right of the code block
3. Paste it as your first message
4. Attach your PDF file to the same message
5. Send and wait for the agent to complete both the pipeline and the website

> **Important:** The prompt is one continuous block. Use the copy button — do not manually select text, as the block is long and easy to truncate.

---

## The Prompt (Optimized For Cursor)

```
You are an autonomous document-ingestion, knowledge-system, and web-product development agent.

Before doing any implementation work, you must first ensure that Gemini API access is properly configured, because later stages of this workflow depend on Gemini for multimodal understanding, including visual page analysis, image-related reasoning, and grounded chat / fallback behavior where applicable.

Do NOT start the pipeline.
Do NOT start building the website.
Do NOT process the PDF yet.

Your first responsibility is to guide the user through Gemini API setup inside Cursor.

==============================================================
STEP 0 — GEMINI API KEY SETUP (MANDATORY, MUST HAPPEN FIRST)
==============================================================

At the very beginning, immediately prompt the user with a clear setup message.
Use language similar to the following:

"This workflow requires Gemini API access before it can begin, because later stages use Gemini for visual page analysis, multimodal document understanding, and AI-powered document interaction.

Please set up your Gemini API key first.

You can create a Gemini API key here:
https://aistudio.google.com/app/apikey

I will now help you create or update a .env file in this project so you can paste your key in safely."

Then do the following inside Cursor:

1. Check whether a .env file already exists in the project root.
2. If no .env file exists, create one.
3. Open the .env file for the user directly inside Cursor.
4. Insert a placeholder line if it does not already exist:

GEMINI_API_KEY=

5. If helpful, also add a commented instruction above it, for example:

# Paste your Gemini API key below
GEMINI_API_KEY=

6. Prompt the user to paste their Gemini API key into that field.
7. Wait until the user confirms the key has been added.
8. Only after confirmation, continue with the rest of the workflow.

IMPORTANT SETUP RULES:
- Do not bury this step later in the workflow.
- Do not merely mention the API key in documentation.
- Do not continue assuming the key exists.
- Do not proceed to pipeline execution until Gemini setup is confirmed.
- If .env is missing from .gitignore, add it.
- If the project uses an example environment file, you may also mirror the key there if appropriate, but .env is the real source of truth.
- If the user says they are using an environment with native Gemini access and no key is needed, explicitly confirm that before proceeding.
- If the key is missing or invalid, stop and explain that the workflow cannot reliably continue.

DESIRED CURSOR BEHAVIOR:
- Open the .env file automatically.
- Place the cursor where the user should paste the key.
- Make the setup step obvious and hard to miss.
- Keep the instruction short and direct.
- The user should feel that the agent is actively guiding setup, not merely describing it.

==============================================================
VISUAL DESIGN REFERENCE SETUP
==============================================================

Before doing implementation work beyond environment setup, clone this repository as a visual design reference:

git clone https://github.com/akseolabs-seo/cinematic-ui

Use it only as a UI / visual-direction reference for building a polished, premium, high-end website.
Study it for:
- visual hierarchy
- spacing
- typography
- motion / transitions
- premium composition
- landing-page polish
- component presentation quality

Do NOT blindly copy its architecture, routing, content model, or interaction logic.
Do NOT let cinematic styling override document usability.

This project should look premium, but it must behave like a serious document exploration product.
Do not sacrifice clarity, density, citation usability, or navigation for visual drama.

The final website in this task is a document-native AI knowledge base, not a generic cinematic landing page.
If any design choice conflicts with page exploration, citation interactivity, glossary browsing, section navigation, visual browsing, or PDF access, choose document usability.

==============================================================
CORE MISSION
==============================================================

Your job is to take the attached PDF and complete TWO major tasks end-to-end:

TASK A: Execute the full DocOracle pipeline to transform the PDF into structured JSON data.
TASK B: Build a complete, interactive AI knowledge base website powered by that data.

Do not stop after Task A.
You must complete both tasks.

This is not just a chatbot website.
This is not just a PDF-to-JSON conversion workflow.
The final product must feel like a document-native, exploration-first knowledge workspace where users can browse, inspect, click through, and ask AI about specific pages, sections, glossary terms, and visuals.

==============================================================
GLOBAL PRIORITIES
==============================================================

1. Fidelity over elegance
2. Citability over fluency
3. Completeness over prettiness
4. Preserve page boundaries
5. Never invent missing content
6. Use vision models for visual content
7. Work autonomously from start to finish
8. Build the website around exploration, not just chat
9. Turn page references, citations, glossary references, and visuals into clickable navigation objects whenever possible
10. Preserve access to the original PDF throughout the product
11. Ensure Gemini API is configured before any multimodal or AI-dependent step begins

==============================================================
PRIMARY PRODUCT GOAL
==============================================================

Build a website that makes a PDF feel alive, navigable, explorable, and AI-askable.

The user should be able to:
- browse the document structure
- inspect individual pages
- open or preview the original PDF
- click page numbers and section references
- jump from citations into page-level exploration
- ask AI about a specific page, section, glossary term, or figure
- move naturally between browsing and asking
- view diagrams, tables, and visual assets as first-class knowledge objects

The website should feel like a hybrid of:
- a document reader
- a knowledge browser
- an AI research assistant
- a visual archive

Chat is only one part of the product.
Exploration is equally important.

==============================================================
SUCCESS CRITERIA
==============================================================

The build is successful only if the website supports flows like these:

Flow A:
User reads an answer in chat → clicks a cited page number → lands on a page detail view or PDF-linked view → clicks “Ask AI about this page” → chat opens prefilled with a page-specific question

Flow B:
User browses sections → opens one section → sees summary, keywords, linked pages, and related visuals → clicks one page or figure → explores further

Flow C:
User opens a glossary term → sees definition + supporting pages → clicks a page → asks AI to explain how this term is used in context

Flow D:
User sees a relevant diagram/table in a chat answer → clicks it → opens a dedicated visual detail view with page reference, description, and a link back to the source page/PDF

Flow E:
User wants to inspect the original source → can open the PDF directly from multiple places in the app

If these flows are weak, the build is not successful even if all files compile.

==============================================================
TASK A: Pipeline (PDF to Structured JSON)
==============================================================

Turn the attached PDF into a high-fidelity, citation-ready, multimodal knowledge base.

NON-NEGOTIABLE RULES:
1. Fidelity over elegance — preserve the source material exactly as it appears
2. Citability over fluency — every claim must trace back to a specific page
3. Completeness over prettiness — process EVERY page, even difficult ones
4. Never invent missing content — if it is not in the PDF, do not fabricate it
5. Maintain page boundaries — never merge content across pages
6. Use vision models for visual content — text extraction alone is insufficient for diagrams
7. Work autonomously — do not stop until both tasks are complete
8. Do not start any Gemini-dependent stage until API setup is confirmed

PIPELINE OUTPUT STRUCTURE:

Create the following folder structure:

PDF_PROJECT_OUTPUT/
  00_source/
    source.pdf
    document_manifest.json
  01_inventory/
    page_inventory.json
  02_page_records/
    page_0001.json
    page_0002.json
    ... (one file per page, zero-padded)
  03_visual_reviews/
    high_risk_pages_summary.md
  04_gold_master/
    glossary.json              (KEY FILE: terms, definitions, categories, pages)
    sections.json              (KEY FILE: chapter hierarchy, summaries, keywords)
    faq_seeds.json
    suggested_prompts.json
  05_retrieval/
    page_chunks.jsonl          (KEY FILE: one JSON line per page chunk)
    section_chunks.jsonl
  06_eval/
    eval_questions.json        (80+ evaluation questions)
  07_skill/
    document_skill.md
    document_skill_system_prompt.txt
  10_visual_assets/
    visual_assets_index.json   (KEY FILE: all visual assets with retrieval tags)
    diagrams/
    tables/
    photos/
    mixed/

PIPELINE STEPS (execute in order):

Step 1 - Source Ingestion
Save the PDF and create document_manifest.json with metadata:
- filename
- total_pages
- document_type
- languages
- visual_density
- extraction_risk
- structure
- handling_strategy

Step 2 - Page Inventory
Classify every page and create one entry per page in page_inventory.json.
For every page, record:
- page_number
- page_type (text / diagram / photo / mixed / table / chart / cover / toc / appendix)
- extraction_risk (low / medium / high)
- likely_section
- has_visual_content
- needs_vision_review
- notes

Step 3 - Page Records
For every page, create page_NNNN.json with fields:
- page_number
- page_type
- section_heading_guess
- raw_text_full
- layout_preserving_markdown
- tables_extracted
- captions
- footnotes
- observed_visual_description
- interpreted_page_meaning
- uncertainties
- keywords
- page_summary_strict

Also add website-supporting fields where useful:
- linked_terms
- linked_sections
- suggested_page_questions
- page_label
- has_visual_assets

Step 4 - Visual Review
For every page with medium/high extraction risk or visual content, perform vision model analysis.
Focus on:
- spatial relationships
- embedded labels
- handwritten content
- table structures
- diagram flow
- caption-to-image relationships
- figure semantics
Save this analysis to high_risk_pages_summary.md

Step 5 - Gold-Master
Merge all data and build:
- glossary.json
- sections.json
- faq_seeds.json
- suggested_prompts.json

Step 6 - Retrieval Layer
Create:
- page_chunks.jsonl (one JSON line per page)
- section_chunks.jsonl

Step 7 - Evaluation Set
Generate 80+ evaluation questions in eval_questions.json

Step 8 - System Prompt
Generate:
- document_skill.md
- document_skill_system_prompt.txt

Step 9 - Visual Assets
Extract images from visual pages, analyze with a vision model, create paired metadata JSON per asset, and build visual_assets_index.json as the master index

==============================================================
EXPANDED PIPELINE EXECUTION DETAILS
==============================================================

The pipeline must explicitly include the following operational sub-steps where applicable:

A. Download / save the source PDF into the output structure

B. Determine page count and document metadata

C. Extract text page by page

D. Classify pages into text-heavy vs visual-heavy vs mixed pages

E. Converting visual pages to images
This is mandatory.
For pages classified as diagram / table / photo / chart / mixed / medium-risk / high-risk:
- render or convert those pages into image files
- preserve page numbering
- store them in a temporary or structured processing location
- use those rendered page images for later visual analysis and visual asset extraction

F. Analyze visual pages with a vision-capable model
For every rendered visual page image:
- describe what is present
- capture labels
- infer structure carefully
- record uncertainty explicitly
- identify whether it contains one or multiple extractable visual assets

G. Build page chunks for retrieval

H. Build section hierarchy, glossary, FAQ seeds, suggested prompts, and system prompt assets

I. Extract visual assets from visual pages
This should not only detect that a page has visuals.
It should produce visual asset entries that can later be displayed and linked inside the website.

J. Save the final knowledge base artifacts in a website-consumable format

KEY DATA FORMATS:

page_chunks.jsonl (one JSON object per line):
{"chunk_id":"page_045","page_number":45,"section_path":"Chapter 2 > Studio Techniques","keywords":["control room","acoustics"],"chunk_text":"The control room should...","has_visual":false}

section_chunks.jsonl (one JSON object per line):
{"chunk_id":"section_ch2_studio_01","section_title":"Studio Techniques","page_start":40,"page_end":62,"keywords":["studio","acoustics"],"summary":"...","chunk_text":"..."}

glossary.json:
[{"term":"Term Name","definition":"Definition...","category":"Category","pages":[10,11,12],"related_terms":["..."]}]

sections.json:
[{"id":"chapter_2","title":"Studio Techniques","level":1,"parent":null,"page_start":40,"page_end":62,"summary":"...","keywords":["..."],"child_sections":["..."],"representative_pages":[41,44,55]}]

visual_assets_index.json:
[{"asset_id":"page_120_fig_01","page":120,"type":"diagram","title":"...","description":"Detailed description...","retrieval_tags":["tag1","tag2"],"confidence":"high","related_terms":["..."],"related_sections":["..."]}]

==============================================================
PHASE 1A — EXTRACTION OBJECT QUALITY
==============================================================

For every page record, preserve direct observation separately from interpretation whenever possible.

Direct observation should capture:
- extracted text
- visible labels
- captions
- footnotes
- observed layout features
- visible visual structure

Interpretation should capture:
- likely meaning
- likely section association
- likely conceptual role
- inferred summary
- uncertainty statements

Do not blur direct extraction and interpretation.

==============================================================
PHASE 1B — EXTRACTION QUALITY PRIORITIES
==============================================================

Prioritize the following:
1. Reliable page-level citation support
2. Strong section hierarchy
3. Glossary quality
4. Visual asset metadata quality
5. Page-level navigation affordances
6. Suggested prompts and page-specific prompts

Do not spend excessive effort on outputs that do not improve the final website UX.

==============================================================
TASK B: Website (JSON Data to Interactive AI Knowledge Base)
==============================================================

After completing the pipeline, build a full-stack web application that serves the knowledge base.

This website must not behave like a generic “chat with PDF” app.
It must behave like an interactive document workspace with many clickable exploration paths.

REQUIRED WEBSITE FEATURES:

Feature 1 — Landing Page
Design a professional landing page that introduces the knowledge base.
Include:
- navigation to Chat, Glossary, Sections, Visuals, and PDF access
- 5 suggested prompt buttons users can click to start a conversation
- document identity and short explanation
- “Start Exploring” call-to-action

Feature 2 — AI Chat Interface
This is a core feature, but not the only one.
Users type questions and receive answers that are:
- grounded in the document using retrieved page chunks
- cited with specific page numbers
- accompanied by relevant diagrams or tables when available
- connected to related sections / pages / visuals when possible

Feature 3 — Visual Asset Retrieval
When a user's question matches a diagram, table, or photo via retrieval tag matching, display the visual asset alongside the answer.
This is critical for spatial and technical questions.

Feature 4 — Glossary Browser
Display all terms from glossary.json with:
- alphabetical filtering (A-Z letter buttons)
- category badges
- page references
- related term links
- “Ask AI about this term” actions

Feature 5 — Section Navigator
Display the book structure from sections.json with:
- chapter and section hierarchy
- summaries
- keyword tags
- page ranges
- representative pages
- “Ask AI about this section”
- click-through to section detail when appropriate

Feature 6 — Image Explanation Button
After complex answers, show a button labeled "Turn into Image Explanation".
When clicked, use AI image generation to create a visual summary of the answer.
IMPORTANT: Always use the "Nano Banana Pro" model for all image generation in this feature. Do not use any other image generation model.

Feature 7 — Dark/Light Theme Toggle
Support both themes with a toggle button.

Feature 8 — Responsive Design
The website must work correctly on both desktop and mobile.

Feature 9 — Gemini Web Search Fallback (CRITICAL FEATURE)
This feature handles the case where the document does not contain enough information to answer the user's question. Instead of leaving the user with a dead end, the chat interface offers to search the web using Gemini's grounding capability — but only after asking the user for consent.

Feature 10 — Page Explorer / Page Detail View (CRITICAL)
This is mandatory.
The website must provide a dedicated page-level exploration experience.
For each page, show:
- page number
- page label or short page title if available
- page summary
- extracted text excerpt or structured page content
- linked glossary terms
- linked section
- related visuals
- “Open original PDF at this page”
- “Ask AI about this page”
- suggested page questions

Feature 11 — Citation-Driven Navigation (CRITICAL)
Citations must not be inert text.
Whenever possible:
- clicking a page number in chat opens the page explorer or relevant PDF page
- clicking a citation chip should launch deeper exploration
- citations should be rendered as interactive page chips, cards, or links

Feature 12 — PDF Access / Source Access (CRITICAL)
Users must be able to access the original PDF from multiple points in the app.
Support this wherever possible:
- open the full PDF
- open or jump near a specific page
- open the source from a page view
- open the source from citations
- open the source from visual asset detail views

Feature 13 — Cross-Linking Between Knowledge Objects
The site must cross-link:
- page ↔ chat
- page ↔ section
- page ↔ glossary term
- page ↔ visual asset
- section ↔ representative pages
- glossary term ↔ supporting pages
- visual asset ↔ source page
- any major object ↔ “Ask AI about this ...”

Feature 14 — Visual Asset Browser / Visual Detail
Visuals must be first-class content, not decorative attachments.
Allow users to:
- browse all visuals
- filter by type (diagram / table / photo / mixed)
- open a visual detail view
- inspect description and source page
- jump back to source page
- ask AI about a specific visual

==============================================================
HOW THE WEBSITE SHOULD FEEL
==============================================================

The product should feel like:
- a document reader
- a knowledge browser
- an AI research assistant
- a visual archive

Do not make the experience depend only on typing in the chat box.
Users should be able to explore by clicking.

The website should contain many clear “next actions” such as:
- Ask AI about this page
- Explore this section
- View related visual
- Open source page
- Open PDF
- Ask about this term

==============================================================
WEB SEARCH FALLBACK — USER FLOW
==============================================================

Step 1:
The AI attempts to answer from the document as normal.

Step 2:
If the retrieved evidence is insufficient, the chat UI automatically displays a consent prompt below the document-based answer. Render it as a styled card, not a code block.

The card should say:

The document doesn't fully cover this topic.

Would you like me to search the web for related information outside this document?

[Search the Web]    [No, thanks]

Note: Web results are from external sources and may not reflect the views or accuracy of this document.

Step 3:
If the user clicks "Search the Web":
- call Gemini API with the google_search tool enabled (grounding)
- pass both the original question and a summary of what the document did say as context
- prompt Gemini as follows:
"The user is reading [document title]. The document says: [brief summary of what was found]. The user wants to know: [original question]. Please search the web for related information and provide a helpful answer, noting which parts come from external sources."
- display the web search result in a visually distinct panel
- label it clearly: "From Web Search (External Sources)"
- show Gemini grounding citations (URLs) as clickable links

Step 4:
If the user clicks "No, thanks":
- dismiss the consent prompt
- show nothing further

==============================================================
DETECTION LOGIC — DOCUMENT CANNOT ANSWER
==============================================================

The backend should flag a response as insufficient and set webSearchAvailable: true when ANY of the following are true:
- the LLM response contains any of these phrases:
  - "the document does not specify"
  - "not mentioned in the text"
  - "the provided text does not"
  - "no information about"
  - "cannot be determined from"
  - "not covered in this document"
- the retrieval search returns fewer than 3 matching chunks with confidence above 0.3
- the top-scoring chunk has a relevance score below 0.25

==============================================================
BACKEND IMPLEMENTATION FOR WEB SEARCH
==============================================================

Add a new API endpoint or tRPC procedure called chat.searchWeb with the following contract:

Input:
- originalQuestion (string)
- documentContext (string)
- documentTitle (string)

Process:
1. construct a grounded search prompt combining document context and question
2. call Gemini API with tools: [{ googleSearch: {} }]
3. extract the response text and grounding metadata (source URLs, titles)
4. return the answer, sources array, and a disclaimer

Output:
- answer (string)
- sources (array of objects with title, url, snippet)
- disclaimer (string): "Results from external web sources. Verify independently."

==============================================================
FRONTEND IMPLEMENTATION FOR WEB SEARCH
==============================================================

In the chat component, after receiving a response with webSearchAvailable set to true:
1. render the normal document-based answer first
2. below it, render the consent card with an amber or yellow left border and subtle background
3. on "Search the Web" click:
   - show a loading spinner
   - call chat.searchWeb
   - render the result in a distinct panel with a blue or teal left border, a globe icon in the header, and an "External Sources" badge
4. on "No, thanks" click:
   - hide the consent card with a smooth fade-out animation
5. source links should be displayed as small chips or pills below the answer, each showing the domain name

==============================================================
WEBSITE ARCHITECTURE
==============================================================

Frontend:
- React + Tailwind CSS (or similar modern framework)

Backend:
- Express + tRPC (or similar API framework)

LLM:
- Gemini API (required for web search fallback and multimodal document analysis)

Image Generation:
- Nano Banana Pro model (required for Feature 6 — do not substitute)

==============================================================
BACKEND SEARCH LOGIC
==============================================================

The backend must:
- load the core JSON files at startup
- implement keyword-based search with weighted fields:
  - retrieval tags: weight 3x (most important for visual asset matching)
  - keywords: weight 2x
  - section path: weight 1.5x
  - glossary terms: weight 1.5x
  - page labels: weight 1.25x
  - full text: weight 1x

For each chat query:
- search for relevant chunks (top 8)
- search for relevant visual assets (top 4)
- construct a prompt with system prompt + evidence + question
- send to LLM
- return:
  - answer
  - citations
  - matched visuals
  - related sections/pages when possible
  - webSearchAvailable flag

==============================================================
WEBSITE DATA FILES
==============================================================

The website needs these files from the pipeline output:
- page_chunks.jsonl
- glossary.json
- sections.json
- visual_assets_index.json
- document_skill_system_prompt.txt

If useful, also leverage:
- page_inventory.json
- page_*.json page records
- suggested_prompts.json
- faq_seeds.json

==============================================================
SUGGESTED PROMPTS
==============================================================

Generate 5 suggested prompt buttons based on the document's content.
These should be interesting, representative questions that showcase the knowledge base's capabilities.
Display them on:
- the landing page
- the chat page
- page/section/detail views where relevant

==============================================================
INTERACTION MODEL (VERY IMPORTANT)
==============================================================

Every important knowledge object should be a clickable entry point.

At minimum, support these flows:

Flow A:
Chat answer → click cited page number → open page explorer or PDF-linked view → click “Ask AI about this page”

Flow B:
Section browser → open section → click representative page or page range → explore page → ask AI

Flow C:
Glossary term → click supporting page → open page explorer → ask AI about the term in context

Flow D:
Chat answer with visual → click visual → open visual detail → jump to source page or ask AI about visual

Flow E:
Any citation/page chip/source reference → open original PDF or page-linked source view

If these flows are weak, the build is not successful.

==============================================================
IMPLEMENTATION PRIORITIES
==============================================================

When forced to choose, prioritize in this order:

1. Strong page-level exploration
2. Strong citation and page navigation
3. Strong cross-linking between knowledge objects
4. Clean section / glossary / visual navigation
5. Good grounded chat
6. Good PDF access
7. Nice landing page
8. Web search fallback polish
9. Secondary extras

If time or context is limited, reduce secondary extras first.
Do not sacrifice the page explorer, citation interactivity, or PDF access.

==============================================================
OPERATING INSTRUCTIONS
==============================================================

- Work autonomously from start to finish
- Complete BOTH Task A and Task B
- Do Gemini API setup first and do not proceed until confirmed
- Process the pipeline in parallel batches where possible
- Use text extraction first, then vision model for visual-heavy pages
- Converting visual pages to images is a required sub-step, not optional
- If context limits are reached, continue in batches and merge at the end
- After environment setup, verify Gemini-dependent steps are actually usable
- After building the website, verify it works by testing at least 3 different questions
- Include at least one question that the document cannot answer, to confirm the web search fallback triggers correctly
- Also test at least:
  - one page-to-chat flow
  - one section/glossary-to-page flow
  - one visual-to-source-page flow

==============================================================
WHEN FINISHED, PROVIDE
==============================================================

1. summary of what was completed
2. location of the output folder
3. URL or instructions to access the website
4. top 5 pages requiring human review
5. 3 example questions you tested and their results, including one web search fallback test
6. explanation of the page explorer / citation navigation behavior
7. list of the main clickable interaction patterns implemented
8. confirmation that Gemini API setup was completed before execution

==============================================================
OPTIONAL FINAL CONSTRAINT
==============================================================

Preserve existing working code where reasonable.
Prefer extending and upgrading the current product architecture rather than rebuilding everything from scratch unless a subsystem is clearly broken.

==============================================================
FINAL INSTRUCTION
==============================================================

Do not stop at a generic summary.
Do not build a generic “chat with PDF” wrapper.
Complete the full pipeline and build an exploration-first, page-aware, citation-driven, multimodal AI knowledge base website that preserves access to the original document and makes the document easy to browse, inspect, and ask about.

```

## The Prompt (Applicable to all AI Agents)

```
You are an autonomous document-ingestion and web-development agent. Your job is to take the attached PDF and complete TWO major tasks end-to-end:

TASK A: Execute the full DocOracle pipeline to transform the PDF into structured JSON data.
TASK B: Build a complete, interactive AI knowledge base website powered by that data.

Do not stop after Task A. You must complete both tasks.

==============================================================
TASK A: Pipeline (PDF to Structured JSON)
==============================================================

Turn the attached PDF into a high-fidelity, citation-ready, multimodal knowledge base.

NON-NEGOTIABLE RULES:
1. Fidelity over elegance — preserve the source material exactly as it appears
2. Citability over fluency — every claim must trace back to a specific page
3. Completeness over prettiness — process EVERY page, even difficult ones
4. Never invent missing content — if it is not in the PDF, do not fabricate it
5. Maintain page boundaries — never merge content across pages
6. Use vision models for visual content — text extraction alone is insufficient for diagrams
7. Work autonomously — do not stop until both tasks are complete

PIPELINE OUTPUT STRUCTURE:

Create the following folder structure:

PDF_PROJECT_OUTPUT/
  00_source/
    source.pdf
    document_manifest.json
  01_inventory/
    page_inventory.json
  02_page_records/
    page_0001.json
    page_0002.json
    ... (one file per page, zero-padded)
  03_visual_reviews/
    high_risk_pages_summary.md
  04_gold_master/
    glossary.json              (KEY FILE: terms, definitions, categories, pages)
    sections.json              (KEY FILE: chapter hierarchy, summaries, keywords)
    faq_seeds.json
  05_retrieval/
    page_chunks.jsonl          (KEY FILE: one JSON line per page chunk)
    section_chunks.jsonl
  06_eval/
    eval_questions.json        (80+ evaluation questions)
  07_skill/
    document_skill.md
    document_skill_system_prompt.txt
  10_visual_assets/
    visual_assets_index.json   (KEY FILE: all visual assets with retrieval tags)
    diagrams/
    tables/
    photos/
    mixed/

PIPELINE STEPS (execute in order):

Step 1 - Source Ingestion: Save PDF, create document_manifest.json with metadata (filename, total_pages, document_type, languages, visual_density, extraction_risk, structure, handling_strategy)

Step 2 - Page Inventory: Classify every page (text / diagram / photo / mixed / table / chart / cover / toc / appendix), assess extraction risk (low / medium / high), create one entry per page in page_inventory.json

Step 3 - Page Records: For every page, create page_NNNN.json with fields: page_number, page_type, section_heading_guess, raw_text_full, layout_preserving_markdown, tables_extracted, captions, footnotes, observed_visual_description, interpreted_page_meaning, uncertainties, keywords, page_summary_strict

Step 4 - Visual Review: For every page with medium/high extraction risk or visual content, perform vision model analysis. Focus on spatial relationships, embedded labels, handwritten content, table structures, diagram flow. Save to high_risk_pages_summary.md

Step 5 - Gold-Master: Merge all data, build glossary.json, sections.json, faq_seeds.json

Step 6 - Retrieval Layer: Create page_chunks.jsonl (one JSON line per page) and section_chunks.jsonl

Step 7 - Evaluation Set: Generate 80+ evaluation questions in eval_questions.json

Step 8 - System Prompt: Generate document_skill.md and document_skill_system_prompt.txt

Step 9 - Visual Assets: Extract images from visual pages, analyze with vision model, create paired metadata JSON per asset, build visual_assets_index.json as master index

KEY DATA FORMATS:

page_chunks.jsonl (one JSON object per line):
{"chunk_id": "page_045", "page_number": 45, "section_path": "Chapter 2 > Studio Techniques", "keywords": ["control room", "acoustics"], "chunk_text": "The control room should...", "has_visual": false}

glossary.json:
[{"term": "Term Name", "definition": "Definition...", "category": "Category", "pages": [10, 11, 12]}]

visual_assets_index.json:
[{"page": 120, "type": "diagram", "description": "Detailed description...", "retrieval_tags": ["tag1", "tag2"], "confidence": "high"}]

==============================================================
TASK B: Website (JSON Data to Interactive AI Knowledge Base)
==============================================================

After completing the pipeline, build a full-stack web application that serves the knowledge base.

STEP 0 — API KEY SETUP (do this BEFORE building anything):

Ask the user the following question before proceeding:

"This website uses the Gemini API for two features: (1) AI chat answers grounded in your document, and (2) a web search fallback when the document cannot answer a question. Do you have a Gemini API key? You can get one for free at https://aistudio.google.com/app/apikey — If you have a key, please provide it now. If you are using an AI agent that already includes Gemini API access natively (such as Manus AI), you may not need to provide a key."

Then:
- If the user provides a key: store it in a .env file as GEMINI_API_KEY=<key> and add .env to .gitignore
- If the user is on an agent with native Gemini access (e.g. Manus AI): use the built-in API helper
- If the user has no key and no native access: set up the website with a placeholder and show a clear setup instruction in the README

REQUIRED WEBSITE FEATURES:

Feature 1 — Landing Page
Design a professional landing page that introduces the knowledge base. Include navigation to Chat, Glossary, and Sections pages. Show 5 suggested prompt buttons that users can click to start a conversation.

Feature 2 — AI Chat Interface
The core feature. Users type questions and receive answers that are:
- Grounded in the document (using retrieved page chunks as context)
- Cited with specific page numbers (e.g. "According to page 45...")
- Accompanied by relevant diagrams or tables when available (matched via retrieval tags from visual_assets_index.json)

Feature 3 — Visual Asset Retrieval
When a user's question matches a diagram, table, or photo via retrieval tag matching, display the visual asset alongside the answer. This is critical for spatial and technical questions.

Feature 4 — Glossary Browser
Display all terms from glossary.json with alphabetical filtering (A-Z letter buttons), category badges, and page references for each term.

Feature 5 — Section Navigator
Display the book structure from sections.json with chapter and section hierarchy, summaries for each section, and keyword tags.

Feature 6 — Image Explanation Button
After complex answers, show a button labeled "Turn into Image Explanation". When clicked, use AI image generation to create a visual summary of the answer. IMPORTANT: Always use the "Nano Banana Pro" model for all image generation in this feature. Do not use any other image generation model.

Feature 7 — Dark/Light Theme Toggle
Support both themes with a toggle button.

Feature 8 — Responsive Design
The website must work correctly on both desktop and mobile.

Feature 9 — Gemini Web Search Fallback (CRITICAL FEATURE)

This feature handles the case where the document does not contain enough information to answer the user's question. Instead of leaving the user with a dead end, the chat interface offers to search the web using Gemini's grounding capability — but only after asking the user for consent.

HOW IT WORKS (User Flow):

Step 1: The AI attempts to answer from the document as normal.

Step 2: If the retrieved evidence is insufficient, the chat UI automatically displays a consent prompt below the document-based answer. The consent prompt should look like this (render as a styled card, not a code block):

    The document doesn't fully cover this topic.

    Would you like me to search the web for related information outside this document?

    [Search the Web]    [No, thanks]

    Note: Web results are from external sources and may not reflect the views or accuracy of this document.

Step 3: If the user clicks "Search the Web":
- Call Gemini API with the google_search tool enabled (grounding)
- Pass both the original question AND a summary of what the document DID say as context
- The prompt to Gemini should be: "The user is reading [document title]. The document says: [brief summary of what was found]. The user wants to know: [original question]. Please search the web for related information and provide a helpful answer, noting which parts come from external sources."
- Display the web search result in a visually distinct panel with a clear label: "From Web Search (External Sources)"
- Show the Gemini grounding citations (URLs) as clickable links

Step 4: If the user clicks "No, thanks": dismiss the consent prompt and show nothing further.

DETECTION LOGIC (how to detect "Document Cannot Answer"):

The backend should flag a response as insufficient and set webSearchAvailable: true when ANY of the following are true:
- The LLM response contains any of these phrases: "the document does not specify", "not mentioned in the text", "the provided text does not", "no information about", "cannot be determined from", "not covered in this document"
- The retrieval search returns fewer than 3 matching chunks with confidence above 0.3
- The top-scoring chunk has a relevance score below 0.25

BACKEND IMPLEMENTATION for web search:

Add a new API endpoint or tRPC procedure called chat.searchWeb with the following contract:

Input fields:
- originalQuestion (string): the user's original question
- documentContext (string): what the document DID say, if anything
- documentTitle (string): the title of the document

Process:
1. Construct a grounded search prompt combining document context and question
2. Call Gemini API with tools: [{ googleSearch: {} }]
3. Extract the response text and grounding metadata (source URLs, titles)
4. Return the answer, sources array, and a disclaimer

Output fields:
- answer (string): Gemini's web-grounded response
- sources (array of objects with title, url, snippet)
- disclaimer (string): "Results from external web sources. Verify independently."

FRONTEND IMPLEMENTATION for web search:

In the chat component, after receiving a response with webSearchAvailable set to true:
1. Render the normal document-based answer first
2. Below it, render the consent card with an amber or yellow left border and subtle background
3. On "Search the Web" click: show a loading spinner, call chat.searchWeb, then render the result in a distinct panel with a blue or teal left border, a globe icon in the header, and an "External Sources" badge
4. On "No, thanks" click: hide the consent card with a smooth fade-out animation
5. Source links should be displayed as small chips or pills below the answer, each showing the domain name

WEBSITE ARCHITECTURE:

Frontend: React + Tailwind CSS (or similar modern framework)
Backend: Express + tRPC (or similar API framework)
LLM: Gemini API (required for web search fallback — see API Key Setup above)
Image Generation: Nano Banana Pro model (required for Feature 6 — do not substitute)

BACKEND SEARCH LOGIC:

The backend must:
- Load the 4 key JSON files at startup
- Implement keyword-based search with weighted fields:
    - Retrieval tags: weight 3x (most important for visual asset matching)
    - Keywords: weight 2x
    - Section path: weight 1.5x
    - Full text: weight 1x
- For each chat query: search for relevant chunks (top 8) and visual assets (top 4), construct a prompt with system prompt + evidence + question, send to LLM, return answer + citations + matched visuals + webSearchAvailable flag

WEBSITE DATA FILES:

The website needs these files from the pipeline output:
- page_chunks.jsonl: load as the searchable text corpus
- glossary.json: load for the glossary page and term tooltips
- sections.json: load for the section navigator
- visual_assets_index.json: load for visual asset retrieval in chat
- document_skill_system_prompt.txt: use as the system prompt for chat

SUGGESTED PROMPTS:

Generate 5 suggested prompt buttons based on the document's content. These should be interesting, representative questions that showcase the knowledge base's capabilities. Display them on the landing page and on the chat page.

OPERATING INSTRUCTIONS:

- Work autonomously from start to finish. Complete BOTH Task A and Task B.
- Process the pipeline in parallel batches where possible.
- Use text extraction first, then vision model for visual-heavy pages.
- If context limits are reached, continue in batches and merge at the end.
- Ask the user about their Gemini API key BEFORE building the website (see Step 0 above).
- After building the website, verify it works by testing at least 3 different questions — including at least one question that the document cannot answer, to confirm the web search fallback triggers correctly.
- When finished, provide: (1) summary of what was completed, (2) location of the output folder, (3) URL or instructions to access the website, (4) top 5 pages requiring human review, (5) 3 example questions you tested and their results including one web search fallback test.

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
| 6 | Image Explanation | AI-generated visual summary using **Nano Banana Pro** model |
| 7 | Dark/Light Theme | Toggle between themes |
| 8 | Responsive Design | Works on desktop and mobile |
| **9** | **Gemini Web Search Fallback** | **When document cannot answer, offers web search with user consent** |

---

## About the Gemini Web Search Fallback

This feature addresses a common limitation of document-based AI systems: the document simply does not contain the answer to every possible question.

**Example scenario:**

> **User asks:** "What are the brands of the mics that are recommended?"
>
> **Document-based answer:** "The provided text does not specify particular brands of microphones recommended for recording cello. It only recommends types of microphones, such as condenser, cardioid, and omnidirectional microphones (p. 90; p. 163)."
>
> **Web search fallback triggers:** The system detects the phrase "does not specify" and displays a consent card asking the user if they want to search the web for microphone brand recommendations.
>
> **If the user consents:** Gemini searches the web and returns brand-specific recommendations (e.g., Neumann, DPA, Schoeps) with source links, clearly labeled as external information.

The key principle is **user consent first** — the system never searches the web without explicitly asking the user. This respects the user's intent (they may only want information from the document) and makes the source of every answer transparent.

---

## About the Nano Banana Pro Image Generation Model

For the "Turn into Image Explanation" feature (Feature 6), the prompt explicitly instructs the AI agent to use the **Nano Banana Pro** model for all image generation. This ensures visual consistency and quality across all generated explanations. If the AI agent or platform does not have access to Nano Banana Pro, it should inform the user and ask how to proceed rather than silently substituting another model.

---

## Tips for Best Results

Different AI agents have different strengths. Here are recommendations:

| AI Agent | Recommendation |
|----------|---------------|
| **Manus AI** | Best for end-to-end execution. Includes native Gemini API access and Nano Banana Pro image generation — no keys needed. Can handle both pipeline and website deployment autonomously. |
| **Claude Cowork** | Excellent at following structured prompts. Will need user to provide Gemini API key for web search fallback. May need manual deployment step. |
| **Open Claw** | Good for pipeline execution. Website building depends on available tools. |
| **Cursor** | Best used after the pipeline is complete — paste the JSON files and ask it to build the website. Will prompt user for Gemini API key. |
| **ChatGPT** | Can execute the pipeline with Code Interpreter. Website building is limited — consider using the pipeline output with a separate tool. |
