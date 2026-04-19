import { useState, useMemo } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sun,
  Moon,
  Search,
  BookOpen,
  MessageCircle,
} from "lucide-react";
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Glossary() {
  const { theme, toggleTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const { data: rawData, isLoading } = trpc.knowledge.glossary.useQuery();
  const entries = (rawData as unknown as Array<{
    term: string;
    definition: string;
    category?: string;
    supporting_pages?: string;
  }>) ?? [];

  const categories = useMemo(() => {
    const cats = new Set(entries.map((e) => e.category).filter(Boolean));
    return Array.from(cats as Set<string>).sort();
  }, [entries]);

  const filteredEntries = useMemo(() => {
    let result = [...entries];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) => e.term.toLowerCase().includes(q) || e.definition.toLowerCase().includes(q)
      );
    }
    if (selectedCategory) {
      result = result.filter((e) => e.category === selectedCategory);
    }
    if (selectedLetter) {
      result = result.filter((e) => e.term.toUpperCase().startsWith(selectedLetter));
    }
    return result.sort((a, b) => a.term.localeCompare(b.term));
  }, [entries, search, selectedCategory, selectedLetter]);

  const groupedEntries = useMemo(() => {
    const groups: Record<string, typeof filteredEntries> = {};
    for (const entry of filteredEntries) {
      const letter = entry.term[0]?.toUpperCase() || "#";
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(entry);
    }
    return groups;
  }, [filteredEntries]);

  const categoryColors: Record<string, string> = {
    Microphone: "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/20",
    Equipment: "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/20",
    Technique: "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/20",
    Acoustics: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/20",
    default: "bg-gray-500/15 text-gray-700 dark:text-gray-300 border-gray-500/20",
  };

  const getCategoryColor = (cat: string) => {
    for (const [key, val] of Object.entries(categoryColors)) {
      if (cat.toLowerCase().includes(key.toLowerCase())) return val;
    }
    return categoryColors.default;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/80 backdrop-blur-md px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/">
              <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                <ArrowLeft size={18} />
              </button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-foreground">
                Glossary
              </h1>
              <p className="text-xs text-muted-foreground">
                {entries.length} terms from the Decca tradition
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/chat">
              <button className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                <MessageCircle size={18} />
              </button>
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="relative mb-6">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search glossary terms..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all text-sm"
          />
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              !selectedCategory
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/30"
            }`}
          >
            All
          </button>
          {categories.map((cat: string) => (
            <button
              key={cat}
              onClick={() =>
                setSelectedCategory(selectedCategory === cat ? null : cat)
              }
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground border-primary"
                  : `${getCategoryColor(cat)} hover:opacity-80`
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Alphabet navigation */}
        <div className="flex flex-wrap gap-1 mb-8">
          <button
            onClick={() => setSelectedLetter(null)}
            className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
              !selectedLetter
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-secondary"
            }`}
          >
            All
          </button>
          {ALPHABET.map((letter) => (
            <button
              key={letter}
              onClick={() =>
                setSelectedLetter(selectedLetter === letter ? null : letter)
              }
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                selectedLetter === letter
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Entries */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="mx-auto mb-4 text-muted-foreground" size={40} />
            <p className="text-muted-foreground">No terms found</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedEntries).map(([letter, terms]) => (
              <motion.div
                key={letter}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-2xl font-bold text-primary mb-4">
                  {letter}
                </h3>
                <div className="space-y-3">
                  {terms.map((entry: { term: string; definition: string; category?: string; supporting_pages?: string }, i: number) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-foreground">
                              {entry.term}
                            </h4>
                            {entry.category && (
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getCategoryColor(entry.category)}`}
                              >
                                {entry.category}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {entry.definition}
                          </p>
                          {entry.supporting_pages && (
                            <p className="text-xs text-primary/70 mt-2">
                              Pages: {entry.supporting_pages}
                            </p>
                          )}
                        </div>
                        <Link href={`/chat?q=${encodeURIComponent(`What is ${entry.term}?`)}`}>
                          <button className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors shrink-0">
                            Ask AI
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
