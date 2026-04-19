/**
 * DocOracle Pipeline Engine
 * Processes uploaded PDFs through 7 steps to build a complete AI knowledge base.
 * Runs as a background async task; progress is persisted to the database.
 */
import { exec as execCb } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { updatePipelineJob } from "./db";
import { storagePut, storageGetSignedUrl } from "./storage";
import { invokeLLM } from "./_core/llm";
import type { Message } from "./_core/llm";

const exec = promisify(execCb);

// ── Types ─────────────────────────────────────────────────────────────────────

export interface PageChunk {
  page: number;
  text: string;
  chapter: string;
  section: string;
  has_visual: boolean;
  visual_type: "diagram" | "photo" | "table" | "mixed" | "none";
  word_count: number;
}

export interface VisualAsset {
  id: string;
  page: number;
  type: "diagram" | "photo" | "table" | "mixed";
  imageUrl: string;
  imageKey: string;
  description: string;
  caption: string;
  tags: string[];
  chapter: string;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  page_references: number[];
  category: string;
}

export interface SectionEntry {
  id: string;
  title: string;
  level: number;
  page_start: number;
  page_end: number;
  summary: string;
  key_topics: string[];
}

export interface KnowledgeBase {
  jobId: string;
  filename: string;
  pageCount: number;
  pageChunks: PageChunk[];
  sections: SectionEntry[];
  glossary: GlossaryEntry[];
  visualAssets: VisualAsset[];
  systemPrompt: string;
  processedAt: string;
}

// ── Step helpers ──────────────────────────────────────────────────────────────

async function updateProgress(
  jobId: string,
  step: number,
  message: string,
  pageProgress = 0
) {
  await updatePipelineJob(jobId, {
    currentStep: step,
    statusMessage: message,
    currentPageProgress: pageProgress,
  });
}

async function setStatus(
  jobId: string,
  status: "extracting_text" | "classifying_pages" | "analyzing_visuals" |
    "building_knowledge_base" | "extracting_visual_assets" | "finalizing" |
    "completed" | "failed",
  message: string
) {
  await updatePipelineJob(jobId, { status, statusMessage: message });
}

// ── Step 1: Download PDF from storage ────────────────────────────────────────

async function downloadPdf(fileKey: string, tmpDir: string): Promise<string> {
  const signedUrl = await storageGetSignedUrl(fileKey);
  const pdfPath = path.join(tmpDir, "source.pdf");
  const resp = await fetch(signedUrl);
  if (!resp.ok) throw new Error(`Failed to download PDF: ${resp.status}`);
  const buf = Buffer.from(await resp.arrayBuffer());
  await fs.writeFile(pdfPath, buf);
  return pdfPath;
}

// ── Step 2: Extract text page by page ────────────────────────────────────────

async function extractText(pdfPath: string, tmpDir: string): Promise<string[]> {
  const textDir = path.join(tmpDir, "text");
  await fs.mkdir(textDir, { recursive: true });
  // Extract all pages at once to a single file, then split
  const allTextPath = path.join(tmpDir, "all_text.txt");
  await exec(`pdftotext -layout "${pdfPath}" "${allTextPath}"`);
  const allText = await fs.readFile(allTextPath, "utf-8");
  // pdftotext separates pages with form feed \f
  const pages = allText.split("\f").map((p) => p.trim());
  // Remove trailing empty page
  while (pages.length > 0 && pages[pages.length - 1] === "") pages.pop();
  return pages;
}

// ── Step 3: Convert pages to images for visual analysis ──────────────────────

async function convertPagesToImages(
  pdfPath: string,
  tmpDir: string,
  pageCount: number
): Promise<string[]> {
  const imgDir = path.join(tmpDir, "images");
  await fs.mkdir(imgDir, { recursive: true });
  // Convert all pages at 150 DPI (good quality, reasonable size)
  await exec(`pdftoppm -r 150 -png "${pdfPath}" "${path.join(imgDir, "page")}"`);
  const files = await fs.readdir(imgDir);
  const pngFiles = files
    .filter((f) => f.endsWith(".png"))
    .sort()
    .map((f) => path.join(imgDir, f));
  return pngFiles;
}

// ── Step 4: Classify pages ────────────────────────────────────────────────────

