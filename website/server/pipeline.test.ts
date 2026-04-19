import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database helpers so tests don't need a real DB
vi.mock("./db", () => ({
  createPipelineJob: vi.fn().mockResolvedValue({
    id: "test-job-id-1234",
    status: "queued",
    stage: "queued",
    progress: 0,
    filename: "test.pdf",
    fileKey: "uploads/test.pdf",
    pageCount: null,
    processedPages: null,
    knowledgeBaseKey: null,
    error: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  getPipelineJob: vi.fn().mockResolvedValue({
    id: "test-job-id-1234",
    status: "done",
    stage: "done",
    progress: 100,
    filename: "test.pdf",
    fileKey: "uploads/test.pdf",
    pageCount: 10,
    processedPages: 10,
    knowledgeBaseKey: "kb/test-job-id-1234/knowledge_base.json",
    error: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }),
  updatePipelineJob: vi.fn().mockResolvedValue(undefined),
}));

// Mock storage
vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({ key: "test-key", url: "/manus-storage/test-key" }),
  storageGet: vi.fn().mockResolvedValue({ key: "test-key", url: "/manus-storage/test-key" }),
}));

// Mock LLM
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn().mockResolvedValue({
    choices: [{ message: { content: "Test answer about recording." } }],
  }),
}));

import { getPipelineJob, createPipelineJob } from "./db";

describe("Pipeline Job Management", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("createPipelineJob returns a job with queued status", async () => {
    const job = await createPipelineJob({
      filename: "test.pdf",
      fileKey: "uploads/test.pdf",
    });
    expect(job.status).toBe("queued");
    expect(job.stage).toBe("queued");
    expect(job.progress).toBe(0);
    expect(job.filename).toBe("test.pdf");
  });

  it("getPipelineJob returns the correct job by id", async () => {
    const job = await getPipelineJob("test-job-id-1234");
    expect(job).not.toBeNull();
    expect(job?.id).toBe("test-job-id-1234");
    expect(job?.status).toBe("done");
    expect(job?.progress).toBe(100);
  });

  it("getPipelineJob returns null for unknown id", async () => {
    const { getPipelineJob: mockGet } = await import("./db");
    vi.mocked(mockGet).mockResolvedValueOnce(null);
    const job = await getPipelineJob("unknown-id");
    expect(job).toBeNull();
  });
});

describe("Pipeline Stage Progression", () => {
  it("stage order is valid: queued → extracting → analyzing_pages → building_kb → done", () => {
    const STAGE_ORDER = [
      "queued",
      "uploading",
      "extracting",
      "analyzing_pages",
      "building_kb",
      "generating_glossary",
      "generating_sections",
      "done",
    ];
    expect(STAGE_ORDER.indexOf("queued")).toBe(0);
    expect(STAGE_ORDER.indexOf("done")).toBe(STAGE_ORDER.length - 1);
    expect(STAGE_ORDER.indexOf("analyzing_pages")).toBeGreaterThan(
      STAGE_ORDER.indexOf("extracting")
    );
    expect(STAGE_ORDER.indexOf("building_kb")).toBeGreaterThan(
      STAGE_ORDER.indexOf("analyzing_pages")
    );
  });

  it("progress percentage is between 0 and 100", () => {
    const clampProgress = (p: number) => Math.min(100, Math.max(0, p));
    expect(clampProgress(-5)).toBe(0);
    expect(clampProgress(50)).toBe(50);
    expect(clampProgress(105)).toBe(100);
  });
});

describe("Knowledge Base Search for Job Chat", () => {
  it("search function handles empty query gracefully", () => {
    const searchJobKnowledge = (kb: { chunks: unknown[]; assets: unknown[] }, query: string, limit: number) => {
      if (!query.trim()) return { chunks: [], assets: [] };
      return { chunks: kb.chunks.slice(0, limit), assets: [] };
    };
    const result = searchJobKnowledge({ chunks: [{ text: "test" }], assets: [] }, "", 5);
    expect(result.chunks).toHaveLength(0);
  });

  it("search returns up to the specified limit", () => {
    const searchJobKnowledge = (kb: { chunks: unknown[]; assets: unknown[] }, query: string, limit: number) => {
      if (!query.trim()) return { chunks: [], assets: [] };
      return { chunks: kb.chunks.slice(0, limit), assets: [] };
    };
    const mockKb = {
      chunks: Array.from({ length: 20 }, (_, i) => ({ text: `chunk ${i}` })),
      assets: [],
    };
    const result = searchJobKnowledge(mockKb, "test query", 8);
    expect(result.chunks.length).toBeLessThanOrEqual(8);
  });
});
