"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Edit3,
  Share2,
  Archive,
  Trash2,
  Zap,
  HelpCircle,
  Code,
} from "lucide-react";

const navItems = [
  { icon: <FileText className="w-5 h-5" />, label: "All Documents", href: "/dashboard" },
  { icon: <Edit3 className="w-5 h-5" />, label: "Drafts", href: "/dashboard?filter=draft" },
  { icon: <Share2 className="w-5 h-5" />, label: "Shared", href: "/dashboard?filter=shared" },
  { icon: <Archive className="w-5 h-5" />, label: "Archived", href: "/dashboard?filter=archived" },
  { icon: <Trash2 className="w-5 h-5" />, label: "Trash", href: "/dashboard?filter=trash" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex h-screen w-64 fixed left-0 top-0 border-r border-[var(--color-border-subtle)] bg-[var(--color-surface-container-low)] flex-col py-6 flex-shrink-0 z-40">
      {/* Logo */}
      <div className="px-6 mb-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
          <FileText className="w-4 h-4 text-[var(--color-on-primary)]" />
        </div>
        <div>
          <div className="label-caps text-[var(--color-text-secondary)]">
            Product Team
          </div>
          <div className="font-heading text-sm font-semibold text-[var(--color-primary)]">
            My Workspace
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href.includes("filter") && pathname === "/dashboard");
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                  : "text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)]"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-6 mt-auto pt-4 border-t border-[var(--color-border-subtle)]">
        <button className="w-full py-2 px-4 rounded-lg border border-[var(--color-outline-variant)] text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-surface-container-high)] transition-colors flex items-center justify-center gap-2 mb-4 cursor-pointer">
          <Zap className="w-4 h-4" /> Upgrade to Pro
        </button>
        <div className="space-y-1">
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] transition-all"
          >
            <HelpCircle className="w-4 h-4" /> Help Center
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--color-on-surface-variant)] hover:bg-[var(--color-surface-container-high)] transition-all"
          >
            <Code className="w-4 h-4" /> API Docs
          </Link>
        </div>
      </div>
    </aside>
  );
}
