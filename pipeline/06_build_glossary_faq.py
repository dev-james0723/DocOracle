#!/usr/bin/env python3
import json, os, re
from openai import OpenAI

client = OpenAI()
OUTPUT_BASE = "/home/ubuntu/PDF_PROJECT_OUTPUT"

print("Building glossary.json...")
glossary_prompt = (
    'Based on the book "Classical Recording: A Practical Guide in the Decca Tradition", '
    "generate a comprehensive glossary. The book covers room acoustics, microphone types/techniques "
    "(Decca Tree, MS, XY, Blumlein, ORTF, NOS, spaced omnis), equipment (Neumann M50, U87, KM184, DPA 4006), "
    "recording scenarios (solo instruments, piano, voice, orchestra, chamber, opera), and post-production "
    "(mixing, editing, mastering).\n\n"
    "For each term provide: term, definition, category (one of: acoustics, microphone_technique, equipment, "
    "recording_practice, post_production, historical, general), supporting_pages (estimated page ranges).\n\n"
    "Generate at least 80 entries as a JSON array. Return ONLY valid JSON."
)

resp = client.chat.completions.create(
    model="gpt-4.1-mini",
    messages=[{"role": "user", "content": glossary_prompt}],
    temperature=0.2,
    max_tokens=8000,
)
gt = resp.choices[0].message.content.strip()
if gt.startswith("```"):
    gt = re.sub(r"^```(?:json)?\n?", "", gt)
    gt = re.sub(r"\n?```$", "", gt)
glossary = json.loads(gt)
with open(os.path.join(OUTPUT_BASE, "04_gold_master/glossary.json"), "w") as f:
    json.dump(glossary, f, indent=2)
print(f"glossary.json: {len(glossary)} entries")

print("Building faq_seeds.json...")
faq_prompt = (
    'Based on "Classical Recording: A Practical Guide in the Decca Tradition" (445 pages, 19 chapters), '
    "generate realistic user questions covering: direct_fact_lookup, cross_page_synthesis, visual_interpretation, "
    "table_chart_lookup, glossary_definition, uncertainty_no_evidence.\n\n"
    "For each: question, question_type, relevant_pages (list), relevant_sections (list), "
    "answerability_level (fully_answerable/partially_answerable/requires_interpretation/not_answerable).\n\n"
    "Generate at least 60 entries as JSON array. Return ONLY valid JSON."
)

resp2 = client.chat.completions.create(
    model="gpt-4.1-mini",
    messages=[{"role": "user", "content": faq_prompt}],
    temperature=0.3,
    max_tokens=8000,
)
ft = resp2.choices[0].message.content.strip()
if ft.startswith("```"):
    ft = re.sub(r"^```(?:json)?\n?", "", ft)
    ft = re.sub(r"\n?```$", "", ft)
faq = json.loads(ft)
with open(os.path.join(OUTPUT_BASE, "04_gold_master/faq_seeds.json"), "w") as f:
    json.dump(faq, f, indent=2)
print(f"faq_seeds.json: {len(faq)} entries")
print("Done!")
