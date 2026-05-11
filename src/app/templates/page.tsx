"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Sparkles, ArrowRight, Layers, Search, Clock, FileText, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  sectionCount: number;
  gradient: string;
  dotColor: string;
  isPublic: boolean;
}

const CATEGORIES = ["All Categories", "Umum", "Fintech", "E-commerce", "SaaS B2B", "Mobile App"];

// Gradient helpers per category
const GRADIENTS: Record<string, string> = {
  Fintech: "from-[#f0f4ff] to-[#e0e7ff]",
  "E-commerce": "from-[#fff0f5] to-[#ffe0eb]",
  "SaaS B2B": "from-[#f0fff4] to-[#d1fae5]",
  "Mobile App": "from-[#f5f3ff] to-[#ede9fe]",
  Umum: "from-surface-container-high to-surface-container-low",
};

const BADGE_COLORS: Record<string, string> = {
  Fintech: "text-secondary",
  "E-commerce": "text-[#be0058]",
  "SaaS B2B": "text-success-green",
  "Mobile App": "text-ai-accent",
  Umum: "text-text-primary",
};

const exampleTemplates: Template[] = [
  {
    id: "t1",
    name: "Payment Gateway Integration",
    description:
      "Structured PRD focusing on compliance, security matrices, API endpoints, and transaction flows necessary for modern financial applications.",
    category: "Fintech",
    sectionCount: 8,
    gradient: GRADIENTS["Fintech"] || GRADIENTS["Umum"],
    dotColor: BADGE_COLORS["Fintech"],
    isPublic: true,
  },
  {
    id: "t2",
    name: "Checkout Flow Optimization",
    description:
      "Comprehensive template covering cart management, shipping logic, promo code application, and user conversion tracking.",
    category: "E-commerce",
    sectionCount: 12,
    gradient: GRADIENTS["E-commerce"] || GRADIENTS["Umum"],
    dotColor: BADGE_COLORS["E-commerce"],
    isPublic: true,
  },
  {
    id: "t3",
    name: "Enterprise Role Management",
    description:
      "Detailed documentation for complex permission matrices, tenant architecture, audit logging, and SSO integration requirements.",
    category: "SaaS B2B",
    sectionCount: 15,
    gradient: GRADIENTS["SaaS B2B"] || GRADIENTS["Umum"],
    dotColor: BADGE_COLORS["SaaS B2B"],
    isPublic: true,
  },
  {
    id: "t4",
    name: "User Onboarding Flow",
    description:
      "Perfect for native iOS/Android apps. Covers push notification permissions, device state handling, and offline capabilities.",
    category: "Mobile App",
    sectionCount: 10,
    gradient: GRADIENTS["Mobile App"] || GRADIENTS["Umum"],
    dotColor: BADGE_COLORS["Mobile App"],
    isPublic: true,
  },
  {
    id: "t5",
    name: "Standard Feature Release",
    description:
      "A versatile, all-purpose PRD template suitable for most internal tools or standard feature additions. Includes sections for problem statement, user stories, out-of-scope definitions, and success metrics.",
    category: "Umum",
    sectionCount: 6,
    gradient: GRADIENTS["Umum"],
    dotColor: BADGE_COLORS["Umum"],
    isPublic: true,
  },
];

// ─── Mock Preview Card Component ────────────────────────

function MockPreview({ category, isGeneral }: { category: string; isGeneral?: boolean }) {
  if (isGeneral) {
    return (
      <>
        <div className="w-1/3 h-4 rounded bg-surface-variant"></div>
        <div className="w-full h-2 rounded bg-surface-variant"></div>
        <div className="w-full h-2 rounded bg-surface-variant"></div>
        <div className="w-4/5 h-2 rounded bg-surface-variant"></div>
      </>
    );
  }
  if (category === "Fintech") {
    return (
      <>
        <div className="w-1/2 h-2 bg-surface-variant rounded mb-2"></div>
        <div className="w-full h-2 bg-surface-variant rounded mb-1"></div>
        <div className="w-5/6 h-2 bg-surface-variant rounded mb-3"></div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-8 bg-surface-variant rounded"></div>
          <div className="h-8 bg-surface-variant rounded"></div>
        </div>
      </>
    );
  }
  if (category === "E-commerce") {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-surface-variant"></div>
          <div className="flex-1">
            <div className="w-full h-3 bg-surface-variant rounded mb-1"></div>
            <div className="w-1/2 h-2 bg-surface-variant rounded"></div>
          </div>
        </div>
        <div className="w-full h-12 bg-surface-variant rounded"></div>
      </div>
    );
  }
  if (category === "SaaS B2B") {
    return (
      <div className="flex gap-0 h-full">
        <div className="w-1/4 h-full border-r border-border-subtle pr-2 flex flex-col gap-1">
          <div className="w-full h-2 bg-surface-variant rounded"></div>
          <div className="w-full h-2 bg-surface-variant rounded"></div>
          <div className="w-full h-2 bg-surface-variant rounded"></div>
        </div>
        <div className="flex-1 pl-2 flex flex-col gap-2">
          <div className="w-1/2 h-3 bg-surface-variant rounded"></div>
          <div className="w-full flex-1 bg-surface-variant rounded"></div>
        </div>
      </div>
    );
  }
  if (category === "Mobile App") {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="w-8 h-8 rounded-full bg-surface-variant mb-2"></div>
        <div className="w-full h-2 bg-surface-variant rounded mb-1"></div>
        <div className="w-3/4 h-2 bg-surface-variant rounded"></div>
      </div>
    );
  }
  return (
    <div className="w-1/2 h-2 bg-surface-variant rounded mb-2"></div>
  );
}

