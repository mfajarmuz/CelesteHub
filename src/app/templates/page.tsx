"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  LayoutTemplate,
  Sparkles,
  ChevronRight,
  FileText,
  Clock,
  Layers,
  Check,
  Loader2,
  Settings,
  Bell,
  Plus,
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
  sectionCount: number;
  isPublic: boolean;
  usageCount: number;
  lastUsed: string;
}

const CATEGORIES = ["All", "Fintech", "E-commerce", "SaaS", "Mobile App", "Umum"];

const exampleTemplates: Template[] = [
  {
    id: "t1",
    name: "Payment Gateway Integration",
    description:
      "Dokumentasi lengkap untuk integrasi payment gateway termasuk Stripe, Midtrans, dan Xendit. Mencakup flow pembayaran, webhook handling, refund, dan dispute management.",
    category: "Fintech",
    sectionCount: 12,
    usageCount: 48,
    lastUsed: "2 days ago",
    isPublic: true,
    structure: JSON.stringify({
      sections: [
        "executive_summary",
        "problem_statement",
        "goals_metrics",
        "target_users",
        "feature_requirements",
        "user_stories",
        "technical_requirements",
        "non_functional_requirements",
        "compliance",
        "success_criteria",
        "timeline",
        "risks",
      ],
    }),
  },
  {
    id: "t2",
    name: "Checkout Flow Optimization",
    description:
      "PRD untuk mengoptimasi flow checkout dengan one-click purchase, saved payment methods, dan guest checkout. Target mengurangi cart abandonment rate hingga 40%.",
    category: "E-commerce",
    sectionCount: 10,
    usageCount: 35,
    lastUsed: "5 days ago",
    isPublic: true,
    structure: JSON.stringify({
      sections: [
        "executive_summary",
        "problem_statement",
        "goals_metrics",
        "customer_journey",
        "feature_requirements",
        "user_stories",
        "ui_ux_requirements",
        "technical_requirements",
        "success_criteria",
        "timeline",
      ],
    }),
  },
  {
    id: "t3",
    name: "User Authentication Revamp",
    description:
      "PRD untuk redesign sistem autentikasi dengan dukungan OAuth (Google, Apple), passwordless login, dan biometric authentication.",
    category: "SaaS",
    sectionCount: 11,
    usageCount: 52,
    lastUsed: "1 week ago",
    isPublic: true,
    structure: JSON.stringify({
      sections: [],
    }),
  },
  {
    id: "t4",
    name: "Push Notification Engine",
    description:
      "Dokumentasi untuk sistem push notification terpusat dengan segmentasi user, A/B testing untuk copy, dan analytics dashboard.",
    category: "Mobile App",
    sectionCount: 9,
    usageCount: 27,
    lastUsed: "2 weeks ago",
    isPublic: true,
    structure: JSON.stringify({
      sections: [],
    }),
  },
  {
    id: "t5",
    name: "Referral Program Dashboard",
    description:
      "PRD untuk referral program dengan tracking link, reward system, leaderboard, dan analytics performa kampanye referral.",
    category: "SaaS",
    sectionCount: 10,
    usageCount: 19,
    lastUsed: "3 weeks ago",
    isPublic: true,
    structure: JSON.stringify({
      sections: [],
    }),
  },
  {
    id: "t6",
    name: "AI-Powered Chatbot untuk CS",
    description:
      "Integrasi LLM untuk customer service chatbot dengan intent detection, human handoff, dan knowledge base integration.",
    category: "Umum",
    sectionCount: 11,
    usageCount: 31,
    lastUsed: "1 month ago",
    isPublic: true,
    structure: JSON.stringify({
      sections: [],
    }),
  },
];

// ─── Template Card ────────────────────────────────────────

const categoryColors: Record<string, string> = {
  Fintech: "bg-emerald-100 text-emerald-800",
  "E-commerce": "bg-blue-100 text-blue-800",
  SaaS: "bg-purple-100 text-purple-800",
  "Mobile App": "bg-orange-100 text-orange-800",
  Umum: "bg-slate-100 text-slate-800",
};

