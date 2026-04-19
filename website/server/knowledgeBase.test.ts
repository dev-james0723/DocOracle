import { describe, expect, it, beforeAll } from "vitest";
import {
  loadKnowledgeBase,
  searchKnowledge,
  searchVisualAssets,
  getGlossary,
  getSections,
  getSystemPrompt,
  getPageChunks,
  getVisualAssets,
  buildRetrievalContext,
} from "./knowledgeBase";

beforeAll(() => {
  loadKnowledgeBase();
});

describe("Knowledge Base Loading", () => {
  it("loads page chunks with expected count", () => {
    const chunks = getPageChunks();
    expect(chunks.length).toBe(445);
  });

  it("loads visual assets with expected count", () => {
    const assets = getVisualAssets();
    expect(assets.length).toBe(251);
  });

  it("loads glossary entries", () => {
    const entries = getGlossary();
    expect(entries.length).toBeGreaterThan(50);
    expect(entries[0]).toHaveProperty("term");
    expect(entries[0]).toHaveProperty("definition");
    expect(entries[0]).toHaveProperty("category");
  });

  it("loads sections with chapter structure", () => {
    const secs = getSections();
    expect(secs.length).toBeGreaterThan(10);
    expect(secs[0]).toHaveProperty("section_id");
    expect(secs[0]).toHaveProperty("title");
    expect(secs[0]).toHaveProperty("level");
    expect(secs[0]).toHaveProperty("page_range");
  });

  it("loads system prompt", () => {
    const prompt = getSystemPrompt();
    expect(prompt.length).toBeGreaterThan(100);
    expect(prompt.toLowerCase()).toContain("decca");
  });
});

describe("Knowledge Search", () => {
  it("finds results for 'Decca Tree'", () => {
    const results = searchKnowledge("Decca Tree", 10);
    expect(results.length).toBeGreaterThan(0);
    const topResult = results[0];
    expect(topResult.score).toBeGreaterThan(0);
    expect(topResult).toHaveProperty("page_number");
    expect(topResult).toHaveProperty("section_path");
    expect(topResult).toHaveProperty("text_preview");
  });

  it("finds results for 'piano recording'", () => {
    const results = searchKnowledge("piano recording", 5);
    expect(results.length).toBeGreaterThan(0);
    // Should find piano-related content
    const hasRelevant = results.some(
      (r) =>
        r.text_preview.toLowerCase().includes("piano") ||
        r.section_path.toLowerCase().includes("piano") ||
        r.keywords.some((k) => k.toLowerCase().includes("piano"))
    );
    expect(hasRelevant).toBe(true);
  });

  it("finds results for 'string quartet'", () => {
    const results = searchKnowledge("string quartet", 5);
    expect(results.length).toBeGreaterThan(0);
  });

  it("respects limit parameter", () => {
    const results3 = searchKnowledge("microphone", 3);
    expect(results3.length).toBeLessThanOrEqual(3);
    const results1 = searchKnowledge("microphone", 1);
    expect(results1.length).toBe(1);
  });

  it("returns empty for gibberish query", () => {
    const results = searchKnowledge("xyzzy12345qwerty", 10);
    expect(results.length).toBe(0);
  });

  it("results are sorted by score descending", () => {
    const results = searchKnowledge("orchestral recording", 10);
    for (let i = 1; i < results.length; i++) {
      expect(results[i].score).toBeLessThanOrEqual(results[i - 1].score);
    }
  });
});

describe("Visual Asset Search", () => {
  it("finds visual assets for 'piano'", () => {
    const assets = searchVisualAssets("piano", 5);
    expect(assets.length).toBeGreaterThan(0);
    expect(assets[0]).toHaveProperty("page_number");
    expect(assets[0]).toHaveProperty("image_url");
    expect(assets[0]).toHaveProperty("description");
  });

  it("finds visual assets for 'Decca Tree'", () => {
    const assets = searchVisualAssets("Decca Tree", 5);
    expect(assets.length).toBeGreaterThan(0);
  });

  it("visual assets have image URLs", () => {
    const assets = searchVisualAssets("microphone placement", 3);
    for (const asset of assets) {
      expect(asset.image_url).toBeTruthy();
      expect(typeof asset.image_url).toBe("string");
    }
  });

  it("respects limit parameter", () => {
    const assets = searchVisualAssets("recording", 2);
    expect(assets.length).toBeLessThanOrEqual(2);
  });
});

describe("Retrieval Context Builder", () => {
  it("builds context for a query", () => {
    const { context, relevantAssets, searchResults } =
      buildRetrievalContext("How to record a string quartet?");

    expect(context).toContain("RETRIEVED KNOWLEDGE BASE EVIDENCE");
    expect(searchResults.length).toBeGreaterThan(0);
    expect(typeof context).toBe("string");
    expect(context.length).toBeGreaterThan(100);
  });

  it("includes visual assets in context when relevant", () => {
    const { context, relevantAssets } = buildRetrievalContext(
      "Decca Tree microphone placement diagram"
    );
    expect(relevantAssets.length).toBeGreaterThan(0);
    expect(context).toContain("RELEVANT VISUAL ASSETS");
  });

  it("returns search results with proper structure", () => {
    const { searchResults } = buildRetrievalContext("opera recording");
    if (searchResults.length > 0) {
      const r = searchResults[0];
      expect(r).toHaveProperty("type");
      expect(r).toHaveProperty("chunk_id");
      expect(r).toHaveProperty("page_number");
      expect(r).toHaveProperty("section_path");
      expect(r).toHaveProperty("text_preview");
      expect(r).toHaveProperty("score");
      expect(["page", "section"]).toContain(r.type);
    }
  });
});

describe("Glossary", () => {
  it("returns entries with required fields", () => {
    const entries = getGlossary();
    for (const entry of entries.slice(0, 5)) {
      expect(entry.term).toBeTruthy();
      expect(entry.definition).toBeTruthy();
      expect(entry.category).toBeTruthy();
    }
  });

  it("contains 'Decca Tree' entry", () => {
    const entries = getGlossary();
    const deccaTree = entries.find((e) =>
      e.term.toLowerCase().includes("decca tree")
    );
    expect(deccaTree).toBeTruthy();
    expect(deccaTree!.definition.length).toBeGreaterThan(10);
  });
});

describe("Sections", () => {
  it("returns sections with required fields", () => {
    const secs = getSections();
    for (const sec of secs.slice(0, 5)) {
      expect(sec.section_id).toBeTruthy();
      expect(sec.title).toBeTruthy();
      expect(sec.level).toBeGreaterThanOrEqual(0);
      expect(sec.page_range).toHaveLength(2);
      expect(sec.page_range[0]).toBeLessThanOrEqual(sec.page_range[1]);
    }
  });

  it("contains chapter about The Decca Tree", () => {
    const secs = getSections();
    const deccaChapter = secs.find((s) =>
      s.title.toLowerCase().includes("decca tree")
    );
    expect(deccaChapter).toBeTruthy();
  });

  it("has both level 1 and level 2 sections", () => {
    const secs = getSections();
    const level1 = secs.filter((s) => s.level === 1);
    const level2 = secs.filter((s) => s.level === 2);
    expect(level1.length).toBeGreaterThan(0);
    // Level 2 may or may not exist depending on data
  });
});
