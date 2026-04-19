#!/usr/bin/env python3
"""
Task 7: Build retrieval layer - page_chunks.jsonl, section_chunks.jsonl, 
retrieval_manifest.json, retrieval_strategy.md
"""

import json
import os

OUTPUT_BASE = "/home/ubuntu/PDF_PROJECT_OUTPUT"
RETRIEVAL_DIR = os.path.join(OUTPUT_BASE, "05_retrieval")

# Load gold master index and sections
with open(os.path.join(OUTPUT_BASE, "04_gold_master/gold_master_index.json")) as f:
    gm_index = json.load(f)

with open(os.path.join(OUTPUT_BASE, "04_gold_master/sections.json")) as f:
    sections = json.load(f)

# ============================================================
# PAGE CHUNKS
# ============================================================
print("Building page_chunks.jsonl...")

chunk_id = 0
page_chunks = []

for entry in gm_index:
    pn = entry["page_number"]
    gold_path = os.path.join(OUTPUT_BASE, f"04_gold_master/pages/page_{pn:04d}.json")
    with open(gold_path) as f:
        gold = json.load(f)
    
    # Build chunk text from available content
    text_parts = []
    
    # Add section context
    section_path = gold.get("section_path", "") or entry.get("section_path", "")
    if section_path:
        text_parts.append(f"[Section: {section_path}]")
    
    # Add page summary
    summary = gold.get("page_summary_strict", "")
    if summary:
        text_parts.append(summary)
    
    # Add raw text (truncated for chunk size)
    raw_text = gold.get("raw_text_full", "")
    if raw_text and raw_text != "[No extractable text - visual content only]":
        text_parts.append(raw_text[:2000])
    
    # Add visual description for visual pages
    vis_desc = gold.get("observed_visual_description", "")
    if vis_desc and "no visual" not in vis_desc.lower():
        text_parts.append(f"[Visual content: {vis_desc[:500]}]")
    
    # Add spatial relationships
    spatial = gold.get("spatial_relationships", "")
    if spatial:
        text_parts.append(f"[Spatial details: {spatial[:500]}]")
    
    # Add table content
    tables = gold.get("tables", [])
    for t in tables:
        if t and t != "No tables":
            text_parts.append(f"[Table: {str(t)[:500]}]")
    
    chunk_text = "\n\n".join(text_parts)
    
    # Determine uncertainty flags
    uncertainties = gold.get("uncertainties", [])
    has_uncertainty = len(uncertainties) > 0
    
    chunk = {
        "chunk_id": f"page_{pn:04d}",
        "source_type": "page",
        "page_number": pn,
        "page_range": [pn, pn],
        "section_path": section_path,
        "keywords": gold.get("keywords", []) or entry.get("key_topics", []),
        "uncertainty_flags": uncertainties[:3] if has_uncertainty else [],
        "chunk_text": chunk_text,
        "page_type": gold.get("page_type", "text"),
        "has_visual_content": bool(vis_desc and "no visual" not in vis_desc.lower()),
        "confidence_level": gold.get("confidence_level", "medium")
    }
    
    page_chunks.append(chunk)
    chunk_id += 1

# Write page chunks
with open(os.path.join(RETRIEVAL_DIR, "page_chunks.jsonl"), 'w') as f:
    for chunk in page_chunks:
        f.write(json.dumps(chunk, ensure_ascii=False) + "\n")

print(f"  Written {len(page_chunks)} page chunks")

# ============================================================
# SECTION CHUNKS
# ============================================================
print("Building section_chunks.jsonl...")

section_chunks = []

for section in sections:
    sid = section["section_id"]
    page_start, page_end = section["page_range"]
    
    # Aggregate text from all pages in this section
    section_text_parts = []
    section_keywords = set()
    section_uncertainties = []
    has_visual = False
    
    for pn in range(page_start, page_end + 1):
        gold_path = os.path.join(OUTPUT_BASE, f"04_gold_master/pages/page_{pn:04d}.json")
        if not os.path.exists(gold_path):
            continue
        with open(gold_path) as f:
            gold = json.load(f)
        
        summary = gold.get("page_summary_strict", "")
        if summary:
            section_text_parts.append(f"[p.{pn}] {summary}")
        
        for kw in (gold.get("keywords", []) or []):
            section_keywords.add(kw)
        
        for u in (gold.get("uncertainties", []) or []):
            if u:
                section_uncertainties.append(f"p.{pn}: {u}")
        
        vis = gold.get("observed_visual_description", "")
        if vis and "no visual" not in vis.lower():
            has_visual = True
            section_text_parts.append(f"[p.{pn} visual: {vis[:200]}]")
    
    chunk_text = f"# {section['title']}\n\n{section['summary']}\n\n" + "\n\n".join(section_text_parts[:50])
    
    section_chunk = {
        "chunk_id": f"section_{sid}",
        "source_type": "section",
        "page_number": page_start,
        "page_range": [page_start, page_end],
        "section_path": section["title"],
        "keywords": list(section_keywords)[:20],
        "uncertainty_flags": section_uncertainties[:5],
        "chunk_text": chunk_text[:5000],
        "has_visual_content": has_visual,
        "key_concepts": section.get("key_concepts", [])
    }
    
    section_chunks.append(section_chunk)

with open(os.path.join(RETRIEVAL_DIR, "section_chunks.jsonl"), 'w') as f:
    for chunk in section_chunks:
        f.write(json.dumps(chunk, ensure_ascii=False) + "\n")

