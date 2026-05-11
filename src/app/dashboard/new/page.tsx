"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  ArrowLeft,
  ArrowRight,
  Check,
  Sparkles,
  LayoutTemplate,
  ChevronRight,
  Loader2,
} from "lucide-react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  isPublic: boolean;
}

interface FormData {
  title: string;
  description: string;
  language: string;
  templateId: string;
}

type Step = "info" | "template" | "review";

// ─── Step 1: Info ─────────────────────────────────────────

function StepInfo({
  form,
  onChange,
}: {
  form: FormData;
  onChange: (updates: Partial<FormData>) => void;
}) {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="font-heading text-xl font-semibold text-[var(--color-text-primary)] mb-1">
          Informasi Dokumen
        </h2>
        <p className="body-sm text-[var(--color-text-secondary)]">
          Beri judul dan deskripsi untuk PRD yang akan dibuat.
        </p>
      </div>

      <Input
        label="Judul PRD"
        placeholder="Contoh: User Authentication Revamp v2.0"
        value={form.title}
        onChange={(e) => onChange({ title: e.target.value })}
        required
      />

      <Textarea
        label="Deskripsi Produk"
        placeholder="Jelaskan secara singkat produk atau fitur yang akan dibuat. Semakin detail deskripsi, semakin baik hasil PRD-nya."
        value={form.description}
        onChange={(e) => onChange({ description: e.target.value })}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[var(--color-text-primary)]">
          Bahasa
        </label>
        <select
          value={form.language}
          onChange={(e) => onChange({ language: e.target.value })}
          className="w-full px-3 py-2.5 bg-[var(--color-surface-canvas)] border border-[var(--color-border-subtle)] rounded-[var(--radius-md)] text-sm text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:border-transparent transition-colors duration-150"
        >
          <option value="id">Bahasa Indonesia</option>
          <option value="en">English</option>
        </select>
      </div>

      {/* Tips */}
      <div className="bg-[var(--color-surface-container-low)] rounded-xl p-4 border border-[var(--color-border-subtle)]">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[var(--color-ai-accent)] flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
              Tips menulis deskripsi yang baik
            </div>
            <ul className="text-xs text-[var(--color-text-secondary)] space-y-1">
              <li>• Sebutkan masalah yang ingin dipecahkan</li>
              <li>• Jelaskan target pengguna</li>
              <li>• Cantumkan fitur utama yang diinginkan</li>
              <li>• Semakin detail, semakin akurat hasil PRD</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Template ─────────────────────────────────────

function StepTemplate({
  selectedId,
  onSelect,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch("/api/templates");
        const data = await res.json();
        setTemplates(data.templates || []);
      } catch (err) {
        console.error("Failed to fetch templates:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--color-text-secondary)]" />
      </div>
    );
  }

  const categories = [
    ...new Set(templates.map((t) => t.category)),
  ] as string[];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="font-heading text-xl font-semibold text-[var(--color-text-primary)] mb-1">
          Pilih Template
        </h2>
        <p className="body-sm text-[var(--color-text-secondary)]">
          Pilih template yang sesuai dengan jenis produk Anda. Atau gunakan
          template kosong untuk memulai dari awal.
        </p>
      </div>

      {/* Empty template card */}
      <button
        onClick={() => onSelect("")}
        className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
          selectedId === ""
            ? "border-[var(--color-ai-accent)] bg-[var(--color-ai-accent)]/5"
            : "border-[var(--color-border-subtle)] hover:border-[var(--color-outline-variant)] bg-[var(--color-surface-canvas)]"
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              selectedId === ""
                ? "bg-[var(--color-ai-accent)] text-white"
                : "bg-[var(--color-surface-container-low)] text-[var(--color-text-secondary)]"
            }`}
          >
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="font-heading text-base font-semibold text-[var(--color-text-primary)]">
              Template Kosong
            </div>
            <div className="body-sm text-[var(--color-text-secondary)]">
              Mulai dari awal tanpa struktur template
            </div>
          </div>
          {selectedId === "" && (
            <Check className="w-5 h-5 text-[var(--color-ai-accent)]" />
          )}
        </div>
      </button>

      {/* Category sections */}
      {categories.map((cat) => (
        <div key={cat}>
          <div className="label-caps text-[var(--color-text-secondary)] mb-3">
            {cat}
          </div>
          <div className="space-y-2">
            {templates
              .filter((t) => t.category === cat)
              .map((template) => (
                <button
                  key={template.id}
                  onClick={() => onSelect(template.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    selectedId === template.id
                      ? "border-[var(--color-ai-accent)] bg-[var(--color-ai-accent)]/5"
                      : "border-[var(--color-border-subtle)] hover:border-[var(--color-outline-variant)] bg-[var(--color-surface-canvas)]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        selectedId === template.id
                          ? "bg-[var(--color-ai-accent)] text-white"
                          : "bg-[var(--color-surface-container-low)] text-[var(--color-text-secondary)]"
                      }`}
                    >
                      <LayoutTemplate className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-heading text-base font-semibold text-[var(--color-text-primary)]">
                        {template.name}
                      </div>
                      <div className="body-sm text-[var(--color-text-secondary)]">
                        {template.description}
                      </div>
                    </div>
                    {selectedId === template.id && (
                      <Check className="w-5 h-5 text-[var(--color-ai-accent)]" />
                    )}
                  </div>
                </button>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Step 3: Review & Generate ────────────────────────────

