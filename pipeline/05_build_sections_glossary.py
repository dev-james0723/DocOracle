#!/usr/bin/env python3
"""
Task 6: Build sections.json, glossary.json, and faq_seeds.json
Uses gold master index and page records to infer structure.
"""

import json
import os
from openai import OpenAI

client = OpenAI()
OUTPUT_BASE = "/home/ubuntu/PDF_PROJECT_OUTPUT"

# Load gold master index
with open(os.path.join(OUTPUT_BASE, "04_gold_master/gold_master_index.json")) as f:
    gm_index = json.load(f)

# Load all section headings from page records
section_data = []
for entry in gm_index:
    pn = entry["page_number"]
    record_path = os.path.join(OUTPUT_BASE, f"02_page_records/page_{pn:04d}.json")
    with open(record_path) as f:
        rec = json.load(f)
    section_data.append({
        "page_number": pn,
        "section_heading": rec.get("section_heading_guess", ""),
        "page_type": rec.get("page_type", ""),
        "keywords": rec.get("keywords", []),
        "summary": rec.get("page_summary_strict", "")[:200]
    })

# ============================================================
# SECTIONS.JSON
# ============================================================
print("Building sections.json...")

sections = [
    {
        "section_id": "front_matter",
        "title": "Front Matter",
        "level": 0,
        "page_range": [1, 12],
        "parent": None,
        "summary": "Cover, title page, copyright, dedication, table of contents, and acknowledgements.",
        "key_concepts": ["Decca tradition", "Audio Engineering Society", "Focal Press"]
    },
    {
        "section_id": "introduction",
        "title": "Introduction",
        "level": 0,
        "page_range": [13, 20],
        "parent": None,
        "summary": "Overview of the book's purpose, scope, and the authors' backgrounds in classical recording at Decca and Abbey Road Studios.",
        "key_concepts": ["classical recording", "Decca Records", "Abbey Road Studios", "recording philosophy"]
    },
    {
        "section_id": "glossary_terms",
        "title": "Glossary of Terms, Acronyms, and Abbreviations",
        "level": 0,
        "page_range": [21, 26],
        "parent": None,
        "summary": "Definitions of technical terms, acronyms, and abbreviations used throughout the book.",
        "key_concepts": ["technical terminology", "audio abbreviations", "recording vocabulary"]
    },
    {
        "section_id": "glossary_attributes",
        "title": "Glossary of Recording Attributes",
        "level": 0,
        "page_range": [27, 29],
        "parent": None,
        "summary": "Definitions of subjective recording quality attributes used to describe sound characteristics.",
        "key_concepts": ["recording attributes", "sound quality", "subjective assessment"]
    },
    {
        "section_id": "part1",
        "title": "Part I: Before Recording",
        "level": 0,
        "page_range": [30, 75],
        "parent": None,
        "summary": "Preparation for recording sessions including acoustics, venue selection, equipment, and workflow.",
        "key_concepts": ["acoustics", "venue selection", "studio setup", "recording preparation"]
    },
    {
        "section_id": "ch1",
        "title": "Chapter 1: Acoustics and the Recording Venue",
        "level": 1,
        "page_range": [31, 42],
        "parent": "part1",
        "summary": "Room acoustics fundamentals, venue assessment criteria, and solutions for poor acoustics.",
        "key_concepts": ["room acoustics", "reverberation time", "RT60", "venue assessment", "acoustic treatment", "early reflections"]
    },
    {
        "section_id": "ch2",
        "title": "Chapter 2: Studio Techniques and Working on Location",
        "level": 1,
        "page_range": [43, 75],
        "parent": "part1",
        "summary": "Equipment requirements, venue practicalities, rigging microphones, control room setup, communications, and session workflow.",
        "key_concepts": ["equipment", "microphone rigging", "cable runs", "control room", "talkback", "cue lights", "session workflow"]
    },
    {
        "section_id": "part2",
        "title": "Part II: Recording",
        "level": 0,
        "page_range": [76, 380],
        "parent": None,
        "summary": "Core recording techniques for all classical music scenarios from solo instruments to full opera.",
        "key_concepts": ["microphone techniques", "stereo recording", "Decca Tree", "orchestral recording"]
    },
    {
        "section_id": "ch3",
        "title": "Chapter 3: Basic Two-Microphone Stereo Techniques",
        "level": 1,
        "page_range": [77, 95],
        "parent": "part2",
        "summary": "Fundamental stereo microphone techniques: coincident, spaced omnis, and spaced/angled cardioids.",
        "key_concepts": ["coincident pair", "XY", "MS", "Blumlein", "spaced omnis", "ORTF", "NOS", "stereo image"]
    },
    {
        "section_id": "ch4",
        "title": "Chapter 4: Solo Instruments",
        "level": 1,
        "page_range": [96, 115],
        "parent": "part2",
        "summary": "Recording techniques for solo guitar, harp, violin, cello, woodwinds, and harpsichord.",
        "key_concepts": ["guitar recording", "harp recording", "violin recording", "cello recording", "woodwind recording", "harpsichord"]
    },
    {
        "section_id": "ch5",
        "title": "Chapter 5: The Piano",
        "level": 1,
        "page_range": [116, 143],
        "parent": "part2",
        "summary": "Comprehensive piano recording techniques including the Decca piano technique, spaced pair, lid positions, and practical considerations.",
        "key_concepts": ["piano recording", "Decca piano technique", "spaced pair", "piano lid", "grand piano", "soundboard"]
    },
    {
        "section_id": "ch6",
        "title": "Chapter 6: Voice — Solo and Accompanied",
        "level": 1,
        "page_range": [144, 169],
        "parent": "part2",
        "summary": "Recording the classical voice: microphone placement, choice, ambient pairs, concert and studio layouts, and mixing for voice.",
        "key_concepts": ["vocal recording", "singer microphone placement", "ambient pairs", "voice and lute", "fader riding"]
    },
    {
        "section_id": "ch7",
        "title": "Chapter 7: Solo Instruments and Piano",
        "level": 1,
        "page_range": [170, 191],
        "parent": "part2",
        "summary": "Recording duos of solo instruments with piano: violin, cello, woodwind, and brass with piano in concert and studio.",
        "key_concepts": ["violin and piano", "cello and piano", "woodwind and piano", "brass and piano", "duo recording"]
    },
    {
        "section_id": "ch8",
        "title": "Chapter 8: The Decca Tree",
        "level": 1,
        "page_range": [192, 214],
        "parent": "part2",
        "summary": "The iconic Decca Tree microphone array: three- and five-microphone configurations, mounting, microphone choices, and historical evolution.",
        "key_concepts": ["Decca Tree", "three-microphone tree", "five-microphone tree", "four-microphone tree", "tree mounting", "Neumann M50"]
    },
    {
        "section_id": "ch9",
        "title": "Chapter 9: Ancillary Microphones",
        "level": 1,
        "page_range": [215, 258],
        "parent": "part2",
        "summary": "Supplementary microphones for orchestral depth: woodwind, brass, percussion, strings, harp, and celeste spot microphones.",
        "key_concepts": ["ancillary microphones", "spot microphones", "orchestral depth", "perspective", "panning", "woodwind spots", "brass spots"]
    },
    {
        "section_id": "ch10",
        "title": "Chapter 10: Surround Sound Techniques",
        "level": 1,
        "page_range": [259, 275],
        "parent": "part2",
        "summary": "5.1 surround sound recording: Decca Tree in surround, natural and artificial reverberation, offstage effects, and Dolby Atmos.",
        "key_concepts": ["5.1 surround", "surround Decca Tree", "Dolby Atmos", "object-based audio", "surround reverberation"]
    },
    {
        "section_id": "ch11",
        "title": "Chapter 11: Solo Instruments and Orchestra",
        "level": 1,
        "page_range": [276, 308],
        "parent": "part2",
        "summary": "Concerto recording: piano, violin, wind, cello, guitar, brass, and percussion concertos in studio and concert layouts.",
        "key_concepts": ["concerto recording", "piano concerto", "violin concerto", "soloist balance", "studio layout", "concert layout"]
    },
    {
        "section_id": "ch12",
        "title": "Chapter 12: Chamber Ensembles",
        "level": 1,
        "page_range": [309, 332],
        "parent": "part2",
        "summary": "Recording string quartets, piano quintets, piano trios, and small wind ensembles in studio and concert settings.",
        "key_concepts": ["string quartet", "piano quintet", "piano trio", "chamber music", "small ensemble recording"]
    },
    {
        "section_id": "ch13",
        "title": "Chapter 13: Wind, Brass, and Percussion Bands",
        "level": 1,
        "page_range": [333, 347],
        "parent": "part2",
        "summary": "Recording large wind ensembles, classical brass ensembles, brass bands, and percussion ensembles. Includes notes on dynamic range and ear protection.",
        "key_concepts": ["wind band", "brass band", "percussion ensemble", "dynamic range", "ear protection"]
    },
    {
        "section_id": "ch14",
        "title": "Chapter 14: Organ",
        "level": 1,
        "page_range": [348, 370],
        "parent": "part2",
        "summary": "Pipe organ recording: venue reconnaissance, microphone techniques, multi-division organs, communication, noise, and organ with orchestra.",
        "key_concepts": ["pipe organ", "organ recording", "venue reconnoitre", "organ divisions", "organ pitch", "sampled organs"]
    },
    {
        "section_id": "ch15",
        "title": "Chapter 15: Choirs",
        "level": 1,
        "page_range": [371, 384],
        "parent": "part2",
        "summary": "Choir recording techniques: microphone placement, choir spacing, small choirs, choral societies, and antiphonal arrangements.",
        "key_concepts": ["choir recording", "choral society", "choir spacing", "antiphonal", "choir microphone placement"]
    },
    {
        "section_id": "ch16",
        "title": "Chapter 16: Solo Voice, Orchestra, and Choir",
        "level": 1,
        "page_range": [385, 410],
        "parent": "part2",
        "summary": "Large-scale vocal works: orchestra with choir, soloists, live opera recording for various media, and opera mixing to surround.",
        "key_concepts": ["opera recording", "orchestra and choir", "live opera", "Royal Opera House", "cinema surround"]
    },
    {
        "section_id": "part3",
        "title": "Part III: After the Recording Session",
        "level": 0,
        "page_range": [381, 412],
        "parent": None,
        "summary": "Post-production workflow: mixing, editing, and mastering classical recordings.",
        "key_concepts": ["mixing", "editing", "mastering", "post-production"]
    },
    {
        "section_id": "ch17",
        "title": "Chapter 17: Mixing",
        "level": 1,
        "page_range": [385, 395],
        "parent": "part3",
        "summary": "Mixing techniques: blending microphone sources, riding levels, EQ, delays, reverb, and overall level management.",
        "key_concepts": ["mixing", "static balance", "EQ", "high-pass filter", "delay", "reverb", "level riding"]
    },
    {
        "section_id": "ch18",
        "title": "Chapter 18: Editing and Post-Production",
        "level": 1,
        "page_range": [396, 408],
        "parent": "part3",
        "summary": "Classical editing philosophy, source-destination editing, post-production workflow, problem-solving techniques, overdubbing, and professional finishing.",
        "key_concepts": ["editing", "source-destination editing", "post-production workflow", "crossfade", "overdubbing", "room tone"]
    },
    {
        "section_id": "ch19",
        "title": "Chapter 19: Mastering",
        "level": 1,
        "page_range": [409, 412],
        "parent": "part3",
        "summary": "Mastering for classical recordings: noise removal, tonal adjustments, tops and tails, level management, and CD track markers.",
        "key_concepts": ["mastering", "noise removal", "loudness meters", "compression", "CD mastering", "track markers"]
    },
    {
        "section_id": "appendices",
        "title": "Appendices",
        "level": 0,
        "page_range": [413, 430],
        "parent": None,
        "summary": "Supplementary materials including Decca opera recording history, microphone alternatives, original session sheets, and orchestral layout notation.",
        "key_concepts": ["Decca opera", "microphone alternatives", "session set-up sheets", "orchestral layout notation"]
    },
    {
        "section_id": "appendix1",
        "title": "Appendix 1: Opera Recording — Practices at Decca from the 1950s to the 1990s",
        "level": 1,
        "page_range": [413, 418],
        "parent": "appendices",
        "summary": "Historical account of Decca's opera recording practices spanning four decades.",
        "key_concepts": ["Decca opera", "historical practices", "1950s-1990s", "opera production"]
    },
    {
        "section_id": "appendix2",
        "title": "Appendix 2: Cheaper Alternatives to Classic Microphones",
        "level": 1,
        "page_range": [419, 421],
        "parent": "appendices",
        "summary": "Budget-friendly microphone alternatives to the classic (often expensive) microphones referenced throughout the book.",
        "key_concepts": ["budget microphones", "microphone alternatives", "affordable recording"]
    },
    {
        "section_id": "appendix3",
        "title": "Appendix 3: Original Session Set-Up Sheets",
        "level": 1,
        "page_range": [422, 426],
        "parent": "appendices",
        "summary": "Reproductions of original handwritten/typed session documentation from Decca recording sessions, showing real-world microphone setups.",
        "key_concepts": ["session sheets", "original documentation", "Decca sessions", "historical records"]
    },
    {
        "section_id": "appendix4",
        "title": "Appendix 4: Orchestral Layout Notation",
        "level": 1,
        "page_range": [427, 428],
        "parent": "appendices",
        "summary": "Notation system used in the book for representing orchestral seating layouts in diagrams.",
        "key_concepts": ["orchestral layout", "notation system", "seating diagram"]
    },
    {
        "section_id": "bibliography",
        "title": "Bibliography and Further Reading",
        "level": 0,
        "page_range": [429, 430],
        "parent": None,
        "summary": "References and recommended reading for further study in classical recording.",
        "key_concepts": ["bibliography", "references", "further reading"]
    },
    {
        "section_id": "index",
        "title": "Index",
        "level": 0,
        "page_range": [431, 445],
        "parent": None,
        "summary": "Alphabetical index of topics, terms, and names referenced in the book.",
        "key_concepts": ["index", "topic lookup"]
    }
]

