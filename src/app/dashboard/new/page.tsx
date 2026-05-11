"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Lightbulb,
  UserSearch,
  X,
  FileText,
  Loader2,
} from "lucide-react";

interface FormData {
  productName: string;
  problemDescription: string;
  targetUsers: string;
  coreFeatures: string;
  techStack: string;
  platform: string;
  integrations: string;
  businessGoals: string;
  successMetrics: string;
  constraints: string;
  outOfScope: string;
}

function IconMagicButton({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconAutoAwesome({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M19 9l1.5-3L23 4.5 20.5 3 19 0 17.5 3 15 4.5 17.5 6 19 9zm-6.5 2.5L14 8l1.5 2.5L18 12l-2.5 1.5L14 16l-1.5-2.5L10 12l2.5-1.5zM4.5 8L6 5.5 8.5 4 6 2.5 4.5 0 3 2.5 0.5 4 3 5.5 4.5 8zM19 13l-1.5 2.5L15 17l2.5 1.5L19 21l1.5-2.5L23 17l-2.5-1.5L19 13zm-9 3l-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2z" />
    </svg>
  );
}

function FormInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  rows,
  required = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  rows?: number;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[var(--color-text-primary)]">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {rows ? (
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="w-full px-4 py-3 rounded-lg border border-[var(--color-border-subtle)] focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] outline-none text-sm text-[var(--color-text-primary)] transition-colors bg-[var(--color-surface-canvas)] resize-y"
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-[var(--color-border-subtle)] focus:border-[var(--color-secondary)] focus:ring-1 focus:ring-[var(--color-secondary)] outline-none text-sm text-[var(--color-text-primary)] transition-colors bg-[var(--color-surface-canvas)]"
        />
      )}
    </div>
  );
}

const STEPS = ["Vision", "Details", "Goals", "Finalize"] as const;
type Step = (typeof STEPS)[number];
const STEP_INDEX: Record<Step, number> = { Vision: 0, Details: 1, Goals: 2, Finalize: 3 };

