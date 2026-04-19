# Sample Output

This directory contains excerpts from a real DocOracle pipeline run, so you can inspect the data format before running your own pipeline. These samples are copyright-safe (paraphrased definitions and generic descriptions).

## Files

| File | Description | Full Version Location |
|------|-------------|----------------------|
| `page_chunks_sample.jsonl` | 10 example page chunks with text, keywords, and page numbers | `output/05_retrieval/page_chunks.jsonl` |
| `glossary_sample.json` | 10 example glossary entries with definitions and categories | `output/04_gold_master/glossary.json` |
| `sections_sample.json` | Example chapter/section hierarchy | `output/04_gold_master/sections.json` |
| `visual_assets_sample.json` | 5 example visual asset entries with descriptions and retrieval tags | `output/10_visual_assets/visual_assets_index.json` |

## Quick Test with Sample Data

You can use these sample files to test the website without running the pipeline:

```bash
cp sample_output/page_chunks_sample.jsonl website/server/data/page_chunks.jsonl
cp sample_output/glossary_sample.json website/server/data/glossary.json
cp sample_output/sections_sample.json website/server/data/sections.json
cp sample_output/visual_assets_sample.json website/server/data/visual_assets.json

cd website
npm install
npm run dev
```

The website will launch with the sample data, giving you a preview of the full experience.
