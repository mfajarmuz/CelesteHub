"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Sparkles,
  Check,
  X,
  Loader2,
  Download,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  Image,
  ChevronDown,
  Send,
  Plus,
  MessageSquare,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────

interface PRDSection {
  id: string;
  title: string;
  content: string;
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
  { title: "Executive Summary", content: "The objective of this project is to integrate a robust, multi-currency payment gateway into our core SaaS platform. This will enable frictionless checkout experiences for international users, directly addressing the 22% drop-off rate observed in the APAC region due to unsupported local payment methods.\n\nBy implementing this solution, we project an increase in successful conversions by 15% within the first quarter post-launch, alongside a reduction in manual reconciliation efforts for the finance team." },
  { title: "Problem Statement", content: "Currently, our checkout process only supports major US credit cards and PayPal. Users from Southeast Asia and Europe frequently abandon their carts at the final step when their preferred local payment methods (e.g., GrabPay, iDEAL, SEPA) are unavailable. Furthermore, the lack of localized currency display creates trust friction, forcing users to manually calculate exchange rates before committing to an annual subscription." },
  { title: "Target Audience", content: "" },
  { title: "User Stories", content: "" },
  { title: "Non-Functional Requirements", content: "" },
];

// ─── Section Content Component ────────────────────────────

function SectionContent({
  section,
  isActive,
  onSelect,
  onUpdate,
  onTitleUpdate,
}: {
  section: PRDSection;
  isActive: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
  onTitleUpdate: (id: string, title: string) => void;
}) {
  return (
    <section
      id={`section-${section.id}`}
      className={`relative group mb-6 pb-3 border-b transition-colors ${
        isActive
          ? "border-[var(--color-secondary)]/40"
          : "border-transparent hover:border-[var(--color-surface-container)]"
      }`}
      onClick={() => onSelect(section.id)}
    >
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-6 bg-[var(--color-secondary)] rounded-full flex-shrink-0" />
        <h2
          contentEditable
          suppressContentEditableWarning
          className="font-heading text-[24px] font-semibold text-[var(--color-text-primary)] outline-none flex-1"
          onFocus={() => onSelect(section.id)}
          onBlur={(e) => {
            const nextTitle = e.currentTarget.innerText.trim();
            if (nextTitle && nextTitle !== section.title) {
              onTitleUpdate(section.id, nextTitle);
            }
          }}
        >
          {section.title}
        </h2>
      </div>

      {/* Section Body */}
      <div
        contentEditable
        suppressContentEditableWarning
        className="text-sm text-[var(--color-text-secondary)] leading-relaxed outline-none min-h-[40px]"
        onFocus={() => onSelect(section.id)}
        onBlur={(e) => {
          const text = e.currentTarget.innerText;
          if (text.trim() !== section.content.trim()) {
            onUpdate(section.id, text);
          }
        }}
        dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, "<br/>") }}
      />

      {/* Floating AI Action */}
      <div className="absolute -right-4 -top-4 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0" contentEditable="false">
        <button
          onClick={() => onSelect(section.id)}
          className="bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-ai-accent)] text-white px-3 py-1.5 rounded-full text-[13px] font-medium flex items-center gap-1.5 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          Regenerate with AI
        </button>
      </div>
    </section>
  );
}

// ─── AI Co-pilot Panel ────────────────────────────────────

interface ChatMessage {
  role: "assistant" | "user";
  text: string;
}