export default function NewPRDWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("Vision");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormData>({
    productName: "",
    problemDescription: "",
    targetUsers: "",
    coreFeatures: "",
    techStack: "",
    platform: "",
    integrations: "",
    businessGoals: "",
    successMetrics: "",
    constraints: "",
    outOfScope: "",
  });

  const currentIdx = STEP_INDEX[currentStep];
  const progressPercent = STEPS.length > 1 ? (currentIdx / (STEPS.length - 1)) * 100 : 0;
  const requiredMissing = [
    !form.productName.trim() && "Nama Produk",
    !form.problemDescription.trim() && "Deskripsi Masalah",
    !form.targetUsers.trim() && "Target Pengguna",
    !form.coreFeatures.trim() && "Fitur Utama",
  ].filter(Boolean) as string[];

  function updateForm(key: keyof FormData, value: string) {
    setError("");
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    const nextIdx = currentIdx + 1;
    if (nextIdx < STEPS.length) setCurrentStep(STEPS[nextIdx]);
  }

  function goBack() {
    const prevIdx = currentIdx - 1;
    if (prevIdx >= 0) setCurrentStep(STEPS[prevIdx]);
  }

  async function handleGenerate() {
    if (requiredMissing.length > 0) {
      setError(`Lengkapi field wajib: ${requiredMissing.join(", ")}.`);
      setCurrentStep("Vision");
      return;
    }

    setIsGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/prds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.prd?.id) {
        throw new Error(data.error || "Gagal membuat PRD.");
      }
      router.push(`/dashboard/${data.prd.id}/edit`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat PRD.");
    } finally {
      setIsGenerating(false);
    }
  }

  function renderStepContent() {
    switch (currentStep) {
      case "Vision":
        return (
          <div>
            <h1 className="heading-headline-lg text-[var(--color-text-primary)] mb-3">Product Vision</h1>
            <p className="text-base text-[var(--color-text-secondary)] mb-6">Definisikan masalah inti yang ingin Anda selesaikan dan untuk siapa solusi ini dibangun.</p>
            <form className="flex flex-col gap-4 bg-[var(--color-surface-canvas)] p-6 rounded-xl border border-[var(--color-border-subtle)] shadow-sm">
              <FormInput required label="Nama Produk" placeholder="Misal: FinTrack Pro" value={form.productName} onChange={(v) => updateForm("productName", v)} />
              <FormInput required label="Deskripsi Masalah" placeholder="Jelaskan masalah utama yang dihadapi pengguna saat ini..." value={form.problemDescription} onChange={(v) => updateForm("problemDescription", v)} rows={4} />
              <FormInput required label="Target Pengguna" placeholder="Misal: Manajer Keuangan UMKM" value={form.targetUsers} onChange={(v) => updateForm("targetUsers", v)} />
              <FormInput required label="Fitur Utama (pisahkan dengan koma atau baris baru)" placeholder="Misal: Dashboard analitik real-time, Ekspor PDF, Integrasi Bank" value={form.coreFeatures} onChange={(v) => updateForm("coreFeatures", v)} rows={3} />
            </form>
          </div>
        );
      case "Details":
        return (
          <div>
            <h1 className="heading-headline-lg text-[var(--color-text-primary)] mb-3">Detail Produk</h1>
            <p className="text-base text-[var(--color-text-secondary)] mb-6">Tambahkan detail teknis dan informasi tambahan tentang produk Anda.</p>
            <form className="flex flex-col gap-4 bg-[var(--color-surface-canvas)] p-6 rounded-xl border border-[var(--color-border-subtle)] shadow-sm">
              <FormInput label="Tech Stack (Opsional)" placeholder="Misal: Next.js, Node.js, PostgreSQL" value={form.techStack} onChange={(v) => updateForm("techStack", v)} />
              <FormInput label="Platform" placeholder="Misal: Web, Mobile iOS & Android" value={form.platform} onChange={(v) => updateForm("platform", v)} />
              <FormInput label="Integrasi Pihak Ketiga" placeholder="Misal: Payment gateway, CRM, Email service" value={form.integrations} onChange={(v) => updateForm("integrations", v)} rows={3} />
              <FormInput label="Constraint / Batasan" placeholder="Misal: Harus selesai 6 minggu, budget terbatas, wajib comply dengan GDPR" value={form.constraints} onChange={(v) => updateForm("constraints", v)} rows={3} />
            </form>
          </div>
        );
      case "Goals":
        return (
          <div>
            <h1 className="heading-headline-lg text-[var(--color-text-primary)] mb-3">Goals & Metrics</h1>
            <p className="text-base text-[var(--color-text-secondary)] mb-6">Tentukan tujuan produk dan bagaimana Anda akan mengukur keberhasilannya.</p>
            <form className="flex flex-col gap-4 bg-[var(--color-surface-canvas)] p-6 rounded-xl border border-[var(--color-border-subtle)] shadow-sm">
              <FormInput label="Tujuan Bisnis" placeholder="Misal: Meningkatkan konversi sebesar 20%" value={form.businessGoals} onChange={(v) => updateForm("businessGoals", v)} rows={3} />
              <FormInput label="Success Metrics" placeholder="Misal: DAU, Conversion Rate, NPS" value={form.successMetrics} onChange={(v) => updateForm("successMetrics", v)} rows={3} />
              <FormInput label="Out of Scope" placeholder="Misal: Kolaborasi real-time, enterprise SSO, mobile app native" value={form.outOfScope} onChange={(v) => updateForm("outOfScope", v)} rows={3} />
            </form>
          </div>
        );
      case "Finalize":
        return (
          <div>
            <h1 className="heading-headline-lg text-[var(--color-text-primary)] mb-3">Finalisasi</h1>
            <p className="text-base text-[var(--color-text-secondary)] mb-6">Periksa kembali semua data, lalu generate PRD Anda.</p>
            <div className="bg-[var(--color-surface-canvas)] p-6 rounded-xl border border-[var(--color-border-subtle)] shadow-sm space-y-4">
              {Object.entries({
                "Nama Produk": form.productName,
                "Deskripsi Masalah": form.problemDescription,
                "Target Pengguna": form.targetUsers,
                "Fitur Utama": form.coreFeatures,
                "Tech Stack": form.techStack,
                Platform: form.platform,
                Integrasi: form.integrations,
                "Tujuan Bisnis": form.businessGoals,
                "Success Metrics": form.successMetrics,
                Constraint: form.constraints,
                "Out of Scope": form.outOfScope,
              }).map(([label, value]) => (
                value ? (
                  <div key={label}>
                    <div className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">{label}</div>
                    <div className="text-sm text-[var(--color-text-primary)] leading-relaxed whitespace-pre-wrap">{value}</div>
                  </div>
                ) : null
              ))}
              {requiredMissing.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">Field wajib belum lengkap: {requiredMissing.join(", ")}.</div>
              )}
            </div>
            {error && <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-ai-accent)] text-white text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              {isGenerating ? "Generating PRD..." : "Generate PRD"}
            </button>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-background)] flex flex-col">
      <header className="w-full bg-[var(--color-surface-canvas)] border-b border-[var(--color-border-subtle)] h-16 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[var(--color-text-primary)] fill-current" />
          <span className="font-heading text-xl font-bold text-[var(--color-text-primary)]">PRD.ai</span>
          <span className="text-sm text-[var(--color-text-secondary)] ml-3 border-l border-[var(--color-border-subtle)] pl-4 hidden sm:inline">Pembuatan Dokumen Baru</span>
        </div>
        <Link href="/dashboard" className="flex items-center justify-center p-2 rounded-full hover:bg-[var(--color-surface-container-high)] transition-colors text-[var(--color-text-secondary)]">
          <X className="w-5 h-5" />
        </Link>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-8 flex flex-col">
        <div className="w-full mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-[var(--color-border-subtle)] -z-10" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[var(--color-primary)] -z-10 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            {STEPS.map((step, idx) => {
              const isActive = idx <= currentIdx;
              return (
                <div key={step} className="flex flex-col items-center gap-2 bg-[var(--color-surface-background)] px-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${isActive ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] border-[var(--color-primary)]" : "bg-[var(--color-surface-canvas)] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)]"}`}>{idx + 1}</div>
                  <span className={`text-xs font-mono uppercase tracking-wider transition-colors ${isActive ? "text-[var(--color-text-primary)]" : "text-[var(--color-text-secondary)]"}`}>{step}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
          <div className="col-span-1 md:col-span-8 flex flex-col gap-6">{renderStepContent()}</div>
          <div className="col-span-1 md:col-span-4">
            <div className="sticky top-24 bg-[var(--color-surface-canvas)] rounded-xl border border-[var(--color-border-subtle)] shadow-sm overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-[var(--color-surface-background)] to-[var(--color-primary-fixed)]/20 p-4 border-b border-[var(--color-border-subtle)] flex items-center gap-3">
                <IconAutoAwesome className="w-5 h-5 text-[var(--color-ai-accent)]" />
                <h3 className="text-base font-semibold text-[var(--color-text-primary)]">Tips dari AI</h3>
              </div>
              <div className="p-4 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-[var(--color-text-secondary)] mt-0.5 flex-shrink-0" />
                  <div><span className="text-sm font-medium text-[var(--color-text-primary)] block">Fokus pada Masalah</span><span className="text-xs text-[var(--color-text-secondary)] mt-1 block">Jelaskan pain point dan dampaknya sebelum membahas solusi.</span></div>
                </div>
                <div className="w-full h-px bg-[var(--color-border-subtle)]" />
                <div className="flex items-start gap-3">
                  <UserSearch className="w-5 h-5 text-[var(--color-text-secondary)] mt-0.5 flex-shrink-0" />
                  <div><span className="text-sm font-medium text-[var(--color-text-primary)] block">Spesifikkan Target Pengguna</span><span className="text-xs text-[var(--color-text-secondary)] mt-1 block">&quot;Semua orang&quot; bukan target yang cukup tajam untuk PRD.</span></div>
                </div>
              </div>
              <div className="p-4 bg-[var(--color-surface-container-low)] mt-auto">
                <button type="button" className="w-full py-2 px-4 rounded-lg bg-[var(--color-surface-canvas)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] text-sm font-medium flex items-center justify-center gap-2 hover:border-[var(--color-ai-accent)] hover:text-[var(--color-ai-accent)] transition-colors cursor-pointer">
                  <IconMagicButton className="w-4 h-4" /> Bantu Saya Menulis
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full mt-8 pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
          <button onClick={goBack} disabled={currentIdx === 0 || isGenerating} className={`px-6 py-3 rounded-lg border border-[var(--color-border-subtle)] text-sm font-medium transition-colors flex items-center gap-2 ${currentIdx === 0 ? "opacity-30 cursor-not-allowed" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-container-low)] cursor-pointer"}`}>
            <ArrowLeft className="w-5 h-5" /> Previous
          </button>
          {currentIdx === STEPS.length - 1 ? (
            <button onClick={handleGenerate} disabled={isGenerating} className="px-6 py-3 rounded-lg text-sm font-medium transition-opacity flex items-center gap-2 shadow-sm bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:opacity-90 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              Generate PRD
            </button>
          ) : (
            <button onClick={goNext} disabled={isGenerating} className="px-6 py-3 rounded-lg text-sm font-medium transition-opacity flex items-center gap-2 shadow-sm bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:opacity-90 cursor-pointer">
              Next Step <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
