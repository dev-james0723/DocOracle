import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// ── Types ──────────────────────────────────────────────────────────
export interface PageChunk {
  chunk_id: string;
  source_type: string;
  page_number: number;
  page_range: number[];
  section_path: string;
  keywords: string[];
  uncertainty_flags: string[];
  chunk_text: string;
  page_type: string;
  has_visual_content: boolean;
  confidence_level: string;
}

export interface SectionChunk {
  chunk_id: string;
  source_type: string;
  page_number: number;
  page_range: number[];
  section_path: string;
  keywords: string[];
  uncertainty_flags: string[];
  chunk_text: string;
  has_visual_content: boolean;
  key_concepts?: string[];
}

export interface VisualAsset {
  page_number: number;
  visual_type: string;
  image_file: string;
  image_url: string;
  section: string;
  caption: string;
  description: string;
  spatial_relationships: string;
  table_content: string;
  handwritten_annotations: string;
  page_summary: string;
  keywords: string[];
  confidence_level: string;
  retrieval_tags: string[];
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  category: string;
  supporting_pages: string;
}

export interface Section {
  section_id: string;
  title: string;
  level: number;
  page_range: number[];
  parent: string | null;
  summary: string;
  key_concepts: string[];
}

// ── Data Store ─────────────────────────────────────────────────────
function resolveDataDir(): string {
  // In production, data is copied to dist/data by the build script
  // In development, data is at server/data
  const candidates = [
    join(import.meta.dirname || dirname(fileURLToPath(import.meta.url)), "data"),
    join(import.meta.dirname || dirname(fileURLToPath(import.meta.url)), "..", "server", "data"),
    join(process.cwd(), "server", "data"),
    join(process.cwd(), "dist", "data"),
  ];
  for (const dir of candidates) {
    if (existsSync(join(dir, "page_chunks.jsonl"))) {
      return dir;
    }
  }
  // Fallback to the first candidate (will produce a clear error message)
  return candidates[0];
}

const DATA_DIR = resolveDataDir();

let pageChunks: PageChunk[] = [];
let sectionChunks: SectionChunk[] = [];
let visualAssets: VisualAsset[] = [];
let glossary: GlossaryEntry[] = [];
let sections: Section[] = [];
let systemPrompt = "";
let loaded = false;

export function loadKnowledgeBase() {
  if (loaded) return;

  // Load page chunks (JSONL)
  const pcRaw = readFileSync(join(DATA_DIR, "page_chunks.jsonl"), "utf-8");
  pageChunks = pcRaw
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l));

  // Load section chunks (JSONL)
  const scRaw = readFileSync(join(DATA_DIR, "section_chunks.jsonl"), "utf-8");
  sectionChunks = scRaw
    .split("\n")
    .filter((l) => l.trim())
    .map((l) => JSON.parse(l));

  // Load visual assets
  visualAssets = JSON.parse(
    readFileSync(join(DATA_DIR, "visual_assets.json"), "utf-8")
  );

  // Load glossary
  glossary = JSON.parse(
    readFileSync(join(DATA_DIR, "glossary.json"), "utf-8")
  );

  // Load sections
  sections = JSON.parse(
    readFileSync(join(DATA_DIR, "sections.json"), "utf-8")
  );

  // Load system prompt
  systemPrompt = readFileSync(
    join(DATA_DIR, "document_skill_system_prompt.txt"),
    "utf-8"
  );

  loaded = true;
  console.log(
    `[KB] Loaded: ${pageChunks.length} page chunks, ${sectionChunks.length} section chunks, ${visualAssets.length} visual assets, ${glossary.length} glossary entries, ${sections.length} sections`
  );
}

// ── Search ─────────────────────────────────────────────────────────
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function scoreMatch(tokens: string[], target: string): number {
  const targetLower = target.toLowerCase();
  let score = 0;
  for (const token of tokens) {
    if (targetLower.includes(token)) {
      score += 1;
      // Bonus for exact word match
      if (new RegExp(`\\b${token}\\b`).test(targetLower)) {
        score += 0.5;
      }
    }
  }
  return score;
}

export interface SearchResult {
  type: "page" | "section";
  chunk_id: string;
  page_number: number;
  page_range: number[];
  section_path: string;
  text_preview: string;
  keywords: string[];
  has_visual_content: boolean;
  score: number;
}

