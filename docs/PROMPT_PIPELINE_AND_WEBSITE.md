# DocOracle — AI Agent Prompt: Pipeline + Website (End-to-End)

> **What this prompt does:** When you paste this prompt into an AI agent (Manus AI, Open Claw, Claude Cowork, etc.) and attach your PDF, the agent will execute the full DocOracle pipeline AND build a complete, deployable AI knowledge base website — all in one session.
>
> **If you only need the JSON data files** (no website), use [`PROMPT_PIPELINE_ONLY.md`](PROMPT_PIPELINE_ONLY.md) instead.

Choose from the following prompts:
1. [The Prompt (Optimized For Cursor + Claude Opus 4.7 Max)](OPTIMIZED_PROMPT.CURSOR.md)
2. [The Prompt (Optimized For Claude Code)](OPTIMIZED_PROMPT.CURSOR.md)
3. [The Prompt (Optimized For No-Code Website Builder / ANY AI Agent)](OPTIMIZED_PROMPT.CURSOR.md)

---

## How to Use

1. Open a capable AI agent that can create files and build web applications (Manus AI, Open Claw, Claude Cowork, Cursor, etc.)
2. Copy the entire prompt below using the copy button at the top-right of the code block
3. Paste it as your first message
4. Attach your PDF file to the same message
5. Send and wait for the agent to complete both the pipeline and the website

> **Important:** The prompt is one continuous block. Use the copy button — do not manually select text, as the block is long and easy to truncate.

---

## The Prompt (Optimized For Cursor + Claude Opus 4.7 Max*)

> ** *Claude offers superior design and completeness. Even with the higher API costs, the value-to-performance ratio is unbeatable!**

