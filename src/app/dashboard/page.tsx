"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Search,
  Grid3X3,
  List,
  MoreHorizontal,
  Clock,
  Plus,
  Sparkles,
  LayoutTemplate,
} from "lucide-react";

// Mock data for PRDs
const mockPRDs = [
  {
    id: "1",
    title: "User Authentication Revamp v2.0",
    description:
      "Complete redesign of the login and signup flows to include OAuth providers and passwordless entry.",
    category: "SaaS",
    status: "Draft",
    updatedAt: "2 hrs ago",
  },
  {
    id: "2",
    title: "Payment Gateway Integration (Stripe)",
    description:
      "Technical requirements for migrating primary payment processing to Stripe infrastructure.",
    category: "Fintech",
    status: "Final",
    updatedAt: "Yesterday",
  },
  {
    id: "3",
    title: "Push Notification Engine",
    description:
      "Logic and delivery rules for segmented push notifications across iOS and Android platforms.",
    category: "Mobile App",
    status: "Final",
    updatedAt: "Oct 12, 2025",
  },
  {
    id: "4",
    title: "AI-Powered Chatbot untuk Customer Service",
    description:
      "Integrasi LLM untuk menangani pertanyaan pelanggan secara otomatis dengan human handoff.",
    category: "SaaS",
    status: "Draft",
    updatedAt: "3 days ago",
  },
  {
    id: "5",
    title: "E-Commerce Checkout Optimization",
    description:
      "Mengurangi friction di checkout flow dengan one-click purchase dan saved payment methods.",
    category: "E-commerce",
    status: "Review",
    updatedAt: "1 week ago",
  },
  {
    id: "6",
    title: "Referral Program Dashboard",
    description:
      "Dashboard untuk user melihat status referral mereka, reward yang didapat, dan leaderboard.",
    category: "Mobile App",
    status: "Draft",
    updatedAt: "2 weeks ago",
  },
];

const categories = ["All", "Fintech", "SaaS", "Mobile App", "E-commerce"] as const;

