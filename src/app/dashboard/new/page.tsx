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
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────

interface FormData {
  productName: string;
  problemDescription: string;
  targetUsers: string;
  coreFeatures: string;
}

// ─── Icons (Material Symbols replacements) ──────────────

function IconMagicButton({ className = "w-4 h-4" }: { className?: string }) {
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

function IconAutoAwesome({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
    >
      <path d="M19 9l1.5-3L23 4.5 20.5 3 19 0 17.5 3 15 4.5 17.5 6 19 9zm-6.5 2.5L14 8l1.5 2.5L18 12l-2.5 1.5L14 16l-1.5-2.5L10 12l2.5-1.5zM4.5 8L6 5.5 8.5 4 6 2.5 4.5 0 3 2.5 0.5 4 3 5.5 4.5 8zM19 13l-1.5 2.5L15 17l2.5 1.5L19 21l1.5-2.5L23 17l-2.5-1.5L19 13zm-9 3l-1 2-2 1 2 1 1 2 1-2 2-1-2-1-1-2z" />
    </svg>
  );
}

function IconClose({ className = "w-5 h-5" }: { className?: string }) {
  return <X className={className} />;
}

// ─── Form Input Component ──────────────────────────────

function FormInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  rows,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  rows?: number;
}) {
  const Component = rows ? "textarea" : "input";
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-[var(--color-text-primary)]">
        {label}
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

// ─── Steps ──────────────────────────────────────────────

const STEPS = ["Vision", "Details", "Goals", "Finalize"] as const;
type Step = (typeof STEPS)[number];
const STEP_INDEX: Record<Step, number> = {
  Vision: 0,
  Details: 1,
  Goals: 2,
  Finalize: 3,
};

// ─── Main Wizard Page ──────────────────────────────────

export default function NewPRDWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("Vision");
  const [form, setForm] = useState<FormData>({
    productName: "",
    problemDescription: "",
    targetUsers: "",
    coreFeatures: "",
  });

  const currentIdx = STEP_INDEX[currentStep];
  const progressPercent =
    STEPS.length > 1 ? (currentIdx / (STEPS.length - 1)) * 100 : 0;

  function updateForm(key: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function goNext() {
    const nextIdx = currentIdx + 1;
    if (nextIdx < STEPS.length) {
      setCurrentStep(STEPS[nextIdx]);
    }
  }

  function goBack() {
    const prevIdx = currentIdx - 1;
    if (prevIdx >= 0) {
      setCurrentStep(STEPS[prevIdx]);
    }
  }

  // ─── Step Content ─────────────────────────────────────

  function renderStepContent() {
    switch (currentStep) {
      case "Vision":
        return (
          <div>
            <h1 className="heading-headline-lg text-[var(--color-text-primary)] mb-3">
              Product Vision
            </h1>
            <p className="text-base text-[var(--color-text-secondary)] mb-6">
              Definisikan masalah inti yang ingin Anda selesaikan dan untuk
              siapa solusi ini dibangun.
            </p>
            <form className="flex flex-col gap-4 bg-[var(--color-surface-canvas)] p-6 rounded-xl border border-[var(--color-border-subtle)] shadow-sm">
              <FormInput
                label="Nama Produk"
                placeholder="Misal: FinTrack Pro"
                value={form.productName}
                onChange={(v) => updateForm("productName", v)}
              />
              <FormInput
                label="Deskripsi Masalah"
                placeholder="Jelaskan masalah utama yang dihadapi pengguna saat ini..."
                value={form.problemDescription}
                onChange={(v) => updateForm("problemDescription", v)}
                rows={4}
              />
              <FormInput
                label="Target Pengguna"
                placeholder="Misal: Manajer Keuangan UMKM"
                value={form.targetUsers}
                onChange={(v) => updateForm("targetUsers", v)}
              />
              <FormInput
                label="Fitur Utama (Pisahkan dengan koma)"
                placeholder="Misal: Dashboard analitik real-time, Ekspor PDF, Integrasi Bank"
                value={form.coreFeatures}
                onChange={(v) => updateForm("coreFeatures", v)}
                rows={3}
              />
            </form>
          </div>
        );
      case "Details":
        return (
          <div>
            <h1 className="heading-headline-lg text-[var(--color-text-primary)] mb-3">
              Detail Produk
            </h1>
            <p className="text-base text-[var(--color-text-secondary)] mb-6">
              Tambahkan detail teknis dan informasi tambahan tentang produk
              Anda.
            </p>
            <form className="flex flex-col gap-4 bg-[var(--color-surface-canvas)] p-6 rounded-xl border border-[var(--color-border-subtle)] shadow-sm">
              <FormInput
                label="Tech Stack (Opsional)"
                placeholder="Misal: React Native, Node.js, PostgreSQL"
                value={form.coreFeatures}
                onChange={(v) => updateForm("coreFeatures", v)}
              />
              <FormInput
                label="Platform"
                placeholder="Misal: Web, Mobile iOS & Android"
                value={form.targetUsers}
                onChange={(v) => updateForm("targetUsers", v)}
              />
              <FormInput
                label="Integrasi Pihak Ketiga"
                placeholder="Misal: Payment gateway, CRM, Email service"
                value={form.problemDescription}
                onChange={(v) => updateForm("problemDescription", v)}
                rows={3}
              />
            </form>
          </div>
        );
      case "Goals":
        return (
          <div>
            <h1 className="heading-headline-lg text-[var(--color-text-primary)] mb-3">
              Goals & Metrics
            </h1>
            <p className="text-base text-[var(--color-text-secondary)] mb-6">
              Tentukan tujuan produk dan bagaimana Anda akan mengukur
              keberhasilannya.
            </p>
            <form className="flex flex-col gap-4 bg-[var(--color-surface-canvas)] p-6 rounded-xl border border-[var(--color-border-subtle)] shadow-sm">
              <FormInput
                label="Tujuan Bisnis"
                placeholder="Misal: Meningkatkan konversi sebesar 20%"
                value={form.productName}
                onChange={(v) => updateForm("productName", v)}
              />
              <FormInput
                label="Success Metrics"
                placeholder="Misal: DAU, Conversion Rate, NPS"
                value={form.coreFeatures}
                onChange={(v) => updateForm("coreFeatures", v)}
                rows={3}
              />
            </form>
          </div>
        );
      case "Finalize":
        return (
          <div>
            <h1 className="heading-headline-lg text-[var(--color-text-primary)] mb-3">
              Finalisasi
            </h1>
            <p className="text-base text-[var(--color-text-secondary)] mb-6">
              Periksa kembali semua data, lalu generate PRD Anda.
            </p>
            <div className="bg-[var(--color-surface-canvas)] p-6 rounded-xl border border-[var(--color-border-subtle)] shadow-sm space-y-4">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
                  Nama Produk
                </div>
                <div className="text-base font-semibold text-[var(--color-text-primary)]">
                  {form.productName || "(belum diisi)"}
                </div>
              </div>
              {form.problemDescription && (
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
                    Deskripsi Masalah
                  </div>
                  <div className="text-sm text-[var(--color-text-primary)] leading-relaxed">
                    {form.problemDescription}
                  </div>
                </div>
              )}
              {form.targetUsers && (
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
                    Target Pengguna
                  </div>
                  <div className="text-sm text-[var(--color-text-primary)]">
                    {form.targetUsers}
                  </div>
                </div>
              )}
              {form.coreFeatures && (
                <div>
                  <div className="text-xs font-mono uppercase tracking-wider text-[var(--color-text-secondary)] mb-1">
                    Fitur Utama
                  </div>
                  <div className="text-sm text-[var(--color-text-primary)]">
                    {form.coreFeatures}
                  </div>
                </div>
              )}
            </div>
            <button className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-ai-accent)] text-white text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm cursor-pointer">
              <Sparkles className="w-5 h-5" /> Generate PRD
            </button>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-background)] flex flex-col">
      {/* Wizard Header (Focused task, global nav suppressed) */}
      <header className="w-full bg-[var(--color-surface-canvas)] border-b border-[var(--color-border-subtle)] h-16 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[var(--color-text-primary)] fill-current" />
          <span className="font-heading text-xl font-bold text-[var(--color-text-primary)]">
            PRD.ai
          </span>
          <span className="text-sm text-[var(--color-text-secondary)] ml-3 border-l border-[var(--color-border-subtle)] pl-4 hidden sm:inline">
            Pembuatan Dokumen Baru
          </span>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center justify-center p-2 rounded-full hover:bg-[var(--color-surface-container-high)] transition-colors text-[var(--color-text-secondary)]"
        >
          <X className="w-5 h-5" />
        </Link>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-8 flex flex-col">
        {/* Progress Stepper */}
        <div className="w-full mb-8">
          <div className="flex items-center justify-between relative">
            {/* Line background */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-[var(--color-border-subtle)] -z-10"></div>
            {/* Active Line */}
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-[var(--color-primary)] -z-10 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>

            {STEPS.map((step, idx) => {
              const isActive = idx <= currentIdx;
              return (
                <div
                  key={step}
                  className="flex flex-col items-center gap-2 bg-[var(--color-surface-background)] px-2"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all ${
                      isActive
                        ? "bg-[var(--color-primary)] text-[var(--color-on-primary)] border-[var(--color-primary)]"
                        : "bg-[var(--color-surface-canvas)] text-[var(--color-text-secondary)] border-[var(--color-border-subtle)]"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span
                    className={`text-xs font-mono uppercase tracking-wider transition-colors ${
                      isActive
                        ? "text-[var(--color-text-primary)]"
                        : "text-[var(--color-text-secondary)]"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Split Layout Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1">
          {/* Left: Form Input Area */}
          <div className="col-span-1 md:col-span-8 flex flex-col gap-6">
            {renderStepContent()}
          </div>

          {/* Right: AI Tips Panel */}
          <div className="col-span-1 md:col-span-4">
            <div className="sticky top-24 bg-[var(--color-surface-canvas)] rounded-xl border border-[var(--color-border-subtle)] shadow-sm overflow-hidden flex flex-col">
              {/* AI Header */}
              <div className="bg-gradient-to-r from-[var(--color-surface-background)] to-[var(--color-primary-fixed)]/20 p-4 border-b border-[var(--color-border-subtle)] flex items-center gap-3">
                <IconAutoAwesome className="w-5 h-5 text-[var(--color-ai-accent)]" />
                <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
                  Tips dari AI
                </h3>
              </div>
              {/* Content */}
              <div className="p-4 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-[var(--color-text-secondary)] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-[var(--color-text-primary)] block">
                      Fokus pada Masalah, Bukan Solusi
                    </span>
                    <span className="text-xs text-[var(--color-text-secondary)] mt-1 block">
                      Pada tahap Deskripsi Masalah, hindari menyebutkan fitur
                      aplikasi. Jelaskan metrik apa yang menurun atau rasa sakit
                      (pain point) pengguna saat ini.
                    </span>
                  </div>
                </div>
                <div className="w-full h-px bg-[var(--color-border-subtle)]"></div>
                <div className="flex items-start gap-3">
                  <UserSearch className="w-5 h-5 text-[var(--color-text-secondary)] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-medium text-[var(--color-text-primary)] block">
                      Spesifikkan Target Pengguna
                    </span>
                    <span className="text-xs text-[var(--color-text-secondary)] mt-1 block">
                      &quot;Semua orang&quot; bukanlah target yang baik. Coba
                      sebutkan rentang usia, profesi, atau kebiasaan teknologi
                      mereka.
                    </span>
                  </div>
                </div>
              </div>
              {/* Generative CTA */}
              <div className="p-4 bg-[var(--color-surface-container-low)] mt-auto">
                <button className="w-full py-2 px-4 rounded-lg bg-[var(--color-surface-canvas)] border border-[var(--color-border-subtle)] text-[var(--color-text-primary)] text-sm font-medium flex items-center justify-center gap-2 hover:border-[var(--color-ai-accent)] hover:text-[var(--color-ai-accent)] transition-colors cursor-pointer">
                  <IconMagicButton className="w-4 h-4" />
                  Bantu Saya Menulis
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="w-full mt-8 pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
          <button
            onClick={goBack}
            disabled={currentIdx === 0}
            className={`px-6 py-3 rounded-lg border border-[var(--color-border-subtle)] text-sm font-medium transition-colors flex items-center gap-2 ${
              currentIdx === 0
                ? "opacity-30 cursor-not-allowed"
                : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-container-low)] cursor-pointer"
            }`}
          >
            <ArrowLeft className="w-5 h-5" /> Previous
          </button>
          <button
            onClick={goNext}
            disabled={currentIdx === STEPS.length - 1}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-opacity flex items-center gap-2 shadow-sm ${
              currentIdx === STEPS.length - 1
                ? "opacity-30 cursor-not-allowed"
                : "bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:opacity-90 cursor-pointer"
            }`}
          >
            {currentIdx === STEPS.length - 1 ? "Complete" : "Next Step"}
            {currentIdx < STEPS.length - 1 && <ArrowRight className="w-5 h-5" />}
          </button>
        </div>
      </main>
    </div>
  );
}
