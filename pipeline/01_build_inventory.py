#!/usr/bin/env python3
"""
Build page inventory for all 445 pages.
Uses text size heuristics + text content analysis to classify pages.
For pages with very little text, flags them for visual review.
"""

import json
import os
import re

RAW_DIR = "/home/ubuntu/raw_text_pages"
OUTPUT_DIR = "/home/ubuntu/PDF_PROJECT_OUTPUT/01_inventory"

# Known structure from TOC inspection
FRONT_MATTER_PAGES = list(range(1, 30))  # approximate
INDEX_PAGES = list(range(430, 446))  # approximate

def classify_page(page_num, text, text_size):
    """Classify a page based on its text content and size."""
    
    text_lower = text.lower().strip()
    
    # Detect page features
    has_table = bool(re.search(r'(\|.*\||\t{2,}|  {4,}\S+  {4,}\S+)', text))
    has_footnote = bool(re.search(r'(\d+\s|†|‡|\*\s)', text_lower)) and text_size > 200
    has_caption = bool(re.search(r'(figure\s+\d|fig\.\s*\d|plate\s+\d|photo\s+\d|table\s+\d|diagram\s+\d)', text_lower))
    has_small_text = False  # Can't determine from text alone
    has_handwriting = False  # Can't determine from text alone
    has_chart = bool(re.search(r'(chart|graph|plot|axis|x-axis|y-axis|frequency response)', text_lower)) and text_size < 500
    has_diagram = bool(re.search(r'(diagram|layout|figure|fig\.|setup|set-up|position|placement)', text_lower)) and text_size < 800
    has_photo = bool(re.search(r'(photo|photograph|plate|image|picture)', text_lower)) and text_size < 500
    has_infographic = False
    has_dense_layout = text_size > 3000
    
    # Determine page type
    if text_size < 10:
        page_type = "cover" if page_num == 1 else "photo"
        extraction_risk = "high"
    elif text_size < 100:
        # Very little text - likely image/diagram page
        if page_num in [7, 8, 9]:
            page_type = "other"  # front matter
        else:
            page_type = "diagram" if has_diagram or has_caption else "photo"
        extraction_risk = "high"
    elif text_size < 500:
        if has_caption or has_diagram:
            page_type = "mixed"
        elif 'contents' in text_lower or 'table of contents' in text_lower:
            page_type = "toc"
        else:
            page_type = "mixed"
        extraction_risk = "medium"
    else:
        # Substantial text
        if 'contents' in text_lower and page_num < 10:
            page_type = "toc"
        elif 'index' in text_lower and page_num > 420:
            page_type = "appendix"
        elif 'appendix' in text_lower and page_num > 380:
            page_type = "appendix"
        elif 'bibliography' in text_lower and page_num > 410:
            page_type = "appendix"
        elif 'glossary' in text_lower and page_num < 35:
            page_type = "text"
        elif has_table and not has_caption:
            page_type = "table"
        elif has_caption and text_size < 1200:
            page_type = "mixed"
        else:
            page_type = "text"
        
        if has_table:
            extraction_risk = "medium"
        elif has_caption and text_size < 1000:
            extraction_risk = "medium"
        else:
            extraction_risk = "low"
    
    # Build short observation
    observations = []
    if text_size < 100:
        observations.append("Minimal extractable text; likely image/diagram page")
    if has_caption:
        observations.append("Contains figure/table caption reference")
    if has_table:
        observations.append("Contains tabular content")
    if has_dense_layout:
        observations.append("Dense text layout")
    if not observations:
        observations.append(f"Standard text page ({text_size} bytes)")
    
    return {
        "page_number": page_num,
        "page_type": page_type,
        "has_small_text": has_small_text,
        "has_handwriting": has_handwriting,
        "has_table": has_table,
        "has_chart": has_chart,
        "has_infographic": has_infographic,
        "has_diagram": has_diagram or (text_size < 100 and page_num not in [1, 7, 8, 9]),
        "has_photo": has_photo or (text_size < 50 and page_num > 9),
        "has_caption": has_caption,
        "has_footnote": has_footnote,
        "has_dense_layout": has_dense_layout,
        "extraction_risk": extraction_risk,
        "short_observation": "; ".join(observations),
        "special_notes": "",
        "text_byte_size": text_size
    }


def main():
    inventory = []
    
    for i in range(1, 446):
        path = os.path.join(RAW_DIR, f"page_{i:04d}.txt")
        with open(path, 'r', encoding='utf-8', errors='replace') as f:
            text = f.read()
        text_size = os.path.getsize(path)
        
        entry = classify_page(i, text, text_size)
        inventory.append(entry)
    
    # Write JSON
    with open(os.path.join(OUTPUT_DIR, "page_inventory.json"), 'w') as f:
        json.dump(inventory, f, indent=2)
    
    # Stats
    types = {}
    risks = {"low": 0, "medium": 0, "high": 0}
    for e in inventory:
        types[e["page_type"]] = types.get(e["page_type"], 0) + 1
        risks[e["extraction_risk"]] += 1
    
    print("Page type distribution:")
    for t, c in sorted(types.items(), key=lambda x: -x[1]):
        print(f"  {t}: {c}")
    print(f"\nExtraction risk distribution:")
    for r, c in risks.items():
        print(f"  {r}: {c}")
    
    # High risk pages
    high_risk = [e["page_number"] for e in inventory if e["extraction_risk"] == "high"]
    medium_risk = [e["page_number"] for e in inventory if e["extraction_risk"] == "medium"]
    print(f"\nHigh risk pages ({len(high_risk)}): {high_risk}")
    print(f"Medium risk pages ({len(medium_risk)}): {medium_risk}")

if __name__ == "__main__":
    main()
