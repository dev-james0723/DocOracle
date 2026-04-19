import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  json,
  bigint,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * pipeline_jobs: tracks every PDF upload and its processing state.
 * One row per uploaded PDF. The pipeline updates status + progress as it runs.
 */
export const pipelineJobs = mysqlTable("pipeline_jobs", {
  id: varchar("id", { length: 64 }).primaryKey(), // UUID
  // PDF info
  originalFilename: varchar("originalFilename", { length: 512 }).notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(), // S3 key for the uploaded PDF
  fileUrl: varchar("fileUrl", { length: 1024 }).notNull(), // /manus-storage/... URL
  pageCount: int("pageCount").default(0).notNull(),
  fileSizeBytes: bigint("fileSizeBytes", { mode: "number" }).default(0).notNull(),

  // Pipeline status
  status: mysqlEnum("status", [
    "queued",
    "extracting_text",
    "classifying_pages",
    "analyzing_visuals",
    "building_knowledge_base",
    "extracting_visual_assets",
    "finalizing",
    "completed",
    "failed",
  ])
    .default("queued")
    .notNull(),

  // Progress tracking
  currentStep: int("currentStep").default(0).notNull(),    // 0-7
  totalSteps: int("totalSteps").default(7).notNull(),
  currentPageProgress: int("currentPageProgress").default(0).notNull(),
  statusMessage: text("statusMessage"),

  // Output: stored as JSON in DB, loaded into memory for chat
  knowledgeBaseKey: varchar("knowledgeBaseKey", { length: 512 }), // S3 key for kb JSON bundle
  visualAssetsKey: varchar("visualAssetsKey", { length: 512 }),   // S3 key for visual assets JSON

  // Error info
  errorMessage: text("errorMessage"),

  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type PipelineJob = typeof pipelineJobs.$inferSelect;
export type InsertPipelineJob = typeof pipelineJobs.$inferInsert;
