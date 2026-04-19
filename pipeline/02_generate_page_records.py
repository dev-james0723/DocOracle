#!/usr/bin/env python3
"""
Generate page-level canonical records for all 445 pages.
Uses OpenAI API (gpt-4.1-mini) for intelligent extraction and classification.
Processes pages in batches to manage rate limits.
"""

import json
import os
import sys
import time
import re
from openai import OpenAI

client = OpenAI()

RAW_DIR = "/home/ubuntu/raw_text_pages"
INVENTORY_PATH = "/home/ubuntu/PDF_PROJECT_OUTPUT/01_inventory/page_inventory.json"
OUTPUT_DIR = "/home/ubuntu/PDF_PROJECT_OUTPUT/02_page_records"

# Load inventory
with open(INVENTORY_PATH) as f:
    inventory = json.load(f)
inv_map = {e["page_number"]: e for e in inventory}

# Section mapping based on TOC analysis
SECTION_MAP = {
    1: "Cover",
    2: "Table of Contents", 3: "Table of Contents", 4: "Table of Contents", 5: "Table of Contents", 6: "Table of Contents",
    7: "Front Matter", 8: "Front Matter", 9: "Front Matter",
    10: "Acknowledgements", 11: "Acknowledgements", 12: "Acknowledgements",
    13: "Introduction", 14: "Introduction", 15: "Introduction", 16: "Introduction", 17: "Introduction",
    18: "Introduction", 19: "Introduction", 20: "Introduction",
}

def get_section_guess(page_num, text):
    """Guess the section based on page number and text content."""
    if page_num in SECTION_MAP:
        return SECTION_MAP[page_num]
    
    text_lower = text.lower()
    
    # Check for chapter headings
    chapter_match = re.search(r'chapter\s+(\d+)', text_lower)
    if chapter_match:
        return f"Chapter {chapter_match.group(1)}"
    
    # Check for section numbers
    section_match = re.search(r'^(\d+\.\d+)\s', text, re.MULTILINE)
    if section_match:
        return f"Section {section_match.group(1)}"
    
    # Check for part headings
    if 'part i' in text_lower or 'before recording' in text_lower:
        return "Part I: Before Recording"
    if 'part ii' in text_lower or 'part ii recording' in text_lower:
        return "Part II: Recording"
    if 'part iii' in text_lower or 'after the recording' in text_lower:
        return "Part III: After the Recording Session"
    
    # Check for appendix
    if 'appendix' in text_lower:
        app_match = re.search(r'appendix\s+(\d+)', text_lower)
        if app_match:
            return f"Appendix {app_match.group(1)}"
        return "Appendix"
    
    if 'bibliography' in text_lower:
        return "Bibliography"
    if 'index' in text_lower and page_num > 420:
        return "Index"
    if 'glossary' in text_lower:
        return "Glossary"
    
    return "Unknown"


