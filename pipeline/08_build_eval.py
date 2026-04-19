#!/usr/bin/env python3
"""
Task 8: Build evaluation set with 80+ questions covering all question types.
"""

import json
import os
from openai import OpenAI

client = OpenAI()
OUTPUT_BASE = "/home/ubuntu/PDF_PROJECT_OUTPUT"
EVAL_DIR = os.path.join(OUTPUT_BASE, "06_eval")

# Generate eval questions in multiple batches to ensure diversity
print("Generating evaluation questions...")

batch_prompts = [
    # Batch 1: Direct factual lookup (20 questions)
    {
        "type": "direct_fact_lookup",
        "count": 20,
        "prompt": (
            'Generate 20 direct factual lookup questions for "Classical Recording: A Practical Guide in the Decca Tradition". '
            "These should be specific questions with clear answers found on specific pages. Cover topics like:\n"
            "- Decca Tree microphone spacing and configuration\n"
            "- Specific microphone models recommended for various instruments\n"
            "- Recording distances and heights mentioned in the book\n"
            "- Equipment specifications and settings\n"
            "- Historical facts about Decca recording practices\n"
            "- Specific techniques named in the book\n\n"
            "For each: eval_id (fact_01 to fact_20), question, question_type (direct_fact_lookup), "
            "expected_behavior (what a correct answer should contain), relevant_pages (estimated list), "
            "relevant_sections (list of chapter/section names), evidence_strength (strong/medium/weak).\n"
            "Return as JSON array. ONLY valid JSON."
        )
    },
    # Batch 2: Cross-page reasoning (15 questions)
    {
        "type": "cross_page_synthesis",
        "count": 15,
        "prompt": (
            'Generate 15 cross-page synthesis questions for "Classical Recording: A Practical Guide in the Decca Tradition". '
            "These require combining information from multiple pages/chapters. Examples:\n"
            "- Comparing techniques across different instrument types\n"
            "- How principles from acoustics chapter apply to specific recording scenarios\n"
            "- Evolution of techniques from studio to concert settings\n"
            "- How mixing/editing chapters relate to recording techniques\n\n"
            "For each: eval_id (cross_01 to cross_15), question, question_type (cross_page_synthesis), "
            "expected_behavior, relevant_pages, relevant_sections, evidence_strength.\n"
            "Return as JSON array. ONLY valid JSON."
        )
    },
    # Batch 3: Visual/diagram interpretation (15 questions)
    {
        "type": "visual_interpretation",
        "count": 15,
        "prompt": (
            'Generate 15 visual interpretation questions for "Classical Recording: A Practical Guide in the Decca Tradition". '
            "The book contains many diagrams showing microphone placements. Questions should ask about:\n"
            "- Microphone positions relative to instruments in specific figures\n"
            "- Spatial relationships shown in studio layout diagrams\n"
            "- Differences between diagram variants (e.g., Figure 6.1a vs 6.1d)\n"
            "- Setup sheet details from Appendix 3\n"
            "- Equipment configurations shown in photographs\n\n"
            "For each: eval_id (vis_01 to vis_15), question, question_type (visual_interpretation), "
            "expected_behavior, relevant_pages, relevant_sections, evidence_strength.\n"
            "Return as JSON array. ONLY valid JSON."
        )
    },
    # Batch 4: Table/chart, glossary, uncertainty (30 questions mixed)
    {
        "type": "mixed",
        "count": 30,
        "prompt": (
            'Generate 30 evaluation questions for "Classical Recording: A Practical Guide in the Decca Tradition" '
            "covering these types:\n\n"
            "10 table_chart_lookup questions about equipment tables, comparison charts, specifications\n"
            "10 glossary_definition questions about technical terms defined in the glossaries (pages 21-29)\n"
            "5 uncertainty_no_evidence questions that the book likely cannot answer\n"
            "5 section_level_understanding questions about understanding entire chapters\n\n"
            "For each: eval_id (table_01-10, gloss_01-10, uncert_01-05, sect_01-05), question, "
            "question_type (table_chart_lookup/glossary_definition/uncertainty_no_evidence/section_level_understanding), "
            "expected_behavior, relevant_pages, relevant_sections, evidence_strength.\n"
            "Return as JSON array. ONLY valid JSON."
        )
    }
]