function StepReview({
  form,
  onGenerate,
  generating,
  error,
}: {
  form: FormData;
  onGenerate: () => void;
  generating: boolean;
  error: string | null;
}) {
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="font-heading text-xl font-semibold text-[var(--color-text-primary)] mb-1">
          Review & Generate
        </h2>
        <p className="body-sm text-[var(--color-text-secondary)]">
          Periksa kembali informasi di bawah, lalu klik Generate untuk memulai.
        </p>
      </div>

      <Card>
        <div className="space-y-4">
          <div>
            <div className="label-caps text-[var(--color-text-secondary)] mb-1">
              Judul
            </div>
            <div className="font-heading text-base font-semibold text-[var(--color-text-primary)]">
              {form.title || "(belum diisi)"}
            </div>
          </div>

          {form.description && (
            <div>
              <div className="label-caps text-[var(--color-text-secondary)] mb-1">
                Deskripsi
              </div>
              <div className="body-sm text-[var(--color-text-primary)] leading-relaxed">
                {form.description}
              </div>
            </div>
          )}

          <div>
            <div className="label-caps text-[var(--color-text-secondary)] mb-1">
              Bahasa
            </div>
            <Badge variant="default">
              {form.language === "id" ? "Bahasa Indonesia" : "English"}
            </Badge>
          </div>

          <div>
            <div className="label-caps text-[var(--color-text-secondary)] mb-1">
              Template
            </div>
            <Badge variant="secondary">
              {form.templateId ? "Template terpilih" : "Template kosong"}
            </Badge>
          </div>
        </div>
      </Card>

      {error && (
        <div className="p-4 rounded-xl bg-[var(--color-error-container)] text-sm text-[var(--color-on-error-container)]">
          {error}
        </div>
      )}

      <div className="bg-gradient-to-r from-[var(--color-ai-accent)]/10 to-[var(--color-secondary)]/10 rounded-xl p-6 border border-[var(--color-ai-accent)]/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[var(--color-ai-accent)]/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-[var(--color-ai-accent)]" />
          </div>
          <div>
            <div className="text-sm font-semibold text-[var(--color-text-primary)] mb-1">
              Siap di-Generate
            </div>
            <div className="text-xs text-[var(--color-text-secondary)]">
              AI akan membuat PRD berdasarkan informasi di atas. Proses ini
              memakan waktu sekitar 10-20 detik. Anda bisa mengedit hasilnya
              nanti.
            </div>
          </div>
        </div>
      </div>

      <Button
        size="lg"
        className="w-full gap-2"
        onClick={onGenerate}
        disabled={generating || !form.title.trim()}
        loading={generating}
      >
        {generating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Menghasilkan PRD...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate PRD
          </>
        )}
      </Button>
    </div>
  );
}

