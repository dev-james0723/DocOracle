# DocOracle

**Turn any PDF into an AI-powered Knowledge Base with chat, diagrams, and citations.**

DocOracle is an open-source pipeline that transforms any PDF document into a fully functional AI knowledge base website. Upload a textbook, manual, or technical guide — DocOracle extracts every page, analyzes every diagram with Gemini Vision, builds structured data, and generates an interactive AI chat interface where users can ask questions and get answers with page-level citations and relevant diagrams.

![Landing Page](screenshots/01_landing_page.webp)

---

## What It Does

DocOracle takes a PDF and produces a complete, deployable AI knowledge base in two stages:

**Stage 1: Pipeline** — A set of Python scripts that process your PDF on your local machine. The pipeline extracts text from every page, uses Gemini Vision to analyze diagrams and tables, classifies page types, builds a glossary, generates section summaries, and creates retrieval-optimized chunks.

**Stage 2: Website** — A full-stack web application (React + Express + tRPC) that serves the processed knowledge base. Users can chat with the AI, browse the glossary, navigate the book structure, and see relevant diagrams alongside answers.

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│             │     │                  │     │                     │
│  Your PDF   │────▶│  Pipeline (12    │────▶│  AI Knowledge Base  │
│  (any book) │     │  Python scripts) │     │  Website (React +   │
│             │     │                  │     │  Express + Gemini)  │
└─────────────┘     └──────────────────┘     └─────────────────────┘
     input/              pipeline/                 website/
```

---

## Live Demo Screenshots

### AI Chat with Citations and Diagrams

Ask any question about the book's content. Every answer includes page-level citations, and relevant diagrams are automatically retrieved and displayed.

![Chat Interface](screenshots/02_chat_interface.webp)

![Chat Response with Citations](screenshots/03_chat_response.webp)

### Glossary Browser

Browse all technical terms with alphabetical filtering and category badges. Each term links to its source pages.

![Glossary](screenshots/04_glossary.webp)

### Book Structure Navigator

Explore the full chapter and section structure with summaries and keyword tags.

![Sections](screenshots/06_sections.webp)

### DocOracle Demo — Upload Your Own PDF

The built-in demo page lets anyone upload a PDF and experience the full pipeline in action.

![DocOracle Upload](screenshots/05_doc_oracle_upload.webp)

---

## Features

| Feature | Description |
|---------|-------------|
| **Gemini Vision Analysis** | Every diagram, table, and image is analyzed by Gemini Vision with detailed spatial descriptions |
| **AI Chat with Citations** | Ask questions and get answers grounded in the book, with page numbers cited |
| **Visual Asset Retrieval** | Relevant diagrams automatically appear alongside chat answers |
| **Glossary Browser** | Alphabetical glossary with category badges and page references |
| **Section Navigator** | Full book structure with summaries and keyword tags |
| **Image Explanation** | "Turn into image explanation" button generates AI visual summaries of complex answers |
| **Dark/Light Theme** | Toggle between dark and light modes |
| **PDF Upload Demo** | Built-in interface for uploading and processing new PDFs |

---

## Quick Start

### Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| Python | 3.9+ | Pipeline scripts |
| Node.js | 18+ | Website |
| pdftotext | any | Text extraction (`sudo apt-get install poppler-utils`) |
| Gemini API Key | — | Vision analysis and chat ([Get free key](https://aistudio.google.com/app/apikey)) |

### Step 1: Clone the Repository

```bash
git clone https://github.com/dev-james0723/DocOracle.git
cd DocOracle
```

### Step 2: Place Your PDF

```bash
cp /path/to/your/book.pdf input/
```

### Step 3: Install Pipeline Dependencies

```bash
pip install -r pipeline/requirements.txt
```

### Step 4: Set Your API Key

```bash
export GEMINI_API_KEY="your-gemini-api-key"
```

### Step 5: Run the Pipeline

```bash
bash pipeline/run_all.sh
```

The pipeline will process your PDF through 12 steps. Processing time depends on page count:

| Pages | Estimated Time |
|-------|---------------|
| 50 | ~15 minutes |
| 200 | ~1 hour |
| 500 | ~3 hours |

### Step 6: Launch the Website

```bash
# Copy the 4 key output files to the website
cp output/05_retrieval/page_chunks.jsonl website/server/data/
cp output/04_gold_master/glossary.json website/server/data/
cp output/04_gold_master/sections.json website/server/data/
cp output/10_visual_assets/visual_assets_index.json website/server/data/visual_assets.json