all_eval_questions = []

for i, batch in enumerate(batch_prompts):
    print(f"  Generating batch {i+1}/4: {batch['type']}...")
    
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[{"role": "user", "content": batch["prompt"]}],
        temperature=0.3,
        max_tokens=6000
    )
    
    import re
    text = response.choices[0].message.content.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\n?", "", text)
        text = re.sub(r"\n?```$", "", text)
    
    try:
        questions = json.loads(text)
        all_eval_questions.extend(questions)
        print(f"    Got {len(questions)} questions")
    except json.JSONDecodeError as e:
        print(f"    JSON parse error: {e}")
        # Try to salvage
        try:
            # Find the array
            start = text.index("[")
            end = text.rindex("]") + 1
            questions = json.loads(text[start:end])
            all_eval_questions.extend(questions)
            print(f"    Salvaged {len(questions)} questions")
        except:
            print(f"    Could not salvage batch {i+1}")

print(f"\nTotal eval questions: {len(all_eval_questions)}")

# Save eval questions
with open(os.path.join(EVAL_DIR, "eval_questions.json"), 'w') as f:
    json.dump(all_eval_questions, f, indent=2)

# Build eval notes
print("Building eval_notes.md...")

type_counts = {}
for q in all_eval_questions:
    qt = q.get("question_type", "unknown")
    type_counts[qt] = type_counts.get(qt, 0) + 1

evidence_counts = {}
for q in all_eval_questions:
    es = q.get("evidence_strength", "unknown")
    evidence_counts[es] = evidence_counts.get(es, 0) + 1

eval_notes = f"""# Evaluation Set Notes

## Overview

Total evaluation questions: {len(all_eval_questions)}

## Question Type Distribution

| Question Type | Count |
|---|---|
"""

for qt, count in sorted(type_counts.items()):
    eval_notes += f"| {qt} | {count} |\n"

eval_notes += f"""
## Evidence Strength Distribution

| Evidence Strength | Count |
|---|---|
"""

for es, count in sorted(evidence_counts.items()):
    eval_notes += f"| {es} | {count} |\n"

eval_notes += """
## Most Likely Failure Modes

1. **Visual content questions**: The system may struggle with questions about specific diagram details (microphone positions, spatial relationships) since these depend on AI-generated descriptions of visual content rather than direct text extraction. Answers may be less precise than what a human could derive from looking at the actual diagrams.

2. **Spatial relationship precision**: Questions about exact distances, angles, and heights in microphone placement diagrams rely on Gemini vision model interpretations. Some measurements may be approximate or uncertain.

3. **Handwritten content in Appendix 3**: The original session set-up sheets contain handwritten annotations that were only partially transcribed. Questions about specific details in these sheets may receive incomplete answers.

4. **Cross-page synthesis**: Questions requiring integration of information from multiple chapters may miss relevant pages if retrieval doesn't surface all relevant chunks.

5. **Uncertainty acknowledgment**: The system should explicitly state when evidence is weak or uncertain, but may over-confidently present AI-interpreted visual descriptions as definitive.

## Hardest Page Types

1. **Full-page diagrams** (pages 76, 104, 109, 130, 136, 139, 144-147, 208-209, 268, 326, 426): These contain critical information encoded entirely in visual form. Text extraction yields almost nothing; the system depends entirely on vision model descriptions.

2. **Session set-up sheets** (pages 419, 422, 426): Original handwritten/typed documents from Decca sessions. Handwriting recognition is imperfect and some annotations may be missed.

3. **Mixed text/diagram pages**: Pages where text references "see Figure X" but the figure is on the same or adjacent page. The system must correctly link textual descriptions to visual content.

4. **Dense index pages** (431-445): Multi-column layout with many entries. Text extraction may jumble column order.

## Coverage Gaps

- Questions about very specific equipment model numbers may not have strong evidence if the text mentions them only in passing
- Questions about the exact visual appearance of equipment (beyond what's described in text) depend on photo analysis quality
- Questions about nuances in the authors' recording philosophy may require subjective interpretation
- The book's practical advice often comes with caveats and "it depends" qualifications that are hard to capture in definitive answers
"""

with open(os.path.join(EVAL_DIR, "eval_notes.md"), 'w') as f:
    f.write(eval_notes)

print("Task 8 complete!")
