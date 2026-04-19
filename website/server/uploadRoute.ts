/**
 * Express route for PDF file upload.
 * Handles multipart/form-data, saves to S3, creates a pipeline job, and starts processing.
 */
import type { Express } from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import { storagePut } from "./storage";
import { createPipelineJob } from "./db";
import { runPipeline } from "./pipeline";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.originalname.endsWith(".pdf")) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are accepted"));
    }
  },
});

export function registerUploadRoute(app: Express) {
  app.post("/api/upload-pdf", upload.single("pdf"), async (req, res) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "No PDF file provided" });
        return;
      }

      const jobId = uuidv4();
      const originalFilename = req.file.originalname || "document.pdf";
      const safeFilename = originalFilename.replace(/[^a-zA-Z0-9._-]/g, "_");

      // Upload PDF to storage
      const { key: fileKey, url: fileUrl } = await storagePut(
        `pipeline-jobs/${jobId}/source_${safeFilename}`,
        req.file.buffer,
        "application/pdf"
      );

      // Create job record in DB
      await createPipelineJob({
        id: jobId,
        originalFilename,
        fileKey,
        fileUrl,
        pageCount: 0,
        fileSizeBytes: req.file.size,
        status: "queued",
        currentStep: 0,
        totalSteps: 7,
        currentPageProgress: 0,
        statusMessage: "Job queued, starting pipeline...",
      });

      // Start pipeline in background (don't await)
      runPipeline(jobId, fileKey, originalFilename).catch((err) => {
        console.error(`[Upload] Pipeline failed for job ${jobId}:`, err);
      });

      res.json({ jobId, filename: originalFilename });
    } catch (err) {
      console.error("[Upload] Error:", err);
      if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
        res.status(413).json({ error: "File too large. Maximum size is 50 MB." });
      } else {
        res.status(500).json({ error: err instanceof Error ? err.message : "Upload failed" });
      }
    }
  });
}
