"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import {
  FileText,
  ArrowLeft,
  Sparkles,
  Save,
  Download,
  Eye,
  EyeOff,
  Code,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Loader2,
  Share2,
  MoreHorizontal,
  FileDown,
  Printer,
  History,
} from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────

interface PRDSection {
  id: string;
  title: string;
  content: string;
  expanded: boolean;
}

interface PRDData {
  id: string;
  title: string;
  content: string;
  status: string;
  language: string;
  updatedAt: string;
  template?: {
    name: string;
    category: string;
  } | null;
}

const DEFAULT_SECTIONS: Omit<PRDSection, "id">[] = [
  { title: "Executive Summary", content: "", expanded: true },
  { title: "Problem Statement", content: "", expanded: true },
  { title: "Goals & Success Metrics", content: "", expanded: false },
  { title: "User Personas", content: "", expanded: false },
  { title: "Feature Requirements", content: "", expanded: true },
  { title: "User Stories", content: "", expanded: false },
  { title: "Technical Requirements", content: "", expanded: false },
  { title: "Design Specifications", content: "", expanded: false },
  { title: "Success Criteria", content: "", expanded: false },
  { title: "Timeline & Milestones", content: "", expanded: false },
  { title: "Risks & Mitigations", content: "", expanded: false },
  { title: "Appendix", content: "", expanded: false },
];

// ─── Section Editor Component ─────────────────────────────

function SectionEditor({
  section,
  onUpdate,
  onDelete,
  onDragStart,
  onDragOver,
  onDrop,
  index,
}: {
  section: PRDSection;
  onUpdate: (id: string, updates: Partial<PRDSection>) => void;
  onDelete: (id: string) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  index: number;
}) {
  return (
    <div
      className="border border-[var(--color-border-subtle)] rounded-xl bg-[var(--color-surface-canvas)] overflow-hidden transition-all hover:shadow-sm group"
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
    >
      {/* Section Header */}
      <button
        onClick={() =>
          onUpdate(section.id, { expanded: !section.expanded })
        }
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--color-surface-container-low)] transition-colors cursor-pointer"
      >
        <div className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-text-secondary)]">
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="flex-1 flex items-center gap-2">
          {section.expanded ? (
            <ChevronDown className="w-4 h-4 text-[var(--color-text-secondary)]" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[var(--color-text-secondary)]" />
          )}
          <span className="font-heading text-sm font-semibold text-[var(--color-text-primary)]">
            {section.title}
          </span>
          {!section.content.trim() && (
            <Badge variant="warning" className="text-[10px] px-1.5 py-0">
              Kosong
            </Badge>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(section.id);
          }}
          className="p-1 rounded-md hover:bg-[var(--color-error-container)] text-[var(--color-text-secondary)] hover:text-[var(--color-error)] opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </button>

      {/* Section Content */}
      {section.expanded && (
        <div className="px-4 pb-4 border-t border-[var(--color-border-subtle)]">
          <Textarea
            placeholder={`Tulis konten untuk ${section.title}...`}
            value={section.content}
            onChange={(e) =>
              onUpdate(section.id, { content: e.target.value })
            }
            className="border-0 focus:ring-0 mt-3 min-h-[100px] resize-y bg-transparent p-0 text-sm leading-relaxed"
          />
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[var(--color-border-subtle)]">
            <button className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-ai-accent-text)] transition-colors px-2 py-1 rounded-md hover:bg-[var(--color-ai-accent-bg)] cursor-pointer">
              <Sparkles className="w-3 h-3" /> AI Suggest
            </button>
            <button className="inline-flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors px-2 py-1 rounded-md hover:bg-[var(--color-surface-container-low)] cursor-pointer">
              <Code className="w-3 h-3" /> Markdown
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── AI Assist Panel ──────────────────────────────────────

