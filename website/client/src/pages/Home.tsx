import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  MessageCircle,
  BookOpen,
  List,
  Sun,
  Moon,
  Mic,
  Music,
  Headphones,
  Zap,
} from "lucide-react";

const SUGGESTED_PROMPTS = [
  "How to record a string quartet?",
  "How to record piano solo?",
  "How to record opera singers?",
  "What is the Decca Tree?",
  "How to set up spot microphones for orchestra?",
];

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Hero section with immersive gradient */}
      <section className="gradient-hero min-h-screen flex flex-col relative">
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-[15%] w-64 h-64 rounded-full bg-white/5 blur-3xl glow-pulse" />
          <div className="absolute bottom-32 left-[10%] w-96 h-96 rounded-full bg-white/3 blur-3xl glow-pulse" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-[40%] right-[5%] w-48 h-48 rounded-full bg-teal-400/10 blur-2xl glow-pulse" style={{ animationDelay: "0.8s" }} />
        </div>

        {/* Top-right delicate subtitle */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute top-8 left-8 text-white/60 text-sm tracking-[0.3em] uppercase font-light"
        >
          Classical Recording Knowledge Base
        </motion.div>

        {/* Main content — anchored bottom-left */}
        <div className="flex-1 flex flex-col justify-end px-8 pb-24 md:px-16 lg:px-24 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-6">
              The Decca
              <br />
              <span className="bg-gradient-to-r from-white via-teal-200 to-teal-300 bg-clip-text text-transparent">
                Oracle
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-white/70 text-lg md:text-xl max-w-xl mb-10 font-light leading-relaxed"
          >
            An AI-powered guide to classical recording techniques, drawn from
            445 pages of expert knowledge in the Decca tradition. Ask anything
            about microphone placement, studio setup, and orchestral recording.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-wrap gap-3 mb-12"
          >
            <Link href="/chat">
              <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-white/90 font-semibold px-8 py-6 text-base rounded-full shadow-lg shadow-white/10"
              >
                <MessageCircle className="mr-2" size={20} />
                Start Asking
              </Button>
            </Link>
            <Link href="/glossary">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-medium px-8 py-6 text-base rounded-full"
              >
                <BookOpen className="mr-2" size={20} />
                Glossary
              </Button>
            </Link>
            <Link href="/sections">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-medium px-8 py-6 text-base rounded-full"
              >
                <List className="mr-2" size={20} />
                Book Structure
              </Button>
            </Link>
            <Link href="/doc-oracle">
              <Button
                size="lg"
                variant="outline"
                className="border-teal-400/40 text-teal-300 hover:bg-teal-400/10 font-medium px-8 py-6 text-base rounded-full"
              >
                <Zap className="mr-2" size={20} />
                Try with Your PDF
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Suggested prompts preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="px-8 md:px-16 lg:px-24 pb-12"
        >
          <p className="text-white/40 text-xs uppercase tracking-[0.2em] mb-4">
            Try asking
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <Link key={i} href={`/chat?q=${encodeURIComponent(prompt)}`}>
                <button className="px-4 py-2 rounded-full text-sm text-white/70 border border-white/15 hover:border-white/30 hover:text-white hover:bg-white/5 transition-all backdrop-blur-sm">
                  {prompt}
                </button>
              </Link>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features section */}
      <section className="py-24 px-8 md:px-16 lg:px-24 bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-16 text-foreground"
          >
            Powered by Expert Knowledge
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Mic className="text-primary" size={28} />,
                title: "251 Visual Assets",
                desc: "Microphone placement diagrams, studio layouts, and setup sheets — all searchable and displayed alongside AI answers.",
              },
              {
                icon: <Music className="text-accent" size={28} />,
                title: "445 Pages Indexed",
                desc: "Every page analyzed with AI vision, capturing spatial relationships, equipment details, and recording techniques.",
              },
              {
                icon: <Headphones className="text-primary" size={28} />,
                title: "Citation-Grounded AI",
                desc: "Every answer includes page-level citations from the book. No hallucination — only evidence-based responses.",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group"
              >
                <div className="mb-4 p-3 rounded-xl bg-primary/10 w-fit group-hover:bg-primary/15 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-8 border-t border-border bg-background">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            The Decca Oracle — Knowledge from "Classical Recording: A Practical
            Guide in the Decca Tradition"
          </p>
          <div className="flex gap-6">
            <Link
              href="/chat"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Chat
            </Link>
            <Link
              href="/glossary"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Glossary
            </Link>
            <Link
              href="/sections"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sections
            </Link>
            <Link
              href="/doc-oracle"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              DocOracle
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
