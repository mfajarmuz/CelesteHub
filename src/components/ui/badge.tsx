import React from "react";

type BadgeVariant = "default" | "primary" | "secondary" | "success" | "warning" | "error" | "info" | "critical" | "ai";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-[var(--color-surface-container)] text-[var(--color-on-surface)]",
  primary:
    "bg-[var(--color-primary)] text-[var(--color-on-primary)]",
  secondary:
    "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]",
  // DESIGN.md §2.4: Final → bg #D1FAE5 text #065F46
  success:
    "bg-[var(--color-badge-final-bg)] text-[var(--color-badge-final-text)]",
  // DESIGN.md §2.4: Draft → bg #FFF8E1 text #92400E
  warning:
    "bg-[var(--color-badge-draft-bg)] text-[var(--color-badge-draft-text)]",
  error:
    "bg-[var(--color-error-container)] text-[var(--color-on-error-container)]",
  // DESIGN.md §2.4: Info / New → bg #EFF6FF text #1D4ED8
  info:
    "bg-[var(--color-badge-info-bg)] text-[var(--color-badge-info-text)]",
  // DESIGN.md §2.4: Critical → bg #FFEBEE text #B91C1C
  critical:
    "bg-[var(--color-badge-critical-bg)] text-[var(--color-badge-critical-text)]",
  // DESIGN.md §2.4: AI Accent → bg #F5F3FF text #6D28D9
  ai:
    "bg-[var(--color-badge-ai-bg)] text-[var(--color-badge-ai-text)]",
};

export function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5
        text-xs font-medium
        rounded-full
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
