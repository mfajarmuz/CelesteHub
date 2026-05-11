"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import {
  Search,
  Grid3X3,
  List,
  Sparkles,
  Library,
  Loader2,
} from "lucide-react";

type ApiPRD = {
  id: string;
  title: string;
  content: string;
  status: string;
  updatedAt: string;
  template?: { name: string; category: string } | null;
};

type DashboardPRD = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  updatedAt: string;
  statusColor: string;
};

function IconLibraryBooks({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function IconSchedule({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconMoreVert({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}

function formatRelativeDate(value: string) {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  if (Number.isNaN(diffMs)) return "Recently";
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hrs ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
}

function extractDescription(content: string) {
  try {
    const parsed = JSON.parse(content || "{}");
    const summary = parsed.sections?.find((section: { title?: string }) => section.title === "Executive Summary") || parsed.sections?.[0];
    if (summary?.content) {
      return String(summary.content).replace(/\s+/g, " ").slice(0, 180);
    }
  } catch {}
  return "Dokumen PRD siap diedit dan disempurnakan.";
}

function normalizePRD(prd: ApiPRD): DashboardPRD {
  const status = prd.status || "draft";
  return {
    id: prd.id,
    title: prd.title || "Untitled PRD",
    description: extractDescription(prd.content),
    category: prd.template?.category || "Custom",
    status: status.charAt(0).toUpperCase() + status.slice(1),
    updatedAt: formatRelativeDate(prd.updatedAt),
    statusColor: status === "final" || status === "published" ? "bg-success-green" : "bg-tertiary-fixed-dim",
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [prds, setPrds] = useState<DashboardPRD[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPRDs() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/prds", { cache: "no-store" });
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load PRDs");
        setPrds((data.prds || []).map(normalizePRD));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load PRDs");
      } finally {
        setLoading(false);
      }
    }
    loadPRDs();
  }, [router]);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(prds.map((prd) => prd.category).filter(Boolean)));
    return ["All", ...unique];
  }, [prds]);

  const filteredPRDs = prds.filter((prd) => {
    const matchesSearch = prd.title.toLowerCase().includes(searchQuery.toLowerCase()) || prd.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || prd.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const draftCount = prds.filter((prd) => prd.status.toLowerCase() === "draft").length;

  return (
    <div className="h-screen flex overflow-hidden bg-[var(--color-surface-background)] text-[var(--color-text-primary)] font-body antialiased">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col h-screen overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6 bg-[var(--color-surface-background)]">
          <div className="max-w-[var(--container-max)] mx-auto space-y-6">
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-8 bg-[var(--color-surface-canvas)] border border-[var(--color-border-subtle)] rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <h1 className="heading-headline-lg text-[var(--color-text-primary)]">Good morning, Team.</h1>
                  <p className="text-[var(--color-text-secondary)] text-base leading-relaxed mt-1">
                    You have {draftCount} draft{draftCount === 1 ? "" : "s"} pending review. Ready to build something great?
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <button onClick={() => router.push("/dashboard/new")} className="bg-[var(--color-primary)] text-[var(--color-on-primary)] px-6 py-3 rounded-lg text-xs font-medium uppercase tracking-wider flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer font-mono">
                    <Sparkles className="w-4 h-4" /> Generate PRD
                  </button>
                  <button onClick={() => router.push("/templates")} className="px-6 py-3 rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] text-xs font-medium uppercase tracking-wider hover:bg-[var(--color-surface-container-low)] transition-colors cursor-pointer font-mono">
                    Browse Templates
                  </button>
                </div>
              </div>

              <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
                <div className="bg-[var(--color-surface-canvas)] border border-[var(--color-border-subtle)] rounded-xl p-4 flex items-center justify-between flex-1">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">Total PRDs</div>
                    <div className="text-[36px] leading-none font-extrabold text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-heading)" }}>{prds.length}</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[var(--color-surface-container-low)] flex items-center justify-center text-[var(--color-text-primary)]"><IconLibraryBooks /></div>
                </div>
                <div className="bg-[var(--color-surface-canvas)] border border-[var(--color-border-subtle)] rounded-xl p-4 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-end mb-2">
                    <div className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)]">Credits Left</div>
                    <div className="text-lg leading-tight text-[var(--color-text-primary)]" style={{ fontFamily: "var(--font-heading)", fontWeight: 600 }}>8,450 <span className="text-sm font-normal text-[var(--color-text-secondary)]">/ 10k</span></div>
                  </div>
                  <div className="w-full bg-[var(--color-surface-container-highest)] rounded-full h-1.5 mt-2 overflow-hidden"><div className="bg-[var(--color-ai-accent)] h-1.5 rounded-full" style={{ width: "84%" }} /></div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
                <input placeholder="Search PRDs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--color-border-subtle)] focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] outline-none text-sm text-[var(--color-text-primary)] bg-[var(--color-surface-canvas)] transition-colors" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${activeCategory === cat ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] border border-[var(--color-primary)]" : "bg-[var(--color-surface-container-low)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-outline-variant)]"}`}>{cat}</button>
                ))}
              </div>
              <div className="flex items-center gap-2 border border-[var(--color-border-subtle)] rounded-lg p-1 bg-[var(--color-surface-canvas)]">
                <button onClick={() => setViewMode("grid")} className={`p-1 rounded cursor-pointer transition-colors ${viewMode === "grid" ? "bg-[var(--color-surface-container-low)] text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"}`}><Grid3X3 className="w-5 h-5 block" /></button>
                <button onClick={() => setViewMode("list")} className={`p-1 rounded cursor-pointer transition-colors ${viewMode === "list" ? "bg-[var(--color-surface-container-low)] text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"}`}><List className="w-5 h-5 block" /></button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-[var(--color-text-secondary)]" /></div>
            ) : error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
            ) : filteredPRDs.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-[var(--color-surface-container-low)] flex items-center justify-center mx-auto mb-4"><Search className="w-6 h-6 text-[var(--color-text-secondary)]" /></div>
                <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)] mb-2">No PRDs found</h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-6">{prds.length === 0 ? "Generate your first PRD to get started." : "Try changing your search query or category filter."}</p>
                <button onClick={() => prds.length === 0 ? router.push("/dashboard/new") : (setSearchQuery(""), setActiveCategory("All"))} className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-[var(--color-on-primary)] text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer">
                  {prds.length === 0 ? "Generate PRD" : "Reset Filter"}
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredPRDs.map((prd) => (
                  <div key={prd.id} onClick={() => router.push(`/dashboard/${prd.id}/edit`)} className="bg-[var(--color-surface-canvas)] border border-[var(--color-border-subtle)] rounded-xl p-4 flex flex-col hover:shadow-sm hover:border-[var(--color-outline-variant)] transition-all group cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-[var(--color-surface-container-highest)] px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)]">{prd.category}</div>
                      <button onClick={(e) => e.stopPropagation()} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><IconMoreVert className="w-5 h-5" /></button>
                    </div>
                    <h3 className="font-heading text-base font-semibold text-[var(--color-text-primary)] mb-2 line-clamp-2">{prd.title}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 flex-1 mb-4">{prd.description}</p>
                    <div className="flex justify-between items-center pt-3 border-t border-[var(--color-border-subtle)] mt-auto">
                      <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)] text-xs"><IconSchedule className="w-4 h-4" /><span>{prd.updatedAt}</span></div>
                      <span className="flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)]"><span className={`w-2 h-2 rounded-full ${prd.statusColor}`} /> {prd.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredPRDs.map((prd) => (
                  <div key={prd.id} onClick={() => router.push(`/dashboard/${prd.id}/edit`)} className="bg-[var(--color-surface-canvas)] border border-[var(--color-border-subtle)] rounded-lg p-4 flex items-center gap-4 hover:shadow-sm hover:border-[var(--color-outline-variant)] transition-all group cursor-pointer">
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-container-low)] flex items-center justify-center flex-shrink-0 text-[var(--color-text-secondary)]"><Library className="w-5 h-5" /></div>
                    <div className="flex-1 min-w-0"><h3 className="font-heading text-sm font-semibold text-[var(--color-text-primary)] truncate">{prd.title}</h3><p className="text-sm text-[var(--color-text-secondary)] truncate">{prd.description}</p></div>
                    <div className="hidden sm:flex items-center gap-3"><div className="bg-[var(--color-surface-container-highest)] px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)]">{prd.category}</div><span className="flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)]"><span className={`w-2 h-2 rounded-full ${prd.statusColor}`} /> {prd.status}</span><span className="text-xs text-[var(--color-text-secondary)]">{prd.updatedAt}</span></div>
                    <button onClick={(e) => e.stopPropagation()} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"><IconMoreVert className="w-5 h-5" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