def generate_page_record(page_num, text, inv_entry):
    """Generate a page record using LLM for rich extraction."""
    
    text_size = len(text.strip())
    
    if text_size < 10:
        # Minimal text page - create basic record
        return {
            "page_number": page_num,
            "page_type": inv_entry.get("page_type", "other"),
            "section_heading_guess": get_section_guess(page_num, text),
            "raw_text_full": text.strip() if text.strip() else "[No extractable text - page appears to be entirely visual]",
            "layout_preserving_markdown": f"*[Page {page_num}: Visual content - no extractable text. This page likely contains a diagram, photograph, or other visual element.]*",
            "tables_extracted": [],
            "captions": [],
            "footnotes": [],
            "observed_visual_description": "Cannot determine from text extraction alone. Page contains minimal or no extractable text, suggesting it is primarily visual content (diagram, photograph, or illustration).",
            "interpreted_page_meaning": "This page likely contains a visual element (diagram, photograph, or illustration) that supplements the surrounding text. Visual review required for full content capture.",
            "uncertainties": ["Page content is entirely or mostly visual and could not be captured through text extraction. Visual review is required."],
            "keywords": [],
            "page_summary_strict": f"Page {page_num} contains minimal extractable text and appears to be primarily visual content. Visual review needed."
        }
    
    # For pages with text, use LLM for intelligent extraction
    prompt = f"""Analyze this extracted text from page {page_num} of "Classical Recording: A Practical Guide in the Decca Tradition" by Caroline Haigh, John Dunkerley, and Mark Rogers.

Page text:
---
{text[:4000]}
---

Page inventory classification: {inv_entry.get('page_type', 'unknown')} | Risk: {inv_entry.get('extraction_risk', 'unknown')}

Return a JSON object with these exact fields:
{{
  "section_heading_guess": "best guess at which section/chapter this page belongs to",
  "layout_preserving_markdown": "reconstruct the page in readable markdown preserving hierarchy, headings, lists, paragraphs",
  "tables_extracted": ["array of any tables found, each as a markdown table string"],
  "captions": ["array of any figure/table captions found"],
  "footnotes": ["array of any footnotes found"],
  "observed_visual_description": "describe ONLY what is directly observable from the text about any visual elements referenced",
  "interpreted_page_meaning": "conservative explanation of what this page is about",
  "uncertainties": ["array of anything unclear, ambiguous, or potentially missing"],
  "keywords": ["array of 5-10 key terms from this page"],
  "page_summary_strict": "2-3 sentence summary grounded only in this page's content"
}}

Rules:
- Be faithful to the text. Do not invent content.
- If the text references figures or diagrams not visible in the extraction, note that as uncertainty.
- Preserve original wording where possible.
- Return ONLY valid JSON, no other text."""

    try:
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.1,
            max_tokens=2000
        )
        
        result_text = response.choices[0].message.content.strip()
        # Try to extract JSON from the response
        if result_text.startswith("```"):
            result_text = re.sub(r'^```(?:json)?\n?', '', result_text)
            result_text = re.sub(r'\n?```$', '', result_text)
        
        result = json.loads(result_text)
        
        record = {
            "page_number": page_num,
            "page_type": inv_entry.get("page_type", "text"),
            "section_heading_guess": result.get("section_heading_guess", get_section_guess(page_num, text)),
            "raw_text_full": text.strip(),
            "layout_preserving_markdown": result.get("layout_preserving_markdown", ""),
            "tables_extracted": result.get("tables_extracted", []),
            "captions": result.get("captions", []),
            "footnotes": result.get("footnotes", []),
            "observed_visual_description": result.get("observed_visual_description", ""),
            "interpreted_page_meaning": result.get("interpreted_page_meaning", ""),
            "uncertainties": result.get("uncertainties", []),
            "keywords": result.get("keywords", []),
            "page_summary_strict": result.get("page_summary_strict", "")
        }
        return record
        
    except json.JSONDecodeError:
        # Fallback: create record without LLM
        return create_fallback_record(page_num, text, inv_entry)
    except Exception as e:
        print(f"  Error on page {page_num}: {e}")
        return create_fallback_record(page_num, text, inv_entry)


def create_fallback_record(page_num, text, inv_entry):
    """Create a basic record without LLM assistance."""
    # Extract keywords from text
    words = re.findall(r'\b[A-Za-z]{4,}\b', text)
    word_freq = {}
    for w in words:
        wl = w.lower()
        word_freq[wl] = word_freq.get(wl, 0) + 1
    keywords = sorted(word_freq, key=word_freq.get, reverse=True)[:10]
    
    # Extract captions
    captions = re.findall(r'(?:Figure|Fig\.|Table|Plate|Photo|Diagram)\s+\d+[^.]*\.', text)
    
    return {
        "page_number": page_num,
        "page_type": inv_entry.get("page_type", "text"),
        "section_heading_guess": get_section_guess(page_num, text),
        "raw_text_full": text.strip(),
        "layout_preserving_markdown": text.strip(),
        "tables_extracted": [],
        "captions": captions,
        "footnotes": [],
        "observed_visual_description": "Text extraction only; visual elements not captured.",
        "interpreted_page_meaning": f"Page {page_num} of the document.",
        "uncertainties": ["Record generated without LLM analysis; may be incomplete."],
        "keywords": keywords,
        "page_summary_strict": f"Page {page_num} contains text content. Fallback record without detailed analysis."
    }


def process_batch(start_page, end_page):
    """Process a batch of pages."""
    for page_num in range(start_page, end_page + 1):
        output_path = os.path.join(OUTPUT_DIR, f"page_{page_num:04d}.json")
        
        # Skip if already processed
        if os.path.exists(output_path):
            continue
        
        # Read text
        text_path = os.path.join(RAW_DIR, f"page_{page_num:04d}.txt")
        with open(text_path, 'r', encoding='utf-8', errors='replace') as f:
            text = f.read()
        
        inv_entry = inv_map.get(page_num, {})
        
        record = generate_page_record(page_num, text, inv_entry)
        
        with open(output_path, 'w') as f:
            json.dump(record, f, indent=2, ensure_ascii=False)
        
        if page_num % 10 == 0:
            print(f"  Processed page {page_num}/445")


if __name__ == "__main__":
    # Process in specified range or all
    if len(sys.argv) >= 3:
        start = int(sys.argv[1])
        end = int(sys.argv[2])
    else:
        start = 1
        end = 445
    
    print(f"Processing pages {start}-{end}...")
    process_batch(start, end)
    print(f"Done processing pages {start}-{end}")