```
You are an autonomous document-ingestion, knowledge-system, and web-product development agent.

Before doing any implementation work, you must first ensure that Gemini API access is properly configured, because later stages of this workflow depend on Gemini for multimodal understanding, including visual page analysis, image-related reasoning, grounded chat, language-adaptive answers, web search fallback, and explanation-image generation.

Do NOT start the pipeline.
Do NOT start building the website.
Do NOT process the PDF yet.

Your first responsibility is to guide the user through Gemini API setup inside Cursor.

==============================================================
STEP 0 — GEMINI API KEY SETUP (MANDATORY, MUST HAPPEN FIRST)
==============================================================

At the very beginning, immediately prompt the user with a clear setup message.
Use language similar to the following:

"This workflow requires Gemini API access before it can begin, because later stages use Gemini for visual page analysis, multimodal document understanding, AI-powered document interaction, response language adaptation, web-grounded fallback, and explanation-image generation.

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

ADDITIONAL CURSOR BEHAVIOR:
Inside Cursor, do not just tell the user to find the environment file manually.
You must proactively open the Environment / .env editing surface for the user inside Cursor if available.
If Cursor supports directly opening the environment variables UI or the .env file tab, do that automatically.
Do not make the user browse folders to locate the environment file.

Required behavior:
- automatically open the Environment tab, environment variable editor, or .env file in Cursor
- if no .env file exists, create it and open it immediately
- place the cursor directly on the GEMINI_API_KEY line
- show the user exactly where to paste the key
- keep the setup flow visible and obvious
- do not proceed until the user confirms the Gemini API key has been pasted

If Cursor has both an Environment variables UI and a .env file workflow, prefer whichever is more direct and least confusing for the user.
The goal is that the user should not need to search through folders to find the environment file manually.

==============================================================
MANDATORY TECH STACK
==============================================================

Use the following stack for the website:
- Next.js
- Tailwind CSS
- TypeScript

The application must be implemented as a proper Next.js app, not as a generic frontend prototype.

For the Next.js bundler / dev pipeline, TurboPack or Webpack are both acceptable.
Choose whichever is more practical for the project.

Other architecture ideas may be mentioned if useful, but the required target stack is:
Next.js + Tailwind CSS + TypeScript

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

After cloning the Cinematic UI repository, check whether the repository contains a SKILL.md file or a valid Cursor skill folder structure.

If a valid Cursor skill is present, try to import or register it as a Cursor skill for this project.
Prefer a project-level skill setup rather than relying only on remote GitHub skill import.

Recommended behavior:
- inspect the cloned repository for SKILL.md
- if the skill is valid, place it in the project-level Cursor skills directory if needed
- make the skill available to the agent for this project
- use the skill as an enhancement to guide design and implementation decisions

Important:
- do not block the project if skill import is unavailable or unreliable
- if the skill cannot be imported cleanly, continue using the cloned repository as a design and implementation reference
- the workflow must still proceed even if Cursor skill discovery does not work
- treat skill import as an optimization, not as a hard dependency

If Cursor skill import from the cloned Git repository does not work reliably, fall back to:
1. reading the SKILL.md file directly
2. extracting its design / implementation guidance
3. applying that guidance manually during the build

CINEMATIC DESIGN DIRECTION:
1. The website should feel cinematic, premium, and art-directed, but still highly usable.
2. It should not feel too scholarly, too stiff, or too text-heavy in presentation.
3. Leave room for design exploration and creativity.
4. Use Cinematic UI as a strong reference so the design does not start from zero.
5. Borrow mood, spacing, motion, polish, and composition techniques from the kit.
6. Adapt those techniques to a document-native product rather than a movie promo site.

Desired design qualities:
- elegant typography
- stronger visual rhythm
- more breathing room
- premium card composition
- more expressive but controlled layout decisions
- subtle cinematic atmosphere
- polished transitions and hover states
- a more intentional sense of mood and hierarchy than a plain utility dashboard

Do NOT blindly copy its architecture, routing, content model, or interaction logic.
Do NOT let cinematic styling override document usability.

This project should look premium, but it must behave like a serious document exploration product.
The final website in this task is a document-native AI knowledge base.
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
RESPONSE LANGUAGE MATCHING REQUIREMENTS (CRITICAL)
==============================================================

The AI Chat must respond in the user's language by default.

This rule applies even when:
- the uploaded PDF is written in a different language
- the source material is primarily in English
- the retrieved evidence comes from English text
- the document language and the user's question language do not match

REQUIRED BEHAVIOR:
1. Detect the language of the user's question.
2. Answer in that same language by default.
3. If the PDF is in another language, first use the document content as evidence, then translate / restate the answer into the user's language.
4. Preserve citations and grounding while adapting the final answer language.
5. Do not simply copy the document language if the user asked in another language.

EXAMPLES:
- If the PDF is in English but the user asks in Traditional Chinese, the response should be in Traditional Chinese.
- If the PDF is in English but the user asks in Japanese, the response should be in Japanese.
- If the user switches languages in a later turn, follow the language of the latest user message unless the user explicitly asks otherwise.

IMPORTANT:
- The answer language should follow the user's language, not the document's language.
- Citations, page numbers, and source references should remain accurate while the explanatory text is translated into the user's language.
- If a technical term is best preserved in the original language, you may include the original term alongside the translated explanation.

==============================================================
DOCUMENT-SPECIFIC VISUAL TAXONOMY REQUIREMENTS
==============================================================

The Visuals page must not rely only on generic pipeline-level visual types such as:
- diagram
- table
- photo
- chart
- mixed

Those generic types are useful for low-level classification, but they are not sufficient as the primary browsing logic for users.

The website must introduce a second-layer, document-specific visual taxonomy derived from the actual content of the uploaded PDF.

This means:
- keep the generic visual type internally for technical classification and filtering
- but also generate higher-level semantic visual categories based on the document's subject matter
- use those semantic categories to improve organization, discovery, and browsing on the Visuals page

EXAMPLES OF DOCUMENT-SPECIFIC VISUAL CATEGORIES:
These are only examples. Do not hardcode them globally.
For a recording-related document, useful semantic visual categories might include:
- Microphones
- Mic types
- Orchestra recording
- Solo recording
- Piano recording
- Chamber recording
- Recording layouts
- Polar patterns
- Stage / room layouts
- Signal diagrams
- Session documentation
- Equipment reference

For a different uploaded PDF, the semantic visual categories must be derived from that PDF's actual content.
Do not reuse the same semantic categories across unrelated documents unless they genuinely fit.

HOW TO BUILD THE VISUAL TAXONOMY:
1. Use the pipeline outputs plus visual descriptions to infer semantic visual topics.
2. Group visuals by what they are about, not only by their low-level image type.
3. Prefer user-meaningful categories over purely technical extraction labels.
4. Limit the semantic taxonomy to a manageable, useful set of categories.
5. Merge redundant categories.
6. Avoid vague buckets that do not help browsing.
7. Ensure the semantic categories reflect the actual document domain.

Each visual asset should ideally have BOTH:
- a low-level type, such as diagram / photo / table / chart / mixed
- a higher-level semantic visual category, such as Microphones or Orchestra recording

VISUALS PAGE REQUIREMENTS:
The Visuals page should support browsing by both:
1. generic type
2. semantic visual category

This means the Visuals interface should not stop at a simple type dropdown.
It should also provide a way to browse or filter by content-aware categories generated from the uploaded PDF.

Preferred UI behavior:
- keep the existing type filter for technical filtering
- add a separate semantic category filter, tabs, chips, or grouped browsing system
- make it obvious to users what kinds of visuals are in the document
- help users discover visuals by topic, not only by file-type logic

VISUAL ORGANIZATION RULES:
- the Visuals page must feel curated and semantically organized
- the first level of discovery should help users understand what the visuals are about
- do not make users guess based only on thumbnails and generic types
- titles, captions, summaries, and categories should work together to explain each visual asset clearly

QUALITY GATE FOR VISUAL TAXONOMY:
Before finalizing the website, verify that:
- the Visuals page does not feel like a flat dump of extracted images
- semantic categories are meaningful for this specific document
- generic types are still available but are not the only browsing mechanism
- the categories help users understand the document's visual knowledge structure
- visual cards feel grouped and organized in a way that matches the document topic

==============================================================
LIGHTBOX IMAGE VIEWER REQUIREMENTS (CRITICAL)
==============================================================

The website contains many image thumbnails, page screenshots, extracted visuals, and preview images.
Users must be able to click or tap these images and open them in a proper Lightbox viewer.

This is not optional.
A separate detail page alone is not sufficient.
If an image is shown in the interface, the user should be able to inspect it more closely through an enlarged viewer.

REQUIRED BEHAVIOR:
1. Clickable / tappable thumbnails
- thumbnails shown in the website should be interactive where appropriate
- users should be able to click or tap them to inspect the image in more detail

2. Lightbox viewer
- when the user opens an image, show it in a Lightbox, modal image viewer, or equivalent focused overlay experience
- the viewer should feel intentional and polished
- do not merely navigate to a static page that still does not allow close inspection

3. Zoom support
Inside the Lightbox viewer, the user should be able to:
- zoom in
- zoom out
- inspect fine details

If useful, also support:
- pan / drag while zoomed
- fit-to-screen behavior
- reset zoom

4. Good sources for the Lightbox
The Lightbox should work for image surfaces such as:
- visual thumbnails
- page screenshots
- extracted diagrams
- extracted photos
- extracted tables where enlargement helps readability
- image previews inside page detail or visual detail views

5. Mobile usability
The Lightbox viewer must also work well on phones and tablets.
Users should be able to inspect images on smaller screens without a broken experience.

QUALITY GATE:
Before finalizing, verify all of the following:
- important image thumbnails are actually clickable
- clicking opens a Lightbox or equivalent viewer
- the user can zoom in and zoom out
- the image can be meaningfully inspected
- the feature works on desktop and mobile

==============================================================
TURN INTO IMAGE EXPLANATION FEATURE REQUIREMENTS (CRITICAL)
==============================================================

The AI Chat must include a working feature called:
Turn into Image Explanation

This is not optional.
This is not a placeholder.
This is not only a visual design element.
It must be a real, functioning capability in the chat experience.

REQUIRED BEHAVIOR:
1. The button must appear in the AI Chat interface
- after assistant answers where visual explanation would be useful
- especially for complex, technical, spatial, structural, process-based, or concept-dense answers

2. The user must be able to tap or click the button directly from the AI Chat answer area
- do not hide it too deeply
- do not make it feel like a secondary debug tool
- make it feel like a natural next action after reading an answer

3. When the user taps the button, the system must generate a detailed explanatory image
- the generated image must explain the assistant's answer visually
- it should help the user understand the answer better
- it should not be a vague decorative image
- it should function as an explanation image, not just a generic illustration

4. The generated output should be detailed and useful
Depending on the answer, the explanation image may take forms such as:
- annotated diagram
- conceptual infographic
- step-by-step visual explanation
- labeled technical illustration
- visual breakdown of relationships, structure, or process

5. The explanation image must be shown back inside the chat experience
- render it inline or directly associated with the answer that generated it
- make it easy for the user to understand that this image is derived from the answer
- keep it visually integrated with the answer flow

6. Use Nano Banana Pro only
This feature must use the Nano Banana Pro model for image generation.
Do not substitute another image model.
Do not leave the model ambiguous.
Do not implement the button without actually wiring it to Nano Banana Pro.

QUALITY GATE:
Before finalizing, verify all of the following:
- the button visibly exists in the chat UI
- the user can tap it from an assistant answer
- tapping it triggers real image generation
- the generation uses Nano Banana Pro
- the returned image meaningfully explains the answer
- the image is displayed back inside the AI Chat experience

==============================================================
REAL PAGE IMAGE RENDERING REQUIREMENTS (CRITICAL)
==============================================================

It is not sufficient to classify visual pages or describe them through text analysis.
The pipeline must render actual PDF pages into real image files that can be displayed in the website.

This is mandatory.
Do not treat page-image rendering as optional, deferred, or implied.

REQUIRED BEHAVIOR:
1. Render PDF pages into actual image files
- render pages from the PDF into PNG or another high-quality web-displayable image format
- preserve page order and page numbering
- generate real files, not just metadata
- ensure the output images are displayable in the browser

2. Store rendered page images in a structured directory
Use a predictable, stable structure such as:
- page-images/
- pages/
- rendered-pages/
- or a similarly clear output directory

The filenames should remain page-addressable, for example:
- page_0001.png
- page_0002.png
- page_0003.png

3. Make the rendered images available to the website
- expose them through a static path, asset route, storage URL, or equivalent delivery mechanism
- ensure the frontend can access and render them without manual intervention
- do not stop at filesystem output only

4. Use real rendered page images throughout the product
These rendered images should power:
- page thumbnails
- page detail views
- visual asset previews where relevant
- clickable page previews
- source previews in the UI where appropriate

5. Distinguish between full rendered page images and extracted visual assets
- full page renders are required for page browsing and source fidelity
- extracted visual assets are separate objects derived from full pages
- both layers must exist if the website is to function properly

QUALITY GATE:
Before finalizing, verify all of the following:
- the PDF pages were actually rendered into image files
- the rendered files exist at a stable path
- the website successfully displays those images
- page cards, page detail views, and relevant visual views are using real image assets
- no placeholder, blank, or missing image behavior remains

==============================================================
DATA QUALITY, INFORMATION ARCHITECTURE, AND ORGANIZATION REQUIREMENTS
==============================================================

The generated website must not merely expose raw extracted data.
It must normalize, organize, clean, and structure the document data before presenting it in the UI.

The current failure modes to avoid include:
- generic page titles like "Page 3" when a better label can be inferred
- repeated or low-value section names such as the same title appearing over and over without real hierarchy
- broken page ranges such as reversed ranges or illogical ranges
- cards showing noisy raw extraction instead of a clean summary
- sections that feel duplicated, fragmented, or semantically weak
- visual badges shown too broadly or inaccurately
- messy table-of-contents text dumped directly into cards
- weak distinction between chapter, section, subsection, and page-level objects
- disorganized browsing that makes the data feel messy even if extraction succeeded

The agent must actively improve information organization before shipping the UI.
Do not treat first-pass extraction output as presentation-ready.

REQUIRED DATA NORMALIZATION PASSES:
1. Title normalization
- infer the best available human-readable title for each page
- avoid default labels like "Page 3" unless no better label can be derived
- prefer actual headings, page headings, section headings, figure labels, or meaningful short descriptors

2. Section hierarchy cleanup
- deduplicate near-duplicate sections
- merge weak or repetitive section labels when they clearly refer to the same conceptual section
- distinguish chapter-level and section-level objects clearly
- ensure section ordering is logical and follows page order
- do not allow obviously broken ranges such as page_end < page_start

3. Summary cleanup
- create clean, concise summaries for pages and sections
- do not dump long raw OCR-like text into cards
- avoid showing noisy table-of-contents fragments as if they were polished summaries
- trim and rewrite summaries for clarity while preserving fidelity to the source

4. Metadata cleanup
- only mark pages as visual when visual evidence is meaningful
- ensure page-type labels are accurate and not over-applied
- normalize keywords and tags to reduce redundancy
- remove obvious junk tokens, repeated fragments, and extraction artifacts

5. Browse UX cleanup
- page cards, section cards, glossary cards, and visual cards should feel curated rather than raw
- each card should show only the most useful metadata
- users should be able to understand the document structure quickly without reading messy blobs of extracted text

PRESENTATION RULES FOR BROWSE PAGES:

Pages page:
- each page card should show a clean title
- a short, high-value summary or preview, not a noisy text dump
- accurate page type badges
- visual badge only when justified
- strong click target and clean hierarchy

Sections page:
- section cards must represent meaningful sections, not weak or repetitive fragments
- page ranges must be valid and trustworthy
- summaries must be concise and semantically useful
- tags should be selective, not cluttered
- if the extracted hierarchy is weak, the agent must repair it before rendering

Glossary page:
- term definitions must be clean and deduplicated
- repeated or overlapping terms should be normalized where appropriate
- page references should be accurate and clickable

Visuals page:
- visual assets should be grouped and labeled clearly
- avoid over-tagging everything as visual if not useful
- visual descriptions should be concise but informative

QUALITY GATE BEFORE FINALIZING THE WEBSITE:
Before finalizing the website, the agent must inspect whether the browsing experience feels organized.
Specifically verify:
- page titles are meaningful
- section titles are not repetitive junk
- page ranges are valid
- summaries are readable
- extracted noise is suppressed
- cards feel curated
- the browsing interface helps users understand the document instead of exposing extraction mess

If the data feels disorganized, the agent must improve the normalization and presentation layers before considering the task complete.

==============================================================
CHAT UX, LAYOUT, AND INTERACTION REQUIREMENTS
==============================================================

The Chat page must feel significantly more polished, structured, and intentional than a basic prompt-response interface.
Do not let the chat become a single large text slab followed by loosely attached elements.

COMMON FAILURE MODES TO AVOID:
- the answer block feels like a wall of text
- related visuals feel randomly appended rather than meaningfully connected
- citations become cluttered and repetitive
- the composer overlaps or visually interferes with content below it
- actions are unclear or weak
- the conversation lacks hierarchy between question, answer, citations, visuals, and next actions
- too many low-value citation chips are shown without prioritization
- layout feels plain, flat, or dashboard-like rather than premium and intentional

REQUIRED CHAT PAGE IMPROVEMENTS:

1. Strong answer hierarchy
The answer should be broken into meaningful visual blocks when appropriate:
- lead answer / direct answer
- supporting points
- cited evidence
- related visuals
- next actions

2. Better citation presentation
- citations should be clickable and visually tidy
- do not dump too many citation chips at equal visual priority
- prioritize the most relevant citations first
- allow overflow citations to collapse under “show more” if needed
- distinguish between page citations, section references, and figure references

3. Better related visuals presentation
- related visuals must be relevance-ranked, not just loosely attached
- do not show visuals that feel weakly related
- if visuals are shown, make the relationship clear
- visual cards should feel integrated into the answer, not like unrelated thumbnails

4. Better composer behavior
- the chat input area must not awkwardly overlap key answer content
- sticky or docked composer behavior is acceptable, but it must feel intentional
- on both desktop and mobile, the composer must remain usable without blocking important content
- spacing around the composer must be carefully designed

5. Better action design
After an answer, the UI should offer clear next actions such as:
- Ask follow-up
- Open cited page
- Open source PDF
- View related visual
- Ask about this section
- Turn into Image Explanation

These actions should be visually coherent and easy to scan.

6. Better conversation flow
Each response should help the user move forward.
Do not stop at a correct answer.
The chat should naturally suggest deeper exploration through:
- the most relevant page
- the most relevant section
- the most relevant visual
- the most useful follow-up question

7. Better layout composition
The chat page should feel designed, not merely assembled.
Use layout techniques such as:
- controlled content width
- proper vertical spacing
- differentiated card zones
- strong alignment
- grouped content blocks
- clear separation between answer body and metadata

8. Better visual tone
The chat page should inherit premium cinematic polish from the design reference, while staying readable and useful.
It should not feel plain, generic, or overly utilitarian.

DESIRED CHAT PAGE STRUCTURE:
A strong answer view may contain, in order:
- user question bubble
- assistant answer card
- concise direct answer at the top
- structured supporting details below
- inline or grouped citations
- related visuals block
- suggested next block
- action row
- composer area

The exact execution may vary, but the hierarchy must be clear.

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
    glossary.json
    sections.json
    faq_seeds.json
    suggested_prompts.json
  05_retrieval/
    page_chunks.jsonl
    section_chunks.jsonl
  06_eval/
    eval_questions.json
  07_skill/
    document_skill.md
    document_skill_system_prompt.txt
  10_visual_assets/
    visual_assets_index.json
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

E. Converting PDF pages to actual image files
This is mandatory.
Do not only convert a subset in theory.
You must render real PDF pages into actual image files.

At minimum:
- render all pages needed for website display and browsing
- render visual-heavy pages for visual analysis and asset extraction
- preserve page numbering
- store them in a stable, structured processing and/or output location
- use those rendered page images for later visual analysis, visual asset extraction, page thumbnails, and page detail UI
- ensure the frontend can actually display the rendered output

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

PRE-PRESENTATION CURATION REQUIREMENT:
Before rendering extracted data into the website, run a curation / normalization layer that transforms raw extraction output into presentation-ready browse objects.
This layer should improve:
- titles
- summaries
- hierarchy
- ranges
- tags
- labels
- preview text

The UI should display curated browse objects, not raw extraction blobs.

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
Users type questions and receive answers that are:
- grounded in the document using retrieved page chunks
- cited with specific page numbers
- accompanied by relevant diagrams or tables when available
- connected to related sections / pages / visuals when possible
- returned in the language of the user's latest message by default

Feature 2A — Rich Text Answer Rendering (CRITICAL)
The AI chat response must be rendered in rich text format, not as plain raw text.
The answer renderer must support clean, readable formatting such as:
- paragraphs
- bullet points
- numbered lists
- bold text
- inline citation chips
- section headers where appropriate
- spacing between blocks
- linked page references

The output should feel editorial, readable, and polished.
Do not render the assistant response as a flat wall of plain text.
If markdown is used internally, it must be rendered into polished rich text UI on the frontend.
The final appearance should look like a premium knowledge product, not a raw markdown dump.

Desired answer presentation:
- good line height
- clear paragraph spacing
- visually distinct bullet lists
- citation chips embedded inline or adjacent to claims
- well-formatted follow-up suggestions
- related visuals presented as structured cards below the answer when relevant

Feature 2B — Chat History Tab (CRITICAL)
The Chat page must include a dedicated Chat History tab or equivalent history panel where users can view their past conversations and prior interactions with the chat.

The history experience should support:
- viewing previous chat sessions
- viewing prior messages within a session
- reopening a past conversation
- restoring the conversation into the current chat view
- preserving prior assistant answers, citations, and related interaction context where feasible
- making it easy for users to continue an older conversation instead of starting from scratch

At minimum, the Chat History tab should allow users to:
- see a list of past conversations
- identify them by title, first prompt, timestamp, or other useful preview metadata
- click one to reopen it
- continue chatting from that state

If appropriate, also preserve interaction history such as:
- cited pages previously clicked
- visuals previously opened
- page-specific prompts that were used
- web search fallback usage

The Chat History tab must be designed clearly for both desktop and mobile.
Do not hide it in a way that makes it hard to discover.

Feature 2C — Premium Chat Layout and Flow (CRITICAL)
The Chat page must be intentionally designed as a premium conversational research interface.
It must improve:
- answer hierarchy
- citation presentation
- related visual relevance
- follow-up action clarity
- composer placement
- spacing and readability
- conversation continuity

The assistant answer should not feel like one large undifferentiated block followed by miscellaneous UI fragments.
It should feel structured, rich, and navigable.

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

Feature 6 — Image Explanation Button (CRITICAL)
After complex or visually explainable answers, show a button labeled "Turn into Image Explanation".
In the AI Chat, the user must be able to tap or click this button directly from the assistant answer area.
When clicked, it must generate a detailed explanation image that visually explains the user's answer / the assistant's answer in a useful way.
This is not a decorative image feature.
It is an explanation-image feature.
The generated image should help the user understand the answer better.
IMPORTANT: Always use the "Nano Banana Pro" model for all image generation in this feature. Do not use any other image generation model.
The resulting explanation image must be shown back inside the chat experience in direct association with the answer that triggered it.

Feature 7 — Dark/Light Theme Toggle
Support both themes with a toggle button.

Feature 8 — Responsive Design
The website must work correctly on both desktop and mobile.

Feature 8A — Full Device Responsiveness (CRITICAL)
All website elements, layouts, and interactions must be fully responsive across device sizes, especially for phone users.
Do not treat mobile responsiveness as an afterthought.
The website must be intentionally designed for:
- mobile phones
- tablets
- laptops
- desktop screens

This requirement applies to all major UI surfaces, including:
- landing page
- chat page
- answer cards
- citation chips
- glossary browser
- section navigator
- page explorer
- visual asset browser
- visual detail views
- PDF access links or source actions
- consent cards
- follow-up action buttons
- navigation headers and menus

Mobile-specific expectations:
- no text overflow
- no clipped citation chips
- no broken card widths
- no horizontal scrolling unless explicitly justified
- buttons must be finger-friendly
- tap targets must be large enough
- stacked layouts should remain readable
- cards and grids should collapse gracefully
- long answers should remain easy to scan on narrow screens
- visual assets should scale cleanly without breaking the layout
- fixed headers / footers must not obstruct core content

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

Feature 10A — Real Page Thumbnails and Rendered Source Images (CRITICAL)
The website must use actual rendered PDF page images for browsing and page detail experiences.
It must not rely only on text summaries or inferred visual metadata.

At minimum:
- page cards should be able to show real page thumbnails where appropriate
- page detail views should have access to real rendered page images
- the frontend must be wired to actual image files or URLs generated from the PDF rendering pipeline

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
- filter by document-specific semantic visual category
- open a visual detail view
- inspect description and source page
- jump back to source page
- ask AI about a specific visual

Feature 14A — Lightbox Image Viewer (CRITICAL)
Image thumbnails and previews across the website must support a proper Lightbox or modal image viewer with zoom in / zoom out capabilities.
This is especially important for visuals, extracted diagrams, full-page screenshots, and any image where close inspection matters.
A dedicated detail page alone is not enough if the image still cannot be enlarged and inspected.

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
- Next.js
- Tailwind CSS
- TypeScript

Backend:
- Next.js server routes / route handlers, or tRPC if useful
- use the simplest architecture that still preserves strong type safety and clean separation of concerns

LLM:
- Gemini API (required for web search fallback, multimodal document analysis, response language adaptation, and explanation-image generation)

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
- instruct the model to answer in the user's language
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

RICH TEXT AND RESPONSIVE UI REQUIREMENTS:
- The chat answer UI must render rich text, not plain raw text blocks.
- The frontend should use a proper renderer for formatted assistant content.
- Typography, spacing, list styling, citations, and follow-up actions must all be visually polished.
- All UI surfaces must be fully device responsive, especially on phones.
- The agent must inspect layouts on narrow viewports and adjust components where needed.

CHAT HISTORY REQUIREMENTS:
- The Chat page must include a Chat History tab, drawer, sidebar, or equivalent clearly accessible history surface.
- Users must be able to revisit previous conversations and continue them.
- The history UI must also be responsive and usable on phones.

INFORMATION ARCHITECTURE REQUIREMENTS:
- The browsing experience must feel organized, trustworthy, and semantically coherent.
- Do not show low-quality extraction output directly in cards when it can be normalized.
- Prefer fewer, better section objects over many messy or repetitive ones.
- Prefer clean previews over long noisy text fragments.
- Ensure card layouts support quick scanning and clear hierarchy.

VISUAL TAXONOMY AND FILTERING REQUIREMENTS:
- Keep generic visual types for backend / technical use.
- Also generate document-specific semantic visual categories from the uploaded PDF.
- The Visuals page must support filtering or browsing by those semantic categories.
- Do not rely only on generic type labels as the primary organization system.
- Visual browsing should feel topic-aware and document-aware.

==============================================================
IMPLEMENTATION PRIORITIES
==============================================================

When forced to choose, prioritize in this order:
1. Strong page-level exploration
2. Strong citation and page navigation
3. Data normalization and browse-page organization
4. Information architecture clarity
5. Premium chat layout, hierarchy, and conversation flow
6. Document-specific visual taxonomy and filtering
7. Strong cross-linking between knowledge objects
8. Rich text answer rendering quality
9. Mobile responsiveness and phone usability
10. Clean section / glossary / visual navigation
11. Good grounded chat
12. Good PDF access
13. Nice landing page
14. Web search fallback polish
15. Secondary extras

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
- Rendering real PDF pages into actual image files is a required sub-step, not optional
- Do not stop at text-only visual analysis; ensure rendered page images are produced and connected to the frontend
- If context limits are reached, continue in batches and merge at the end
- After environment setup, verify Gemini-dependent steps are actually usable
- Ensure the AI chat response is rendered as rich text, not plain raw text
- Ensure the Chat page includes a clearly accessible Chat History tab or history panel
- Verify that past chat sessions can be reopened and continued correctly
- Verify that the Chat page feels organized, premium, and easy to continue using after each answer
- Remove weakly related visuals or low-signal citations that clutter the answer view
- Ensure the composer, answer card, citations, related visuals, and next actions work as one coherent flow
- Verify that the Turn into Image Explanation button exists, works, and uses Nano Banana Pro
- Verify that tapping the button returns a detailed explanation image inside the chat flow
- Verify that image thumbnails and previews can open in a Lightbox with zoom support
- Verify that actual rendered PDF page images exist, are served correctly, and appear in the UI
- Ensure page thumbnails and page-detail visuals are using real rendered images rather than text-only placeholders
- Verify that page cards and section cards do not expose messy raw extraction output
- Verify that titles, summaries, page ranges, and badges are normalized and trustworthy
- Fix repetitive or semantically weak section labels before finalizing
- Verify that the Visuals page is organized by meaningful document-specific visual categories, not only generic types
- Ensure semantic visual filters are useful and intuitive for this document
- Test mobile responsiveness carefully across all major pages and interaction surfaces
- Verify that answer cards, citation chips, buttons, visuals, navigation, and lightbox behavior all remain usable on phones
- Verify response language matching: asking in Traditional Chinese returns Traditional Chinese, asking in English returns English, asking in another supported language returns that language
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

Deployment hardening requirement for hosting platforms (e.g. Vercel):

Make this app self-contained for deployment. Do not rely on sibling folders, parent directories, or local-only filesystem paths at runtime.

Requirements:
1. Bundle all extracted book data needed by the app into the app project itself at build time.
2. Automatically detect the source PDF if it exists at the workspace root as `source.pdf`.
3. Update the bundling/build scripts so that, during build preparation, the root-level `source.pdf` is copied into the app's deployable public assets (for example `public/source.pdf`) automatically.
4. If extracted data currently lives outside the app folder (for example in a sibling `PDF_PROJECT_OUTPUT` directory), generate bundled artifacts inside the app so Vercel can deploy them without needing external filesystem access.
5. Ensure the production app does not depend on runtime reads from paths like `../PDF_PROJECT_OUTPUT` or other non-deployed local paths.
6. Add safe fallback logic:
   - prefer bundled/generated in-app data in production
   - allow local external data only as a development convenience
7. Verify that the deployed app can:
   - serve the PDF from the deployed site
   - load non-zero page/section/glossary/visual counts
   - work even if the original external data folders are absent in Vercel
8. Before finishing, run a production build and confirm the app is deployment-ready.

Implementation guidance:
- Treat `source.pdf` at workspace root as the canonical default input PDF unless a more explicit configured path is provided.
- Update package scripts and bundling scripts as needed so this happens automatically before build.
- Prefer a deterministic generated-data folder inside the app (for example `src/generated`).
- If existing gold-master JSON files are empty, synthesize usable fallback data from page records/chunks so the deployed UI does not show zeros.
- Do not leave the app depending on undeployed local files.

Success criteria:
- `public/source.pdf` exists in the deployable app output when a root `source.pdf` exists.
- The deployed Vercel app is self-contained and does not break when external local folders are missing.

LASTLY:

- After the full workflow is complete, start the local development server and open the localhost preview automatically inside Cursor if possible.
- Prefer opening the website in Cursor's built-in preview / portal so the user can immediately inspect the final website without manually starting or locating it.
- If the app runs on a standard local port such as localhost:3000, localhost:3001, or another detected port, open that live preview for the user automatically after the build succeeds.
- Do not stop at code completion alone; the final workflow should end with a working localhost preview of the website visible to the user inside Cursor.
- The task is not complete until the website is running locally and a live localhost preview has been opened for inspection inside Cursor.

```

