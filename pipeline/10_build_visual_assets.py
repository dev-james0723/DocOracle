#!/usr/bin/env python3
"""
Copy all visual page images into organized folder structure within the project output.
Group by visual type: diagrams/, photos/, tables/, mixed/
"""

import json
import os
import shutil

OUTPUT_BASE = "/home/ubuntu/PDF_PROJECT_OUTPUT"
ASSETS_DIR = os.path.join(OUTPUT_BASE, "10_visual_assets")
PAGE_IMAGES_DIR = "/home/ubuntu/page_images"

# Create directory structure
for subdir in ["diagrams", "photos", "tables", "mixed"]:
    os.makedirs(os.path.join(ASSETS_DIR, subdir), exist_ok=True)

# Load visual pages list
with open("/home/ubuntu/visual_pages_list.json") as f:
    visual_pages = json.load(f)

# Map visual_type to folder
type_to_folder = {
    "diagram": "diagrams",
    "photo": "photos",
    "table": "tables",
    "mixed_visual": "mixed",
    "sketch": "diagrams",
    "infographic": "diagrams"
}

copied = 0
missing = 0

for vp in visual_pages:
    pn = vp["page_number"]
    vtype = vp["visual_type"]
    folder = type_to_folder.get(vtype, "mixed")
    
    src = os.path.join(PAGE_IMAGES_DIR, f"page_{pn:04d}.png")
    dst = os.path.join(ASSETS_DIR, folder, f"page_{pn:04d}.png")
    
    if os.path.exists(src):
        shutil.copy2(src, dst)
        copied += 1
    else:
        print(f"  MISSING: page_{pn:04d}.png")
        missing += 1

print(f"Copied {copied} images, {missing} missing")
print(f"  diagrams/: {len(os.listdir(os.path.join(ASSETS_DIR, 'diagrams')))} files")
print(f"  photos/:   {len(os.listdir(os.path.join(ASSETS_DIR, 'photos')))} files")
print(f"  tables/:   {len(os.listdir(os.path.join(ASSETS_DIR, 'tables')))} files")
print(f"  mixed/:    {len(os.listdir(os.path.join(ASSETS_DIR, 'mixed')))} files")
