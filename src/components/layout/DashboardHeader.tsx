"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Bell, Settings, Plus, FileText } from "lucide-react";

interface DashboardHeaderProps {
  onNewPRD?: () => void;
}

export function DashboardHeader({ onNewPRD }: DashboardHeaderProps) {
  const pathname = usePathname();

  const isDashboard = pathname === "/dashboard";
  const isTemplates = pathname === "/templates";

  return (
    <header className="bg-[var(--color-surface-canvas)] border-b border-[var(--color-border-subtle)] w-full sticky top-0 z-30 flex justify-between items-center px-6 h-16">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
            <FileText className="w-4 h-4 text-[var(--color-on-primary)]" />
          </div>
          <span className="font-heading text-lg font-bold text-[var(--color-text-primary)]">
            PRD.ai
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 h-full pt-1">
          <Link
            href="/dashboard"
            className={`h-full flex items-center font-body text-sm transition-colors cursor-pointer border-b-2 ${
              isDashboard
                ? "text-[var(--color-text-primary)] font-semibold border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border-transparent"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="#"
            className="h-full flex items-center text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer border-b-2 border-transparent"
          >
            Library
          </Link>
          <Link
            href="/templates"
            className={`h-full flex items-center text-sm transition-colors cursor-pointer border-b-2 ${
              isTemplates
                ? "text-[var(--color-text-primary)] font-semibold border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] border-transparent"
            }`}
          >
            Templates
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-[var(--color-surface-container-high)] transition-colors cursor-pointer">
          <Bell className="w-5 h-5 text-[var(--color-text-secondary)]" />
        </button>
        <button className="p-2 rounded-full hover:bg-[var(--color-surface-container-high)] transition-colors cursor-pointer">
          <Settings className="w-5 h-5 text-[var(--color-text-secondary)]" />
        </button>
        <Button size="sm" onClick={onNewPRD} className="label-caps">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Document</span>
        </Button>
        <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)] flex items-center justify-center text-white text-xs font-bold ml-2">
          U
        </div>
      </div>
    </header>
  );
}
