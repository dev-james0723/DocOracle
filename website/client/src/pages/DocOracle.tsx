import { useState, useRef, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Sparkles,
  ArrowLeft,
  Sun,
  Moon,
  ChevronRight,
  Zap,
  Database,
  MessageSquare,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

const STEPS = [
  { icon: Upload, label: "Upload PDF", desc: "Any PDF document up to 50 MB" },
  { icon: Eye, label: "Visual Analysis", desc: "Gemini Vision analyses every diagram & table" },
  { icon: Database, label: "Knowledge Base", desc: "Structured chunks, glossary & section map built" },
  { icon: MessageSquare, label: "AI Chat Ready", desc: "Ask anything — answers with citations & diagrams" },
];

const EXAMPLES = [
  { title: "Medical Manual", desc: "Hospital procedure handbook → AI assistant for staff" },
  { title: "Legal Document", desc: "Contract or regulation → Instant Q&A interface" },
  { title: "Technical Guide", desc: "Engineering spec → Interactive knowledge base" },
  { title: "Academic Text", desc: "Research paper → Cited, searchable AI tutor" },
];

export default function DocOracle() {
  const { theme, toggleTheme } = useTheme();
  const [, navigate] = useLocation();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDark = theme === "dark";

  const { data: recentJobs } = trpc.pipeline.listJobs.useQuery(undefined, {
    refetchInterval: 5000,
  });
  const jobs = (recentJobs ?? []) as Array<{
    id: string;
    originalFilename: string;
    status: string;
    currentStep: number;
    totalSteps: number;
    statusMessage: string | null;
    createdAt: Date;
  }>;

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith(".pdf") && file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError("File too large. Maximum size is 50 MB.");
      return;
    }
    setError(null);
    setSelectedFile(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("pdf", selectedFile);
      const res = await fetch("/api/upload-pdf", { method: "POST", body: formData });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Upload failed (${res.status})`);
      }
      const { jobId } = await res.json();
      navigate(`/doc-oracle/job/${jobId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
      setUploading(false);
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-[#0d0d1a] via-[#0a1628] to-[#0d1f2d] text-white"
          : "bg-gradient-to-br from-slate-50 via-violet-50 to-teal-50 text-slate-900"
      }`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md ${
          isDark ? "bg-black/40 border-white/10" : "bg-white/70 border-violet-100"
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <button
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? "hover:bg-white/10 text-white/70" : "hover:bg-violet-50 text-slate-600"
                }`}
              >
                <ArrowLeft size={18} />
              </button>
            </Link>
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-teal-400" />
              <span className="font-semibold text-sm">DocOracle</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  isDark ? "bg-teal-500/15 text-teal-300" : "bg-teal-50 text-teal-700"
                }`}
              >
                Demo
              </span>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? "hover:bg-white/10 text-white/70" : "hover:bg-violet-50 text-slate-600"
            }`}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 ${
              isDark
                ? "bg-teal-500/10 border border-teal-500/20 text-teal-300"
                : "bg-teal-50 border border-teal-200 text-teal-700"
            }`}
          >
            <Sparkles size={12} />
            PDF → AI Knowledge Base Pipeline
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            Turn any PDF into an
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-teal-400 bg-clip-text text-transparent">
              AI Knowledge Base
            </span>
          </h1>
          <p
            className={`text-lg max-w-2xl mx-auto ${isDark ? "text-white/60" : "text-slate-500"}`}
          >
            Upload your document. Our pipeline extracts text, analyses every diagram with Gemini
            Vision, builds a structured knowledge base, and generates a fully functional AI chat
            interface — all automatically.
          </p>
        </motion.div>

        {/* Pipeline steps */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-12"
        >
          {STEPS.map((step, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border text-center ${
                isDark
                  ? "bg-white/3 border-white/8"
                  : "bg-white border-violet-100 shadow-sm"
              }`}
            >
              <div
                className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${
                  isDark ? "bg-violet-500/15" : "bg-violet-50"
                }`}
              >
                <step.icon size={18} className="text-violet-400" />
              </div>
              <div className="flex items-center justify-center gap-1 mb-1">
                <span
                  className={`text-xs font-bold ${isDark ? "text-white/30" : "text-slate-300"}`}
                >
                  {i + 1}
                </span>
                <ChevronRight size={10} className={isDark ? "text-white/20" : "text-slate-300"} />
                <span className="text-xs font-semibold">{step.label}</span>
              </div>
              <p className={`text-xs ${isDark ? "text-white/40" : "text-slate-400"}`}>
                {step.desc}
              </p>
            </div>
          ))}
        </motion.div>

        {/* Upload area */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => !selectedFile && fileInputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed transition-all cursor-pointer p-10 text-center ${
              isDragging
                ? isDark
                  ? "border-violet-400 bg-violet-500/10"
                  : "border-violet-400 bg-violet-50"
                : selectedFile
                ? isDark
                  ? "border-teal-400/50 bg-teal-500/5"
                  : "border-teal-400 bg-teal-50"
                : isDark
                ? "border-white/15 hover:border-violet-400/40 hover:bg-white/3"
                : "border-violet-200 hover:border-violet-400 hover:bg-violet-50/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />

            <AnimatePresence mode="wait">
              {selectedFile ? (
                <motion.div
                  key="selected"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${
                      isDark ? "bg-teal-500/15" : "bg-teal-100"
                    }`}
                  >
                    <FileText size={28} className="text-teal-400" />
                  </div>
                  <p className="font-semibold text-lg mb-1">{selectedFile.name}</p>
                  <p className={`text-sm mb-4 ${isDark ? "text-white/50" : "text-slate-500"}`}>
                    {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        isDark
                          ? "border-white/10 text-white/50 hover:border-white/20"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      Change file
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                      disabled={uploading}
                      className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-teal-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Zap size={14} />
                          Start Pipeline
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 ${
                      isDark ? "bg-white/5" : "bg-violet-50"
                    }`}
                  >
                    <Upload size={28} className={isDark ? "text-white/30" : "text-violet-300"} />
                  </div>
                  <p className="font-semibold text-lg mb-1">Drop your PDF here</p>
                  <p className={`text-sm ${isDark ? "text-white/40" : "text-slate-400"}`}>
                    or click to browse — up to 50 MB
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-sm text-red-400 text-center"
            >
              {error}
            </motion.p>
          )}
        </motion.div>

        {/* Example use cases */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2
            className={`text-center text-sm font-semibold uppercase tracking-wider mb-6 ${
              isDark ? "text-white/30" : "text-slate-400"
            }`}
          >
            Works great for
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {EXAMPLES.map((ex, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border ${
                  isDark
                    ? "bg-white/3 border-white/8"
                    : "bg-white border-violet-100 shadow-sm"
                }`}
              >
                <p className="font-semibold text-sm mb-1">{ex.title}</p>
                <p className={`text-xs ${isDark ? "text-white/40" : "text-slate-400"}`}>
                  {ex.desc}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Jobs */}
        {jobs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <h3 className={`text-sm font-semibold uppercase tracking-widest mb-4 ${isDark ? "text-white/40" : "text-slate-400"}`}>
              Recent Uploads
            </h3>
            <div className="flex flex-col gap-2">
              {jobs.slice(0, 5).map((job) => (
                <div
                  key={job.id}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
                    isDark ? "bg-white/3 border-white/10 hover:bg-white/5" : "bg-white border-violet-100 hover:border-violet-200 shadow-sm"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {job.status === "done" ? (
                      <CheckCircle size={16} className="text-teal-400 flex-shrink-0" />
                    ) : job.status === "error" ? (
                      <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                    ) : (
                      <Loader2 size={16} className="text-violet-400 animate-spin flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${isDark ? "text-white" : "text-slate-800"}`}>
                        {job.originalFilename}
                      </p>
                      <p className={`text-xs ${isDark ? "text-white/40" : "text-slate-400"}`}>
                        {job.status === "completed" ? "Ready" : job.status === "failed" ? "Failed" : `Step ${job.currentStep}/${job.totalSteps} — ${(job.statusMessage ?? job.status).replace(/_/g, " ")}`}
                      </p>
                    </div>
                  </div>
                  {job.status !== "queued" && (
                    <Link href={`/doc-oracle/job/${job.id}`}>
                      <button
                        className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          isDark
                            ? "border-violet-400/30 text-violet-300 hover:bg-violet-500/10"
                            : "border-violet-200 text-violet-600 hover:bg-violet-50"
                        }`}
                      >
                        {job.status === "completed" ? "Open Chat" : "View Progress"}
                      </button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Link to Decca Oracle */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className={`text-sm mb-3 ${isDark ? "text-white/40" : "text-slate-400"}`}>
            Want to see a live example?
          </p>
          <Link href="/chat">
            <button
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                isDark
                  ? "border-violet-400/30 text-violet-300 hover:bg-violet-500/10"
                  : "border-violet-200 text-violet-700 hover:bg-violet-50"
              }`}
            >
              <Sparkles size={14} />
              Try The Decca Oracle (pre-built demo)
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
