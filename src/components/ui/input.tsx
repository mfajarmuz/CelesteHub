import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({
  label,
  error,
  helperText,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--color-text-primary)]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full px-3 py-2.5
          bg-[var(--color-surface-canvas)]
          border border-[var(--color-border-subtle)]
          rounded-[var(--radius-md)]
          text-sm text-[var(--color-text-primary)]
          placeholder:text-[var(--color-text-secondary)]
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent
          ${error ? "border-[var(--color-error)] focus:ring-[var(--color-error)]" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-[var(--color-text-secondary)]">{helperText}</p>
      )}
    </div>
  );
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  className = "",
  id,
  ...props
}: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[var(--color-text-primary)]"
        >
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`
          w-full px-3 py-2.5
          bg-[var(--color-surface-canvas)]
          border border-[var(--color-border-subtle)]
          rounded-[var(--radius-md)]
          text-sm text-[var(--color-text-primary)]
          placeholder:text-[var(--color-text-secondary)]
          transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent
          resize-vertical min-h-[100px]
          ${error ? "border-[var(--color-error)]" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
    </div>
  );
}
