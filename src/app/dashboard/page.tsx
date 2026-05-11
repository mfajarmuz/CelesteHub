"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import {
  Search,
  Grid3X3,
  List,
  MoreHorizontal,
  Clock,
  Sparkles,
  Library,
} from "lucide-react";

// ─── Mock Data ──────────────────────────────────────────

const mockPRDs = [
  {
    id: "1",
    title: "User Authentication Revamp v2.0",
    description:
      "Complete redesign of the login and signup flows to include OAuth providers and passwordless entry.",
    category: "SaaS",
    status: "Draft",
    updatedAt: "2 hrs ago",
    statusColor: "bg-tertiary-fixed-dim",
    statusTextColor: "text-[#92400E]",
    statusBgColor: "bg-amber-100",
  },
  {
    id: "2",
    title: "Payment Gateway Integration (Stripe)",
    description:
      "Technical requirements for migrating primary payment processing to Stripe infrastructure.",
    category: "Fintech",
    status: "Final",
    updatedAt: "Yesterday",
    statusColor: "bg-success-green",
    statusTextColor: "text-success-green",
    statusBgColor: "bg-green-100",
  },
  {
    id: "3",
    title: "Push Notification Engine",
    description:
      "Logic and delivery rules for segmented push notifications across iOS and Android platforms.",
    category: "Mobile App",
    status: "Final",
    updatedAt: "Oct 12, 2023",
    statusColor: "bg-success-green",
    statusTextColor: "text-success-green",
    statusBgColor: "bg-green-100",
  },
];

const categories = ["All", "Fintech", "SaaS", "Mobile App"];

// ─── Icons (Material Symbols style) ──────────────────────

