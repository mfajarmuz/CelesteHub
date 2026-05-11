"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, Settings, Plus, FileText } from "lucide-react";

interface DashboardHeaderProps {
  onNewPRD?: () => void;
}

export function DashboardHeader({ onNewPRD }: DashboardHeaderProps) {
  return (
    <header className="bg-[var(--color-surface-canvas)] border-b border-[var(--color-border-subtle)] w-full sticky top-0 z-30 flex justify-between items-center px-6 h-16">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 md:hidden">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
            <FileText className="w-4 h-4 text-[var(--color-on-primary)]" />
          </div>
          <span className="font-heading text-lg font-bold">PRD.ai</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-[var(--color-text-primary)] border-b-2 border-[var(--color-primary)] pb-1"
          >
            Dashboard
          </Link>
          <Link
            href="#"
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors border-b-2 border-transparent pb-1"
          >
            Library
          </Link>
          <Link
            href="#"
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors border-b-2 border-transparent pb-1"
          >
            Templates
          </Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-[var(--color-surface-container-high)] transition-colors cursor-pointer">
          <Bell className="w-5 h-5 text-[var(--color-text-secondary)]" />
        </button>
        <button className="p-2 rounded-full hover:bg-[var(--color-surface-container-high)] transition-colors cursor-pointer">
          <Settings className="w-5 h-5 text-[var(--color-text-secondary)]" />
        </button>
        <Button size="sm" onClick={onNewPRD}>
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Document</span>
        </Button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-ai-accent)] flex items-center justify-center text-white text-xs font-bold">
          U
        </div>
      </div>
    </header>
  );
}
