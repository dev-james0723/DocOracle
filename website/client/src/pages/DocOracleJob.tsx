import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Link, useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc";
import { Streamdown } from "streamdown";
import {
  ArrowLeft,
  Sun,
  Moon,
  Zap,
  CheckCircle,
  Clock,
  AlertCircle,
  MessageSquare,
  Send,
  Image,
  FileText,
  BookOpen,
} from "lucide-react";

interface Citation {
  page: number;
  section: string;
  type: string;
}

interface VisualAsset {
  filename: string;
  url: string;
  caption: string;
  description: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  visualAssets?: VisualAsset[];
  isComplex?: boolean;
  imageExplanation?: string;
}

const STAGE_LABELS: Record<string, string> = {
  queued: "Queued",
  uploading: "Uploading PDF",
  extracting: "Extracting text",
  analyzing_pages: "Analysing pages with Gemini Vision",
  building_kb: "Building knowledge base",
  generating_glossary: "Generating glossary",
  generating_sections: "Generating section map",
  done: "Complete",
  error: "Error",
};

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

export default function DocOracleJob() {
  const { jobId } = useParams<{ jobId: string }>();
  const { theme, toggleTheme } = useTheme();
  const [, navigate] = useLocation();
  const isDark = theme === "dark";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [generatingImage, setGeneratingImage] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Poll job status
  const { data: job, refetch } = trpc.pipeline.getJob.useQuery(
    { jobId: jobId ?? "" },
    { enabled: !!jobId, refetchInterval: (data) => {
      if (!data) return 2000;
      const status = (data as { status?: string }).status;
      return status === "done" || status === "error" ? false : 2000;
    }}
  );

  const chatMutation = trpc.pipeline.chat.useMutation();
  const imageExplanationMutation = trpc.pipeline.generateImageExplanation.useMutation();

  const jobData = job as {
    id: string;
    status: string;
    stage: string;
    progress: number;
    filename: string;
    error?: string;
    pageCount?: number;
    processedPages?: number;
  } | undefined;

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const q = text ?? input.trim();
    if (!q || !jobId || sending) return;
    setInput("");
    setSending(true);

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: q };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const result = await chatMutation.mutateAsync({ jobId, message: q });
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.answer,
        citations: (result.citations as unknown) as Citation[],
        visualAssets: (result.relevantAssets as unknown) as VisualAsset[],
        isComplex: result.isComplex,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const generateImageExplanation = async (msgId: string, content: string) => {
    if (!jobId) return;
    setGeneratingImage(msgId);
    try {
      const result = await imageExplanationMutation.mutateAsync({ answerText: content });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId ? { ...m, imageExplanation: result.imageUrl } : m
        )
      );
    } catch {
      // silently fail
    } finally {
      setGeneratingImage(null);
    }
  };

  const currentStageIndex = STAGE_ORDER.indexOf(jobData?.stage ?? "queued");
  const isDone = jobData?.status === "done";
  const isError = jobData?.status === "error";

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDark
          ? "bg-gradient-to-br from-[#0d0d1a] via-[#0a1628] to-[#0d1f2d] text-white"
          : "bg-gradient-to-br from-slate-50 via-violet-50 to-teal-50 text-slate-900"
      }`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md flex-shrink-0 ${
          isDark ? "bg-black/40 border-white/10" : "bg-white/70 border-violet-100"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/doc-oracle">
              <button
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? "hover:bg-white/10 text-white/70" : "hover:bg-violet-50 text-slate-600"
                }`}
              >
                <ArrowLeft size={18} />
              </button>
            </Link>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-teal-400" />
              <span className="font-semibold text-sm truncate max-w-[200px]">
                {jobData?.filename ?? "Processing…"}
              </span>
              {isDone && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-500/15 text-teal-300">
                  Ready
                </span>
              )}
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

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
        {/* Pipeline Progress */}
        <AnimatePresence>
          {!isDone && !isError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className={`rounded-2xl border p-6 ${
                isDark ? "bg-white/3 border-white/10" : "bg-white border-violet-100 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-semibold">Building your knowledge base</h2>
                  <p className={`text-sm ${isDark ? "text-white/50" : "text-slate-500"}`}>
                    {STAGE_LABELS[jobData?.stage ?? "queued"] ?? "Processing…"}
                    {jobData?.processedPages && jobData?.pageCount
                      ? ` — page ${jobData.processedPages} of ${jobData.pageCount}`
                      : ""}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
              </div>

              {/* Progress bar */}
              <div
                className={`h-2 rounded-full overflow-hidden ${
                  isDark ? "bg-white/10" : "bg-violet-100"
                }`}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-violet-500 to-teal-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${jobData?.progress ?? 0}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className={`text-xs mt-2 ${isDark ? "text-white/30" : "text-slate-400"}`}>
                {jobData?.progress ?? 0}% complete
              </p>

              {/* Stage checklist */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STAGE_ORDER.filter((s) => s !== "queued" && s !== "done").map((stage, i) => {
                  const stageIdx = STAGE_ORDER.indexOf(stage);
                  const done = stageIdx < currentStageIndex;
                  const active = stageIdx === currentStageIndex;
                  return (
                    <div
                      key={stage}
                      className={`flex items-center gap-1.5 text-xs ${
                        done
                          ? "text-teal-400"
                          : active
                          ? isDark
                            ? "text-white"
                            : "text-slate-800"
                          : isDark
                          ? "text-white/25"
                          : "text-slate-300"
                      }`}
                    >
                      {done ? (
                        <CheckCircle size={12} className="flex-shrink-0" />
                      ) : active ? (
                        <div className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin flex-shrink-0" />
                      ) : (
                        <Clock size={12} className="flex-shrink-0" />
                      )}
                      <span className="truncate">{STAGE_LABELS[stage]}</span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error state */}
        {isError && (
          <div
            className={`rounded-2xl border p-6 ${
              isDark ? "bg-red-500/5 border-red-500/20" : "bg-red-50 border-red-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
              <div>
                <p className="font-semibold text-red-400">Pipeline failed</p>
                <p className={`text-sm ${isDark ? "text-white/50" : "text-slate-500"}`}>
                  {jobData?.error ?? "An unexpected error occurred."}
                </p>
              </div>
            </div>
            <Link href="/doc-oracle">
              <button className="mt-4 text-sm px-4 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                Try again
              </button>
            </Link>
          </div>
        )}

        {/* Done banner */}
        <AnimatePresence>
          {isDone && messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`rounded-2xl border p-6 text-center ${
                isDark ? "bg-teal-500/5 border-teal-500/20" : "bg-teal-50 border-teal-200"
              }`}
            >
              <CheckCircle size={32} className="text-teal-400 mx-auto mb-3" />
              <h2 className="font-bold text-xl mb-2">Knowledge base ready!</h2>
              <p className={`text-sm mb-4 ${isDark ? "text-white/50" : "text-slate-500"}`}>
                Your PDF has been fully processed. Ask anything below.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {["What is this document about?", "What are the key topics?", "Summarise the main sections"].map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      isDark
                        ? "border-teal-400/30 text-teal-300 hover:bg-teal-500/10"
                        : "border-teal-200 text-teal-700 hover:bg-teal-50"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat messages */}
        {messages.length > 0 && (
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "user" ? (
                  <div
                    className="max-w-[75%] px-4 py-3 rounded-2xl rounded-tr-sm text-sm font-medium bg-gradient-to-br from-violet-600 to-teal-600 text-white"
                  >
                    {msg.content}
                  </div>
                ) : (
                  <div className="max-w-[85%] space-y-3">
                    {/* Answer */}
                    <div
                      className={`px-5 py-4 rounded-2xl rounded-tl-sm text-sm leading-relaxed ${
                        isDark ? "bg-white/5 border border-white/10" : "bg-white border border-violet-100 shadow-sm"
                      }`}
                    >
                      <Streamdown>{msg.content}</Streamdown>

                      {/* Citations */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-current/10">
                          {msg.citations.slice(0, 6).map((c, i) => (
                            <span
                              key={i}
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                isDark ? "bg-violet-500/15 text-violet-300" : "bg-violet-50 text-violet-600"
                              }`}
                            >
                              p.{c.page}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Visual assets */}
                    {msg.visualAssets && msg.visualAssets.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {msg.visualAssets.slice(0, 3).map((asset, i) => (
                          <div
                            key={i}
                            className={`flex-shrink-0 rounded-xl overflow-hidden border ${
                              isDark ? "border-white/10" : "border-violet-100"
                            }`}
                          >
                            <img
                              src={asset.url}
                              alt={asset.caption}
                              className="w-48 h-32 object-cover"
                            />
                            <div
                              className={`px-2 py-1.5 text-xs ${
                                isDark ? "bg-white/5 text-white/50" : "bg-slate-50 text-slate-500"
                              }`}
                            >
                              {asset.caption || asset.filename}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Image explanation button */}
                    {msg.isComplex && !msg.imageExplanation && (
                      <button
                        onClick={() => generateImageExplanation(msg.id, msg.content)}
                        disabled={generatingImage === msg.id}
                        className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl border transition-colors ${
                          isDark
                            ? "border-violet-400/30 text-violet-300 hover:bg-violet-500/10"
                            : "border-violet-200 text-violet-600 hover:bg-violet-50"
                        } disabled:opacity-50`}
                      >
                        {generatingImage === msg.id ? (
                          <div className="w-3 h-3 rounded-full border border-current border-t-transparent animate-spin" />
                        ) : (
                          <Image size={12} />
                        )}
                        Turn into image explanation
                      </button>
                    )}

                    {/* Generated image explanation */}
                    {msg.imageExplanation && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-xl overflow-hidden border ${
                          isDark ? "border-violet-400/20" : "border-violet-200"
                        }`}
                      >
                        <img
                          src={msg.imageExplanation}
                          alt="Visual explanation"
                          className="w-full"
                        />
                        <div
                          className={`px-3 py-2 text-xs flex items-center gap-1.5 ${
                            isDark ? "bg-violet-500/10 text-violet-300" : "bg-violet-50 text-violet-600"
                          }`}
                        >
                          <Image size={11} />
                          AI-generated visual explanation
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div
                  className={`px-4 py-3 rounded-2xl rounded-tl-sm ${
                    isDark ? "bg-white/5 border border-white/10" : "bg-white border border-violet-100 shadow-sm"
                  }`}
                >
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-violet-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>
        )}

        {/* Chat input — only shown when done */}
        {isDone && (
          <div
            className={`sticky bottom-4 rounded-2xl border p-3 flex items-center gap-2 ${
              isDark
                ? "bg-black/60 border-white/15 backdrop-blur-xl"
                : "bg-white/90 border-violet-200 backdrop-blur-xl shadow-lg"
            }`}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask anything about your document…"
              className={`flex-1 bg-transparent text-sm outline-none ${
                isDark ? "text-white placeholder:text-white/30" : "text-slate-800 placeholder:text-slate-400"
              }`}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || sending}
              className="p-2 rounded-xl bg-gradient-to-br from-violet-600 to-teal-600 text-white disabled:opacity-40 transition-opacity hover:opacity-90"
            >
              <Send size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
