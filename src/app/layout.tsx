import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AI PRD Generator — Tulis PRD dalam hitungan menit",
  description:
    "Hasilkan Product Requirements Document berkualitas tinggi dengan bantuan AI. Cepat, konsisten, dan profesional.",
  keywords: [
    "PRD",
    "Product Requirements Document",
    "AI",
    "Product Manager",
    "dokumentasi produk",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}
