#!/usr/bin/env python3
"""
Identify all pages containing diagrams, images, and tables from the existing analysis.
Categorize them by visual type for organized extraction.
"""

import json
import os

OUTPUT_BASE = "/home/ubuntu/PDF_PROJECT_OUTPUT"

# Load gold master index
with open(os.path.join(OUTPUT_BASE, "04_gold_master/gold_master_index.json")) as f:
    gm_index = json.load(f)

# Load page inventory
with open(os.path.join(OUTPUT_BASE, "01_inventory/page_inventory.json")) as f:
    inventory = json.load(f)
inv_map = {e["page_number"]: e for e in inventory}

# Scan all gold master pages for visual content
visual_pages = {
    "diagram": [],
    "photo": [],
    "table": [],
    "mixed_visual": [],
    "sketch": [],
    "infographic": []
}

all_visual = []

for entry in gm_index:
    pn = entry["page_number"]
    gold_path = os.path.join(OUTPUT_BASE, f"04_gold_master/pages/page_{pn:04d}.json")
    with open(gold_path) as f:
        gold = json.load(f)
    
    page_type = gold.get("page_type", "text")
    vis_desc = gold.get("observed_visual_description", "")
    spatial = gold.get("spatial_relationships", "")
    figures = gold.get("figures", [])
    tables = gold.get("tables", [])
    captions = gold.get("captions", [])
    section = gold.get("section_path", "") or entry.get("section_path", "")
    summary = gold.get("page_summary_strict", "")
    
    has_visual = False
    visual_type = "mixed_visual"
    
    # Check page type
    if page_type in ("diagram", "sketch"):
        has_visual = True
        visual_type = "diagram"
    elif page_type == "photo":
        has_visual = True
        visual_type = "photo"
    elif page_type == "table":
        has_visual = True
        visual_type = "table"
    elif page_type == "infographic":
        has_visual = True
        visual_type = "infographic"
    
    # Check for visual descriptions
    if vis_desc and "no visual" not in vis_desc.lower() and "text only" not in vis_desc.lower():
        has_visual = True
    
    # Check for figures
    if figures and len(figures) > 0:
        fig_desc = figures[0].get("description", "")
        if fig_desc and len(fig_desc) > 10:
            has_visual = True
            if "diagram" in fig_desc.lower() or "microphone" in fig_desc.lower() or "layout" in fig_desc.lower():
                visual_type = "diagram"
            elif "photo" in fig_desc.lower() or "photograph" in fig_desc.lower():
                visual_type = "photo"
    
    # Check for tables
    if tables and len(tables) > 0:
        for t in tables:
            if t and t != "No tables" and len(str(t)) > 20:
                has_visual = True
                if visual_type == "mixed_visual":
                    visual_type = "table"
    
    # Check for spatial relationships (indicates diagram)
    if spatial and len(spatial) > 20:
        has_visual = True
        visual_type = "diagram"
    
    # Check captions for figure references
    if captions:
        for cap in captions:
            if cap and ("Figure" in cap or "Table" in cap or "Fig." in cap):
                has_visual = True
    
    # Skip non-visual pages
    if not has_visual:
        continue
    
    # Skip cover, toc, index pages
    if page_type in ("cover", "toc", "other") and not figures and not spatial:
        continue
    
    # Build record
    record = {
        "page_number": pn,
        "visual_type": visual_type,
        "page_type": page_type,
        "section": section,
        "summary": summary[:300] if summary else "",
        "visual_description": vis_desc[:500] if vis_desc else "",
        "spatial_relationships": spatial[:500] if spatial else "",
        "captions": captions,
        "has_figures": len(figures) > 0,
        "has_tables": len([t for t in tables if t and t != "No tables"]) > 0
    }
    
    visual_pages[visual_type].append(record)
    all_visual.append(record)

# Print summary
print("=== Visual Pages Summary ===")
for vtype, pages in visual_pages.items():
    print(f"  {vtype}: {len(pages)} pages")
    if pages:
        print(f"    Pages: {[p['page_number'] for p in pages]}")
print(f"\n  TOTAL: {len(all_visual)} visual pages")

# Save
with open("/home/ubuntu/visual_pages_list.json", "w") as f:
    json.dump(all_visual, f, indent=2)

print(f"\nSaved to /home/ubuntu/visual_pages_list.json")
