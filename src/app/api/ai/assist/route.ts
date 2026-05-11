import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { runGeminiPrompt } from "@/lib/ai";

type AssistSection = {
  title?: string;
  content?: string;
};

type AssistBody = {
  prompt?: string;
  documentTitle?: string;
  sections?: AssistSection[];
  activeSection?: string;
};

function buildFallbackMessage(body: AssistBody) {
  const sectionTitle = body.activeSection || "bagian aktif";
  const section = (body.sections || []).find((item) => item.title === sectionTitle);
  const currentContent = section?.content?.trim();

  return [
    `Mode fallback aktif karena Gemini CLI belum merespons. Berikut draft bantuan untuk ${sectionTitle}:`,
    currentContent
      ? `Perjelas isi berikut dengan outcome, scope, dan metrik yang lebih konkret:\n\n${currentContent}`
      : `Tambahkan tujuan, requirement utama, risiko, dan metrik keberhasilan agar ${sectionTitle} lebih actionable.`,
    body.prompt ? `Permintaan Anda: ${body.prompt}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as AssistBody;

    if (!body.prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const sectionContext = (body.sections || [])
      .slice(0, 12)
      .map(
        (section, index) =>
          `${index + 1}. ${section.title || "Untitled"}\n${(section.content || "").trim() || "(kosong)"}`
      )
      .join("\n\n");

    const prompt = `Anda adalah AI co-pilot untuk editor PRD.
Balas dalam Bahasa Indonesia yang profesional, jelas, dan langsung bisa ditempel ke dokumen bila diperlukan.

Dokumen: ${body.documentTitle || "Tanpa Judul"}
Section aktif: ${body.activeSection || "Tidak ditentukan"}

Isi dokumen saat ini:
${sectionContext || "Dokumen belum memiliki section."}

Permintaan user:
${body.prompt}

Instruksi:
- Berikan jawaban praktis, spesifik, dan relevan dengan section aktif.
- Jika user minta rewrite/expand/refine, berikan teks yang siap dipakai.
- Jika perlu, gunakan bullet list singkat.
- Jangan gunakan markdown fence.`;

    try {
      const message = await runGeminiPrompt(prompt, { timeoutMs: 60000 });
      return NextResponse.json({ message, provider: "gemini-cli" });
    } catch (error) {
      const fallbackMessage = buildFallbackMessage(body);
      const reason = error instanceof Error ? error.message : "Unknown AI error";
      return NextResponse.json({
        message: `${fallbackMessage}\n\nCatatan: menggunakan fallback karena ${reason}`,
        provider: "deterministic-fallback",
      });
    }
  } catch (error) {
    console.error("Error assisting PRD editor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