function classifyPage(text: string): {
  type: "text" | "diagram" | "photo" | "table" | "mixed";
  hasVisual: boolean;
} {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const hasFigureRef = /figure\s*\d+|fig\.\s*\d+|diagram|illustration/i.test(text);
  const hasTableRef = /table\s*\d+|\|\s*\w+\s*\|/i.test(text);
  const hasPhotoRef = /photograph|photo\s*\d+|plate\s*\d+/i.test(text);

  if (wordCount < 30) {
    if (hasTableRef) return { type: "table", hasVisual: true };
    return { type: "diagram", hasVisual: true };
  }
  if (wordCount < 100) {
    if (hasTableRef) return { type: "mixed", hasVisual: true };
    if (hasFigureRef || hasPhotoRef) return { type: "mixed", hasVisual: true };
    return { type: "mixed", hasVisual: true };
  }
  if (hasFigureRef || hasPhotoRef) return { type: "mixed", hasVisual: true };
  if (hasTableRef) return { type: "mixed", hasVisual: true };
  return { type: "text", hasVisual: false };
}

// ── Step 5: Analyze visual pages with Gemini Vision ──────────────────────────

async function analyzePageWithVision(
  imagePath: string,
  pageNum: number,
  pageText: string
): Promise<{
  description: string;
  caption: string;
  tags: string[];
  visualType: "diagram" | "photo" | "table" | "mixed";
}> {
  const imageBuffer = await fs.readFile(imagePath);
  const base64Image = imageBuffer.toString("base64");
  const ext = path.extname(imagePath).slice(1).toLowerCase();
  const mimeType = ext === "png" ? "image/png" : "image/jpeg";

  const messages: Message[] = [
    {
      role: "user",
      content: [
        {
          type: "image_url",
          image_url: {
            url: `data:${mimeType};base64,${base64Image}`,
            detail: "high",
          },
        },
        {
          type: "text",
          text: `This is page ${pageNum} of a technical document. The extracted text from this page is:
"${pageText.slice(0, 500)}"

Please analyze this page image and provide:
1. A detailed description of any diagrams, tables, photos, or visual elements (include spatial relationships, measurements, labels, distances if visible)
2. A short caption (max 20 words) summarizing the main visual content
3. 5-8 retrieval tags (lowercase, relevant to the content)
4. The visual type: "diagram", "photo", "table", or "mixed"

Respond in JSON format:
{
  "description": "...",
  "caption": "...",
  "tags": ["tag1", "tag2", ...],
  "visualType": "diagram|photo|table|mixed"
}`,
        },
      ],
    },
  ];

  const result = await invokeLLM({
    messages,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "visual_analysis",
        strict: true,
        schema: {
          type: "object",
          properties: {
            description: { type: "string" },
            caption: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
            visualType: { type: "string", enum: ["diagram", "photo", "table", "mixed"] },
          },
          required: ["description", "caption", "tags", "visualType"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = result.choices[0]?.message?.content;
  if (typeof content !== "string") {
    return {
      description: `Visual content on page ${pageNum}`,
      caption: `Page ${pageNum} visual`,
      tags: ["visual"],
      visualType: "diagram",
    };
  }
  try {
    return JSON.parse(content);
  } catch {
    return {
      description: content.slice(0, 500),
      caption: `Page ${pageNum} visual`,
      tags: ["visual"],
      visualType: "diagram",
    };
  }
}

// ── Step 6: Build knowledge base (sections, glossary) ────────────────────────

async function buildKnowledgeBaseMetadata(
  pageChunks: PageChunk[],
  filename: string
): Promise<{ sections: SectionEntry[]; glossary: GlossaryEntry[]; systemPrompt: string }> {
  // Build a condensed summary of the document for the LLM
  const docSummary = pageChunks
    .slice(0, 50)
    .map((p) => `Page ${p.page}: ${p.text.slice(0, 200)}`)
    .join("\n");

  const messages: Message[] = [
    {
      role: "system",
      content: `You are a knowledge base builder. Analyze the provided document content and extract structured metadata.`,
    },
    {
      role: "user",
      content: `Document: "${filename}"
Total pages: ${pageChunks.length}

Sample content from first 50 pages:
${docSummary}

Please extract:
1. Up to 15 sections/chapters with summaries
2. Up to 30 key glossary terms with definitions
3. A system prompt for an AI assistant that will answer questions about this document

Respond in JSON:
{
  "sections": [{"id": "s1", "title": "...", "level": 1, "page_start": 1, "page_end": 10, "summary": "...", "key_topics": ["topic1"]}],
  "glossary": [{"term": "...", "definition": "...", "page_references": [1, 2], "category": "technical"}],
  "systemPrompt": "You are an expert assistant for the document '${filename}'..."
}`,
    },
  ];

  const result = await invokeLLM({
    messages,
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "kb_metadata",
        strict: false,
        schema: {
          type: "object",
          properties: {
            sections: { type: "array" },
            glossary: { type: "array" },
            systemPrompt: { type: "string" },
          },
          required: ["sections", "glossary", "systemPrompt"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = result.choices[0]?.message?.content;
  if (typeof content !== "string") {
    return {
      sections: [],
      glossary: [],
      systemPrompt: `You are an expert assistant for the document "${filename}". Answer questions accurately based on the document content. Always cite page numbers.`,
    };
  }
  try {
    return JSON.parse(content);
  } catch {
    return {
      sections: [],
      glossary: [],
      systemPrompt: `You are an expert assistant for the document "${filename}". Answer questions accurately based on the document content. Always cite page numbers.`,
    };
  }
}

// ── Main pipeline runner ──────────────────────────────────────────────────────

export async function runPipeline(
  jobId: string,
  fileKey: string,
  originalFilename: string
): Promise<void> {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), `docoracle-${jobId}-`));

  try {
    // ── Step 1: Download PDF ──────────────────────────────────────────────────
    await setStatus(jobId, "extracting_text", "Downloading your PDF...");
    await updateProgress(jobId, 1, "Downloading PDF from storage...");
    const pdfPath = await downloadPdf(fileKey, tmpDir);

    // Get page count
    const { stdout: pdfInfoOut } = await exec(`pdfinfo "${pdfPath}" 2>/dev/null || echo "Pages: 0"`);
    const pageCountMatch = pdfInfoOut.match(/Pages:\s*(\d+)/);
    const pageCount = pageCountMatch ? parseInt(pageCountMatch[1]) : 0;
    await updatePipelineJob(jobId, { pageCount });

    // ── Step 2: Extract text ──────────────────────────────────────────────────
    await setStatus(jobId, "extracting_text", `Extracting text from ${pageCount} pages...`);
    await updateProgress(jobId, 2, `Extracting text from ${pageCount} pages...`);
    const pageTexts = await extractText(pdfPath, tmpDir);
    const actualPageCount = pageTexts.length;
    await updatePipelineJob(jobId, { pageCount: actualPageCount });

    // ── Step 3: Classify pages ────────────────────────────────────────────────
    await setStatus(jobId, "classifying_pages", "Classifying pages...");
    await updateProgress(jobId, 3, "Classifying pages (text vs visual)...");

    const pageClassifications = pageTexts.map((text, i) => ({
      page: i + 1,
      text,
      ...classifyPage(text),
    }));

    const visualPages = pageClassifications.filter((p) => p.hasVisual);
    const textPages = pageClassifications.filter((p) => !p.hasVisual);

    // ── Step 4: Convert to images for visual pages ────────────────────────────
    let imageFiles: string[] = [];
    if (visualPages.length > 0) {
      await setStatus(jobId, "analyzing_visuals", `Converting ${visualPages.length} visual pages to images...`);
      await updateProgress(jobId, 4, `Converting ${visualPages.length} visual pages to images...`);
      imageFiles = await convertPagesToImages(pdfPath, tmpDir, actualPageCount);
    }

    // ── Step 5: Analyze visual pages with Gemini Vision ──────────────────────
    const visualAssets: VisualAsset[] = [];
    if (visualPages.length > 0) {
      await setStatus(jobId, "analyzing_visuals", `Analyzing ${visualPages.length} visual pages with AI...`);

      // Process in batches of 5 to avoid rate limits
      const batchSize = 5;
      for (let i = 0; i < visualPages.length; i += batchSize) {
        const batch = visualPages.slice(i, i + batchSize);
        await updateProgress(
          jobId,
          4,
          `Analyzing visual pages ${i + 1}-${Math.min(i + batchSize, visualPages.length)} of ${visualPages.length}...`,
          Math.round((i / visualPages.length) * 100)
        );

        await Promise.all(
          batch.map(async (page) => {
            const imageIndex = page.page - 1;
            const imagePath = imageFiles[imageIndex];
            if (!imagePath) return;

            try {
              const analysis = await analyzePageWithVision(imagePath, page.page, page.text);

              // Upload the image to storage
              const imgBuffer = await fs.readFile(imagePath);
              const { key: imgKey, url: imgUrl } = await storagePut(
                `pipeline-jobs/${jobId}/visuals/page_${page.page}.png`,
                imgBuffer,
                "image/png"
              );

              visualAssets.push({
                id: `${jobId}-page-${page.page}`,
                page: page.page,
                type: analysis.visualType,
                imageUrl: imgUrl,
                imageKey: imgKey,
                description: analysis.description,
                caption: analysis.caption,
                tags: analysis.tags,
                chapter: `Page ${page.page}`,
              });
            } catch (err) {
              console.warn(`[Pipeline] Failed to analyze page ${page.page}:`, err);
            }
          })
        );

        // Small delay between batches to be gentle on rate limits
        if (i + batchSize < visualPages.length) {
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    }

    // ── Step 6: Build page chunks ─────────────────────────────────────────────
    await setStatus(jobId, "building_knowledge_base", "Building knowledge base...");
    await updateProgress(jobId, 5, "Building page chunks and knowledge base...");

    const pageChunks: PageChunk[] = pageClassifications.map((p) => ({
      page: p.page,
      text: p.text,
      chapter: `Page ${p.page}`,
      section: "",
      has_visual: p.hasVisual,
      visual_type: p.hasVisual ? (p.type as "diagram" | "photo" | "table" | "mixed") : "none",
      word_count: p.text.split(/\s+/).filter(Boolean).length,
    }));

    // ── Step 7: Build sections, glossary, system prompt ───────────────────────
    await setStatus(jobId, "building_knowledge_base", "Generating glossary and sections with AI...");
    await updateProgress(jobId, 6, "Generating glossary, sections, and system prompt...");
    const { sections, glossary, systemPrompt } = await buildKnowledgeBaseMetadata(
      pageChunks,
      originalFilename
    );

    // Update page chunks with section info
    for (const section of sections) {
      for (const chunk of pageChunks) {
        if (chunk.page >= section.page_start && chunk.page <= section.page_end) {
          chunk.chapter = section.title;
          chunk.section = section.id;
        }
      }
    }

    // ── Step 8: Save knowledge base to storage ────────────────────────────────
    await setStatus(jobId, "finalizing", "Saving knowledge base to storage...");
    await updateProgress(jobId, 7, "Saving knowledge base...");

    const kb: KnowledgeBase = {
      jobId,
      filename: originalFilename,
      pageCount: actualPageCount,
      pageChunks,
      sections,
      glossary,
      visualAssets,
      systemPrompt,
      processedAt: new Date().toISOString(),
    };

    const kbJson = JSON.stringify(kb);
    const { key: kbKey } = await storagePut(
      `pipeline-jobs/${jobId}/knowledge_base.json`,
      kbJson,
      "application/json"
    );

    // ── Done! ─────────────────────────────────────────────────────────────────
    await updatePipelineJob(jobId, {
      status: "completed",
      currentStep: 7,
      statusMessage: `Knowledge base ready! Processed ${actualPageCount} pages, found ${visualAssets.length} visual assets.`,
      currentPageProgress: 100,
      knowledgeBaseKey: kbKey,
      completedAt: new Date(),
    });

    console.log(`[Pipeline] Job ${jobId} completed: ${actualPageCount} pages, ${visualAssets.length} visuals`);
  } catch (err) {
    console.error(`[Pipeline] Job ${jobId} failed:`, err);
    await updatePipelineJob(jobId, {
      status: "failed",
      errorMessage: err instanceof Error ? err.message : String(err),
      statusMessage: "Pipeline failed. Please try again.",
    });
  } finally {
    // Clean up temp directory
    await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

// ── In-memory knowledge base cache (loaded per job for chat) ─────────────────

const kbCache = new Map<string, KnowledgeBase>();

export async function loadJobKnowledgeBase(
  jobId: string,
  kbKey: string
): Promise<KnowledgeBase | null> {
  if (kbCache.has(jobId)) return kbCache.get(jobId)!;
  try {
    const signedUrl = await storageGetSignedUrl(kbKey);
    const resp = await fetch(signedUrl);
    if (!resp.ok) return null;
    const kb = (await resp.json()) as KnowledgeBase;
    kbCache.set(jobId, kb);
    return kb;
  } catch {
    return null;
  }
}

export function searchJobKnowledge(
  kb: KnowledgeBase,
  query: string,
  topK = 8
): { chunks: PageChunk[]; assets: VisualAsset[] } {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2);

  // Score page chunks
  const scoredChunks = kb.pageChunks
    .map((chunk) => {
      const textLower = chunk.text.toLowerCase();
      let score = 0;
      for (const word of queryWords) {
        const count = (textLower.match(new RegExp(word, "g")) || []).length;
        score += count;
      }
      return { chunk, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  // Score visual assets
  const scoredAssets = kb.visualAssets
    .map((asset) => {
      const searchText = `${asset.description} ${asset.caption} ${asset.tags.join(" ")}`.toLowerCase();
      let score = 0;
      for (const word of queryWords) {
        if (searchText.includes(word)) score += 2;
      }
      return { asset, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return {
    chunks: scoredChunks.map((s) => s.chunk),
    assets: scoredAssets.map((s) => s.asset),
  };
}