function AIAssistPanel({
  onClose,
  onApplySuggestion,
}: {
  onClose: () => void;
  onApplySuggestion: (text: string) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setLoading(true);

    // Simulate AI generation - in production, call AI API
    setTimeout(() => {
      setSuggestions([
        `Berdasarkan permintaan "${prompt}", berikut adalah draft yang disarankan:\n\n**[Fitur]** Penjelasan detail tentang fitur yang diminta mencakup:\n- Poin utama 1 dengan deskripsi singkat\n- Poin utama 2 dengan detail teknis\n- Poin utama 3 dengan pertimbangan UX\n\n**[Justifikasi]** Fitur ini penting karena menjawab kebutuhan pengguna akan...`,
        `Saran alternatif:\n\nFitur ini dapat diimplementasikan dengan pendekatan:\n1. Tahap 1: MVP dengan fungsionalitas dasar\n2. Tahap 2: Optimasi performa dan skalabilitas\n3. Tahap 3: Fitur lanjutan berdasarkan feedback user`,
      ]);
      setLoading(false);
    }, 1500);
  }

  return (
    <div className="w-80 border-l border-[var(--color-border-subtle)] bg-[var(--color-surface-canvas)] flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--color-ai-accent)]" />
          <span className="font-heading text-sm font-semibold text-[var(--color-text-primary)]">
            AI Assist
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-[var(--color-surface-container-high)] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 text-[var(--color-text-secondary)]" />
        </button>
      </div>

      {/* Input */}
      <div className="p-4 border-b border-[var(--color-border-subtle)]">
        <Textarea
          placeholder="Minta AI menulis konten untuk section tertentu..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[80px] text-sm"
        />
        <Button
          size="sm"
          className="w-full mt-2 gap-1.5"
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
          loading={loading}
        >
          {loading ? "Menulis..." : "Generate"}
        </Button>
      </div>

      {/* Suggestions */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {suggestions.length === 0 && !loading && (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-[var(--color-ai-accent-bg)] flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-5 h-5 text-[var(--color-ai-accent-text)]" />
            </div>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Tulis prompt di atas untuk meminta AI menulis konten PRD.
            </p>
          </div>
        )}

        {suggestions.map((text, i) => (
          <div
            key={i}
            className="p-3 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-container-low)]"
          >
            <p className="text-xs text-[var(--color-text-primary)] whitespace-pre-wrap mb-3 leading-relaxed">
              {text}
            </p>
            <Button
              size="sm"
              variant="secondary"
              className="w-full gap-1.5"
              onClick={() => onApplySuggestion(text)}
            >
              <Check className="w-3 h-3" /> Apply ke Section
            </Button>
          </div>
        ))}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-[var(--color-ai-accent)]" />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Export Modal ─────────────────────────────────────────

function ExportModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const exportOptions = [
    { label: "PDF Document", icon: FileDown, desc: "Formatted PDF with all sections" },
    { label: "DOCX Document", icon: FileDown, desc: "Editable Word document" },
    { label: "Markdown", icon: Code, desc: "Raw markdown text file" },
    { label: "Print", icon: Printer, desc: "Send to printer directly" },
  ];

  return (
    <Modal open={open} onClose={onClose} title="Export PRD" size="md">
      <div className="space-y-2">
        {exportOptions.map((opt) => (
          <button
            key={opt.label}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-[var(--color-border-subtle)] hover:border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container-low)] transition-all cursor-pointer text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-container-low)] flex items-center justify-center flex-shrink-0">
              <opt.icon className="w-5 h-5 text-[var(--color-text-primary)]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--color-text-primary)]">
                {opt.label}
              </div>
              <div className="text-xs text-[var(--color-text-secondary)]">
                {opt.desc}
              </div>
            </div>
          </button>
        ))}
      </div>
    </Modal>
  );
}

// ─── Status Badge Color ───────────────────────────────────

const statusColors: Record<string, "warning" | "success" | "secondary" | "default"> = {
  draft: "warning",
  review: "secondary",
  final: "success",
};

