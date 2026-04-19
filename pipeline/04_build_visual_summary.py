#!/usr/bin/env python3
"""Build the high_risk_pages_summary.md from visual review data."""

import json
import os

OUTPUT_BASE = "/home/ubuntu/PDF_PROJECT_OUTPUT"
VR_DIR = os.path.join(OUTPUT_BASE, "03_visual_reviews")

# Load all visual reviews
reviews = []
for fname in sorted(os.listdir(VR_DIR)):
    if fname.endswith("_visual_review.json"):
        with open(os.path.join(VR_DIR, fname)) as f:
            reviews.append(json.load(f))

# Load high risk analysis
with open("/home/ubuntu/analyze_high_risk_pages.json") as f:
    high_risk_data = json.load(f)

with open("/home/ubuntu/analyze_medium_risk_pages.json") as f:
    medium_risk_data = json.load(f)

# Separate by risk level
high_risk_pages = set()
for r in high_risk_data["results"]:
    if not r.get("error"):
        high_risk_pages.add(int(r["input"]))

medium_risk_pages = set()
for r in medium_risk_data["results"]:
    if not r.get("error"):
        medium_risk_pages.add(int(r["input"]))

# Build summary
with open(os.path.join(VR_DIR, "high_risk_pages_summary.md"), 'w') as f:
    f.write("# High-Risk Pages Visual Review Summary\n\n")
    f.write("## Overview\n\n")
    f.write(f"Total visual reviews performed: {len(reviews)}\n")
    f.write(f"- High-risk pages reviewed: {len([r for r in reviews if r['page_number'] in high_risk_pages])}\n")
    f.write(f"- Medium-risk pages reviewed: {len([r for r in reviews if r['page_number'] in medium_risk_pages])}\n\n")
    
    f.write("## High-Risk Pages Detail\n\n")
    f.write("These pages had minimal extractable text and required full visual analysis.\n\n")
    
    for r in sorted([rv for rv in reviews if rv['page_number'] in high_risk_pages], key=lambda x: x['page_number']):
        pn = r['page_number']
        f.write(f"### Page {pn}\n\n")
        f.write(f"**Confidence:** {r.get('confidence_level', 'N/A')}\n\n")
        f.write(f"**Visual Elements:** {r.get('visual_elements_detected', 'N/A')[:300]}\n\n")
        if r.get('spatial_relationships'):
            f.write(f"**Spatial Relationships:** {r['spatial_relationships'][:300]}\n\n")
        f.write(f"**Meaning:** {r.get('likely_meaning', 'N/A')[:200]}\n\n")
        if r.get('uncertainties') and r['uncertainties'] != "None":
            f.write(f"**Uncertainties:** {r['uncertainties'][:200]}\n\n")
        if r.get('handwritten_annotations') and r['handwritten_annotations'] != "None detected":
            f.write(f"**Handwritten Annotations:** {r['handwritten_annotations'][:200]}\n\n")
        f.write("---\n\n")
    
    f.write("## Medium-Risk Pages Summary\n\n")
    f.write("These pages had mixed text/visual content. Key findings from visual review:\n\n")
    
    # Group medium risk by type
    diagram_pages = []
    table_pages = []
    mixed_pages = []
    
    for r in sorted([rv for rv in reviews if rv['page_number'] in medium_risk_pages], key=lambda x: x['page_number']):
        pn = r['page_number']
        vis = r.get('visual_elements_detected', '').lower()
        if 'diagram' in vis or 'layout' in vis or 'microphone' in vis:
            diagram_pages.append(r)
        elif 'table' in vis:
            table_pages.append(r)
        else:
            mixed_pages.append(r)
    
    if diagram_pages:
        f.write("### Pages with Diagrams/Layouts\n\n")
        for r in diagram_pages:
            f.write(f"- **Page {r['page_number']}**: {r.get('likely_meaning', 'N/A')[:150]}\n")
        f.write("\n")
    
    if table_pages:
        f.write("### Pages with Tables\n\n")
        for r in table_pages:
            f.write(f"- **Page {r['page_number']}**: {r.get('likely_meaning', 'N/A')[:150]}\n")
        f.write("\n")
    
    if mixed_pages:
        f.write("### Other Mixed Content Pages\n\n")
        for r in mixed_pages:
            f.write(f"- **Page {r['page_number']}**: {r.get('likely_meaning', 'N/A')[:150]}\n")
        f.write("\n")
    
    f.write("## Uncertainty Reduction Assessment\n\n")
    f.write("The Gemini vision model analysis significantly reduced uncertainty for most visual pages:\n\n")
    
    high_conf = len([r for r in reviews if r.get('confidence_level') == 'high'])
    med_conf = len([r for r in reviews if r.get('confidence_level') == 'medium'])
    low_conf = len([r for r in reviews if r.get('confidence_level') == 'low'])
    
    f.write(f"- High confidence: {high_conf} pages\n")
    f.write(f"- Medium confidence: {med_conf} pages\n")
    f.write(f"- Low confidence: {low_conf} pages\n\n")
    
    f.write("**Key findings:**\n\n")
    f.write("1. Microphone placement diagrams were successfully described with spatial relationships (distances, angles, heights)\n")
    f.write("2. Studio layout diagrams captured instrument positions and microphone configurations\n")
    f.write("3. Appendix 3 session set-up sheets contained handwritten annotations that were partially transcribed\n")
    f.write("4. Some pages with very small text or complex overlapping elements retained medium/low confidence\n")
    f.write("5. Page 169 could not be analyzed (appeared blank/corrupted)\n")

print("Visual review summary created.")
