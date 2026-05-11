import React from "react";

type BadgeVariant = "default" | "primary" | "secondary" | "success" | "warning" | "error";

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
  success:
    "bg-[var(--color-success-green)]/10 text-[var(--color-success-green)]",
  warning:
    "bg-amber-100 text-amber-800",
  error:
    "bg-[var(--color-error-container)] text-[var(--color-on-error-container)]",
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