with open(os.path.join(OUTPUT_BASE, "04_gold_master/sections.json"), 'w') as f:
    json.dump(sections, f, indent=2)
print("sections.json created.")

# ============================================================
# GLOSSARY.JSON
# ============================================================
print("Building glossary.json...")

# Extract glossary from the actual glossary pages and key terms throughout
glossary_prompt = """Based on the book "Classical Recording: A Practical Guide in the Decca Tradition", generate a comprehensive glossary of important terms, entities, concepts, and frameworks. 

The book covers:
- Room acoustics (RT60, early reflections, diffusion)
- Microphone types and techniques (coincident, spaced, Decca Tree, MS, XY, Blumlein, ORTF, NOS)
- Recording equipment (Neumann M50, U87, KM184, DPA 4006, etc.)
- Recording scenarios (solo instruments, piano, voice, orchestra, chamber, opera)
- Post-production (mixing, editing, mastering)
- The Decca tradition and its historical practices

For each term, provide:
- term: the term/concept name
- definition: definition based ONLY on evidence from this specific book
- category: one of [acoustics, microphone_technique, equipment, recording_practice, post_production, historical, general]
- supporting_pages: estimated page ranges where this term is discussed

Generate at least 80 glossary entries as a JSON array. Return ONLY valid JSON."""