// ─── Main Wizard Page ─────────────────────────────────────

export default function NewPRDWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>("info");
  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    language: "id",
    templateId: "",
  });
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stepOrder: Step[] = ["info", "template", "review"];
  const currentIndex = stepOrder.indexOf(currentStep);
  const progress = ((currentIndex + 1) / stepOrder.length) * 100;

  function updateForm(updates: Partial<FormData>) {
    setForm((prev) => ({ ...prev, ...updates }));
  }

  function goNext() {
    if (currentStep === "info" && !form.title.trim()) return;
    const nextIndex = currentIndex + 1;
    if (nextIndex < stepOrder.length) {
      setCurrentStep(stepOrder[nextIndex]);
    }
  }

  function goBack() {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(stepOrder[prevIndex]);
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/prds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          templateId: form.templateId || undefined,
          language: form.language,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat PRD");
      }

      router.push(`/dashboard/${data.prd.id}/edit`);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-background)]">
      <Sidebar />

      <div className="md:ml-64 flex flex-col min-h-screen">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-[var(--container-max)] mx-auto space-y-6">
            {/* Back link */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali ke Dashboard
            </Link>

            {/* Progress bar */}
            <div className="bg-[var(--color-surface-canvas)] border border-[var(--color-border-subtle)] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="font-heading text-xl font-bold text-[var(--color-text-primary)]">
                  Buat PRD Baru
                </h1>
                <div className="label-caps text-[var(--color-text-secondary)]">
                  Langkah {currentIndex + 1} dari {stepOrder.length}
                </div>
              </div>

              {/* Step indicators */}
              <div className="flex items-center gap-0 mb-6">
                {stepOrder.map((step, idx) => (
                  <React.Fragment key={step}>
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          idx <= currentIndex
                            ? "bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                            : "bg-[var(--color-surface-container-highest)] text-[var(--color-text-secondary)]"
                        }`}
                      >
                        {idx < currentIndex ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium hidden sm:inline ${
                          idx <= currentIndex
                            ? "text-[var(--color-text-primary)]"
                            : "text-[var(--color-text-secondary)]"
                        }`}
                      >
                        {step === "info"
                          ? "Info"
                          : step === "template"
                            ? "Template"
                            : "Review"}
                      </span>
                    </div>
                    {idx < stepOrder.length - 1 && (
                      <div className="flex-1 h-px bg-[var(--color-border-subtle)] mx-3 relative">
                        <div
                          className="absolute inset-0 bg-[var(--color-primary)] transition-all duration-300"
                          style={{
                            width: `${
                              idx < currentIndex
                                ? "100%"
                                : idx === currentIndex
                                  ? "0%"
                                  : "0%"
                            }`,
                          }}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Step content */}
              <div className="pt-4">
                {currentStep === "info" && (
                  <StepInfo form={form} onChange={updateForm} />
                )}
                {currentStep === "template" && (
                  <StepTemplate
                    selectedId={form.templateId}
                    onSelect={(id) => updateForm({ templateId: id })}
                  />
                )}
                {currentStep === "review" && (
                  <StepReview
                    form={form}
                    onGenerate={handleGenerate}
                    generating={generating}
                    error={error}
                  />
                )}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--color-border-subtle)]">
                <div>
                  {currentStep !== "info" && (
                    <Button variant="ghost" onClick={goBack} className="gap-1.5">
                      <ArrowLeft className="w-4 h-4" /> Sebelumnya
                    </Button>
                  )}
                </div>
                <div>
                  {currentStep !== "review" && (
                    <Button
                      onClick={goNext}
                      className="gap-1.5"
                      disabled={currentStep === "info" && !form.title.trim()}
                    >
                      Selanjutnya <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