## The Prompt (Optimized for AI Agents & No-Code Website Building Platform)

```
You are an autonomous document-ingestion, knowledge-system, and web-product development agent working inside an AI agent, a no-code or vibe-coded web app builder environment such as Lovable, Base44, VibeCode.dev, or similar platforms.

Your job is to take the attached PDF and complete TWO major tasks end-to-end:

TASK A: Execute the full DocOracle pipeline to transform the PDF into structured JSON data.
TASK B: Build a complete, interactive AI knowledge base website powered by that data.

Do not stop after Task A.
You must complete both tasks.

This is not just a chatbot website.
This is not just a PDF-to-JSON conversion workflow.
The final product must feel like a document-native, exploration-first knowledge workspace where users can browse, inspect, click through, and ask AI about specific pages, sections, glossary terms, and visuals.

==============================================================
PLATFORM CONTEXT
==============================================================

This prompt is intended for no-code / low-code / vibe-coded web app builders.
That means:
- do not assume Cursor-specific IDE behaviors
- do not assume direct file-tree editing workflows
- do not assume the user is manually coding every file
- prefer platform-native flows for environment variables, data storage, file uploads, server functions, API connections, asset hosting, and deployment
- if the builder provides built-in database, storage, auth, server actions, functions, edge routes, or environment variable panels, use those where appropriate
- adapt implementation details to the builder environment while preserving the product requirements

If the platform has limitations, preserve the product behavior as much as possible rather than abandoning key requirements.

==============================================================
STEP 0 — GEMINI API SETUP (MANDATORY, MUST HAPPEN FIRST)
==============================================================

Before doing any pipeline or website work, you must first ensure that Gemini API access is configured.
Do not proceed until Gemini API access is clearly set up.

At the very beginning, immediately prompt the user with a clear setup message.
Use language similar to the following:

"This workflow requires Gemini API access before it can begin, because later stages use Gemini for visual page analysis, multimodal document understanding, grounded chat, and explanation-image generation.

Please set up your Gemini API key first.

You can create a Gemini API key here:
https://aistudio.google.com/app/apikey

I will now guide you to the correct environment variable or secrets configuration area in this builder so you can paste your key safely."

Then do the following in a platform-appropriate way:

1. Check whether the platform has an Environment Variables, Secrets, API Keys, or similar configuration panel.
2. If such a panel exists, direct the user there and prepare the variable name:
   GEMINI_API_KEY
3. If the platform instead uses a .env-like mechanism, create or populate it appropriately.
4. Make it obvious where the user should paste the key.
5. Wait until the user confirms the key has been added.
6. Only after confirmation, continue with the rest of the workflow.

IMPORTANT SETUP RULES:
- Do not bury this step later in the workflow.
- Do not merely mention the API key in documentation.
- Do not continue assuming the key exists.
- Do not proceed to pipeline execution until Gemini setup is confirmed.
- If the platform supports a native secrets or environment manager, prefer that over manual file editing.
- If the user says their platform already includes native Gemini access, explicitly confirm that before proceeding.
- If the key is missing or invalid, stop and explain that the workflow cannot reliably continue.

==============================================================
VISUAL DESIGN REFERENCE
==============================================================

Use the following repository as a visual design reference:

git clone https://github.com/akseolabs-seo/cinematic-ui

This reference is for visual direction only.
Use it to study:
- visual hierarchy
- spacing
- typography
- motion / transitions
- premium composition
- landing-page polish
- component presentation quality

Do NOT blindly copy its architecture, routing, content model, or interaction logic.
Do NOT let cinematic styling override document usability.

The final website should feel cinematic, premium, and art-directed, but still highly usable.
It should not feel too academic, too stiff, or too text-heavy in presentation.
Leave room for design exploration and creativity.
Use Cinematic UI as a strong reference so the design does not start from zero.
Borrow mood, spacing, motion, polish, and composition techniques from the kit.
Adapt those techniques to a document-native product rather than a movie promo site.

Desired design qualities:
- elegant typography
- stronger visual rhythm
- more breathing room
- premium card composition
- more expressive but controlled layout decisions
- subtle cinematic atmosphere
- polished transitions and hover states
- a more intentional sense of mood and hierarchy than a plain utility dashboard

==============================================================
MANDATORY TECH DIRECTION
==============================================================

Target a modern web app architecture appropriate for a no-code / low-code builder.
If the platform supports React / Next.js style generation, prefer:
- Next.js
- Tailwind CSS
- TypeScript

The application must be implemented as a proper Next.js app, not as a generic frontend prototype.

For the Next.js bundler / dev pipeline, TurboPack or Webpack are both acceptable.
Choose whichever is more practical for the project.

Other architecture ideas may be mentioned if useful, but the required target stack is:
Next.js + Tailwind CSS + TypeScript

The most important thing is not the exact framework label.
The most important thing is preserving:
- document-native browsing
- responsive design
- rich chat rendering
- page explorer
- clickable citations
- visual taxonomy
- rendered page images
- Gemini-powered multimodal behavior
- explanation-image generation

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
TURN INTO IMAGE EXPLANATION FEATURE REQUIREMENTS (CRITICAL)
==============================================================

The AI Chat must include a working feature called:
Turn into Image Explanation

This is not optional.
This is not a placeholder.
This is not only a visual design element.
It must be a real, functioning capability in the chat experience.

REQUIRED BEHAVIOR:

1. The button must appear in the AI Chat interface
- after assistant answers where visual explanation would be useful
- especially for complex, technical, spatial, structural, process-based, or concept-dense answers

2. The user must be able to tap or click the button directly from the AI Chat answer area
- do not hide it too deeply
- do not make it feel like a secondary debug tool
- make it feel like a natural next action after reading an answer

3. When the user taps the button, the system must generate a detailed explanatory image
- the generated image must explain the assistant's answer visually
- it should help the user understand the answer better
- it should not be a vague decorative image
- it should function as an explanation image, not just a generic illustration

4. The generated output should be detailed and useful
Depending on the answer, the explanation image may take forms such as:
- annotated diagram
- conceptual infographic
- step-by-step visual explanation
- labeled technical illustration
- visual breakdown of relationships, structure, or process

5. The explanation image must be shown back inside the chat experience
- render it inline or directly associated with the answer that generated it
- make it easy for the user to understand that this image is derived from the answer
- keep it visually integrated with the answer flow

6. Use Nano Banana Pro only
This feature must use the Nano Banana Pro model for image generation.
Do not substitute another image model.
Do not leave the model ambiguous.
Do not implement the button without actually wiring it to Nano Banana Pro.

QUALITY GATE:
Before finalizing, verify all of the following:
- the button visibly exists in the chat UI
- the user can tap it from an assistant answer
- tapping it triggers real image generation
- the generation uses Nano Banana Pro
- the returned image meaningfully explains the answer
- the image is displayed back inside the AI Chat experience

==============================================================
REAL PAGE IMAGE RENDERING REQUIREMENTS (CRITICAL)
==============================================================

It is not sufficient to classify visual pages or describe them through text analysis.
The pipeline must render actual PDF pages into real image files that can be displayed in the website.

This is mandatory.
Do not treat page-image rendering as optional, deferred, or implied.

REQUIRED BEHAVIOR:

1. Render PDF pages into actual image files
- render pages from the PDF into PNG or another high-quality web-displayable image format
- preserve page order and page numbering
- generate real files, not just metadata
- ensure the output images are displayable in the browser

2. Store rendered page images in a structured location
- use the platform's native storage, file system abstraction, asset hosting, object storage, or equivalent mechanism
- keep paths stable and page-addressable
- use predictable naming such as page_0001.png, page_0002.png, etc.

3. Make the rendered images available to the website
- expose them through a static path, asset route, storage URL, CDN URL, or equivalent delivery mechanism
- ensure the frontend can access and render them without manual intervention
- do not stop at storage only

4. Use real rendered page images throughout the product
These rendered images should power:
- page thumbnails
- page detail views
- visual asset previews where relevant
- clickable page previews
- source previews in the UI where appropriate

5. Distinguish between full rendered page images and extracted visual assets
- full page renders are required for page browsing and source fidelity
- extracted visual assets are separate objects derived from full pages
- both layers must exist if the website is to function properly

QUALITY GATE:
Before finalizing, verify all of the following:
- the PDF pages were actually rendered into image files
- the rendered files exist at a stable path or hosted URL
- the website successfully displays those images
- page cards, page detail views, and relevant visual views are using real image assets
- no placeholder, blank, or missing image behavior remains

==============================================================
DOCUMENT-SPECIFIC VISUAL TAXONOMY REQUIREMENTS
==============================================================

The Visuals page must not rely only on generic pipeline-level visual types such as:
- diagram
- table
- photo
- chart
- mixed

Those generic types are useful for low-level classification, but they are not sufficient as the primary browsing logic for users.

The website must introduce a second-layer, document-specific visual taxonomy derived from the actual content of the uploaded PDF.

This means:
- keep the generic visual type internally for technical classification and filtering
- but also generate higher-level semantic visual categories based on the document's subject matter
- use those semantic categories to improve organization, discovery, and browsing on the Visuals page

For example, for a recording-related document, useful semantic visual categories might include:
- Microphones
- Mic types
- Orchestra recording
- Solo recording
- Piano recording
- Chamber recording
- Recording layouts
- Polar patterns
- Stage / room layouts
- Signal diagrams
- Session documentation
- Equipment reference

For a different uploaded PDF, the semantic visual categories must be derived from that PDF's actual content.
Do not reuse the same semantic categories across unrelated documents unless they genuinely fit.

HOW TO BUILD THE VISUAL TAXONOMY:
- use the pipeline outputs plus visual descriptions to infer semantic visual topics
- group visuals by what they are about, not only by their low-level image type
- prefer user-meaningful categories over purely technical extraction labels
- limit the semantic taxonomy to a manageable, useful set of categories
- merge redundant categories
- avoid vague buckets that do not help browsing
- ensure the semantic categories reflect the actual document domain

Each visual asset should ideally have BOTH:
- a low-level type, such as diagram / photo / table / chart / mixed
- a higher-level semantic visual category, such as Microphones or Orchestra recording

The Visuals page should support browsing by both:
1. generic type
2. semantic visual category

==============================================================
DATA QUALITY, INFORMATION ARCHITECTURE, AND ORGANIZATION REQUIREMENTS
==============================================================

The generated website must not merely expose raw extracted data.
It must normalize, organize, clean, and structure the document data before presenting it in the UI.

The current failure modes to avoid include:
- generic page titles like "Page 3" when a better label can be inferred
- repeated or low-value section names such as the same title appearing over and over without real hierarchy
- broken page ranges such as reversed ranges or illogical ranges
- cards showing noisy raw extraction instead of a clean summary
- sections that feel duplicated, fragmented, or semantically weak
- visual badges shown too broadly or inaccurately
- messy table-of-contents text dumped directly into cards
- weak distinction between chapter, section, subsection, and page-level objects
- disorganized browsing that makes the data feel messy even if extraction succeeded

The agent must actively improve information organization before shipping the UI.
Do not treat first-pass extraction output as presentation-ready.

REQUIRED DATA NORMALIZATION PASSES:

1. Title normalization
- infer the best available human-readable title for each page
- avoid default labels like "Page 3" unless no better label can be derived
- prefer actual headings, page headings, section headings, figure labels, or meaningful short descriptors

2. Section hierarchy cleanup
- deduplicate near-duplicate sections
- merge weak or repetitive section labels when they clearly refer to the same conceptual section
- distinguish chapter-level and section-level objects clearly
- ensure section ordering is logical and follows page order
- do not allow obviously broken ranges such as page_end < page_start

3. Summary cleanup
- create clean, concise summaries for pages and sections
- do not dump long raw OCR-like text into cards
- avoid showing noisy table-of-contents fragments as if they were polished summaries
- trim and rewrite summaries for clarity while preserving fidelity to the source

4. Metadata cleanup
- only mark pages as visual when visual evidence is meaningful
- ensure page-type labels are accurate and not over-applied
- normalize keywords and tags to reduce redundancy
- remove obvious junk tokens, repeated fragments, and extraction artifacts

5. Browse UX cleanup
- page cards, section cards, glossary cards, and visual cards should feel curated rather than raw
- each card should show only the most useful metadata
- users should be able to understand the document structure quickly without reading messy blobs of extracted text

==============================================================
CHAT UX, LAYOUT, AND INTERACTION REQUIREMENTS
==============================================================

The Chat page must feel significantly more polished, structured, and intentional than a basic prompt-response interface.
Do not let the chat become a single large text slab followed by loosely attached elements.

COMMON FAILURE MODES TO AVOID:
- the answer block feels like a wall of text
- related visuals feel randomly appended rather than meaningfully connected
- citations become cluttered and repetitive
- the composer overlaps or visually interferes with content below it
- actions are unclear or weak
- the conversation lacks hierarchy between question, answer, citations, visuals, and next actions
- too many low-value citation chips are shown without prioritization
- layout feels plain, flat, or dashboard-like rather than premium and intentional

REQUIRED CHAT PAGE IMPROVEMENTS:

1. Strong answer hierarchy
The answer should be broken into meaningful visual blocks when appropriate:
- lead answer / direct answer
- supporting points
- cited evidence
- related visuals
- next actions

2. Better citation presentation
- citations should be clickable and visually tidy
- do not dump too many citation chips at equal visual priority
- prioritize the most relevant citations first
- allow overflow citations to collapse under “show more” if needed
- distinguish between page citations, section references, and figure references

3. Better related visuals presentation
- related visuals must be relevance-ranked, not just loosely attached
- do not show visuals that feel weakly related
- if visuals are shown, make the relationship clear
- visual cards should feel integrated into the answer, not like unrelated thumbnails

4. Better composer behavior
- the chat input area must not awkwardly overlap key answer content
- sticky or docked composer behavior is acceptable, but it must feel intentional
- on both desktop and mobile, the composer must remain usable without blocking important content
- spacing around the composer must be carefully designed

5. Better action design
After an answer, the UI should offer clear next actions such as:
- Ask follow-up
- Open cited page
- Open source PDF
- View related visual
- Ask about this section
- Turn into Image Explanation

6. Better conversation flow
Each response should help the user move forward.
Do not stop at a correct answer.
The chat should naturally suggest deeper exploration through:
- the most relevant page
- the most relevant section
- the most relevant visual
- the most useful follow-up question

7. Better layout composition
The chat page should feel designed, not merely assembled.
Use layout techniques such as:
- controlled content width
- proper vertical spacing
- differentiated card zones
- strong alignment
- grouped content blocks
- clear separation between answer body and metadata

8. Better visual tone
The chat page should inherit premium cinematic polish from the design reference, while staying readable and useful.
It should not feel plain, generic, or overly utilitarian.

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

Create the following folder structure conceptually or in platform-native storage / data structures:

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
    glossary.json
    sections.json
    faq_seeds.json
    suggested_prompts.json
  05_retrieval/
    page_chunks.jsonl
    section_chunks.jsonl
  06_eval/
    eval_questions.json
  07_skill/
    document_skill.md
    document_skill_system_prompt.txt
  10_visual_assets/
    visual_assets_index.json
    diagrams/
    tables/
    photos/
    mixed/

If the platform does not expose a literal file system, preserve the same logical structure using platform-native tables, collections, buckets, storage objects, or equivalent data groupings.

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
TASK B: Website (JSON Data to Interactive AI Knowledge Base)
==============================================================

After completing the pipeline, build a full-stack or platform-native web application that serves the knowledge base.

This website must not behave like a generic “chat with PDF” app.
It must behave like an interactive document workspace with many clickable exploration paths.

REQUIRED WEBSITE FEATURES:

Feature 1 — Landing Page
Design a professional landing page that introduces the knowledge base.
Include:
- navigation to Chat, Glossary, Sections, Visuals, and PDF access
- 5 suggested prompt buttons users can click to start a conversation
- document identity and short explanation
- Start Exploring call-to-action

Feature 2 — AI Chat Interface
Users type questions and receive answers that are:
- grounded in the document using retrieved page chunks
- cited with specific page numbers
- accompanied by relevant diagrams or tables when available
- connected to related sections / pages / visuals when possible

Feature 2A — Rich Text Answer Rendering (CRITICAL)
The AI chat response must be rendered in rich text format, not as plain raw text.
The answer renderer must support clean, readable formatting such as:
- paragraphs
- bullet points
- numbered lists
- bold text
- inline citation chips
- section headers where appropriate
- spacing between blocks
- linked page references

Feature 2B — Chat History Tab (CRITICAL)
The Chat page must include a dedicated Chat History tab or equivalent history panel where users can view their past conversations and prior interactions with the chat.
Users must be able to:
- see a list of past conversations
- identify them by title, first prompt, timestamp, or preview metadata
- reopen a past conversation
- continue chatting from that state

Feature 2C — Premium Chat Layout and Flow (CRITICAL)
The Chat page must be intentionally designed as a premium conversational research interface.
It must improve:
- answer hierarchy
- citation presentation
- related visual relevance
- follow-up action clarity
- composer placement
- spacing and readability
- conversation continuity

Feature 3 — Visual Asset Retrieval
When a user's question matches a diagram, table, or photo via retrieval tag matching, display the visual asset alongside the answer.

Feature 4 — Glossary Browser
Display all terms from glossary.json with:
- alphabetical filtering
- category badges
- page references
- related term links
- Ask AI about this term actions

Feature 5 — Section Navigator
Display the document structure from sections.json with:
- chapter and section hierarchy
- summaries
- keyword tags
- page ranges
- representative pages
- Ask AI about this section

Feature 6 — Image Explanation Button (CRITICAL)
After complex or visually explainable answers, show a button labeled:
Turn into Image Explanation

In the AI Chat, the user must be able to tap or click this button directly from the assistant answer area.
When clicked, it must generate a detailed explanation image that visually explains the user's answer / the assistant's answer in a useful way.
This is not a decorative image feature.
It is an explanation-image feature.
The generated image should help the user understand the answer better.
IMPORTANT: Always use the Nano Banana Pro model for all image generation in this feature. Do not use any other image generation model.
The resulting explanation image must be shown back inside the chat experience in direct association with the answer that triggered it.

Feature 7 — Dark/Light Theme Toggle
Support both themes with a toggle button.

Feature 8 — Responsive Design
The website must work correctly on both desktop and mobile.
All website elements, layouts, and interactions must be fully responsive across device sizes, especially for phone users.

Feature 9 — Gemini Web Search Fallback
If the document does not contain enough information to answer the user's question, offer a consent-based web search fallback using Gemini grounding.

Feature 10 — Page Explorer / Page Detail View (CRITICAL)
For each page, show:
- page number
- page label or short page title if available
- page summary
- extracted text excerpt or structured page content
- linked glossary terms
- linked section
- related visuals
- Open original PDF at this page
- Ask AI about this page
- suggested page questions

Feature 10A — Real Page Thumbnails and Rendered Source Images (CRITICAL)
The website must use actual rendered PDF page images for browsing and page detail experiences.

Feature 11 — Citation-Driven Navigation (CRITICAL)
Citations must not be inert text.
Whenever possible:
- clicking a page number in chat opens the page explorer or relevant PDF page
- clicking a citation chip launches deeper exploration
- citations are rendered as interactive page chips, cards, or links

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
- any major object ↔ Ask AI about this ...

Feature 14 — Visual Asset Browser / Visual Detail
Visuals must be first-class content, not decorative attachments.
Allow users to:
- browse all visuals
- filter by generic type
- filter by semantic visual category
- open a visual detail view
- inspect description and source page
- jump back to source page
- ask AI about a specific visual

==============================================================
WEB SEARCH FALLBACK — USER FLOW
==============================================================

Step 1:
The AI attempts to answer from the document as normal.

Step 2:
If the retrieved evidence is insufficient, the chat UI automatically displays a consent prompt below the document-based answer.
Render it as a styled card, not a code block.

The card should say:

The document doesn't fully cover this topic.

Would you like me to search the web for related information outside this document?

[Search the Web]    [No, thanks]

Note: Web results are from external sources and may not reflect the views or accuracy of this document.

Step 3:
If the user clicks Search the Web:
- call Gemini API with the google_search tool enabled (grounding)
- pass both the original question and a summary of what the document did say as context
- prompt Gemini with a grounded search prompt
- display the web search result in a visually distinct panel
- label it clearly: From Web Search (External Sources)
- show grounding citations as clickable links

Step 4:
If the user clicks No, thanks:
- dismiss the consent prompt
- show nothing further

==============================================================
BACKEND / LOGIC REQUIREMENTS
==============================================================

If the platform supports server-side logic, functions, actions, workflows, edge functions, or API routes, use them to implement:
- retrieval
- chat orchestration
- visual matching
- image explanation generation
- web search fallback
- history persistence
- page-image serving

The logic layer must:
- load the retrieval data at startup or from storage
- implement weighted search using retrieval tags, keywords, section path, glossary terms, page labels, and full text
- return answer + citations + matched visuals + related sections/pages + webSearchAvailable flag
- store and reload chat history
- serve rendered page images and asset URLs

==============================================================
INTERACTION MODEL (VERY IMPORTANT)
==============================================================

Every important knowledge object should be a clickable entry point.

At minimum, support these flows:

Flow A:
Chat answer → click cited page number → open page explorer or PDF-linked view → click Ask AI about this page

Flow B:
Section browser → open section → click representative page or page range → explore page → ask AI

Flow C:
Glossary term → click supporting page → open page explorer → ask AI about the term in context

Flow D:
Chat answer with visual → click visual → open visual detail → jump to source page or ask AI about visual

Flow E:
Any citation/page chip/source reference → open original PDF or page-linked source view

==============================================================
IMPLEMENTATION PRIORITIES
==============================================================

When forced to choose, prioritize in this order:
1. Strong page-level exploration
2. Strong citation and page navigation
3. Data normalization and browse-page organization
4. Information architecture clarity
5. Premium chat layout, hierarchy, and conversation flow
6. Document-specific visual taxonomy and filtering
7. Strong cross-linking between knowledge objects
8. Rich text answer rendering quality
9. Mobile responsiveness and phone usability
10. Clean section / glossary / visual navigation
11. Good grounded chat
12. Good PDF access
13. Nice landing page
14. Web search fallback polish
15. Secondary extras

==============================================================
OPERATING INSTRUCTIONS
==============================================================

- Work autonomously from start to finish
- Complete BOTH Task A and Task B
- Do Gemini API setup first and do not proceed until confirmed
- Use the platform's native capabilities wherever practical
- Render real PDF pages into actual image files or hosted assets
- Do not stop at text-only visual analysis
- Ensure the AI chat response is rendered as rich text, not plain raw text
- Ensure the Chat page includes a clearly accessible Chat History tab or history panel
- Verify that past chat sessions can be reopened and continued correctly
- Verify that the Chat page feels organized, premium, and easy to continue using after each answer
- Remove weakly related visuals or low-signal citations that clutter the answer view
- Ensure the composer, answer card, citations, related visuals, and next actions work as one coherent flow
- Verify that the Turn into Image Explanation button exists, works, and uses Nano Banana Pro
- Verify that tapping the button returns a detailed explanation image inside the chat flow
- Verify that actual rendered PDF page images exist, are served correctly, and appear in the UI
- Ensure page thumbnails and page-detail visuals are using real rendered images rather than text-only placeholders
- Verify that page cards and section cards do not expose messy raw extraction output
- Verify that titles, summaries, page ranges, and badges are normalized and trustworthy
- Fix repetitive or semantically weak section labels before finalizing
- Verify that the Visuals page is organized by meaningful document-specific visual categories, not only generic types
- Ensure semantic visual filters are useful and intuitive for this document
- Test mobile responsiveness carefully across all major pages and interaction surfaces
- Verify that answer cards, citation chips, buttons, visuals, and navigation all remain usable on phones
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
2. location of the output folder, storage area, or platform data structure
3. URL or instructions to access the website
4. top 5 pages requiring human review
5. 3 example questions you tested and their results, including one web search fallback test
6. explanation of the page explorer / citation navigation behavior
7. list of the main clickable interaction patterns implemented
8. confirmation that Gemini API setup was completed before execution

==============================================================
FINAL INSTRUCTION
==============================================================

Do not stop at a generic summary.
Do not build a generic “chat with PDF” wrapper.
Complete the full pipeline and build an exploration-first, page-aware, citation-driven, multimodal AI knowledge base website that preserves access to the original document and makes the document easy to browse, inspect, and ask about.

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
