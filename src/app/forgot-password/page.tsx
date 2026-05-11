"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { FileText, ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulated password reset - in production, send email via API
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface-background)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mb-8"
        >
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center">
            <FileText className="w-5 h-5 text-[var(--color-on-primary)]" />
          </div>
          <span className="font-heading text-2xl font-bold text-[var(--color-text-primary)]">
            PRD.ai
          </span>
        </Link>

        <Card>
          <CardHeader>
            {submitted ? (
              <>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-success-green)]/10 flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-[var(--color-success-green)]" />
                  </div>
                </div>
                <h1 className="heading-headline-md text-[var(--color-text-primary)] text-center">
                  Cek Email Anda
                </h1>
                <p className="body-sm text-[var(--color-text-secondary)] text-center mt-1">
                  Kami telah mengirim link reset password ke{" "}
                  <strong>{email}</strong>
                </p>
              </>
            ) : (
              <>
                <h1 className="heading-headline-md text-[var(--color-text-primary)] text-center">
                  Lupa Password
                </h1>
                <p className="body-sm text-[var(--color-text-secondary)] text-center mt-1">
                  Masukkan email Anda dan kami akan mengirim link untuk reset
                  password.
                </p>
              </>
            )}
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center">
                <p className="body-sm text-[var(--color-text-secondary)] mb-6">
                  Tidak menerima email? Cek folder spam atau{" "}
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-[var(--color-secondary)] hover:underline cursor-pointer"
                  >
                    kirim ulang
                  </button>
                </p>
                <Link href="/login">
                  <Button variant="ghost" className="gap-2">
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-lg bg-[var(--color-error-container)] text-sm text-[var(--color-on-error-container)]">
                    {error}
                  </div>
                )}

                <Input
                  label="Email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Button type="submit" className="w-full" loading={loading}>
                  {loading ? "Mengirim..." : "Kirim Link Reset"}
                </Button>

                <div className="text-center">
                  <Link
                    href="/login"
                    className="text-sm text-[var(--color-secondary)] hover:underline inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3 h-3" /> Kembali ke Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
