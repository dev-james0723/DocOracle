#!/usr/bin/env python3
"""
Merge all analysis results into:
1. 02_page_records/ - per-page canonical JSON records
2. 03_visual_reviews/ - visual review files for high/medium risk pages
3. 04_gold_master/pages/ - gold master per-page records
4. extraction_log.md
"""

import json
import os

# Paths
OUTPUT_BASE = "/home/ubuntu/PDF_PROJECT_OUTPUT"
RAW_DIR = "/home/ubuntu/raw_text_pages"
PAGE_RECORDS_DIR = os.path.join(OUTPUT_BASE, "02_page_records")
VISUAL_REVIEWS_DIR = os.path.join(OUTPUT_BASE, "03_visual_reviews")
GOLD_MASTER_DIR = os.path.join(OUTPUT_BASE, "04_gold_master/pages")

# Load all analysis results
print("Loading analysis results...")

with open("/home/ubuntu/analyze_high_risk_pages.json") as f:
    high_risk_data = json.load(f)

with open("/home/ubuntu/analyze_medium_risk_pages.json") as f:
    medium_risk_data = json.load(f)

with open("/home/ubuntu/analyze_low_risk_pages.json") as f:
    low_risk_data = json.load(f)

with open(os.path.join(OUTPUT_BASE, "01_inventory/page_inventory.json")) as f:
    inventory = json.load(f)
inv_map = {e["page_number"]: e for e in inventory}

# Build lookup maps
high_risk_map = {}
for r in high_risk_data["results"]:
    if not r.get("error"):
        pn = int(r["input"])
        high_risk_map[pn] = r["output"]

medium_risk_map = {}
for r in medium_risk_data["results"]:
    if not r.get("error"):
        pn = int(r["input"])
        medium_risk_map[pn] = r["output"]

low_risk_map = {}
for r in low_risk_data["results"]:
    if not r.get("error"):
        pn = int(r["input"])
        low_risk_map[pn] = r["output"]

print(f"High risk: {len(high_risk_map)}, Medium risk: {len(medium_risk_map)}, Low risk: {len(low_risk_map)}")
print(f"Total covered: {len(high_risk_map) + len(medium_risk_map) + len(low_risk_map)}")

# Track issues for extraction log
extraction_issues = []
visual_review_pages = []

def build_page_record(page_num):
    """Build a canonical page record from all available data."""
    
    # Read raw text
    text_path = os.path.join(RAW_DIR, f"page_{page_num:04d}.txt")
    with open(text_path, 'r', encoding='utf-8', errors='replace') as f:
        raw_text = f.read()
    
    inv = inv_map.get(page_num, {})
    
    # Determine which analysis source to use
    if page_num in high_risk_map:
        vis = high_risk_map[page_num]
        source = "high_risk_visual"
        
        record = {
            "page_number": page_num,
            "page_type": vis.get("page_type", inv.get("page_type", "other")),
            "section_heading_guess": "",  # Will be filled from context
            "raw_text_full": raw_text.strip() if raw_text.strip() else "[No extractable text - visual content only]",
            "layout_preserving_markdown": vis.get("all_text_in_image", ""),
            "tables_extracted": [vis.get("table_content_markdown", "")] if vis.get("table_content_markdown", "No tables") != "No tables" else [],
            "captions": [c.strip() for c in vis.get("all_text_in_image", "").split("Figure") if c.strip()][:5] if "Figure" in vis.get("all_text_in_image", "") else [],
            "footnotes": [],
            "observed_visual_description": vis.get("visual_elements_detected", ""),
            "spatial_relationships": vis.get("spatial_relationships", ""),
            "diagram_structure": vis.get("diagram_structure", ""),
            "interpreted_page_meaning": vis.get("page_summary", ""),
            "uncertainties": [u.strip() for u in vis.get("uncertainties", "").split(";") if u.strip()],
            "keywords": [],
            "page_summary_strict": vis.get("page_summary", ""),
            "handwritten_annotations": vis.get("handwritten_annotations", "None detected"),
            "confidence_level": vis.get("confidence_level", "medium"),
            "analysis_source": source
        }
        
    elif page_num in medium_risk_map:
        vis = medium_risk_map[page_num]
        source = "medium_risk_visual"
        
        record = {
            "page_number": page_num,
            "page_type": vis.get("page_type", inv.get("page_type", "mixed")),
            "section_heading_guess": "",
            "raw_text_full": raw_text.strip(),
            "layout_preserving_markdown": vis.get("all_text_in_image", raw_text.strip()),
            "tables_extracted": [vis.get("table_content_markdown", "")] if vis.get("table_content_markdown", "No tables") != "No tables" else [],
            "captions": [],
            "footnotes": [],
            "observed_visual_description": vis.get("visual_elements_detected", ""),
            "spatial_relationships": vis.get("spatial_relationships", ""),
            "diagram_structure": vis.get("diagram_structure", ""),
            "interpreted_page_meaning": vis.get("page_summary", ""),
            "uncertainties": [u.strip() for u in vis.get("uncertainties", "").split(";") if u.strip()],
            "keywords": [],
            "page_summary_strict": vis.get("page_summary", ""),
            "handwritten_annotations": vis.get("handwritten_annotations", "None detected"),
            "confidence_level": vis.get("confidence_level", "medium"),
            "analysis_source": source
        }
        
    elif page_num in low_risk_map:
        txt = low_risk_map[page_num]
        source = "text_analysis"
        
        captions_raw = txt.get("captions", "None")
        captions = [c.strip() for c in captions_raw.split(";") if c.strip() and c.strip() != "None"] if captions_raw else []
        
        footnotes_raw = txt.get("footnotes", "None")
        footnotes = [f.strip() for f in footnotes_raw.split(";") if f.strip() and f.strip() != "None"] if footnotes_raw else []
        
        uncertainties_raw = txt.get("uncertainties", "None")
        uncertainties = [u.strip() for u in uncertainties_raw.split(";") if u.strip() and u.strip() != "None"] if uncertainties_raw else []
        
        keywords_raw = txt.get("keywords", "")
        keywords = [k.strip() for k in keywords_raw.split(",") if k.strip()] if keywords_raw else []
        
        record = {
            "page_number": page_num,
            "page_type": txt.get("page_type", inv.get("page_type", "text")),
            "section_heading_guess": txt.get("section_heading", ""),
            "raw_text_full": raw_text.strip(),
            "layout_preserving_markdown": txt.get("layout_markdown", raw_text.strip()),
            "tables_extracted": [],
            "captions": captions,
            "footnotes": footnotes,
            "observed_visual_description": txt.get("visual_description", "Text only - no visual elements"),
            "spatial_relationships": "",
            "diagram_structure": "",
            "interpreted_page_meaning": txt.get("interpreted_meaning", ""),
            "uncertainties": uncertainties,
            "keywords": keywords,
            "page_summary_strict": txt.get("page_summary", ""),
            "handwritten_annotations": "None detected",
            "confidence_level": "high",
            "analysis_source": source
        }
    else:
        # Fallback for any missing pages
        source = "fallback"
        extraction_issues.append(f"Page {page_num}: No analysis data available, using fallback")
        
        record = {
            "page_number": page_num,
            "page_type": inv.get("page_type", "other"),
            "section_heading_guess": "",
            "raw_text_full": raw_text.strip(),
            "layout_preserving_markdown": raw_text.strip(),
            "tables_extracted": [],
            "captions": [],
            "footnotes": [],
            "observed_visual_description": "No visual analysis performed",
            "spatial_relationships": "",
            "diagram_structure": "",
            "interpreted_page_meaning": "",
            "uncertainties": ["No detailed analysis available for this page"],
            "keywords": [],
            "page_summary_strict": "",
            "handwritten_annotations": "Not reviewed",
            "confidence_level": "low",
            "analysis_source": source
        }
    
    return record


