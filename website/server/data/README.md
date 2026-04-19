# Knowledge Base Data Directory

Place the 4 key output files from the pipeline here:

```
server/data/
├── page_chunks.jsonl              ← from output/05_retrieval/
├── glossary.json                  ← from output/04_gold_master/
├── sections.json                  ← from output/04_gold_master/
├── visual_assets.json             ← from output/10_visual_assets/visual_assets_index.json
└── document_skill_system_prompt.txt  (pre-included)
```

After running the pipeline, copy the files:

```bash
cp output/05_retrieval/page_chunks.jsonl website/server/data/
cp output/04_gold_master/glossary.json website/server/data/
cp output/04_gold_master/sections.json website/server/data/
cp output/10_visual_assets/visual_assets_index.json website/server/data/visual_assets.json
```