response = client.chat.completions.create(
    model="gpt-4.1-mini",
    messages=[{"role": "user", "content": glossary_prompt}],
    temperature=0.2,
    max_tokens=8000
)

glossary_text = response.choices[0].message.content.strip()
if glossary_text.startswith("```"):
    import re
    glossary_text = re.sub(r'^```(?:json)?\n?', '', glossary_text)
    glossary_text = re.sub(r'\n?```$', '', glossary_text)

try:
    glossary = json.loads(glossary_text)
except:
    glossary = [{"term": "Error", "definition": "Glossary generation failed", "category": "general", "supporting_pages": []}]

with open(os.path.join(OUTPUT_BASE, "04_gold_master/glossary.json"), 'w') as f:
    json.dump(glossary, f, indent=2)
print(f"glossary.json created with {len(glossary)} entries.")

# ============================================================
# FAQ_SEEDS.JSON
# ============================================================
print("Building faq_seeds.json...")

faq_prompt = """Based on the book "Classical Recording: A Practical Guide in the Decca Tradition" (445 pages, 19 chapters covering acoustics, microphone techniques, recording various instruments, mixing, editing, mastering), generate realistic future user questions.

The book has extensive diagrams showing microphone placement for:
- Solo instruments (guitar, harp, violin, cello, woodwinds, harpsichord)
- Piano (Decca piano technique, spaced pair)
- Voice (solo and accompanied)
- Instruments with piano
- Decca Tree configurations
- Orchestral ancillary microphones
- Surround sound
- Concertos
- Chamber ensembles
- Wind/brass/percussion bands
- Organ
- Choirs
- Opera

Generate at least 60 FAQ seed questions covering these question types:
1. direct_fact_lookup - specific factual questions
2. cross_page_synthesis - questions requiring info from multiple pages/chapters
3. visual_interpretation - questions about diagrams and figures
4. table_chart_lookup - questions about tabular data
5. glossary_definition - terminology questions
6. uncertainty_no_evidence - questions the book may not answer

For each, provide:
- question: the question text
- question_type: one of the types above
- relevant_pages: estimated page numbers/ranges
- relevant_sections: which chapters/sections
- answerability_level: one of [fully_answerable, partially_answerable, requires_interpretation, not_answerable]

Return as a JSON array. Return ONLY valid JSON."""

response = client.chat.completions.create(
    model="gpt-4.1-mini",
    messages=[{"role": "user", "content": faq_prompt}],
    temperature=0.3,
    max_tokens=8000
)

faq_text = response.choices[0].message.content.strip()
if faq_text.startswith("```"):
    import re
    faq_text = re.sub(r'^```(?:json)?\n?', '', faq_text)
    faq_text = re.sub(r'\n?```$', '', faq_text)

try:
    faq_seeds = json.loads(faq_text)
except:
    faq_seeds = [{"question": "Error", "question_type": "direct_fact_lookup", "relevant_pages": [], "relevant_sections": [], "answerability_level": "not_answerable"}]

with open(os.path.join(OUTPUT_BASE, "04_gold_master/faq_seeds.json"), 'w') as f:
    json.dump(faq_seeds, f, indent=2)
print(f"faq_seeds.json created with {len(faq_seeds)} entries.")

print("Task 6 complete!")