const statusColors: Record<string, "warning" | "success" | "secondary" | "default"> = {
  Draft: "warning",
  Final: "success",
  Review: "secondary",
};

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
    <div className="min-h-screen bg-[var(--color-surface-background)]">
      <Sidebar />

      <div className="md:ml-64 flex flex-col min-h-screen">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[var(--container-max)] mx-auto space-y-6">
            {/* Welcome & Stats */}
            <div className="grid grid-cols-12 gap-6">
              <div className="col-span-12 md:col-span-8 bg-[var(--color-surface-canvas)] border border-[var(--color-border-subtle)] rounded-xl p-6 flex flex-col justify-between">
                <div>
                  <h1 className="heading-headline-md text-[var(--color-text-primary)]">
                    Good morning, Team.
                  </h1>
                  <p className="body-md text-[var(--color-text-secondary)] mt-1">
                    You have 3 drafts pending review. Ready to build something
                    great?
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <Link href="/dashboard/new">
                    <Button size="lg" className="gap-2">
                      <Sparkles className="w-4 h-4" /> Generate PRD
                    </Button>
                  </Link>
                  <Link href="/templates">
                    <Button variant="ghost" size="lg">
                      <LayoutTemplate className="w-4 h-4" /> Browse Templates
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="col-span-12 md:col-span-4 flex flex-col gap-4">
                <div className="bg-[var(--color-surface-canvas)] border border-[var(--color-border-subtle)] rounded-xl p-4 flex items-center justify-between flex-1">
                  <div>
                    <div className="label-caps text-[var(--color-text-secondary)] mb-1">
                      Total PRDs
                    </div>
                    <div className="text-3xl font-bold font-heading text-[var(--color-text-primary)]">
                      124
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[var(--color-surface-container-low)] flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[var(--color-text-primary)]" />
                  </div>
                </div>
                <div className="bg-[var(--color-surface-canvas)] border border-[var(--color-border-subtle)] rounded-xl p-4 flex-1 flex flex-col justify-center">
                  <div className="flex justify-between items-end mb-2">
                    <div className="label-caps text-[var(--color-text-secondary)]">
                      Credits Left
                    </div>
                    <div className="font-heading text-base font-semibold text-[var(--color-text-primary)]">
                      8,450{" "}
                      <span className="body-sm text-[var(--color-text-secondary)] font-normal">
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

            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-secondary)]" />
                <Input
                  placeholder="Cari PRD..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2 border border-[var(--color-border-subtle)] rounded-lg p-1 bg-[var(--color-surface-canvas)]">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded ${
                    viewMode === "grid"
                      ? "bg-[var(--color-surface-container-low)] text-[var(--color-text-primary)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  } cursor-pointer transition-colors`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded ${
                    viewMode === "list"
                      ? "bg-[var(--color-surface-container-low)] text-[var(--color-text-primary)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  } cursor-pointer transition-colors`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    activeCategory === cat
                      ? "bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                      : "bg-[var(--color-surface-container-low)] text-[var(--color-text-secondary)] border border-[var(--color-border-subtle)] hover:border-[var(--color-outline-variant)]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* PRD Grid */}
            {filteredPRDs.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-[var(--color-surface-container-low)] flex items-center justify-center mx-auto mb-4">
                  <Search className="w-6 h-6 text-[var(--color-text-secondary)]" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                  Tidak ada PRD ditemukan
                </h3>
                <p className="body-sm text-[var(--color-text-secondary)] mb-6">
                  Coba ubah kata kunci pencarian atau filter kategori.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("All");
                  }}
                >
                  Reset Filter
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredPRDs.map((prd) => (
                  <PRDGridCard key={prd.id} prd={prd} />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredPRDs.map((prd) => (
                  <PRDListCard key={prd.id} prd={prd} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function PRDGridCard({
  prd,
}: {
  prd: (typeof mockPRDs)[number];
}) {
  return (
    <Card hover className="flex flex-col">
      <div className="flex justify-between items-start mb-3">
        <Badge variant="default">{prd.category}</Badge>
        <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      <h3 className="font-heading text-base font-semibold text-[var(--color-text-primary)] mb-2 line-clamp-2">
        {prd.title}
      </h3>
      <p className="body-sm text-[var(--color-text-secondary)] line-clamp-2 flex-1 mb-4">
        {prd.description}
      </p>
      <div className="flex justify-between items-center pt-3 border-t border-[var(--color-border-subtle)] mt-auto">
        <div className="flex items-center gap-1.5 body-sm text-[var(--color-text-secondary)]">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs">{prd.updatedAt}</span>
        </div>
        <Badge variant={statusColors[prd.status] || "default"}>
          {prd.status}
        </Badge>
      </div>
    </Card>
  );
}

function PRDListCard({
  prd,
}: {
  prd: (typeof mockPRDs)[number];
}) {
  return (
    <div className="bg-[var(--color-surface-canvas)] border border-[var(--color-border-subtle)] rounded-lg p-4 flex items-center gap-4 hover:shadow-sm hover:border-[var(--color-outline-variant)] transition-all group cursor-pointer">
      <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-container-low)] flex items-center justify-center flex-shrink-0">
        <FileTextIcon />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-heading text-sm font-semibold text-[var(--color-text-primary)] truncate">
          {prd.title}
        </h3>
        <p className="body-sm text-[var(--color-text-secondary)] truncate">
          {prd.description}
        </p>
      </div>
      <div className="hidden sm:flex items-center gap-3">
        <Badge variant="default">{prd.category}</Badge>
        <Badge variant={statusColors[prd.status] || "default"}>
          {prd.status}
        </Badge>
        <span className="body-sm text-[var(--color-text-secondary)] text-xs">
          {prd.updatedAt}
        </span>
      </div>
      <button className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
}

function FileTextIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-[var(--color-text-secondary)]"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}
