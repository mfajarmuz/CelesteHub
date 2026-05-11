"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  LayoutTemplate,
  Sparkles,
  ChevronRight,
  Clock,
  Star,
  Check,
  Loader2,
  FileText,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  structure: string;
  isPublic: boolean;
}

const categoryIcons: Record<string, string> = {
  umum: "📋",
  fintech: "💰",
  ecommerce: "🛒",
  saas: "☁️",
  mobile: "📱",
};

const categoryNames: Record<string, string> = {
  umum: "Umum",
  fintech: "Fintech",
  ecommerce: "E-commerce",
  saas: "SaaS",
  mobile: "Mobile App",
};

// ─── Template Card ────────────────────────────────────────

function TemplateCard({
  template,
  index,
}: {
  template: Template;
  index: number;
}) {
  const router = useRouter();
  const [using, setUsing] = useState(false);

  async function handleUseTemplate() {
    setUsing(true);
    try {
      const res = await fetch("/api/prds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `PRD — ${template.name}`,
          templateId: template.id,
          language: "id",
        }),
      });
      const data = await res.json();
      if (res.ok && data.prd) {
        router.push(`/dashboard/${data.prd.id}/edit`);
      }
    } catch (err) {
      console.error("Failed to create PRD from template:", err);
    } finally {
      setUsing(false);
    }
  }

  return (
    <div className="bg-[var(--color-surface-canvas)] border border-[var(--color-border-subtle)] rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group flex flex-col">
      {/* Header */}
      <div className="p-6 flex-1">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-container-low)] flex items-center justify-center text-2xl">
            {categoryIcons[template.category] || "📄"}
          </div>
          <Badge variant="secondary">
            {categoryNames[template.category] || template.category}
          </Badge>
        </div>

        <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)] mb-2">
          {template.name}
        </h3>
        <p className="body-sm text-[var(--color-text-secondary)] line-clamp-2 mb-4">
          {template.description}
        </p>

        {/* Structure preview */}
        <div className="flex flex-wrap gap-1.5">
          {(() => {
            try {
              const structure = JSON.parse(template.structure);
              return (structure.sections || []).slice(0, 4).map((s: string) => (
                <span
                  key={s}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-surface-container-low)] text-[var(--color-text-secondary)] capitalize"
                >
                  {s.replace(/_/g, " ")}
                </span>
              ));
            } catch {
              return null;
            }
          })()}
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-ai-accent)]/10 text-[var(--color-ai-accent)]">
            +more
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6">
        <Button
          className="w-full gap-1.5"
          onClick={handleUseTemplate}
          loading={using}
          disabled={using}
        >
          {using ? (
            "Membuat..."
          ) : (
            <>
              <Sparkles className="w-4 h-4" /> Gunakan Template
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Main Templates Page ──────────────────────────────────

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch("/api/templates");
        const data = await res.json();
        setTemplates(data.templates || []);
      } catch (err) {
        console.error("Failed to fetch templates:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  const categories = [
    "all",
    ...new Set(templates.map((t) => t.category)),
  ] as string[];

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[var(--color-surface-background)]">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-[var(--color-surface-canvas)]/80 backdrop-blur-md border-b border-[var(--color-border-subtle)]">
        <div className="container-main flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
              <FileText className="w-4 h-4 text-[var(--color-on-primary)]" />
            </div>
            <span className="font-heading text-lg font-bold text-[var(--color-text-primary)]">
              PRD.ai
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-[var(--color-text-primary)]"
            >
              Dashboard
            </Link>
            <span className="text-sm font-semibold text-[var(--color-text-primary)] border-b-2 border-[var(--color-primary)] pb-1">
              Templates
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Daftar</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="bg-gradient-to-b from-[var(--color-primary)]/5 to-transparent">
        <div className="container-main py-16 md:py-20 text-center">
          <Badge variant="secondary" className="mb-4">
            📚 Template Library
          </Badge>
          <h1 className="heading-headline-lg text-[var(--color-text-primary)] mb-4">
            Pilih Template PRD
          </h1>
          <p className="body-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-8">
            Mulai dari template yang sudah terstruktur untuk berbagai jenis
            produk. Setiap template dirancang oleh Product Manager
            berpengalaman.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="text-center">
              <div className="heading-headline-md text-[var(--color-text-primary)]">
                {templates.length}
              </div>
              <div className="body-sm text-[var(--color-text-secondary)]">
                Template
              </div>
            </div>
            <div className="w-px h-10 bg-[var(--color-border-subtle)]" />
            <div className="text-center">
              <div className="heading-headline-md text-[var(--color-text-primary)]">
                {categories.length - 1}
              </div>
              <div className="body-sm text-[var(--color-text-secondary)]">
                Kategori
              </div>
            </div>
            <div className="w-px h-10 bg-[var(--color-border-subtle)]" />
            <div className="text-center">
              <div className="heading-headline-md text-[var(--color-text-primary)]">
                60+
              </div>
              <div className="body-sm text-[var(--color-text-secondary)]">
                Sections Siap Pakai
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Search & Filter ── */}
      <section className="container-main py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
            <Input
              placeholder="Cari template..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                  : "bg-[var(--color-surface-container-low)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-outline-variant)]"
              }`}
            >
              {cat === "all"
                ? "Semua"
                : categoryNames[cat] || cat}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--color-text-secondary)]" />
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-[var(--color-surface-container-low)] flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-[var(--color-text-secondary)]" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)] mb-2">
              Template tidak ditemukan
            </h3>
            <p className="body-sm text-[var(--color-text-secondary)] mb-6">
              Coba ubah kata kunci pencarian atau filter kategori.
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setSearch("");
                setActiveCategory("all");
              }}
            >
              Reset Filter
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((t, i) => (
              <TemplateCard key={t.id} template={t} index={i} />
            ))}
          </div>
        )}
      </section>

      {/* ── CTA ── */}
      <section className="bg-[var(--color-primary)] text-[var(--color-on-primary)]">
        <div className="container-main py-16 text-center">
          <h2 className="heading-headline-lg mb-4">
            Butuh template custom?
          </h2>
          <p className="body-lg max-w-2xl mx-auto mb-8 opacity-80">
            Tim kami bisa membuat template khusus untuk kebutuhan produk Anda.
            Tersedia untuk pengguna Pro dan Team.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register">
              <Button className="bg-white text-black hover:bg-white/90 gap-2">
                Upgrade ke Pro <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                Kembali ke Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 border-t border-[var(--color-border-subtle)]">
        <div className="container-main flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--color-text-secondary)]" />
            <span className="body-sm text-[var(--color-text-secondary)]">
              PRD.ai — AI-Powered PRD Generator
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="body-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Kebijakan Privasi
            </a>
            <a
              href="#"
              className="body-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Syarat & Ketentuan
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