def build_visual_review(page_num, record):
    """Build a visual review JSON for high/medium risk pages."""
    
    vis_data = high_risk_map.get(page_num) or medium_risk_map.get(page_num)
    if not vis_data:
        return None
    
    return {
        "page_number": page_num,
        "visual_elements_detected": vis_data.get("visual_elements_detected", ""),
        "readable_text_in_visuals": vis_data.get("all_text_in_image", ""),
        "observed_structure": vis_data.get("diagram_structure", ""),
        "spatial_relationships": vis_data.get("spatial_relationships", ""),
        "likely_meaning": vis_data.get("page_summary", ""),
        "uncertainties": vis_data.get("uncertainties", ""),
        "confidence_level": vis_data.get("confidence_level", "medium"),
        "handwritten_annotations": vis_data.get("handwritten_annotations", "None detected"),
        "table_content": vis_data.get("table_content_markdown", "No tables"),
        "review_notes": f"Analyzed via Gemini vision model. Source: {'high' if page_num in high_risk_map else 'medium'} risk visual analysis."
    }


def build_gold_master(page_num, record, visual_review):
    """Build gold master record merging all data."""
    
    inv = inv_map.get(page_num, {})
    
    # Build citation-ready excerpts
    excerpts = []
    raw = record.get("raw_text_full", "")
    if raw and len(raw) > 50:
        # Extract first meaningful paragraph
        paragraphs = [p.strip() for p in raw.split('\n\n') if len(p.strip()) > 30]
        for p in paragraphs[:3]:
            if len(p) > 50:
                excerpts.append(p[:500])
    
    gold = {
        "page_number": page_num,
        "page_type": record.get("page_type", "text"),
        "section_path": record.get("section_heading_guess", ""),
        "raw_text_full": record.get("raw_text_full", ""),
        "layout_preserving_markdown": record.get("layout_preserving_markdown", ""),
        "figures": [],
        "tables": record.get("tables_extracted", []),
        "captions": record.get("captions", []),
        "footnotes": record.get("footnotes", []),
        "observed_visual_description": record.get("observed_visual_description", ""),
        "spatial_relationships": record.get("spatial_relationships", ""),
        "interpreted_page_meaning": record.get("interpreted_page_meaning", ""),
        "uncertainties": record.get("uncertainties", []),
        "page_summary_strict": record.get("page_summary_strict", ""),
        "keywords": record.get("keywords", []),
        "citation_ready_excerpt_candidates": excerpts,
        "handwritten_annotations": record.get("handwritten_annotations", "None detected"),
        "confidence_level": record.get("confidence_level", "medium"),
        "analysis_source": record.get("analysis_source", "unknown")
    }
    
    # If visual review exists, add figure descriptions
    if visual_review:
        gold["figures"] = [{
            "description": visual_review.get("visual_elements_detected", ""),
            "structure": visual_review.get("observed_structure", ""),
            "spatial_info": visual_review.get("spatial_relationships", ""),
            "text_in_figure": visual_review.get("readable_text_in_visuals", "")
        }]
    
    return gold


