"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  FileText,
  Sparkles,
  Edit3,
  Download,
  LayoutTemplate,
  ChevronRight,
  Star,
  Check,
  Menu,
  X,
} from "lucide-react";

const features = [
  {
    icon: <Sparkles className="w-6 h-6 text-[var(--color-ai-accent)]" />,
    title: "AI Generation",
    description:
      "Hasilkan PRD lengkap dari ide sederhana. Cukup jelaskan produk Anda, AI kami yang menyusun dokumen profesional.",
  },
  {
    icon: <Edit3 className="w-6 h-6 text-[var(--color-secondary)]" />,
    title: "WYSIWYG Editor",
    description:
      "Edit hasil generasi dengan editor kaya fitur. Mendukung heading, tabel, daftar, dan formatting profesional.",
  },
  {
    icon: <Download className="w-6 h-6 text-[var(--color-success-green)]" />,
    title: "Export PDF & DOCX",
    description:
      "Download PRD dalam format PDF, DOCX, atau Markdown. Siap dibagikan ke stakeholder kapan saja.",
  },
  {
    icon: (
      <LayoutTemplate className="w-6 h-6 text-[var(--color-ai-accent)]" />
    ),
    title: "Template Library",
    description:
      "Pilih dari berbagai template industri: fintech, e-commerce, SaaS, mobile app, dan umum.",
  },
];

const plans = [
  {
    name: "Free",
    price: "Rp 0",
    period: "/selamanya",
    description: "Coba fitur dasar tanpa biaya",
    features: [
      "3 PRD per bulan",
      "5 regenerasi per PRD",
      "Export PDF (watermark)",
      "Template umum",
    ],
    cta: "Mulai Gratis",
    popular: false,
  },
  {
    name: "Pro",
    price: "Rp 99.000",
    period: "/bulan",
    description: "Untuk PM profesional",
    features: [
      "PRD tidak terbatas",
      "Regenerasi tidak terbatas",
      "Export PDF, DOCX, MD",
      "AI Assist inline",
      "Semua template industri",
    ],
    cta: "Mulai Pro",
    popular: true,
  },
  {
    name: "Team",
    price: "Rp 299.000",
    period: "/bulan/user",
    description: "Untuk tim produk",
    features: [
      "Semua fitur Pro",
      "Kolaborasi tim",
      "Custom template",
      "Priority support",
      "Admin dashboard",
    ],
    cta: "Hubungi Kami",
    popular: false,
  },
];

