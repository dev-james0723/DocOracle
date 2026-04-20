# DocOracle: Detailed User Guide with Real Examples

> This guide walks through exactly how DocOracle works — using real screenshots, real feature descriptions, and real conversation examples drawn from the live demo at [decca-oracle.manus.space](https://decca-oracle.manus.space).

---

## Language | 語言 | 言語 | Sprache

[English](USER_GUIDE.md) · [繁體中文](USER_GUIDE.zh-TW.md) · [简体中文](USER_GUIDE.zh-CN.md) · [日本語](USER_GUIDE.ja.md) · [Deutsch](USER_GUIDE.de.md)

---

## Real Example: A Hospital Wants to Build an Internal Medical Knowledge Base

Imagine a hospital that has a 600-page *Emergency Medicine Handbook* in PDF format. They want their doctors to be able to query it through an AI chat interface instead of flipping through the book every time.

The hospital's IT manager decides to use DocOracle. Here is exactly what they do — and what they see at every step.

---

## Step 1: Try the Live Demo First (Zero Setup)

Before installing anything, the IT manager visits the DocOracle live demo at **[decca-oracle.manus.space](https://decca-oracle.manus.space)**.

The landing page shows a clean interface with two options:

- **"Explore the Demo"** — loads a pre-processed sample document so you can immediately see what the Knowledge Hub looks like without uploading anything.
- **"Try with Your PDF"** — lets you upload your own PDF and run the full pipeline on it.

The IT manager clicks **"Try with Your PDF"**, uploads a 50-page excerpt of the handbook, and waits.

---

## Step 2: The Upload and Pipeline Processing Screen

After uploading, the user is taken to the **Recent Uploads** screen. This screen shows all previously submitted PDFs and their current processing status.

Each item in the list shows:

| Column | What it means |
|--------|---------------|
| **Filename** | The name of the uploaded PDF |
| **Status badge** | One of: `queued`, `processing`, `completed`, or `failed` |
| **"View Progress" button** | Opens the job detail page for that upload |
| **Trash icon button** | Deletes the job immediately (available for all statuses) |

> **Real example from the live demo:** After uploading *Emergency_Medicine_Excerpt.pdf*, the Recent Uploads list shows:
>
> ```
> Emergency_Medicine_Excerpt.pdf   [processing]   [View Progress]  [🗑]
> ```

The trash icon (🗑) appears on the **left side** of the "View Progress" button. You can delete any job at any time — including jobs that are still queued or currently processing — to prevent them from consuming further API credits.

---

## Step 3: Watching the Pipeline Run

Clicking **"View Progress"** opens the job detail page. While the pipeline is running, you see a live progress indicator showing which of the 12 steps is currently executing:

```
[2026-04-19 10:00:00] Starting DocOracle pipeline...
[2026-04-19 10:00:05] Step 1: Building page inventory...
  - Analyzing 50 pages
  - Classifying pages: 38 text pages, 7 diagram pages, 5 mixed
[2026-04-19 10:15:30] Step 2: Generating page records with Gemini Vision...
  - Processing pages 1-10...
  - Processing pages 11-20...
  [████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░] 25%
...
[2026-04-19 10:45:00] ✅ Pipeline complete!
```

Processing time depends on document size:

| Pages | Estimated Time |
|-------|---------------|
| 50 | ~15 minutes |
| 200 | ~1 hour |
| 500 | ~3 hours |

---

## Step 4: What Happens If the Pipeline Fails

Sometimes the pipeline fails — for example, if the Gemini API rate limit is hit, or if the PDF contains unusual encoding. When this happens, the job detail page shows a clear **"Pipeline Failed"** error card.

The card shows two buttons side by side:

- **"Try Again"** — re-queues the job and attempts the pipeline from the beginning.
- **"Delete"** — permanently removes the job from the system.

> **Why the Delete button matters here:** If a job fails repeatedly, clicking "Try Again" over and over will keep consuming API credits without producing results. The Delete button lets you remove the failed job cleanly so it does not keep retrying in the background.

**Real example:** The IT manager uploaded a corrupted PDF by mistake. The pipeline failed at Step 2. Instead of clicking "Try Again" (which would fail again), they clicked **"Delete"**, then re-uploaded the correct file.

---

## Step 5: The Knowledge Hub — What You See After Pipeline Completes

This is the most important part of the guide. Once the pipeline finishes successfully, the job detail page transforms into the **Knowledge Hub** — a full tabbed interface with three sections.

### The Stats Bar

At the top of the Knowledge Hub, a stats bar shows a quick summary of what was extracted:

```
📄 50 pages   |   🖼 12 visual assets   |   📑 8 sections   |   📖 23 glossary terms
```

### Tab 1: Book Structure

The **Book Structure** tab shows the complete chapter and section hierarchy of your document. Each entry displays:

- Section title and page range (e.g., "Chapter 3: Chest Pain Assessment — pages 42–67")
- A one-paragraph summary of what that section covers
- Key topic tags (e.g., `ECG`, `troponin`, `differential diagnosis`)

**Clicking any section** opens a pre-filled chat question about that section. For example, clicking "Chapter 3: Chest Pain Assessment" automatically asks: *"What does Chapter 3 cover about chest pain assessment?"*

> **Real example from the live demo:** The IT manager browsed to "Chapter 5: Trauma Protocols" and clicked it. The AI immediately answered with a structured summary of the chapter, citing specific pages from the handbook.

### Tab 2: Glossary

The **Glossary** tab shows every technical term extracted from the document, displayed as searchable cards. Each card shows:

- The term (e.g., "Troponin I")
- Its definition as extracted from the document
- The page number(s) where it appears
- A category badge (e.g., `Biomarker`, `Diagnostic`)

There is a **search bar** at the top of the Glossary tab. Typing "ECG" filters the list to show only ECG-related terms.

**Clicking any glossary card** opens a pre-filled chat question. For example, clicking "Troponin I" asks: *"Can you explain Troponin I in more detail?"*

> **Real example from the live demo:** A doctor used the Glossary tab to look up "STEMI" (ST-Elevation Myocardial Infarction). The card showed the definition, the page range (pp. 246–251), and a `Cardiology` badge. Clicking the card opened a chat asking for more detail, and the AI responded with a full explanation citing pages 246, 248, and 250.

### Tab 3: Start Asking

The **Start Asking** tab shows 6 suggested questions generated from the document content. These are designed to help new users understand what kinds of questions DocOracle can answer.

Example suggested questions for the Emergency Medicine Handbook:

1. "What are the first-line treatments for anaphylaxis?"
2. "How should I assess a patient with altered mental status?"
3. "What imaging is recommended for suspected pulmonary embolism?"
4. "What are the criteria for activating a trauma team?"
5. "How do I interpret a 12-lead ECG for STEMI?"
6. "What medications are contraindicated in pregnancy emergencies?"

Clicking any suggested question sends it directly to the AI chat.

---

## Step 6: Using the AI Chat

After exploring the Knowledge Hub tabs, the doctor clicks one of the suggested questions or types their own. The AI responds with:

1. A structured answer grounded in the document
2. Exact page number citations
3. Relevant diagrams or tables displayed alongside the answer

**Real example conversation:**

> **Doctor:** "If a patient has severe chest pain, what tests should I run?"
>
> **DocOracle AI:** "According to the handbook (pages 245–250), for a patient presenting with severe chest pain, the following tests are recommended:
>
> 1. **ECG (Electrocardiogram)** — Perform within 10 minutes of arrival. See page 246 for interpretation guidelines.
> 2. **Chest X-Ray** — To rule out pneumothorax and aortic dissection. See page 248.
> 3. **Blood Tests** — Troponin I, BNP, D-dimer. See page 250 for reference ranges.
>
> [Diagram: ECG interpretation flowchart — extracted from page 247]
>
> [Button: **Turn into image explanation** — click to generate a visual summary of this answer]"

The **"Turn into image explanation"** button generates an AI-created visual diagram summarising the answer — useful for quick reference or teaching.

---

## Step 7: Managing Your Uploads

### Deleting a Job from the Recent Uploads List

On the main DocOracle page, the **Recent Uploads** section lists all your processed documents. Every row has a trash icon (🗑) button to the left of the "View Progress" button.

You can delete **any job regardless of status**:

| Status | Can delete? | Effect |
|--------|-------------|--------|
| `queued` | Yes | Cancels the job before it starts |
| `processing` | Yes | Stops the pipeline mid-run |
| `completed` | Yes | Removes the knowledge base permanently |
| `failed` | Yes | Cleans up the failed job |

> **Why this matters:** Failed jobs that are not deleted may be retried automatically, consuming API credits. Deleting them immediately stops this.

### Deleting a Job from the Job Detail Page

When you are viewing a specific job (whether it succeeded or failed), there is also a **Delete** button directly on that page:

- On a **completed** job: the Delete button appears in the Knowledge Hub header, next to the document title.
- On a **failed** job: the Delete button appears next to the "Try Again" button inside the error card.

---

## Step 8: Deploying Your Own Instance (Developer Path)

If you want to run DocOracle on your own server with your own documents, follow the steps below.

### Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| Python | 3.9+ | Pipeline scripts |
| Node.js | 18+ | Website |
| pdftotext | any | Text extraction (`sudo apt-get install poppler-utils`) |
| Gemini API Key | — | Vision analysis and chat ([Get a free key](https://aistudio.google.com/app/apikey)) |

### Step-by-Step

**1. Clone the repository**

```bash
git clone https://github.com/dev-james0723/DocOracle.git
cd DocOracle
```

**2. Place your PDF in the `input/` folder**

```bash
cp /path/to/your/handbook.pdf input/
```

**3. Install pipeline dependencies**

```bash
pip install -r pipeline/requirements.txt
```

**4. Set your Gemini API key**

```bash
export GEMINI_API_KEY="your-gemini-api-key"
```

**5. Run the pipeline**

```bash
bash pipeline/run_all.sh
```

**6. Copy the output files to the website**

```bash
cp output/05_retrieval/page_chunks.jsonl website/server/data/
cp output/04_gold_master/glossary.json website/server/data/
cp output/04_gold_master/sections.json website/server/data/
cp output/10_visual_assets/visual_assets_index.json website/server/data/visual_assets.json
```

**7. Start the website**

```bash
cd website
npm install
npm run dev
```

Open `http://localhost:3000` in your browser. Your AI knowledge base is ready.

---

## Step 9: The Output File Structure

After the pipeline completes, the `output/` directory contains:

```
output/
├── 00_source/
│   ├── source.pdf
│   └── document_manifest.json
│
├── 01_inventory/
│   └── page_inventory.json
│
├── 02_page_records/
│   ├── page_1.json
│   ├── page_2.json
│   └── ... (one file per page)
│
├── 04_gold_master/
│   ├── page_chunks.jsonl          ← Full text content, page by page
│   ├── glossary.json              ← All extracted terms and definitions
│   ├── sections.json              ← Chapter/section hierarchy
│   └── faq_seeds.json
│
├── 05_retrieval/
│   ├── page_chunks.jsonl          ← Retrieval-optimised chunks for RAG
│   └── section_chunks.jsonl
│
├── 10_visual_assets/
│   ├── diagrams/
│   │   ├── diagram_001.png
│   │   ├── diagram_001.json       ← Spatial description of this diagram
│   │   └── ...
│   ├── tables/
│   │   ├── table_001.png
│   │   └── ...
│   └── visual_assets_index.json   ← Index of all visual assets
│
└── 09_final_report/
    └── final_report.md
```

The **4 key files** you need to copy to the website are:

| File | What it contains |
|------|-----------------|
| `output/05_retrieval/page_chunks.jsonl` | Full page-level text for AI retrieval |
| `output/04_gold_master/glossary.json` | All glossary terms with definitions and page refs |
| `output/04_gold_master/sections.json` | Chapter/section structure with summaries |
| `output/10_visual_assets/visual_assets_index.json` | Index of all diagrams, tables, and photos |

---

## Frequently Asked Questions

**Q: How long does the pipeline take?**
A: Approximately 15 minutes for a 50-page document, 1 hour for 200 pages, and 3 hours for 500 pages. Processing time depends on the number of visual assets (diagrams, tables) since each one is individually analysed by Gemini Vision.

**Q: Do I need to pay for the Gemini API?**
A: Gemini has a free tier that covers small documents (up to ~50 pages). For larger documents, you may need a paid API key. Check [Google AI Studio](https://aistudio.google.com) for current pricing.

**Q: Can I use a different LLM instead of Gemini?**
A: Yes. Edit `pipeline/config.yaml` to point to a different model endpoint. The pipeline is designed to be model-agnostic for the text steps; only the Vision analysis steps require a multimodal model.

**Q: What happens if the pipeline fails partway through?**
A: The pipeline saves progress at each step. If it fails at Step 7, you can re-run from Step 7 without repeating Steps 1–6. Alternatively, delete the job from the UI and start fresh.

**Q: Can I delete a completed knowledge base?**
A: Yes. Use the trash icon in the Recent Uploads list, or the Delete button on the job detail page. This permanently removes the job and all associated data.

**Q: What file formats are supported?**
A: Currently PDF only. Support for DOCX, EPUB, and HTML is planned for a future release.

---

## Summary: What Users Get

After running DocOracle on a document, users have access to:

| Feature | Description |
|---------|-------------|
| **AI Chat with Citations** | Ask questions, get answers with exact page numbers |
| **Book Structure tab** | Browse chapters and sections; click any to ask about it |
| **Glossary tab** | Search all extracted terms; click any to ask for more detail |
| **Start Asking tab** | 6 suggested questions generated from the document |
| **Visual Asset Retrieval** | Relevant diagrams appear automatically alongside answers |
| **Image Explanation** | Generate a visual summary of any complex answer |
| **Delete Controls** | Remove any job (queued, processing, completed, or failed) at any time |

---

*DocOracle — because every document deserves to be understood.*