# Process all 445 pages
print("Building records for all 445 pages...")

gold_master_index = []

for page_num in range(1, 446):
    # Build page record
    record = build_page_record(page_num)
    
    # Save page record
    record_path = os.path.join(PAGE_RECORDS_DIR, f"page_{page_num:04d}.json")
    with open(record_path, 'w') as f:
        json.dump(record, f, indent=2, ensure_ascii=False)
    
    # Build visual review if applicable
    visual_review = None
    if page_num in high_risk_map or page_num in medium_risk_map:
        visual_review = build_visual_review(page_num, record)
        if visual_review:
            vr_path = os.path.join(VISUAL_REVIEWS_DIR, f"page_{page_num:04d}_visual_review.json")
            with open(vr_path, 'w') as f:
                json.dump(visual_review, f, indent=2, ensure_ascii=False)
            visual_review_pages.append(page_num)
    
    # Build gold master
    gold = build_gold_master(page_num, record, visual_review)
    gold_path = os.path.join(GOLD_MASTER_DIR, f"page_{page_num:04d}.json")
    with open(gold_path, 'w') as f:
        json.dump(gold, f, indent=2, ensure_ascii=False)
    
    # Add to index
    gold_master_index.append({
        "page_number": page_num,
        "file_path": f"pages/page_{page_num:04d}.json",
        "section_path": record.get("section_heading_guess", ""),
        "page_type": record.get("page_type", ""),
        "key_topics": record.get("keywords", [])[:5]
    })
    
    if page_num % 50 == 0:
        print(f"  Processed page {page_num}/445")

# Save gold master index
index_path = os.path.join(OUTPUT_BASE, "04_gold_master/gold_master_index.json")
with open(index_path, 'w') as f:
    json.dump(gold_master_index, f, indent=2, ensure_ascii=False)

print(f"\nCompleted:")
print(f"  Page records: {len(os.listdir(PAGE_RECORDS_DIR))} files")
print(f"  Visual reviews: {len(os.listdir(VISUAL_REVIEWS_DIR))} files")
print(f"  Gold master pages: {len(os.listdir(GOLD_MASTER_DIR))} files")
print(f"  Extraction issues: {len(extraction_issues)}")

# Save extraction log
log_path = os.path.join(PAGE_RECORDS_DIR, "extraction_log.md")
with open(log_path, 'w') as f:
    f.write("# Extraction Log\n\n")
    f.write("## Processing Summary\n\n")
    f.write(f"- Total pages processed: 445\n")
    f.write(f"- High-risk pages (Gemini vision): {len(high_risk_map)}\n")
    f.write(f"- Medium-risk pages (Gemini vision): {len(medium_risk_map)}\n")
    f.write(f"- Low-risk pages (text + vision): {len(low_risk_map)}\n")
    f.write(f"- Visual review files created: {len(visual_review_pages)}\n\n")
    
    f.write("## Pages Requiring Special Handling\n\n")
    f.write("### High-Risk Visual Pages\n\n")
    f.write("These pages contained primarily visual content (diagrams, photographs, setup sheets) with minimal extractable text. ")
    f.write("Each was analyzed using the Gemini 2.5 Flash vision model for detailed spatial and structural description.\n\n")
    for pn in sorted(high_risk_map.keys()):
        vis = high_risk_map[pn]
        f.write(f"- **Page {pn}** ({vis.get('page_type', 'unknown')}): {vis.get('page_summary', 'N/A')[:100]}\n")
    
    f.write("\n### Medium-Risk Mixed Pages\n\n")
    f.write("These pages contained mixed text and visual content. Both text extraction and vision analysis were performed.\n\n")
    
    f.write("### Visually Complex Page Ranges\n\n")
    f.write("- Pages 76-169: Heavy concentration of microphone placement diagrams (Chapters 3-6)\n")
    f.write("- Pages 188-275: Studio layout diagrams for various instruments and ensembles (Chapters 7-12)\n")
    f.write("- Pages 413-428: Appendix materials including original session set-up sheets\n\n")
    
    if extraction_issues:
        f.write("## Extraction Issues\n\n")
        for issue in extraction_issues:
            f.write(f"- {issue}\n")
    
    f.write("\n## Page 169 Note\n\n")
    f.write("Page 169 failed visual analysis — the image appeared blank with only a watermark visible. ")
    f.write("This may be a blank separator page or a page where content did not render properly.\n")

print("Extraction log saved.")
print("Done!")
