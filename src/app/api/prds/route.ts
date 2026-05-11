import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type GeneratorInput = {
  title?: string;
  productName?: string;
  problemDescription?: string;
  targetUsers?: string;
  coreFeatures?: string;
  techStack?: string;
  platform?: string;
  integrations?: string;
  businessGoals?: string;
  successMetrics?: string;
  constraints?: string;
  outOfScope?: string;
  templateId?: string | null;
  language?: string;
};

function splitItems(value?: string) {
  return (value || "")
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function bulletList(items: string[], fallback: string[]) {
  const source = items.length > 0 ? items : fallback;
  return source.map((item) => `- ${item}`).join("\n");
}

function buildPRDContent(input: GeneratorInput) {
  const productName = (input.productName || input.title || "Produk Baru").trim();
  const problemDescription = (input.problemDescription || "Masalah utama belum dijelaskan secara rinci.").trim();
  const targetUsers = (input.targetUsers || "Pengguna utama produk").trim();
  const features = splitItems(input.coreFeatures);
  const metrics = splitItems(input.successMetrics);
  const goals = splitItems(input.businessGoals);
  const integrations = splitItems(input.integrations);
  const platforms = splitItems(input.platform);
  const constraints = splitItems(input.constraints);
  const outOfScope = splitItems(input.outOfScope);
  const techStack = (input.techStack || "Belum ditentukan; disarankan dipilih berdasarkan kebutuhan skalabilitas, biaya operasional, dan kemampuan tim.").trim();

  const primaryFeature = features[0] || "fitur inti yang menyelesaikan masalah utama pengguna";
  const sections = [
    {
      title: "Executive Summary",
      content: `${productName} adalah inisiatif produk yang dirancang untuk membantu ${targetUsers} mengatasi masalah berikut: ${problemDescription}\n\nPRD ini mendefinisikan ruang lingkup MVP, kebutuhan fungsional, metrik keberhasilan, pertimbangan teknis, risiko, serta rencana peluncuran awal. Fokus utama MVP adalah menghadirkan ${primaryFeature} secara stabil, mudah digunakan, dan dapat divalidasi melalui metrik produk yang jelas.`,
    },
    {
      title: "Problem Statement",
      content: `Saat ini ${targetUsers} menghadapi hambatan yang berdampak langsung pada efisiensi, kualitas pengalaman, atau kemampuan mengambil keputusan: ${problemDescription}\n\nMasalah ini penting diselesaikan karena tanpa solusi yang terstruktur, pengguna berisiko terus menggunakan proses manual, berpindah antar alat, atau kehilangan konteks penting. Produk perlu memberikan alur yang lebih sederhana, hasil yang konsisten, dan kejelasan tindakan berikutnya.`,
    },
    {
      title: "Target Users",
      content: `Target utama produk ini adalah ${targetUsers}.\n\nKarakteristik pengguna yang perlu diperhatikan:\n- Memiliki kebutuhan langsung terhadap penyelesaian masalah yang dijelaskan.\n- Mengharapkan pengalaman yang cepat dipahami tanpa konfigurasi berlebihan.\n- Membutuhkan output atau hasil yang dapat digunakan dalam pekerjaan sehari-hari.\n- Memerlukan kepercayaan terhadap akurasi, keamanan, dan konsistensi sistem.`,
    },
    {
      title: "Goals & Success Metrics",
      content: `Tujuan bisnis dan produk:\n${bulletList(goals, [
        `Memvalidasi bahwa ${productName} benar-benar menyelesaikan pain point utama ${targetUsers}.`,
        "Meningkatkan efisiensi alur kerja pengguna melalui pengalaman yang lebih terarah.",
        "Membangun fondasi MVP yang dapat dikembangkan setelah mendapat umpan balik nyata.",
      ])}\n\nMetrik keberhasilan:\n${bulletList(metrics, [
        "Activation rate pengguna baru pada minggu pertama.",
        "Jumlah PR/task/output utama yang berhasil dibuat pengguna.",
        "Retensi pengguna aktif mingguan.",
        "Feedback kualitatif tentang kemudahan penggunaan dan kelengkapan fitur.",
      ])}`,
    },
    {
      title: "Core Features",
      content: `Fitur inti MVP:\n${bulletList(features, [primaryFeature])}\n\nSetiap fitur harus dirancang agar pengguna dapat mencapai hasil utama tanpa melewati terlalu banyak langkah. Prioritas implementasi diberikan pada fitur yang paling dekat dengan penyelesaian problem statement, bukan fitur tambahan yang hanya mempercantik pengalaman.`,
    },
    {
      title: "User Stories",
      content: `User stories awal:\n- Sebagai ${targetUsers}, saya ingin memahami nilai utama ${productName} sejak pertama kali membuka produk agar saya tahu langkah yang perlu dilakukan.\n- Sebagai ${targetUsers}, saya ingin menggunakan ${primaryFeature} agar masalah utama saya dapat diselesaikan lebih cepat.\n- Sebagai ${targetUsers}, saya ingin menyimpan dan membuka kembali hasil kerja agar proses saya tidak hilang.\n- Sebagai ${targetUsers}, saya ingin mendapatkan status yang jelas saat sistem memproses data agar saya tidak bingung apakah aksi berhasil atau gagal.\n- Sebagai pemilik produk, saya ingin melihat sinyal penggunaan utama agar dapat memprioritaskan iterasi berikutnya berdasarkan data.`,
    },
    {
      title: "Functional Requirements",
      content: `Kebutuhan fungsional:\n- Sistem harus menyediakan alur onboarding atau entry point yang menjelaskan tujuan ${productName}.\n- Sistem harus memungkinkan pengguna memasukkan informasi yang diperlukan untuk menjalankan fitur inti.\n- Sistem harus menjalankan fitur berikut dengan hasil yang dapat dipakai: ${features.length ? features.join(", ") : primaryFeature}.\n- Sistem harus menyimpan data/dokumen/output pengguna secara aman dan dapat dibuka kembali.\n- Sistem harus menampilkan pesan error yang jelas ketika input tidak lengkap atau proses gagal.\n- Sistem harus menyediakan state loading, success, dan failure pada aksi penting.\n- Sistem harus mendukung pencarian atau navigasi dasar untuk menemukan hasil yang sudah dibuat.`,
    },
    {
      title: "Non-Functional Requirements",
      content: `Kebutuhan non-fungsional:\n- Performa: halaman utama dan alur inti harus terasa responsif untuk penggunaan harian.\n- Reliability: data pengguna tidak boleh hilang setelah refresh, logout, atau perpindahan halaman.\n- Security: akses data harus dibatasi berdasarkan pengguna yang sedang login.\n- Usability: copy, label, validasi, dan empty state harus membantu pengguna menyelesaikan tugas tanpa dokumentasi panjang.\n- Maintainability: struktur kode dan data harus siap untuk integrasi AI atau template lanjutan di fase berikutnya.`,
    },
    {
      title: "Technical Considerations",
      content: `Platform target: ${platforms.length ? platforms.join(", ") : "Belum ditentukan secara spesifik; mulai dari platform yang paling dekat dengan pengguna utama."}\n\nTech stack: ${techStack}\n\nIntegrasi yang perlu dipertimbangkan:\n${bulletList(integrations, [
        "Autentikasi dan manajemen sesi pengguna.",
        "Database untuk menyimpan dokumen, preferensi, dan metadata.",
        "Layanan analitik produk untuk mengukur aktivasi dan retensi.",
      ])}\n\nImplementasi MVP sebaiknya menjaga kontrak data tetap sederhana: input pengguna, dokumen hasil generate, sections yang dapat diedit, dan metadata untuk tracking versi berikutnya.`,
    },
    {
      title: "Out of Scope",
      content: `Hal yang tidak termasuk pada MVP:\n${bulletList(outOfScope, [
        "Otomasi kompleks yang belum dibuktikan kebutuhannya oleh pengguna awal.",
        "Integrasi enterprise yang membutuhkan kontrak khusus.",
        "Fitur kolaborasi real-time penuh sebelum kebutuhan kolaborasi tervalidasi.",
        "Optimasi lanjutan yang tidak berdampak langsung pada validasi problem-solution fit.",
      ])}`,
    },
    {
      title: "Risks & Open Questions",
      content: `Risiko utama:\n- Input pengguna mungkin terlalu umum sehingga hasil produk kurang presisi.\n- Ruang lingkup fitur dapat melebar jika prioritas MVP tidak dijaga.\n- Ketergantungan pada integrasi pihak ketiga dapat memperlambat peluncuran.\n${constraints.length ? constraints.map((item) => `- Constraint: ${item}`).join("\n") : "- Constraint teknis, legal, atau operasional perlu dikonfirmasi sebelum implementasi final."}\n\nPertanyaan terbuka:\n- Segmen pengguna mana yang paling siap menjadi early adopter?\n- Fitur mana yang wajib ada untuk membuktikan nilai dalam 1-2 minggu pertama penggunaan?\n- Data apa yang harus dikumpulkan sejak awal untuk mengambil keputusan iterasi?`,
    },
    {
      title: "Launch Plan",
      content: `Rencana peluncuran MVP:\n1. Validasi ruang lingkup dengan 3-5 calon pengguna dari segmen ${targetUsers}.\n2. Implementasikan alur inti: input, proses fitur utama, penyimpanan hasil, dan editing dasar.\n3. Jalankan internal QA untuk skenario happy path, input kosong, error jaringan, dan akses user berbeda.\n4. Rilis beta terbatas kepada pengguna awal dan kumpulkan feedback terstruktur.\n5. Evaluasi metrik aktivasi, penggunaan fitur inti, dan feedback kualitatif untuk menentukan iterasi berikutnya.`,
    },
  ];

  return {
    sections,
    meta: {
      generatedBy: "deterministic-mvp-generator",
      generatedAt: new Date().toISOString(),
      productName,
      targetUsers,
      language: input.language || "id",
      sourceInputs: {
        problemDescription: input.problemDescription || "",
        coreFeatures: input.coreFeatures || "",
        techStack: input.techStack || "",
        platform: input.platform || "",
        integrations: input.integrations || "",
        businessGoals: input.businessGoals || "",
        successMetrics: input.successMetrics || "",
        constraints: input.constraints || "",
        outOfScope: input.outOfScope || "",
      },
    },
  };
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  try {
    const documents = await prisma.prdDocument.findMany({
      where: {
        user: { email: session.user.email },
        status: status || { not: "deleted" },
        ...(search
          ? {
              OR: [
                { title: { contains: search } },
                { content: { contains: search } },
              ],
            }
          : {}),
      },
      include: {
        template: {
          select: { name: true, category: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    let filtered = documents;
    if (category && category !== "all") {
      filtered = documents.filter(
        (doc) => doc.template?.category?.toLowerCase() === category.toLowerCase()
      );
    }

    return NextResponse.json({ prds: filtered });
  } catch (error) {
    console.error("Error fetching PRDs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as GeneratorInput;
    const productName = (body.productName || body.title || "").trim();
    const problemDescription = (body.problemDescription || "").trim();
    const targetUsers = (body.targetUsers || "").trim();
    const coreFeatures = (body.coreFeatures || "").trim();
    const language = body.language || "id";

    const missing = [
      !productName && "productName",
      !problemDescription && "problemDescription",
      !targetUsers && "targetUsers",
      !coreFeatures && "coreFeatures",
    ].filter(Boolean);

    if (missing.length > 0) {
      return NextResponse.json(
        { error: `Field wajib belum lengkap: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const generated = buildPRDContent({ ...body, productName, language });

    const prd = await prisma.prdDocument.create({
      data: {
        title: productName,
        content: JSON.stringify(generated),
        templateId: body.templateId || null,
        language,
        status: "draft",
        userId: user.id,
      },
    });

    return NextResponse.json({ prd }, { status: 201 });
  } catch (error) {
    console.error("Error creating PRD:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
