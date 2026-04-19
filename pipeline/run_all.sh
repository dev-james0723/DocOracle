#!/bin/bash
# ============================================================
# DocOracle Pipeline — Run All Steps
# ============================================================
# Usage:
#   1. Place your PDF in the ../input/ directory
#   2. Set your Gemini API key:  export GEMINI_API_KEY="your-key-here"
#   3. Run:  bash pipeline/run_all.sh
# ============================================================

set -e

# Colors for output
GREEN='\033[0;32m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${CYAN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║        DocOracle Pipeline v1.0               ║${NC}"
echo -e "${CYAN}║   PDF → AI Knowledge Base Generator          ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════╝${NC}"
echo ""

# Check prerequisites
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: Python 3 is required but not installed.${NC}"
    exit 1
fi

if ! command -v pdftotext &> /dev/null; then
    echo -e "${RED}Error: pdftotext is required. Install with: sudo apt-get install poppler-utils${NC}"
    exit 1
fi

if [ -z "$GEMINI_API_KEY" ]; then
    echo -e "${RED}Error: GEMINI_API_KEY environment variable is not set.${NC}"
    echo "Get your free API key at: https://makersuite.google.com/app/apikey"
    echo "Then run: export GEMINI_API_KEY=\"your-key-here\""
    exit 1
fi

# Find PDF in input directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
INPUT_DIR="$PROJECT_DIR/input"
OUTPUT_DIR="$PROJECT_DIR/output"

PDF_FILE=$(find "$INPUT_DIR" -name "*.pdf" -type f | head -1)

if [ -z "$PDF_FILE" ]; then
    echo -e "${RED}Error: No PDF file found in $INPUT_DIR${NC}"
    echo "Please place your PDF file in the input/ directory."
    exit 1
fi

echo -e "${GREEN}Found PDF: $(basename "$PDF_FILE")${NC}"
echo -e "${GREEN}Output directory: $OUTPUT_DIR${NC}"
echo ""

# Create output directories
mkdir -p "$OUTPUT_DIR"/{00_source,01_inventory,02_page_records,03_visual_reviews,04_gold_master,05_retrieval,06_eval,07_skill,10_visual_assets}

# Copy source PDF
cp "$PDF_FILE" "$OUTPUT_DIR/00_source/source.pdf"

# Get page count
PAGE_COUNT=$(pdfinfo "$PDF_FILE" | grep "Pages:" | awk '{print $2}')
echo -e "${CYAN}Total pages: $PAGE_COUNT${NC}"
echo ""

# Extract text from all pages
echo -e "${CYAN}[Step 0/12] Extracting text from all pages...${NC}"
mkdir -p "$OUTPUT_DIR/raw_text"
for i in $(seq 1 $PAGE_COUNT); do
    pdftotext -f $i -l $i "$PDF_FILE" "$OUTPUT_DIR/raw_text/page_$(printf '%04d' $i).txt" 2>/dev/null
done
echo -e "${GREEN}✓ Text extracted from $PAGE_COUNT pages${NC}"

# Convert pages to images for vision analysis
echo -e "${CYAN}[Step 0.5/12] Converting pages to images...${NC}"
mkdir -p "$OUTPUT_DIR/page_images"
python3 -c "
from pdf2image import convert_from_path
import os
images = convert_from_path('$PDF_FILE', dpi=200)
for i, img in enumerate(images, 1):
    img.save(os.path.join('$OUTPUT_DIR/page_images', f'page_{i:04d}.png'), 'PNG')
    if i % 50 == 0:
        print(f'  Converted {i}/{len(images)} pages...')
print(f'  Done: {len(images)} pages converted')
"
echo -e "${GREEN}✓ Pages converted to images${NC}"

# Run pipeline steps
STEPS=(
    "01_build_inventory.py|Step 1/12: Building page inventory"
    "02_generate_page_records.py|Step 2/12: Generating page records with Gemini Vision"
    "03_merge_all_records.py|Step 3/12: Merging all records"
    "04_build_visual_summary.py|Step 4/12: Building visual summary"
    "05_build_sections_glossary.py|Step 5/12: Building sections and glossary"
    "06_build_glossary_faq.py|Step 6/12: Building glossary and FAQ"
    "07_build_retrieval.py|Step 7/12: Building retrieval chunks"
    "08_build_eval.py|Step 8/12: Building evaluation set"
    "09_identify_visual_pages.py|Step 9/12: Identifying visual pages"
    "10_build_visual_assets.py|Step 10/12: Extracting visual assets"
    "11_build_visual_metadata.py|Step 11/12: Building visual metadata"
    "12_build_url_map.py|Step 12/12: Building URL map"
)

for step in "${STEPS[@]}"; do
    IFS='|' read -r script desc <<< "$step"
    echo -e "${CYAN}[$desc]${NC}"
    python3 "$SCRIPT_DIR/$script" || {
        echo -e "${RED}Warning: $script encountered an error. Continuing...${NC}"
    }
    echo -e "${GREEN}✓ Complete${NC}"
    echo ""
done

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║          Pipeline Complete!                   ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo "Output files are in: $OUTPUT_DIR"
echo ""
echo "Key files for the website:"
echo "  - $OUTPUT_DIR/05_retrieval/page_chunks.jsonl"
echo "  - $OUTPUT_DIR/04_gold_master/glossary.json"
echo "  - $OUTPUT_DIR/04_gold_master/sections.json"
echo "  - $OUTPUT_DIR/10_visual_assets/visual_assets_index.json"
echo ""
echo "Next steps:"
echo "  1. Copy these 4 files to website/server/data/"
echo "  2. cd website && npm install && npm run dev"
echo "  3. Open http://localhost:3000 in your browser"