# Install and start the website
cd website
npm install
npm run dev
```

Open `http://localhost:3000` in your browser. Your AI knowledge base is ready.

---

## Pipeline Steps

The pipeline consists of 12 Python scripts that run sequentially:

| Step | Script | What It Does |
|------|--------|-------------|
| 1 | `01_build_inventory.py` | Classifies every page as text, diagram, photo, or mixed |
| 2 | `02_generate_page_records.py` | Creates detailed records for each page using Gemini Vision |
| 3 | `03_merge_all_records.py` | Merges text extraction and vision analysis into gold-master records |
| 4 | `04_build_visual_summary.py` | Generates summaries for high-risk visual pages |
| 5 | `05_build_sections_glossary.py` | Builds chapter/section structure and glossary |
| 6 | `06_build_glossary_faq.py` | Generates FAQ seeds from the content |
| 7 | `07_build_retrieval.py` | Creates retrieval-optimized chunks for RAG |
| 8 | `08_build_eval.py` | Generates 80+ evaluation questions for testing |
| 9 | `09_identify_visual_pages.py` | Identifies all pages with diagrams, tables, or images |
| 10 | `10_build_visual_assets.py` | Extracts visual assets as individual images |
| 11 | `11_build_visual_metadata.py` | Pairs each visual asset with descriptive metadata |
| 12 | `12_build_url_map.py` | Builds the URL mapping for web display |

---

## Output Structure

After the pipeline completes, you get this output:

```
output/
├── 00_source/           # Original PDF copy
├── 01_inventory/        # Page-by-page classification
├── 02_page_records/     # Detailed record per page (JSON)
├── 03_visual_reviews/   # Vision analysis for diagram pages
├── 04_gold_master/      # Authoritative merged records
│   ├── glossary.json        ← KEY FILE: all technical terms
│   ├── sections.json        ← KEY FILE: chapter structure
│   └── faq_seeds.json       # Generated FAQ questions
├── 05_retrieval/        # RAG-optimized chunks
│   ├── page_chunks.jsonl    ← KEY FILE: searchable text chunks
│   └── section_chunks.jsonl # Section-level chunks
├── 06_eval/             # 80+ evaluation questions
├── 07_skill/            # System prompt for the AI
└── 10_visual_assets/    # Extracted diagrams and images
    ├── visual_assets_index.json  ← KEY FILE: visual asset metadata
    ├── diagrams/        # Diagram screenshots + descriptions
    ├── mixed/           # Mixed content screenshots
    └── photos/          # Photo screenshots
```

The **4 key files** marked above are what the website needs. Everything else is supplementary.

---

## Sample Output

The `sample_output/` directory contains excerpts from a real pipeline run so you can see the data format before running your own:

**page_chunks_sample.jsonl** — Each line is a searchable text chunk:
```json
{
  "page": 45,
  "chapter": "Chapter 2: Studio Techniques",
  "text": "The control room should ideally be...",
  "has_visual": false
}
```

**glossary_sample.json** — Technical terms with definitions:
```json
{
  "term": "Decca Tree",
  "definition": "A three-microphone array using omnidirectional microphones...",
  "category": "Microphone Techniques",
  "pages": [192, 193, 194]
}
```

**visual_assets_sample.json** — Diagram metadata with descriptions:
```json
{
  "page": 120,
  "type": "diagram",
  "description": "Piano recording setup showing two spaced omnidirectional microphones...",
  "retrieval_tags": ["piano", "microphone placement", "spaced pair"]
}
```

---

## Use Cases

DocOracle works with any PDF document. Here are some examples:

| Use Case | PDF Type | Who Benefits |
|----------|----------|-------------|
| **Medical Knowledge Base** | Hospital procedure manual | Doctors and nurses querying protocols |
| **Legal Research** | Contract templates or regulations | Lawyers searching for clauses |
| **Technical Documentation** | Engineering specifications | Engineers finding procedures |
| **Academic Tutoring** | Textbooks or research papers | Students asking study questions |
| **Training Materials** | Employee handbooks | HR teams building onboarding tools |
| **Music/Audio** | Recording technique guides | Audio engineers learning methods |

---

## Project Structure

```
DocOracle/
├── README.md              # This file
├── LICENSE                # MIT License
├── .gitignore             # Protects PDFs and API keys
├── pipeline/              # Python processing scripts
│   ├── run_all.sh             # One-command pipeline runner
│   ├── config.yaml            # Configuration template
│   ├── requirements.txt       # Python dependencies
│   └── 01-12_*.py             # 12 pipeline scripts
├── website/               # Full-stack web application
│   ├── client/                # React frontend
│   ├── server/                # Express + tRPC backend
│   └── server/data/           # Place output files here
├── sample_output/         # Example output files
├── docs/                  # Additional documentation
│   ├── PIPELINE_PROMPT.md     # Detailed pipeline instructions
│   ├── USER_GUIDE.md          # Step-by-step user guide
│   └── GITHUB_GUIDE.md        # GitHub publishing guide
├── input/                 # Place your PDF here
└── screenshots/           # README screenshots
```

---

## Configuration

Copy `pipeline/config.yaml` to `pipeline/config.local.yaml` and customize:

```yaml
llm:
  provider: "gemini"          # or "openai", "anthropic"
  api_key: ""                 # or use GEMINI_API_KEY env var
  vision_model: "gemini-2.5-flash"

pipeline:
  max_pages: 0                # 0 = process all pages
  image_dpi: 200              # higher = better quality
  concurrency: 5              # parallel API requests
```

---

## Cost Estimate

Processing costs depend on your PDF size and the LLM provider:

| PDF Size | Gemini (Free Tier) | Gemini (Paid) | OpenAI GPT-4o |
|----------|-------------------|---------------|---------------|
| 50 pages | Free (within limits) | ~$1-2 | ~$3-5 |
| 200 pages | ~3-4 days (rate limited) | ~$5-10 | ~$15-25 |
| 500 pages | ~9-10 days (rate limited) | ~$10-20 | ~$30-50 |

The Gemini free tier allows approximately 50 vision requests per day. For faster processing, use the paid tier.

---

## For Developers

If you want to integrate DocOracle's output into your own application instead of using the provided website:

**The pipeline output is standard JSON.** You can read `page_chunks.jsonl`, `glossary.json`, `sections.json`, and `visual_assets_index.json` from any programming language (Python, PHP, Java, Ruby, Go, etc.) and build your own search and chat interface on top.

**Key integration points:**

1. **Search** — Load `page_chunks.jsonl` and implement keyword or semantic search across chunks
2. **Chat** — Send matching chunks as context to any LLM (Gemini, GPT-4, Claude, etc.)
3. **Visual Assets** — Use `visual_assets_index.json` to find and display relevant diagrams
4. **Glossary** — Load `glossary.json` for term definitions and tooltips
5. **Navigation** — Use `sections.json` for chapter/section structure

---

## Contributing

Contributions are welcome. Please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

**Important:** DocOracle is a tool for processing documents you have legal rights to use. The pipeline and website code are open source; the documents you process are your responsibility. Never upload copyrighted material you do not have permission to use.

---

## Acknowledgments

This project was built using:

- [Google Gemini](https://ai.google.dev/) — Vision and language model for document analysis
- [React](https://react.dev/) + [Tailwind CSS](https://tailwindcss.com/) — Frontend framework
- [Express](https://expressjs.com/) + [tRPC](https://trpc.io/) — Backend API
- [poppler-utils](https://poppler.freedesktop.org/) — PDF text extraction

---

<p align="center">
  <strong>DocOracle</strong> — Because every document deserves to be understood.
</p>