// ─── Template Card ────────────────────────────────────────

function TemplateCard({ template }: { template: Template }) {
  const router = useRouter();
  const isGeneral = template.id === "t5";

  async function handleUse() {
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
        const res2 = await fetch("/api/prds", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: `PRD — ${template.name}`, language: "id" }),
        });
        const data2 = await res2.json();
        if (res2.ok && data2.prd) {
          router.push(`/dashboard/${data2.prd.id}/edit`);
        }
      }
    } catch (err) {
      console.error("Failed:", err);
    }
  }

  const gridClass = isGeneral
    ? "col-span-1 md:col-span-2 lg:col-span-2"
    : "col-span-1";

  return (
    <div className={`${gridClass}`}>
      <div className={`bg-surface-canvas border border-border-subtle rounded-xl overflow-hidden hover:shadow-[0_4px_20px_rgba(0,0,0,0.05)] transition-all flex flex-col h-full group`}>
        {/* Gradient Preview */}
        <div
          className={`h-40 bg-gradient-to-br ${template.gradient} relative p-4 flex justify-center items-start overflow-hidden`}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(#64748B 1px, transparent 1px)", backgroundSize: "16px 16px" }}
          ></div>
          {isGeneral ? (
            <div className="w-3/4 bg-white rounded-t-lg shadow-sm border border-border-subtle mt-4 p-4 relative z-10 transform group-hover:-translate-y-2 transition-transform duration-300 flex flex-col gap-3">
              <MockPreview category={template.category} isGeneral />
            </div>
          ) : template.category === "Mobile App" ? (
            <div className="w-[80px] bg-white rounded-t-xl shadow-sm border border-border-subtle mt-4 p-2 relative z-10 transform group-hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center">
              <MockPreview category={template.category} />
            </div>
          ) : (
            <div className="w-3/4 bg-white rounded-t-lg shadow-sm border border-border-subtle mt-4 p-3 relative z-10 transform group-hover:-translate-y-2 transition-transform duration-300">
              <MockPreview category={template.category} />
            </div>
          )}
          <span
            className={`absolute top-4 right-4 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold border border-border-subtle ${template.dotColor}`}
          >
            {template.category === "Umum" ? "UMUM" : template.category.toUpperCase() === "SAAS B2B" ? "SAAS B2B" : template.category === "Mobile App" ? "MOBILE APP" : template.category.toUpperCase()}
          </span>
        </div>

        {/* Content */}
        <div className={`p-5 flex-1 flex flex-col ${isGeneral ? "justify-center" : ""}`}>
          <h3 className="font-heading text-xl font-semibold text-primary mb-2">
            {template.name}
          </h3>
          <p className="text-sm text-text-secondary mb-4 flex-1 leading-relaxed">
            {template.description}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-sm text-text-secondary flex items-center gap-1 text-xs">
              <FileText className="w-3.5 h-3.5" /> {template.sectionCount} Sections
            </span>
            {isGeneral ? (
              <button
                onClick={handleUse}
                className="bg-primary text-on-primary px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 cursor-pointer"
              >
                Use Template
                <FileText className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleUse}
                className="text-primary hover:text-ai-accent text-sm font-medium flex items-center gap-1 transition-colors cursor-pointer"
              >
                Use Template
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Templates Page ─────────────────────────────────

export default function TemplatesPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Categories");

  const filteredTemplates = exampleTemplates.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All Categories" || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-surface-background">
      <Sidebar />
      <div className="md:ml-64 flex flex-col min-h-screen">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[var(--container-max)] mx-auto">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-[32px] font-heading font-bold text-primary leading-tight mb-2">
                Template Library
              </h1>
              <p className="text-base text-text-secondary max-w-2xl">
                Start your next Product Requirements Document with a solid foundation.
                Choose from our industry-specific templates designed to capture exactly
                what you need.
              </p>
            </div>

            {/* Search */}
            <div className="relative max-w-md mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                placeholder="Search templates..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border-subtle focus:border-secondary focus:ring-1 focus:ring-secondary outline-none text-sm text-text-primary bg-surface-canvas transition-colors"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors cursor-pointer ${
                    activeCategory === cat
                      ? "bg-primary text-on-primary border border-primary"
                      : "bg-surface text-text-secondary border border-border-subtle hover:border-outline"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Bento Grid */}
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-text-secondary" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-primary mb-2">
                  No templates found
                </h3>
                <p className="text-sm text-text-secondary mb-6">
                  Try adjusting your search or filter.
                </p>
                <button
                  onClick={() => { setSearch(""); setActiveCategory("All Categories"); }}
                  className="px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