print(f"  Written {len(section_chunks)} section chunks")

# ============================================================
# RETRIEVAL MANIFEST
# ============================================================
print("Building retrieval_manifest.json...")

manifest = {
    "document_title": "Classical Recording: A Practical Guide in the Decca Tradition",
    "total_pages": 445,
    "total_page_chunks": len(page_chunks),
    "total_section_chunks": len(section_chunks),
    "chunk_format": "JSONL (one JSON object per line)",
    "page_chunk_file": "page_chunks.jsonl",
    "section_chunk_file": "section_chunks.jsonl",
    "chunk_schema": {
        "chunk_id": "Unique identifier (page_NNNN or section_ID)",
        "source_type": "page or section",
        "page_number": "Primary page number",
        "page_range": "[start, end] page range",
        "section_path": "Section/chapter path",
        "keywords": "Array of key terms",
        "uncertainty_flags": "Array of uncertainty notes",
        "chunk_text": "Full chunk text content",
        "has_visual_content": "Boolean indicating visual elements"
    },
    "visual_content_pages": [c["page_number"] for c in page_chunks if c.get("has_visual_content")],
    "high_uncertainty_pages": [c["page_number"] for c in page_chunks if len(c.get("uncertainty_flags", [])) > 0],
    "sections_with_visuals": [c["chunk_id"] for c in section_chunks if c.get("has_visual_content")]
}

with open(os.path.join(RETRIEVAL_DIR, "retrieval_manifest.json"), 'w') as f:
    json.dump(manifest, f, indent=2)

# ============================================================
# RETRIEVAL STRATEGY
# ============================================================
print("Building retrieval_strategy.md...")

strategy = """# Retrieval Strategy

## Overview

This retrieval layer provides two complementary levels of access to the knowledge base:

1. **Page-level chunks** (`page_chunks.jsonl`): 445 chunks, one per page, preserving exact page-level citation fidelity
2. **Section-level chunks** (`section_chunks.jsonl`): 35 chunks covering all major sections, supporting higher-level semantic retrieval

## Page-Level Retrieval

### How It Works

Each page chunk contains:
- The raw extracted text from that page
- Visual content descriptions (from Gemini vision analysis) for pages with diagrams, photos, or figures
- Spatial relationship descriptions for microphone placement diagrams
- Table content in markdown format
- Page summary and keywords for semantic matching

### When to Use

- **Direct fact lookup**: When the user asks about a specific topic, retrieve the most relevant page chunks by keyword/semantic similarity
- **Citation-grounded answers**: Always cite the specific page number from the chunk
- **Visual content questions**: Filter for chunks where `has_visual_content` is true
- **Uncertainty-aware answers**: Check `uncertainty_flags` before presenting information as definitive

### Retrieval Process

1. Embed the user query
2. Search page chunks by semantic similarity
3. Return top-k results (recommended: k=5-10)
4. For each result, check confidence_level and uncertainty_flags
5. Construct answer with page citations

## Section-Level Retrieval

### How It Works

Each section chunk aggregates page summaries and visual descriptions across an entire chapter or section, providing a higher-level view.

### When to Use

- **Cross-page synthesis**: When the user asks a broad question spanning multiple pages
- **Topic overview**: When the user wants to understand a whole chapter or concept
- **Navigation**: To help users find the right section for their question

### Retrieval Process

1. Embed the user query
2. Search section chunks by semantic similarity
3. Return top-k sections (recommended: k=3-5)
4. Use section page_range to drill down into specific page chunks for detail

## Choosing Between Page and Section Evidence

| Question Type | Primary Source | Secondary Source |
|---|---|---|
| Specific fact (e.g., "What distance for Decca Tree?") | Page chunks | Section for context |
| Broad topic (e.g., "How to record a string quartet?") | Section chunks | Page chunks for specifics |
| Visual/diagram question | Page chunks (visual) | Section for context |
| Comparison across topics | Section chunks | Page chunks for details |
| Definition/glossary | Page chunks (glossary pages 21-29) | Glossary.json directly |

## Handling Visual-Content Questions

Many of the book's most valuable content is in diagrams showing microphone placements. For visual questions:

1. **Identify visual pages**: Use `has_visual_content` flag or filter by `page_type` (diagram, photo, mixed)
2. **Use visual descriptions**: The `observed_visual_description` and `spatial_relationships` fields contain Gemini-generated descriptions of diagram content
3. **Cite with caveats**: Visual descriptions are AI-generated interpretations of diagrams. Always note that the original diagram provides the authoritative visual reference
4. **Spatial precision**: For microphone placement questions, prioritize chunks with `spatial_relationships` data that includes distances, angles, and heights

## Uncertainty Handling

- Pages with `uncertainty_flags` should trigger explicit uncertainty language in responses
- Pages with `confidence_level: "low"` should be flagged as potentially incomplete
- Page 169 has no analysis data (blank/corrupted) and should be excluded
- Appendix 3 pages (422-426) contain handwritten session sheets with partial transcription

## Recommended Embedding Strategy

For production deployment:
1. Use a text embedding model (e.g., text-embedding-3-small or similar)
2. Embed both page and section chunks
3. Use hybrid search (semantic + keyword) for best results
4. Consider separate indexes for text-heavy and visual-heavy chunks
5. Include metadata filtering by section, page_type, and has_visual_content
"""

with open(os.path.join(RETRIEVAL_DIR, "retrieval_strategy.md"), 'w') as f:
    f.write(strategy)

print("Task 7 complete!")
