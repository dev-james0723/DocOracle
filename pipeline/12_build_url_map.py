#!/usr/bin/env python3
"""Build a JSON mapping from page numbers to storage URLs and metadata."""
import json
import re

# Load upload URLs
url_map = {}
with open("/home/ubuntu/upload_urls.txt") as f:
    for line in f:
        line = line.strip()
        if "|" in line:
            fname, url = line.split("|", 1)
            page_num = int(re.search(r'page_(\d+)', fname).group(1))
            url_map[page_num] = url

# Load visual assets index
with open("/home/ubuntu/PDF_PROJECT_OUTPUT/10_visual_assets/visual_assets_index.json") as f:
    assets = json.load(f)

# Build enriched index with URLs
enriched = []
for asset in assets:
    pn = asset["page_number"]
    if pn in url_map:
        asset["image_url"] = url_map[pn]
        enriched.append(asset)
    else:
        print(f"WARNING: No URL for page {pn}")

# Save
with open("/home/ubuntu/decca-oracle/server/data/visual_assets.json", "w") as f:
    json.dump(enriched, f, indent=2, ensure_ascii=False)

print(f"Built visual_assets.json with {len(enriched)} entries")
print(f"Sample: page {enriched[0]['page_number']} -> {enriched[0]['image_url']}")