function TemplateCard({
  template,
}: {
  template: Template;
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
      } else {
        // Fallback: create a PRD with this name anyway
        const res2 = await fetch("/api/prds", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: `PRD — ${template.name}`,
            language: "id",
          }),
        });
        const data2 = await res2.json();
        if (res2.ok && data2.prd) {
          router.push(`/dashboard/${data2.prd.id}/edit`);
        }
      }
    } catch (err) {
      console.error("Failed to use template:", err);
    } finally {
      setUsing(false);
    }
  }

  return (
    <div className="bg-[var(--color-surface-canvas)] border border-[var(--color-border-subtle)] rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group flex flex-col">
      {/* Header */}
      <div className="p-5 flex-1">
        {/* Category + Usage */}
        <div className="flex items-center justify-between mb-3">
          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
              categoryColors[template.category] ||
              "bg-[var(--color-surface-container)] text-[var(--color-on-surface)]"
            }`}
          >
            {template.category}
          </span>
          <span className="text-[11px] text-[var(--color-text-secondary)] flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {template.lastUsed}
          </span>
        </div>

        {/* Icon + Title */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-container-low)] flex items-center justify-center flex-shrink-0">
            <LayoutTemplate className="w-5 h-5 text-[var(--color-text-primary)]" />
          </div>
          <div className="min-w-0">
            <h3 className="font-heading text-[15px] font-semibold text-[var(--color-text-primary)] leading-snug line-clamp-2">
              {template.name}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-[13px] text-[var(--color-text-secondary)] leading-relaxed line-clamp-3 mb-4">
          {template.description}
        </p>

        {/* Sections count + Usage count */}
        <div className="flex items-center gap-4 text-xs text-[var(--color-text-secondary)]">
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            {template.sectionCount} sections
          </span>
          <span className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            {template.usageCount} uses
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5">
        <Button
          className="w-full gap-1.5"
          size="sm"
          onClick={handleUseTemplate}
          loading={using}
          disabled={using}
        >
          {using ? (
            "Creating..."
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" /> Use Template
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Main Templates Page (Dashboard Layout) ──────────────

export default function TemplatesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [templates, setTemplates] = useState<Template[]>(exampleTemplates);
  const [loading, setLoading] = useState(false);

  // Try to fetch from API, fall back to examples
  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch("/api/templates");
        const data = await res.json();
        if (data.templates && data.templates.length > 0) {
          // Merge with example data — use real templates but enrich with display info
          const enriched = data.templates.map((t: any, i: number) => {
            const example = exampleTemplates[i] || exampleTemplates[0];
            let sectionCount = 0;
            try {
              const structure = JSON.parse(t.structure || "{}");
              sectionCount = (structure.sections || []).length;
            } catch {}
            return {
              ...t,
              sectionCount: sectionCount || example.sectionCount,
              usageCount: Math.floor(Math.random() * 50) + 10,
              lastUsed: ["2 days ago", "1 week ago", "3 days ago"][i % 3],
              category:
                t.category === "umum"
                  ? "Umum"
                  : t.category === "fintech"
                    ? "Fintech"
                    : t.category === "ecommerce"
                      ? "E-commerce"
                      : t.category === "saas"
                        ? "SaaS"
                        : t.category === "mobile"
                          ? "Mobile App"
                          : t.category || "Umum",
              name:
                i === 0
                  ? "Payment Gateway Integration"
                  : i === 1
                    ? "Checkout Flow Optimization"
                    : i === 2
                      ? "User Authentication Revamp"
                      : i === 3
                        ? "Push Notification Engine"
                        : i === 4
                          ? "Referral Program Dashboard"
                          : t.name,
              description:
                i === 0
                  ? "Dokumentasi lengkap untuk integrasi payment gateway termasuk Stripe, Midtrans, dan Xendit. Mencakup flow pembayaran, webhook handling, refund, dan dispute management."
                  : i === 1
                    ? "PRD untuk mengoptimasi flow checkout dengan one-click purchase, saved payment methods, dan guest checkout. Target mengurangi cart abandonment rate hingga 40%."
                    : i === 2
                      ? "PRD untuk redesign sistem autentikasi dengan dukungan OAuth (Google, Apple), passwordless login, dan biometric authentication."
                      : i === 3
                        ? "Dokumentasi untuk sistem push notification terpusat dengan segmentasi user, A/B testing untuk copy, dan analytics dashboard."
                        : i === 4
                          ? "PRD untuk referral program dengan tracking link, reward system, leaderboard, dan analytics performa kampanye referral."
                          : t.description,
            };
          });
          setTemplates(enriched);
        }
      } catch (err) {
        // Silently fall back to example templates
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[var(--color-surface-background)]">
      {/* Sidebar — same as dashboard */}
      <Sidebar />

      {/* Main content area */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[var(--container-max)] mx-auto space-y-6">
            {/* Page header */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href="/dashboard"
                  className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  Dashboard
                </Link>
                <span className="text-xs text-[var(--color-text-secondary)]">
                  /
                </span>
                <span className="text-xs font-semibold text-[var(--color-text-primary)]">
                  Templates
                </span>
              </div>
              <h1 className="heading-headline-md text-[var(--color-text-primary)]">
                Template Library
              </h1>
              <p className="body-sm text-[var(--color-text-secondary)] mt-1">
                Choose from our collection of professionally structured PRD
                templates.
              </p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
                <Input
                  placeholder="Search templates by name or keyword..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-ai-accent)] flex items-center justify-center text-white text-xs font-bold">
                  U
                </div>
              </div>
            </div>

            {/* Category filters — "Fintech", "E-commerce" etc */}
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    activeCategory === cat
                      ? "bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                      : "bg-[var(--color-surface-container-low)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-outline-variant)]"
                  }`}
                >
                  {cat}
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
                  No templates found
                </h3>
                <p className="body-sm text-[var(--color-text-secondary)] mb-6">
                  Try adjusting your search or filter to find what you're
                  looking for.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearch("");
                    setActiveCategory("All");
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTemplates.map((t) => (
                  <TemplateCard key={t.id} template={t} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