const testimonials = [
  {
    name: "Rina Amalia",
    role: "Product Manager, Fintech Startup",
    content:
      "PRD yang dulu saya selesaikan dalam 3 hari, sekarang cuma 20 menit. Quality-nya juga bagus, tinggal polish dikit.",
    rating: 5,
  },
  {
    name: "Bayu Pratama",
    role: "Founder, SaaS B2B",
    content:
      "Bikin PRD untuk pitching ke investor jadi jauh lebih cepat. Formatnya profesional dan mudah diedit.",
    rating: 5,
  },
  {
    name: "Sasha Wijaya",
    role: "Lead PM, E-commerce Platform",
    content:
      "Sekarang seluruh tim pakai template yang sama. Review PRD jadi lebih efisien karena formatnya konsisten.",
    rating: 4,
  },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-surface-background)]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-[var(--color-surface-canvas)]/80 backdrop-blur-md border-b border-[var(--color-border-subtle)]">
        <div className="container-main flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] flex items-center justify-center">
              <FileText className="w-4 h-4 text-[var(--color-on-primary)]" />
            </div>
            <span className="font-heading text-lg font-bold text-[var(--color-text-primary)]">
              PRD.ai
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Fitur
            </a>
            <a
              href="#pricing"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Harga
            </a>
            <a
              href="#testimonials"
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Testimoni
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Daftar Gratis</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[var(--color-surface-container-high)] transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-canvas)]">
            <div className="container-main py-4 flex flex-col gap-3">
              <a
                href="#features"
                className="text-sm text-[var(--color-text-secondary)] py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fitur
              </a>
              <a
                href="#pricing"
                className="text-sm text-[var(--color-text-secondary)] py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Harga
              </a>
              <a
                href="#testimonials"
                className="text-sm text-[var(--color-text-secondary)] py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimoni
              </a>
              <div className="flex gap-3 pt-2 border-t border-[var(--color-border-subtle)]">
                <Link href="/login" className="flex-1">
                  <Button variant="ghost" className="w-full">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register" className="flex-1">
                  <Button className="w-full">Daftar</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="container-main pt-20 pb-16 md:pt-32 md:pb-24 text-center">
        <Badge variant="secondary" className="mb-6">
          🚀 AI-Powered Documentation
        </Badge>
        <h1 className="heading-display text-[var(--color-text-primary)] mb-6 max-w-3xl mx-auto">
          Tulis PRD dalam hitungan{" "}
          <span className="text-[var(--color-ai-accent)]">menit</span>, bukan
          hari
        </h1>
        <p className="body-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10">
          Hasilkan Product Requirements Document berkualitas tinggi dengan
          bantuan AI. Cukup masukkan ide produk Anda, dan dapatkan PRD
          terstruktur yang siap diedit dan dibagikan.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="text-base px-8">
              Mulai Gratis <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
          <a href="#features">
            <Button variant="ghost" size="lg" className="text-base">
              Lihat Fitur
            </Button>
          </a>
        </div>

        {/* Hero stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
          {[
            { value: "10x", label: "Lebih Cepat" },
            { value: "500+", label: "PRD Dihasilkan" },
            { value: "98%", label: "Kepuasan User" },
            { value: "5", label: "Template Industri" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="heading-headline-md text-[var(--color-text-primary)]">
                {stat.value}
              </div>
              <div className="body-sm text-[var(--color-text-secondary)]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 md:py-24 bg-[var(--color-surface-canvas)]"
      >
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="heading-headline-lg text-[var(--color-text-primary)] mb-4">
              Semua yang Anda butuhkan untuk PRD yang sempurna
            </h2>
            <p className="body-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              Dari generasi AI hingga export profesional — satu platform untuk
              seluruh workflow dokumentasi produk Anda.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} hover className="text-center">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-surface-container-low)] flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                  {feature.title}
                </h3>
                <p className="body-sm text-[var(--color-text-secondary)]">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="heading-headline-lg text-[var(--color-text-primary)] mb-4">
              Cara Kerjanya
            </h2>
            <p className="body-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              Tiga langkah sederhana dari ide hingga PRD siap pakai.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                title: "Masukkan Ide",
                desc: "Jelaskan produk Anda dalam beberapa kalimat — masalah, target user, dan fitur utama.",
              },
              {
                step: "02",
                title: "AI Menulis PRD",
                desc: "AI kami menghasilkan PRD lengkap dengan struktur profesional dalam hitungan detik.",
              },
              {
                step: "03",
                title: "Edit & Export",
                desc: "Sempurnakan dengan editor WYSIWYG, lalu export ke PDF, DOCX, atau Markdown.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-[var(--color-primary)] text-[var(--color-on-primary)] flex items-center justify-center mx-auto mb-4 font-heading text-2xl font-bold">
                  {item.step}
                </div>
                <h3 className="font-heading text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                  {item.title}
                </h3>
                <p className="body-sm text-[var(--color-text-secondary)]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section
        id="pricing"
        className="py-16 md:py-24 bg-[var(--color-surface-canvas)]"
      >
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="heading-headline-lg text-[var(--color-text-primary)] mb-4">
              Harga yang transparan
            </h2>
            <p className="body-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              Mulai gratis, upgrade kapan pun Anda butuh lebih.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative flex flex-col ${
                  plan.popular
                    ? "border-[var(--color-ai-accent)] ring-2 ring-[var(--color-ai-accent)]/20"
                    : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="primary">Paling Populer</Badge>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-heading text-xl font-bold text-[var(--color-text-primary)] mb-1">
                    {plan.name}
                  </h3>
                  <p className="body-sm text-[var(--color-text-secondary)] mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="heading-headline-lg text-[var(--color-text-primary)]">
                      {plan.price}
                    </span>
                    <span className="body-sm text-[var(--color-text-secondary)]">
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className="flex-1 space-y-3 mb-8">
                  {plan.features.map((feat) => (
                    <li
                      key={feat}
                      className="flex items-start gap-2 body-sm text-[var(--color-text-primary)]"
                    >
                      <Check className="w-4 h-4 text-[var(--color-success-green)] mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? "primary" : "ghost"}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24">
        <div className="container-main">
          <div className="text-center mb-12">
            <h2 className="heading-headline-lg text-[var(--color-text-primary)] mb-4">
              Apa kata pengguna kami
            </h2>
            <p className="body-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
              Ribuan Product Manager sudah merasakan manfaatnya.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t) => (
              <Card key={t.name}>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < t.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-[var(--color-border-subtle)]"
                      }`}
                    />
                  ))}
                </div>
                <p className="body-sm text-[var(--color-text-primary)] mb-4 italic">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div>
                  <div className="font-heading text-sm font-semibold text-[var(--color-text-primary)]">
                    {t.name}
                  </div>
                  <div className="body-sm text-[var(--color-text-secondary)]">
                    {t.role}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-[var(--color-primary)] text-[var(--color-on-primary)]">
        <div className="container-main text-center">
          <h2 className="heading-headline-lg mb-4">
            Siap menulis PRD lebih cepat?
          </h2>
          <p className="body-lg max-w-2xl mx-auto mb-8 opacity-80">
            Ribuan Product Manager sudah beralih. Mulai gratis, tidak perlu kartu
            kredit.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-white/90"
            >
              Mulai Gratis Sekarang
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[var(--color-border-subtle)]">
        <div className="container-main flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[var(--color-text-secondary)]" />
            <span className="body-sm text-[var(--color-text-secondary)]">
              PRD.ai — AI-Powered PRD Generator
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="body-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Kebijakan Privasi
            </a>
            <a
              href="#"
              className="body-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
            >
              Syarat & Ketentuan
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