export function searchKnowledge(
  query: string,
  limit = 10
): SearchResult[] {
  loadKnowledgeBase();
  const tokens = tokenize(query);
  const results: SearchResult[] = [];

  // Search page chunks
  for (const chunk of pageChunks) {
    const textScore = scoreMatch(tokens, chunk.chunk_text);
    const keywordScore = scoreMatch(tokens, chunk.keywords.join(" ")) * 2;
    const sectionScore = scoreMatch(tokens, chunk.section_path) * 1.5;
    const totalScore = textScore + keywordScore + sectionScore;

    if (totalScore > 0) {
      results.push({
        type: "page",
        chunk_id: chunk.chunk_id,
        page_number: chunk.page_number,
        page_range: chunk.page_range,
        section_path: chunk.section_path,
        text_preview: chunk.chunk_text.slice(0, 300),
        keywords: chunk.keywords,
        has_visual_content: chunk.has_visual_content,
        score: totalScore,
      });
    }
  }

  // Search section chunks
  for (const chunk of sectionChunks) {
    const textScore = scoreMatch(tokens, chunk.chunk_text) * 0.8;
    const keywordScore = scoreMatch(tokens, chunk.keywords.join(" ")) * 2;
    const sectionScore = scoreMatch(tokens, chunk.section_path) * 2;
    const conceptScore = chunk.key_concepts
      ? scoreMatch(tokens, chunk.key_concepts.join(" ")) * 2
      : 0;
    const totalScore = textScore + keywordScore + sectionScore + conceptScore;

    if (totalScore > 0) {
      results.push({
        type: "section",
        chunk_id: chunk.chunk_id,
        page_number: chunk.page_number,
        page_range: chunk.page_range,
        section_path: chunk.section_path,
        text_preview: chunk.chunk_text.slice(0, 300),
        keywords: chunk.keywords,
        has_visual_content: chunk.has_visual_content,
        score: totalScore,
      });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

// ── Visual Asset Search ────────────────────────────────────────────
export function searchVisualAssets(
  query: string,
  limit = 5
): VisualAsset[] {
  loadKnowledgeBase();
  const tokens = tokenize(query);

  const scored = visualAssets.map((asset) => {
    const tagScore = scoreMatch(tokens, asset.retrieval_tags.join(" ")) * 3;
    const descScore = scoreMatch(tokens, asset.description);
    const keywordScore = scoreMatch(tokens, asset.keywords.join(" ")) * 2;
    const sectionScore = scoreMatch(tokens, asset.section) * 1.5;
    const captionScore = scoreMatch(tokens, asset.caption) * 1.5;
    const spatialScore = scoreMatch(tokens, asset.spatial_relationships);
    return {
      asset,
      score:
        tagScore +
        descScore +
        keywordScore +
        sectionScore +
        captionScore +
        spatialScore,
    };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.asset);
}

// ── Getters ────────────────────────────────────────────────────────
export function getGlossary() {
  loadKnowledgeBase();
  return glossary;
}

export function getSections() {
  loadKnowledgeBase();
  return sections;
}

export function getSystemPrompt() {
  loadKnowledgeBase();
  return systemPrompt;
}

export function getPageChunks() {
  loadKnowledgeBase();
  return pageChunks;
}

export function getVisualAssets() {
  loadKnowledgeBase();
  return visualAssets;
}

// Build context for LLM from search results
export function buildRetrievalContext(query: string): {
  context: string;
  relevantAssets: VisualAsset[];
  searchResults: SearchResult[];
} {
  const searchResults = searchKnowledge(query, 8);
  const relevantAssets = searchVisualAssets(query, 4);

  let context = "RETRIEVED KNOWLEDGE BASE EVIDENCE:\n\n";

  for (const result of searchResults) {
    context += `[${result.type.toUpperCase()} - Page ${result.page_number} - ${result.section_path}]\n`;
    context += result.text_preview + "\n\n";
  }

  if (relevantAssets.length > 0) {
    context += "RELEVANT VISUAL ASSETS:\n\n";
    for (const asset of relevantAssets) {
      context += `[Page ${asset.page_number} - ${asset.visual_type} - ${asset.section}]\n`;
      context += `Description: ${asset.description.slice(0, 200)}\n`;
      if (asset.spatial_relationships) {
        context += `Spatial: ${asset.spatial_relationships.slice(0, 200)}\n`;
      }
      if (asset.caption) {
        context += `Caption: ${asset.caption}\n`;
      }
      context += "\n";
    }
  }

  return { context, relevantAssets, searchResults };
}
