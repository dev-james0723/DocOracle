#!/usr/bin/env python3
"""
Build paired metadata JSON for each visual asset.
Each image gets a companion .json file with description, section, keywords, etc.
Also builds a master visual_assets_index.json for retrieval.
"""

import json
import os

OUTPUT_BASE = "/home/ubuntu/PDF_PROJECT_OUTPUT"
ASSETS_DIR = os.path.join(OUTPUT_BASE, "10_visual_assets")

# Load visual pages list
with open("/home/ubuntu/visual_pages_list.json") as f:
    visual_pages = json.load(f)

# Load gold master data for richer descriptions
type_to_folder = {
    "diagram": "diagrams",
    "photo": "photos",
    "table": "tables",
    "mixed_visual": "mixed",
    "sketch": "diagrams",
    "infographic": "diagrams"
}

master_index = []

for vp in visual_pages:
    pn = vp["page_number"]
    vtype = vp["visual_type"]
    folder = type_to_folder.get(vtype, "mixed")
    
    # Load gold master for this page
    gold_path = os.path.join(OUTPUT_BASE, f"04_gold_master/pages/page_{pn:04d}.json")
    with open(gold_path) as f:
        gold = json.load(f)
    
    # Load visual review if exists
    vr_path = os.path.join(OUTPUT_BASE, f"03_visual_reviews/page_{pn:04d}_visual_review.json")
    vr = None
    if os.path.exists(vr_path):
        with open(vr_path) as f:
            vr = json.load(f)
    
    # Build comprehensive description
    descriptions = []
    
    # From gold master
    vis_desc = gold.get("observed_visual_description", "")
    if vis_desc and "no visual" not in vis_desc.lower() and "text only" not in vis_desc.lower():
        descriptions.append(vis_desc)
    
    # From figures
    figures = gold.get("figures", [])
    for fig in figures:
        if isinstance(fig, dict):
            fig_desc = fig.get("description", "")
            if fig_desc:
                descriptions.append(f"Figure elements: {fig_desc}")
            fig_struct = fig.get("structure", "")
            if fig_struct:
                descriptions.append(f"Structure: {fig_struct}")
            fig_spatial = fig.get("spatial_info", "")
            if fig_spatial:
                descriptions.append(f"Spatial details: {fig_spatial}")
    
    # From visual review
    if vr:
        vr_vis = vr.get("visual_elements_detected", "")
        if vr_vis and vr_vis not in descriptions:
            descriptions.append(f"Visual elements: {vr_vis}")
        vr_struct = vr.get("observed_structure", "")
        if vr_struct:
            descriptions.append(f"Diagram structure: {vr_struct}")
    
    # Spatial relationships
    spatial = gold.get("spatial_relationships", "")
    if not spatial and vr:
        spatial = vr.get("spatial_relationships", "")
    
    # Captions
    captions = gold.get("captions", [])
    caption_text = "; ".join([c for c in captions if c]) if captions else ""
    
    # Tables
    tables = gold.get("tables", [])
    table_content = ""
    if tables:
        for t in tables:
            if t and t != "No tables" and len(str(t)) > 10:
                table_content += str(t) + "\n"
    if not table_content and vr:
        tc = vr.get("table_content", "")
        if tc and tc != "No tables":
            table_content = tc
    
    # Handwritten annotations
    handwritten = gold.get("handwritten_annotations", "None detected")
    if handwritten == "None detected" and vr:
        handwritten = vr.get("handwritten_annotations", "None detected")
    
    # Build the metadata record
    metadata = {
        "page_number": pn,
        "visual_type": vtype,
        "image_file": f"{folder}/page_{pn:04d}.png",
        "section": vp.get("section", gold.get("section_path", "")),
        "caption": caption_text,
        "description": "\n\n".join(descriptions) if descriptions else vp.get("visual_description", "Visual content on this page."),
        "spatial_relationships": spatial,
        "table_content": table_content.strip() if table_content else "",
        "handwritten_annotations": handwritten if handwritten != "None detected" else "",
        "page_summary": gold.get("page_summary_strict", vp.get("summary", "")),
        "keywords": gold.get("keywords", []),
        "confidence_level": gold.get("confidence_level", "medium"),
        "retrieval_tags": []
    }
    
    # Build retrieval tags for semantic matching
    tags = set()
    section = metadata["section"].lower()
    desc_lower = metadata["description"].lower()
    
    # Instrument tags
    instruments = ["piano", "violin", "cello", "guitar", "harp", "organ", "harpsichord",
                   "flute", "oboe", "clarinet", "bassoon", "trumpet", "horn", "trombone",
                   "tuba", "percussion", "timpani", "voice", "singer", "choir", "soprano",
                   "woodwind", "brass", "strings"]
    for inst in instruments:
        if inst in desc_lower or inst in section:
            tags.add(inst)
    
    # Technique tags
    techniques = ["decca tree", "spaced pair", "coincident", "blumlein", "ortf", "nos",
                  "ms", "xy", "spot microphone", "ancillary", "surround", "5.1",
                  "dolby atmos", "ambient pair"]
    for tech in techniques:
        if tech in desc_lower or tech in section:
            tags.add(tech)
    
    # Setup tags
    setups = ["studio layout", "concert layout", "microphone placement", "microphone position",
              "recording setup", "session setup", "orchestral layout", "seating"]
    for setup in setups:
        if setup in desc_lower or setup in section:
            tags.add(setup)
    
    # Content type tags
    if "table" in desc_lower or table_content:
        tags.add("table")
    if "diagram" in desc_lower or vtype == "diagram":
        tags.add("diagram")
    if "photo" in desc_lower or vtype == "photo":
        tags.add("photograph")
    if spatial:
        tags.add("spatial_layout")
    if "figure" in caption_text.lower():
        tags.add("figure")
    
    metadata["retrieval_tags"] = sorted(list(tags))
    
    # Save companion JSON next to the image
    json_path = os.path.join(ASSETS_DIR, folder, f"page_{pn:04d}.json")
    with open(json_path, 'w') as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)
    
    # Add to master index
    master_index.append(metadata)

# Save master index
with open(os.path.join(ASSETS_DIR, "visual_assets_index.json"), 'w') as f:
    json.dump(master_index, f, indent=2, ensure_ascii=False)

# Print summary
print(f"Created {len(master_index)} visual asset pairs (image + JSON)")

# Count by type
type_counts = {}
for m in master_index:
    vt = m["visual_type"]
    type_counts[vt] = type_counts.get(vt, 0) + 1
for vt, count in sorted(type_counts.items()):
    print(f"  {vt}: {count}")

# Count by retrieval tags
tag_counts = {}
for m in master_index:
    for tag in m["retrieval_tags"]:
        tag_counts[tag] = tag_counts.get(tag, 0) + 1
print(f"\nTop retrieval tags:")
for tag, count in sorted(tag_counts.items(), key=lambda x: -x[1])[:20]:
    print(f"  {tag}: {count}")

# File counts per folder
for folder in ["diagrams", "photos", "tables", "mixed"]:
    fpath = os.path.join(ASSETS_DIR, folder)
    pngs = len([f for f in os.listdir(fpath) if f.endswith(".png")])
    jsons = len([f for f in os.listdir(fpath) if f.endswith(".json")])
    print(f"\n{folder}/: {pngs} images, {jsons} metadata files")
