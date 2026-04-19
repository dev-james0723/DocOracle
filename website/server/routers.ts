import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { generateImage } from "./_core/imageGeneration";
import type { Message } from "./_core/llm";
import {
  searchKnowledge,
  searchVisualAssets,
  getGlossary,
  getSections,
  getSystemPrompt,
  buildRetrievalContext,
  loadKnowledgeBase,
} from "./knowledgeBase";
import {
  getPipelineJob,
  listPipelineJobs,
} from "./db";
import {
  loadJobKnowledgeBase,
  searchJobKnowledge,
} from "./pipeline";

// Pre-load Decca Oracle knowledge base on import
loadKnowledgeBase();

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ── Decca Oracle Chat (existing knowledge base) ───────────────────────────
  chat: router({
    send: publicProcedure
      .input(
        z.object({
          message: z.string().min(1).max(2000),
          history: z
            .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
            .optional()
            .default([]),
        })
      )
      .mutation(async ({ input }) => {
        const { context, relevantAssets, searchResults } = buildRetrievalContext(input.message);
        const systemPrompt = getSystemPrompt();
        const messages: Message[] = [
          { role: "system", content: systemPrompt },
          { role: "system", content: context },
          ...input.history.map((h) => ({ role: h.role as "user" | "assistant", content: h.content })),
          { role: "user", content: input.message },
        ];
        const result = await invokeLLM({ messages });
        const answer = result.choices[0]?.message?.content;
        const answerText = typeof answer === "string" ? answer : JSON.stringify(answer);
        const isComplex = answerText.length > 400 || relevantAssets.length > 0;
        return {
          answer: answerText,
          relevantAssets: relevantAssets.slice(0, 3),
          citations: searchResults.slice(0, 5).map((r) => ({
            page: r.page_number,
            chapter: r.section_path,
            excerpt: r.text_preview.slice(0, 150),
          })),
          isComplex,
        };
      }),

    generateImageExplanation: publicProcedure
      .input(z.object({ answerText: z.string().min(10).max(3000) }))
      .mutation(async ({ input }) => {
        const prompt = `Create a clear, professional technical diagram or infographic that visually explains the following concept from a classical recording textbook. Use clean lines, labels, and a professional style suitable for audio engineers:

${input.answerText.slice(0, 800)}

Style: Clean technical illustration, white background, clear labels, professional audio engineering diagram style.`;
        const { url } = await generateImage({ prompt });
        return { imageUrl: url };
      }),
  }),

  // ── Knowledge browser (existing Decca Oracle KB) ──────────────────────────
  knowledge: router({
    glossary: publicProcedure.query(() => getGlossary()),
    sections: publicProcedure.query(() => getSections()),
    search: publicProcedure
      .input(z.object({ query: z.string().min(1).max(500) }))
      .query(({ input }) => {
        const results = searchKnowledge(input.query, 10);
        const assets = searchVisualAssets(input.query, 5);
        return { results, assets };
      }),
  }),

  // ── DocOracle Pipeline — job management ──────────────────────────────────
  pipeline: router({
    getJob: publicProcedure
      .input(z.object({ jobId: z.string().uuid() }))
      .query(async ({ input }) => {
        const job = await getPipelineJob(input.jobId);
        if (!job) throw new Error("Job not found");
        return job;
      }),

    listJobs: publicProcedure.query(async () => {
      return listPipelineJobs(20);
    }),

    // Chat with a completed job's knowledge base
    chat: publicProcedure
      .input(
        z.object({
          jobId: z.string().uuid(),
          message: z.string().min(1).max(2000),
          history: z
            .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
            .optional()
            .default([]),
        })
      )
      .mutation(async ({ input }) => {
        const job = await getPipelineJob(input.jobId);
        if (!job) throw new Error("Job not found");
        if (job.status !== "completed") throw new Error("Job is not yet completed");
        if (!job.knowledgeBaseKey) throw new Error("Knowledge base not available");

        const kb = await loadJobKnowledgeBase(input.jobId, job.knowledgeBaseKey);
        if (!kb) throw new Error("Failed to load knowledge base");

        const { chunks, assets } = searchJobKnowledge(kb, input.message, 8);

        const context = chunks.length > 0
          ? `Relevant content from the document:\n\n${chunks
              .map((c) => `[Page ${c.page} — ${c.chapter}]\n${c.text.slice(0, 600)}`)
              .join("\n\n---\n\n")}`
          : "No specific relevant content found. Answer based on general knowledge of the document.";

        const messages: Message[] = [
          { role: "system", content: kb.systemPrompt },
          { role: "system", content: context },
          ...input.history.map((h) => ({ role: h.role as "user" | "assistant", content: h.content })),
          { role: "user", content: input.message },
        ];

        const result = await invokeLLM({ messages });
        const answer = result.choices[0]?.message?.content;
        const answerText = typeof answer === "string" ? answer : JSON.stringify(answer);
        const isComplex = answerText.length > 400 || assets.length > 0;

        return {
          answer: answerText,
          relevantAssets: assets.slice(0, 3),
          citations: chunks.slice(0, 5).map((c) => ({
            page: c.page,
            chapter: c.chapter,
            excerpt: c.text.slice(0, 150),
          })),
          isComplex,
        };
      }),

    // Generate image explanation for a job chat answer
    generateImageExplanation: publicProcedure
      .input(z.object({ answerText: z.string().min(10).max(3000) }))
      .mutation(async ({ input }) => {
        const prompt = `Create a clear, professional technical diagram or infographic that visually explains the following concept from a technical document. Use clean lines, labels, and a professional style:

${input.answerText.slice(0, 800)}

Style: Clean technical illustration, white background, clear labels, professional diagram style.`;
        const { url } = await generateImage({ prompt });
        return { imageUrl: url };
      }),
  }),
});

export type AppRouter = typeof appRouter;