function AICopilotPanel({
  onClose,
  documentTitle,
  sections,
  activeSection,
  onApplyToCurrentSection,
}: {
  onClose: () => void;
  documentTitle: string;
  sections: PRDSection[];
  activeSection: PRDSection | null;
  onApplyToCurrentSection: (content: string) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "I've generated the initial draft based on your outline. Select any paragraph in the editor to refine it, or ask me to expand on specific sections like \"User Acceptance Criteria\".",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggestedActions = [
    { icon: Plus, text: "Add technical requirements for the API integration" },
    { icon: MessageSquare, text: "Make the Problem Statement more concise" },
  ];

  const lastAssistantMessage = [...messages].reverse().find((msg) => msg.role === "assistant");

  async function sendPrompt(promptText: string) {
    if (!promptText.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: promptText }]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          documentTitle,
          sections: sections.map((section) => ({
            title: section.title,
            content: section.content,
          })),
          activeSection: activeSection?.title || "",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to get AI response");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.message,
        },
      ]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Gagal menghubungi AI co-pilot.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  function handleSend() {
    void sendPrompt(input);
  }

  return (
    <aside className="w-[320px] border-l border-[var(--color-border-subtle)]/50 bg-[var(--color-surface-canvas)]/70 backdrop-blur-[12px] flex flex-col shrink-0 relative z-20 shadow-[-4px_0_15px_rgba(0,0,0,0.02)]">
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-[var(--color-border-subtle)]/50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--color-ai-accent)]" />
          <h3 className="font-heading text-[16px] font-semibold text-[var(--color-text-primary)]">
            AI Co-pilot
          </h3>
        </div>
        <button
          onClick={onClose}
          className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors p-1 rounded hover:bg-[var(--color-surface-container-low)] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[var(--color-surface-container-lowest)]/50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col gap-1 max-w-[90%] ${
              msg.role === "user" ? "self-end items-end" : "items-start"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 rounded-full bg-[var(--color-ai-accent)]/10 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--color-ai-accent)]" />
                </div>
                <span className="label-caps text-[10px] text-[var(--color-text-secondary)]">
                  PRD.ai Assistant
                </span>
              </div>
            )}
            <div
              className={`p-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "assistant"
                  ? "bg-[var(--color-surface-container-lowest)] border border-[var(--color-border-subtle)] rounded-tl-sm text-[var(--color-text-primary)]"
                  : "bg-[var(--color-primary)] text-[var(--color-on-primary)] rounded-tr-sm"
              }`}
              dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, "<br/>") }}
            />
          </div>
        ))}

        {/* Suggested Actions */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center gap-2 text-[13px] text-[var(--color-text-secondary)]">
            <Loader2 className="w-4 h-4 animate-spin" />
            AI sedang menyiapkan jawaban...
          </div>
        )}

        {messages.length === 1 && (
          <div className="grid grid-cols-1 gap-2 mt-2">
            {suggestedActions.map((action, i) => (
              <button
                key={i}
                onClick={() => {
                  void sendPrompt(action.text);
                }}
                className="text-left p-2.5 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-surface-container-lowest)] hover:border-[var(--color-secondary)] hover:bg-[var(--color-secondary-fixed)]/10 transition-colors group flex items-start gap-2 cursor-pointer"
              >
                <action.icon className="w-4 h-4 text-[var(--color-secondary)] mt-0.5 flex-shrink-0" />
                <span className="text-[13px] text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)] transition-colors">
                  {action.text}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[var(--color-surface-container-lowest)] border-t border-[var(--color-border-subtle)]/50">
        <div className="relative flex items-end bg-[var(--color-surface-container-low)] border border-[var(--color-border-subtle)] rounded-lg focus-within:border-[var(--color-secondary)] focus-within:ring-1 focus-within:ring-[var(--color-secondary)] transition-all">
          <textarea
            className="w-full bg-transparent border-none focus:ring-0 resize-none py-3 pl-3 pr-10 text-sm text-[var(--color-text-primary)] min-h-[44px] max-h-[120px] outline-none"
            placeholder="Ask AI to write or refine..."
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-2 bottom-2 w-7 h-7 rounded bg-[var(--color-primary)] text-[var(--color-on-primary)] flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        {lastAssistantMessage && activeSection && (
          <button
            onClick={() => onApplyToCurrentSection(lastAssistantMessage.text)}
            className="mt-3 w-full rounded-lg border border-[var(--color-secondary)]/30 bg-[var(--color-secondary-fixed)]/10 px-3 py-2 text-[13px] font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-secondary-fixed)]/20 transition-colors cursor-pointer"
          >
            Apply to current section ({activeSection.title})
          </button>
        )}
        <div className="mt-2 text-center">
          <span className="text-[11px] text-[var(--color-text-secondary)]">
            AI may produce inaccurate information.
          </span>
        </div>
      </div>
    </aside>
  );
}

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
  const [aiPanelOpen, setAiPanelOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Load PRD data
  useEffect(() => {
    async function loadPRD() {
      try {
        const res = await fetch(`/api/prds/${id}`);
        const data = await res.json();
        if (data.prd) {
          setPRD(data.prd);
          setTitle(data.prd.title);
          let parsedSections = DEFAULT_SECTIONS.map((s) => ({
            ...s,
            id: crypto.randomUUID(),
          }));
          try {
            const content = JSON.parse(data.prd.content || "{}");
            if (Array.isArray(content.sections) && content.sections.length > 0) {
              parsedSections = content.sections.map((s: { id?: string; title?: string; content?: string }) => ({
                id: s.id || crypto.randomUUID(),
                title: s.title || "Untitled Section",
                content: s.content || "",
              }));
            }
          } catch {}
          setSections(parsedSections);
          if (parsedSections.length > 0) {
            setActiveSection(parsedSections[0].id);
          }
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
      const content = JSON.stringify({
        sections,
        meta: {
          lastEditedAt: new Date().toISOString(),
          editorVersion: "mvp-sections-v1",
        },
      });
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

  function updateSection(id: string, content: string) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, content } : s))
    );
  }

  function updateSectionTitle(id: string, nextTitle: string) {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: nextTitle } : s))
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-surface-background)] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-text-secondary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-background)] text-[var(--color-text-primary)] h-screen flex flex-col overflow-hidden">
      {/* Document Header */}
      <header className="flex items-center justify-between px-6 h-16 bg-[var(--color-surface-canvas)] border-b border-[var(--color-border-subtle)] shrink-0 z-20">
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center justify-center text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <h1 className="font-heading text-[20px] font-bold tracking-tight text-[var(--color-text-primary)]">
              {title || "Untitled PRD"}
            </h1>
            <span className="bg-[var(--color-surface-container-high)] text-[var(--color-on-surface-variant)] label-caps px-2 py-1 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success-green)]" />
              {lastSaved ? "Auto-saved" : saving ? "Saving..." : "Unsaved"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-1">
            <Plus className="w-4 h-4" /> Share
          </Button>
          <Button size="sm" className="gap-1.5" onClick={autoSave} loading={saving}>
            <Download className="w-4 h-4" /> Export
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Table of Contents */}
        <aside className="w-64 bg-[var(--color-surface-canvas)] border-r border-[var(--color-border-subtle)] flex flex-col shrink-0 overflow-y-auto">
          <div className="p-4 pb-3 label-caps text-[var(--color-text-secondary)] sticky top-0 bg-[var(--color-surface-canvas)] z-10">
            Document Outline
          </div>
          <nav className="flex flex-col pb-6">
            {sections.map((section) => (
              <React.Fragment key={section.id}>
                <a
                  href={`#section-${section.id}`}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-4 py-2.5 text-sm transition-colors border-l-[3px] ${
                    activeSection === section.id
                      ? "text-[var(--color-text-primary)] font-medium border-[var(--color-secondary)] bg-[var(--color-secondary-fixed)]/30"
                      : "text-[var(--color-text-secondary)] border-transparent hover:bg-[var(--color-surface-container-low)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  {section.title}
                </a>
                {/* Sub-items for User Stories */}
                {section.title === "User Stories" && (
                  <div className="pl-8 pr-4 py-1 flex flex-col gap-1">
                    <a className="text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors truncate cursor-pointer">
                      US-1: One-click Checkout
                    </a>
                    <a className="text-[13px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors truncate cursor-pointer">
                      US-2: Multi-currency Support
                    </a>
                  </div>
                )}
              </React.Fragment>
            ))}
          </nav>
        </aside>

        {/* Center Panel: WYSIWYG Editor */}
        <main className="flex-1 flex flex-col relative bg-[var(--color-surface-container-low)] overflow-hidden">
          {/* Sticky Formatting Toolbar */}
          <div className="h-12 bg-[var(--color-surface-canvas)] border-b border-[var(--color-border-subtle)] flex items-center justify-center px-6 shrink-0 z-10 shadow-sm">
            <div className="flex items-center gap-1 bg-[var(--color-surface-container-low)] p-1 rounded border border-[var(--color-border-subtle)]">
              <button className="p-1.5 text-[var(--color-text-primary)] hover:bg-[var(--color-surface-container-highest)] rounded transition-colors cursor-pointer">
                <Bold className="w-[18px] h-[18px]" />
              </button>
              <button className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-container-highest)] rounded transition-colors cursor-pointer">
                <Italic className="w-[18px] h-[18px]" />
              </button>
              <button className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-container-highest)] rounded transition-colors cursor-pointer">
                <Underline className="w-[18px] h-[18px]" />
              </button>
              <div className="w-px h-4 bg-[var(--color-outline-variant)] mx-1" />
              <button className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-container-highest)] rounded transition-colors flex items-center gap-1 cursor-pointer">
                <span className="text-[13px] font-medium pl-1">Normal text</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-[var(--color-outline-variant)] mx-1" />
              <button className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-container-highest)] rounded transition-colors cursor-pointer">
                <List className="w-[18px] h-[18px]" />
              </button>
              <button className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-container-highest)] rounded transition-colors cursor-pointer">
                <ListOrdered className="w-[18px] h-[18px]" />
              </button>
              <div className="w-px h-4 bg-[var(--color-outline-variant)] mx-1" />
              <button className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-container-highest)] rounded transition-colors cursor-pointer">
                <Link className="w-[18px] h-[18px]" />
              </button>
              <button className="p-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-container-highest)] rounded transition-colors cursor-pointer">
                <Image className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>

          {/* Document Canvas */}
          <div className="flex-1 overflow-y-auto w-full py-6 px-4">
            <div className="max-w-[var(--editor-max)] mx-auto bg-[var(--color-surface-container-lowest)] min-h-[800px] border border-[var(--color-border-subtle)] rounded shadow-sm p-[64px] relative">
              {/* Document Content */}
              <div className="text-[var(--color-text-primary)]">
                {sections.map((section) => (
                  <SectionContent
                    key={section.id}
                    section={section}
                    isActive={activeSection === section.id}
                    onSelect={setActiveSection}
                    onUpdate={updateSection}
                    onTitleUpdate={updateSectionTitle}
                  />
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Right Panel: AI Co-pilot */}
        {aiPanelOpen && (
          <AICopilotPanel
            onClose={() => setAiPanelOpen(false)}
            documentTitle={title || prd?.title || "Untitled PRD"}
            sections={sections}
            activeSection={sections.find((section) => section.id === activeSection) || null}
            onApplyToCurrentSection={(content) => {
              if (!activeSection) return;
              updateSection(activeSection, content);
            }}
          />
        )}
      </div>
    </div>
  );
}