function IconLibraryBooks({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function IconSchedule({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconMagic({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconMoreVert({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <circle cx="12" cy="5" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="19" r="1.5" />
    </svg>
  );
}

// ─── Dashboard Page ─────────────────────────────────────

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredPRDs = mockPRDs.filter((prd) => {
    const matchesSearch =
      prd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prd.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || prd.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-screen flex overflow-hidden bg-[var(--color-surface-background)] text-[var(--color-text-primary)] font-body antialiased">
      {/* SideNavBar (shared component) */}
      <Sidebar />

      {/* Main Content Wrapper */}
      <div className="ml-64 flex-1 flex flex-col h-screen overflow-hidden">
        {/* TopNavBar */}
        <DashboardHeader />

        {/* Main Scrollable Canvas */}
        <main className="flex-1 overflow-y-auto p-6 bg-[var(--color-surface-background)]">
          <div className="max-w-[var(--container-max)] mx-auto space-y-6">
            {/* Welcome & Stats (Bento Grid Style) */}
            <div className="grid grid-cols-12 gap-6">
              {/* Welcome */}
              <div className="col-span-12 md:col-span-8 bg-[var(--color-surface-canvas)] border border-[var(--color-border-subtle)] rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <h1 className="heading-headline-lg text-[var(--color-text-primary)]">
                    Good morning, Team.
                  </h1>
                  <p className="text-[var(--color-text-secondary)] text-base leading-relaxed mt-1">
                    You have 3 drafts pending review. Ready to build something
                    great?
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-4">
                  <button className="bg-[var(--color-primary)] text-[var(--color-on-primary)] px-6 py-3 rounded-lg text-xs font-medium uppercase tracking-wider flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer font-mono">
                    <Sparkles className="w-4 h-4" /> Generate PRD
                  </button>
                  <button className="px-6 py-3 rounded-lg border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] text-xs font-medium uppercase tracking-wider hover:bg-[var(--color-surface-container-low)] transition-colors cursor-pointer font-mono">
                    Browse Templates
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
                <div className="bg-[var(--color-surface-canvas)] border border-[var(--color-border-subtle)] rounded-xl p-4 flex items-center justify-between flex-1">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
                      Total PRDs
                    </div>
                    <div className="text-[36px] leading-none font-extrabold text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                      124
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[var(--color-surface-container-low)] flex items-center justify-center text-[var(--color-text-primary)]">
                    <IconLibraryBooks />
                  </div>
                </div>
                <div className="bg-[var(--color-surface-canvas)] border border-[var(--color-border-subtle)] rounded-xl p-4 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-end mb-2">
                    <div className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)]">
                      Credits Left
                    </div>
                    <div className="text-lg leading-tight text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-heading)', fontWeight: 600 }}>
                      8,450{" "}
                      <span className="text-sm font-normal text-[var(--color-text-secondary)]">
                        / 10k
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-[var(--color-surface-container-highest)] rounded-full h-1.5 mt-2 overflow-hidden">
                    <div
                      className="bg-[var(--color-ai-accent)] h-1.5 rounded-full"
                      style={{ width: "84%" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters & Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
                <input
                  placeholder="Search PRDs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[var(--color-border-subtle)] focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] outline-none text-sm text-[var(--color-text-primary)] bg-[var(--color-surface-canvas)] transition-colors"
                />
              </div>
            </div>

            {/* Category Pills + View Toggle */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                      activeCategory === cat
                        ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] border border-[var(--color-primary)]"
                        : "bg-[var(--color-surface-container-low)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-outline-variant)]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {/* View toggle */}
              <div className="flex items-center gap-2 border border-[var(--color-border-subtle)] rounded-lg p-1 bg-[var(--color-surface-canvas)]">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1 rounded cursor-pointer transition-colors ${
                    viewMode === "grid"
                      ? "bg-[var(--color-surface-container-low)] text-[var(--color-text-primary)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5 block" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1 rounded cursor-pointer transition-colors ${
                    viewMode === "list"
                      ? "bg-[var(--color-surface-container-low)] text-[var(--color-text-primary)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  }`}
                >
                  <List className="w-5 h-5 block" />
                </button>
              </div>
            </div>

            {/* Document Grid */}
            {filteredPRDs.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-[var(--color-surface-container-low)] flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-[var(--color-text-secondary)]" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                  No PRDs found
                </h3>
                <p className="text-sm text-[var(--color-text-secondary)] mb-6">
                  Try changing your search query or category filter.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                  }}
                  className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-[var(--color-on-primary)] text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Reset Filter
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredPRDs.map((prd) => (
                  <div
                    key={prd.id}
                    className="bg-[var(--color-surface-canvas)] border border-[var(--color-border-subtle)] rounded-xl p-4 flex flex-col hover:shadow-sm hover:border-[var(--color-outline-variant)] transition-all group"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-[var(--color-surface-container-highest)] px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)]">
                        {prd.category}
                      </div>
                      <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <IconMoreVert className="w-5 h-5" />
                      </button>
                    </div>
                    <h3 className="font-heading text-base font-semibold text-[var(--color-text-primary)] mb-2 line-clamp-2">
                      {prd.title}
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 flex-1 mb-4">
                      {prd.description}
                    </p>
                    <div className="flex justify-between items-center pt-3 border-t border-[var(--color-border-subtle)] mt-auto">
                      <div className="flex items-center gap-1.5 text-[var(--color-text-secondary)] text-xs">
                        <IconSchedule className="w-4 h-4" />
                        <span>{prd.updatedAt}</span>
                      </div>
                      <span className="flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)]">
                        <span
                          className={`w-2 h-2 rounded-full ${prd.statusColor}`}
                        ></span>{" "}
                        {prd.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredPRDs.map((prd) => (
                  <div
                    key={prd.id}
                    className="bg-[var(--color-surface-canvas)] border border-[var(--color-border-subtle)] rounded-lg p-4 flex items-center gap-4 hover:shadow-sm hover:border-[var(--color-outline-variant)] transition-all group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-container-low)] flex items-center justify-center flex-shrink-0 text-[var(--color-text-secondary)]">
                      <Library className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading text-sm font-semibold text-[var(--color-text-primary)] truncate">
                        {prd.title}
                      </h3>
                      <p className="text-sm text-[var(--color-text-secondary)] truncate">
                        {prd.description}
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-3">
                      <div className="bg-[var(--color-surface-container-highest)] px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-secondary)]">
                        {prd.category}
                      </div>
                      <span className="flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)]">
                        <span
                          className={`w-2 h-2 rounded-full ${prd.statusColor}`}
                        ></span>{" "}
                        {prd.status}
                      </span>
                      <span className="text-xs text-[var(--color-text-secondary)]">
                        {prd.updatedAt}
                      </span>
                    </div>
                    <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <IconMoreVert className="w-5 h-5" />
                    </button>
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