// ─── Main Editor Page ─────────────────────────────────────

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [prd, setPRD] = useState<PRDData | null>(null);
  const [sections, setSections] = useState<PRDSection[]>([]);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);

  // Load PRD data
  useEffect(() => {
    async function loadPRD() {
      try {
        const res = await fetch(`/api/prds/${id}`);
        const data = await res.json();
        if (data.prd) {
          setPRD(data.prd);
          setTitle(data.prd.title);
          // Parse content or use defaults
          let parsedSections = DEFAULT_SECTIONS.map((s) => ({
            ...s,
            id: crypto.randomUUID(),
          }));
          try {
            const content = JSON.parse(data.prd.content || "{}");
            if (content.sections && content.sections.length > 0) {
              parsedSections = content.sections.map((s: any) => ({
                ...s,
                id: s.id || crypto.randomUUID(),
                expanded: true,
              }));
            }
          } catch {}
          setSections(parsedSections);
        }
      } catch (err) {
        console.error("Failed to load PRD:", err);
      } finally {
        setLoading(false);
      }
    }
    loadPRD();
  }, [id]);

  // Auto-save
  const autoSave = useCallback(async () => {
    if (!title.trim()) return;
    setSaving(true);
    try {
      const content = JSON.stringify({ sections });
      const res = await fetch(`/api/prds/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (res.ok) {
        setLastSaved(new Date());
      }
    } catch (err) {
      console.error("Auto-save failed:", err);
    } finally {
      setSaving(false);
    }
  }, [id, title, sections]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [autoSave]);

  function updateSection(id: string, updates: Partial<PRDSection>) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  }

  function deleteSection(id: string) {
    setSections((prev) => prev.filter((s) => s.id !== id));
  }

  function addSection() {
    const newSection: PRDSection = {
      id: crypto.randomUUID(),
      title: `Section ${sections.length + 1}`,
      content: "",
      expanded: true,
    };
    setSections((prev) => [...prev, newSection]);
  }

  function applySuggestion(text: string) {
    // Apply AI suggestion to the first section that's empty or to the current expanded section
    const target = sections.find(
      (s) => s.expanded
    );
    if (target) {
      updateSection(target.id, {
        content: target.content
          ? target.content + "\n\n" + text
          : text,
      });
    }
  }

  // ─── Drag & Drop ──────────────────────────────────────
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function handleDragStart(e: React.DragEvent, index: number) {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDrop(e: React.DragEvent, dropIndex: number) {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) return;
    const newSections = [...sections];
    const [moved] = newSections.splice(dragIndex, 1);
    newSections.splice(dropIndex, 0, moved);
    setSections(newSections);
    setDragIndex(null);
  }

  async function handleStatusChange(newStatus: string) {
    setStatusMenuOpen(false);
    try {
      const res = await fetch(`/api/prds/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setPRD((prev) => (prev ? { ...prev, status: newStatus } : prev));
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-surface-background)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-text-secondary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-background)] flex flex-col">
      {/* ── Top Bar ── */}
      <header className="bg-[var(--color-surface-canvas)] border-b border-[var(--color-border-subtle)] px-4 py-2 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-1.5 rounded-lg hover:bg-[var(--color-surface-container-high)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[var(--color-text-secondary)]" />
          </Link>
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
            <FileText className="w-4 h-4 text-[var(--color-on-primary)]" />
          </div>
          <span className="font-heading text-base font-bold text-[var(--color-text-primary)] hidden sm:inline">
            PRD Editor
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Status badge */}
          <div className="relative">
            <button
              onClick={() => setStatusMenuOpen(!statusMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-[var(--color-surface-container-high)] transition-colors cursor-pointer"
            >
              <Badge variant={statusColors[prd?.status || "draft"] || "default"}>
                {(prd?.status || "draft").charAt(0).toUpperCase() + (prd?.status || "draft").slice(1)}
              </Badge>
              <ChevronDown className="w-3 h-3 text-[var(--color-text-secondary)]" />
            </button>

            {statusMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setStatusMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-20 w-36 bg-[var(--color-surface-canvas)] border border-[var(--color-border-subtle)] rounded-xl shadow-lg py-1 overflow-hidden">
                  {["draft", "review", "final"].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-[var(--color-surface-container-low)] transition-colors flex items-center gap-2 cursor-pointer ${
                        prd?.status === s
                          ? "text-[var(--color-text-primary)] font-semibold"
                          : "text-[var(--color-text-secondary)]"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          s === "draft"
                            ? "bg-[var(--color-badge-draft-text)]"
                            : s === "review"
                              ? "bg-[var(--color-secondary)]"
                              : "bg-[var(--color-success-green)]"
                        }`}
                      />
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="h-6 w-px bg-[var(--color-border-subtle)] mx-1" />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAiPanelOpen(!aiPanelOpen)}
            className={`gap-1.5 ${aiPanelOpen ? "text-[var(--color-ai-accent)]" : ""}`}
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">AI Assist</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExportModalOpen(true)}
            className="gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>

          <Button size="sm" onClick={autoSave} loading={saving} className="gap-1.5">
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">
              {saving ? "Menyimpan..." : "Simpan"}
            </span>
          </Button>

          <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)] flex items-center justify-center text-white text-xs font-bold ml-1">
            U
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="container-editor space-y-6">
            {/* Save indicator */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {prd?.template && (
                  <Badge variant="default">{prd.template.category}</Badge>
                )}
                <Badge
                  variant={
                    prd?.language === "id" ? "default" : "secondary"
                  }
                >
                  {prd?.language === "id" ? "ID" : "EN"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                {lastSaved && (
                  <>
                    <Check className="w-3 h-3 text-[var(--color-success-green)]" />
                    Tersimpan {lastSaved.toLocaleTimeString("id-ID")}
                  </>
                )}
              </div>
            </div>

            {/* Title */}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Judul PRD..."
              className="w-full text-3xl font-heading font-bold text-[var(--color-text-primary)] bg-transparent border-none outline-none placeholder:text-[var(--color-border-subtle)]"
            />

            {/* Sections */}
            <div className="space-y-3">
              {sections.map((section, idx) => (
                <SectionEditor
                  key={section.id}
                  section={section}
                  index={idx}
                  onUpdate={updateSection}
                  onDelete={deleteSection}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                />
              ))}
            </div>

            {/* Add Section */}
            <button
              onClick={addSection}
              className="w-full py-4 rounded-xl border-2 border-dashed border-[var(--color-border-subtle)] hover:border-[var(--color-outline-variant)] hover:bg-[var(--color-surface-container-low)] transition-all flex items-center justify-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Tambah Section
            </button>
          </div>
        </div>

        {/* AI Assist Panel */}
        {aiPanelOpen && (
          <AIAssistPanel
            onClose={() => setAiPanelOpen(false)}
            onApplySuggestion={applySuggestion}
          />
        )}
      </div>

      {/* Export Modal */}
      <ExportModal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />
    </div>
  );
}
