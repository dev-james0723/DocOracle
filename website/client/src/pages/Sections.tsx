import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Sun,
  Moon,
  ChevronRight,
  MessageCircle,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Sections() {
  const { theme, toggleTheme } = useTheme();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  type SectionItem = {
    section_id: string;
    title: string;
    level: number;
    parent?: string;
    page_range: number[];
    summary?: string;
    key_concepts?: string[];
  };
  const { data: rawSections, isLoading } = trpc.knowledge.sections.useQuery();
  const sections: SectionItem[] = (rawSections as unknown as SectionItem[]) ?? [];

  // Build hierarchy: top-level sections with children
  const topLevel = sections.filter((s: SectionItem) => s.level <= 1 || !sections.some((p: SectionItem) => p.section_id === s.parent));
  const getChildren = (parentId: string) =>
    sections.filter((s: SectionItem) => s.parent === parentId);

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
                Book Structure
              </h1>
              <p className="text-xs text-muted-foreground">
                Classical Recording: A Practical Guide in the Decca Tradition
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
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {topLevel.map((section: SectionItem, i: number) => {
              const children = getChildren(section.section_id);
              const isExpanded = expandedSection === section.section_id;

              return (
                <motion.div
                  key={section.section_id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <button
                    onClick={() =>
                      setExpandedSection(isExpanded ? null : section.section_id)
                    }
                    className="w-full text-left p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-mono text-primary/70 bg-primary/10 px-2 py-0.5 rounded">
                            pp. {section.page_range[0]}–{section.page_range[1]}
                          </span>
                          <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                            {section.title}
                          </h3>
                        </div>
                        {section.summary && (
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                            {section.summary}
                          </p>
                        )}
                        {section.key_concepts &&
                          section.key_concepts.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-3">
                              {section.key_concepts!.slice(0, 5).map((c: string, j: number) => (
                                <span
                                  key={j}
                                  className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-accent/10 text-accent border border-accent/20"
                                >
                                  {c}
                                </span>
                              ))}
                            </div>
                          )}
                      </div>
                      <ChevronRight
                        size={18}
                        className={`text-muted-foreground transition-transform shrink-0 mt-1 ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Children */}
                  {isExpanded && children.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="ml-6 mt-2 space-y-2 border-l-2 border-primary/20 pl-4"
                    >
                      {children.map((child: SectionItem) => (
                        <div
                          key={child.section_id}
                          className="p-4 rounded-lg bg-card/50 border border-border/50 hover:border-primary/20 transition-all"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-mono text-muted-foreground">
                                  pp. {child.page_range[0]}–
                                  {child.page_range[1]}
                                </span>
                                <h4 className="text-sm font-medium text-foreground">
                                  {child.title}
                                </h4>
                              </div>
                              {child.summary && (
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {child.summary}
                                </p>
                              )}
                            </div>
                            <Link
                              href={`/chat?q=${encodeURIComponent(`Tell me about ${child.title}`)}`}
                            >
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs rounded-full shrink-0"
                              >
                                Ask AI
                              </Button>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {/* Ask AI for this section */}
                  {isExpanded && (
                    <div className="ml-6 mt-2 pl-4">
                      <Link
                        href={`/chat?q=${encodeURIComponent(`Summarize the section on ${section.title}`)}`}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs rounded-full"
                        >
                          <BookOpen className="mr-1.5" size={12} />
                          Ask AI about this section
                        </Button>
                      </Link>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
