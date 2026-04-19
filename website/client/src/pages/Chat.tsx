import { useState, useRef, useEffect, useCallback } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Streamdown } from "streamdown";
import { Link, useSearch } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Sun,
  Moon,
  ArrowLeft,
  Image as ImageIcon,
  Loader2,
  BookOpen,
  X,
} from "lucide-react";

const SUGGESTED_PROMPTS = [
  "How to record a string quartet?",
  "How to record piano solo?",
  "How to record opera singers?",
  "What is the Decca Tree?",
  "How to set up spot microphones for orchestra?",
  "What microphones are recommended for solo violin?",
  "How does room acoustics affect recording quality?",
  "What is the difference between XY and ORTF techniques?",
];

interface VisualAsset {
  pageNumber: number;
  imageUrl: string;
  description: string;
  caption: string;
  section: string;
  visualType: string;
  spatialRelationships: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Array<{ page: number; section: string; type: string }>;
  visualAssets?: VisualAsset[];
  isComplex?: boolean;
  imageExplanation?: string | null;
}

export default function Chat() {
  const { theme, toggleTheme } = useTheme();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialQuery = params.get("q") || "";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [generatingImageFor, setGeneratingImageFor] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const hasSentInitial = useRef(false);

  const chatMutation = trpc.chat.send.useMutation();
  const imageGenMutation = trpc.chat.generateImageExplanation.useMutation();

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: text.trim(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);

      try {
        const history = messages.map((m) => ({
          role: m.role,
          content: m.content,
        }));

        const result = await chatMutation.mutateAsync({
          message: text.trim(),
          history,
        });

        const assistantMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: result.answer,
          citations: (result.citations as unknown) as Array<{ page: number; section: string; type: string }>,
          visualAssets: (result.relevantAssets as unknown as VisualAsset[]),
          isComplex: result.isComplex,
        };

        setMessages((prev) => [...prev, assistantMsg]);
      } catch (err) {
        const errorMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I encountered an error processing your question. Please try again.",
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, messages, chatMutation]
  );

  // Handle initial query from URL
  useEffect(() => {
    if (initialQuery && !hasSentInitial.current) {
      hasSentInitial.current = true;
      sendMessage(initialQuery);
    }
  }, [initialQuery, sendMessage]);

  const handleImageExplanation = async (msg: ChatMessage) => {
    setGeneratingImageFor(msg.id);
    try {
      const userQuestion =
        messages.find(
          (m, i) =>
            m.role === "user" &&
            messages[i + 1]?.id === msg.id
        )?.content || "classical recording technique";

      const result = await imageGenMutation.mutateAsync({
        answerText: msg.content,
      });

      if (result.imageUrl) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msg.id ? { ...m, imageExplanation: result.imageUrl } : m
          )
        );
      }
    } catch {
      // Silently fail
    } finally {
      setGeneratingImageFor(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-border bg-card/80 backdrop-blur-md px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <Link href="/">
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
              <ArrowLeft size={18} />
            </button>
          </Link>
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              The Decca Oracle
            </h1>
            <p className="text-xs text-muted-foreground">
              AI-powered classical recording assistant
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/glossary">
            <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
              <BookOpen size={18} />
            </button>
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Empty state with suggested prompts */}
          {messages.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center"
            >
              <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center mb-6">
                <BookOpen className="text-white" size={28} />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Ask The Decca Oracle
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                Ask any question about classical recording techniques,
                microphone placement, or studio setup. Answers are grounded in
                445 pages of expert knowledge.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {SUGGESTED_PROMPTS.slice(0, 6).map((prompt, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                    onClick={() => sendMessage(prompt)}
                    className="text-left px-4 py-3 rounded-xl border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all text-sm text-foreground group"
                  >
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                      {prompt}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Chat messages */}
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-5 py-3"
                      : "bg-card border border-border rounded-2xl rounded-bl-md px-5 py-4"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <Streamdown>{msg.content}</Streamdown>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  )}

                  {/* Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-2 font-medium">
                        Sources
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.citations.slice(0, 8).map((c, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              const query = c.section || `page ${c.page}`;
                              setInput(`Tell me more about what's on page ${c.page}: ${c.section}`);
                              inputRef.current?.focus();
                            }}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/40 transition-colors cursor-pointer"
                            title={`${c.section} — Click to explore page ${c.page}`}
                          >
                            p. {c.page}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Visual Assets */}
                  {msg.visualAssets && msg.visualAssets.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border/50">
                      <p className="text-xs text-muted-foreground mb-3 font-medium">
                        Related Diagrams from the Book
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {msg.visualAssets.map((asset, i) => (
                          <button
                            key={i}
                            onClick={() => setExpandedImage(asset.imageUrl)}
                            className="group rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all bg-background text-left"
                          >
                            <div className="aspect-[4/3] overflow-hidden bg-muted">
                              <img
                                src={asset.imageUrl}
                                alt={asset.caption || asset.description}
                                className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                              />
                            </div>
                            <div className="p-2.5">
                              <p className="text-xs font-medium text-foreground truncate">
                                Page {asset.pageNumber} — {asset.section}
                              </p>
                              {asset.caption && (
                                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                  {asset.caption}
                                </p>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Image Explanation button — only for complex answers */}
                  {msg.role === "assistant" && msg.isComplex && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      {msg.imageExplanation ? (
                        <div>
                          <p className="text-xs text-muted-foreground mb-2 font-medium">
                            Visual Explanation
                          </p>
                          <button
                            onClick={() =>
                              setExpandedImage(msg.imageExplanation!)
                            }
                            className="rounded-xl overflow-hidden border border-border hover:border-primary/40 transition-all"
                          >
                            <img
                              src={msg.imageExplanation}
                              alt="AI-generated visual explanation"
                              className="w-full max-w-md rounded-xl"
                            />
                          </button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleImageExplanation(msg)}
                          disabled={generatingImageFor === msg.id}
                          className="text-xs rounded-full"
                        >
                          {generatingImageFor === msg.id ? (
                            <>
                              <Loader2
                                className="mr-1.5 animate-spin"
                                size={14}
                              />
                              Generating visual...
                            </>
                          ) : (
                            <>
                              <ImageIcon className="mr-1.5" size={14} />
                              Turn into image explanation
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-5 py-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary/60 typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-primary/60 typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-primary/60 typing-dot" />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="flex-shrink-0 border-t border-border bg-card/80 backdrop-blur-md px-4 py-4">
        <div className="max-w-3xl mx-auto">
          {/* Quick suggested prompts when there are messages */}
          {messages.length > 0 && messages.length < 4 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {SUGGESTED_PROMPTS.slice(0, 3)
                .filter(
                  (p) =>
                    !messages.some(
                      (m) => m.role === "user" && m.content === p
                    )
                )
                .map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(prompt)}
                    className="text-xs px-3 py-1.5 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                  >
                    {prompt}
                  </button>
                ))}
            </div>
          )}

          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about classical recording techniques..."
                rows={1}
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                style={{ minHeight: "44px", maxHeight: "120px" }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  target.style.height = Math.min(target.scrollHeight, 120) + "px";
                }}
              />
            </div>
            <Button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="rounded-xl h-11 w-11 bg-primary hover:bg-primary/90 shrink-0"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Send size={18} />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Expanded image modal */}
      <AnimatePresence>
        {expandedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setExpandedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setExpandedImage(null)}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              <img
                src={expandedImage}
                alt="Expanded diagram"
                className="w-full h-full object-contain rounded-xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
