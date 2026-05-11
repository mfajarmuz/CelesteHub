---
name: AI PRD Generator — PDF Design System
version: 1.0
project: AI-Powered PRD Generator (PRD.ai)
source: stitch_design_system_integration / screen observations
applies_to: Semua dokumen PDF yang dihasilkan untuk proyek ini
---

# DESIGN.md — Panduan Desain PDF
## AI-Powered PRD Generator (PRD.ai)

Dokumen ini adalah panduan visual wajib untuk menghasilkan PDF yang konsisten
dengan design system proyek. Baca sebelum menulis kode ReportLab apapun.

---

## 1. Filosofi Desain

Desain PDF PRD.ai mengikuti estetika aplikasi webnya: **bersih, profesional,
minimal dekorasi**. Tidak ada gradien, tidak ada ornamen berlebihan. Hierarki
visual dibangun dari tipografi dan whitespace — bukan warna tebal.

Prinsip utama:
- **Clarity first** — pembaca harus menemukan informasi dalam 3 detik
- **Consistent hierarchy** — H1 → H2 → H3 tidak boleh ambigu
- **Print-friendly** — dokumen harus tetap terbaca bila dicetak hitam-putih
- **Faithful to web UI** — palet warna, font, dan spacing mencerminkan tampilan aplikasi

---

## 2. Palet Warna

Diambil langsung dari `DESIGN.md` design system (Material You tokens).

### 2.1 Warna Utama

| Token | Hex | Penggunaan dalam PDF |
|---|---|---|
| `primary` | `#000000` | Judul H1 utama, teks strong |
| `secondary` | `#0058BE` | Header tabel, accent bar, link |
| `secondary-container` | `#2170E4` | Background header tabel (lebih terang) |
| `ai-accent` | `#8B5CF6` | Badge AI, highlight fitur AI, callout AI |
| `success-green` | `#10B981` | Status "Final", badge lulus, highlight positif |
| `error` | `#BA1A1A` | Status error, warning kritis |

### 2.2 Warna Surface & Background

| Token | Hex | Penggunaan dalam PDF |
|---|---|---|
| `surface-canvas` | `#FFFFFF` | Background halaman, cell tabel baris genap |
| `surface-container-low` | `#F6F3F5` | Background alternating row tabel |
| `surface-container` | `#F0EDEF` | Background section callout ringan |
| `surface-container-high` | `#EAE7E9` | Background header metadata (cover) |
| `surface-background` | `#F8FAFC` | Background blok kode / monospace |

### 2.3 Warna Teks

| Token | Hex | Penggunaan |
|---|---|---|
| `text-primary` | `#0F172A` | Body text utama |
| `on-surface` | `#1B1B1D` | Teks gelap pada surface terang |
| `text-secondary` | `#64748B` | Label, caption, note, footer |
| `on-surface-variant` | `#45464D` | Teks subtabel, placeholder |
| `outline` | `#76777D` | Garis tabel, border tipis |
| `outline-variant` | `#C6C6CD` | Garis pemisah halus, divider |
| `border-subtle` | `#E2E8F0` | Border tabel paling tipis |

### 2.4 Warna Status / Semantic

| Kondisi | Background | Teks | Penggunaan |
|---|---|---|---|
| Draft | `#FFF8E1` | `#92400E` | Badge status Draft |
| Final | `#D1FAE5` | `#065F46` | Badge status Final |
| Warning / High | `#FFF3E0` | `#92400E` | Callout peringatan |
| Critical | `#FFEBEE` | `#B91C1C` | Callout critical |
| Info / New | `#EFF6FF` | `#1D4ED8` | Callout informasi, badge baru |
| Success | `#ECFDF5` | `#065F46` | Callout sukses, lulus |
| AI Accent | `#F5F3FF` | `#6D28D9` | Callout fitur AI |

---

## 3. Tipografi

Design system menggunakan tiga font family. Dalam ReportLab gunakan fallback
yang tersedia secara built-in karena ReportLab tidak dapat load Google Fonts.

### 3.1 Mapping Font

| Design System | Font Asli | ReportLab Fallback | Penggunaan |
|---|---|---|---|
| Display / Headline | Manrope | `Helvetica-Bold` | Judul, heading besar |
| Body | Inter | `Helvetica` | Body text, paragraf, tabel |
| Label Caps / Code | JetBrains Mono | `Courier` | Kode, namespace, ID teknis |

### 3.2 Skala Tipografi untuk PDF (dalam points, bukan px)

PDF menggunakan points (1pt ≈ 1.33px). Konversi dari design system:

| Token Design | Font Size Web | PDF Points | Font | Penggunaan |
|---|---|---|---|---|
| `display-lg` | 48px | — | — | Tidak dipakai di PDF |
| `headline-lg` | 32px | 24pt | Helvetica-Bold | Judul dokumen (cover) |
| `headline-md` | 24px | 18pt | Helvetica-Bold | H1 per bab |
| `body-lg` | 18px | 13pt | Helvetica-Bold | H2 sub-bab |
| `body-md` | 16px | 11pt | Helvetica-Bold | H3, sub-sub-bab |
| `body-sm` | 14px | 9pt | Helvetica | Body text, bullet, tabel |
| `label-caps` | 12px | 8pt | Courier | Kode, ID, monospace |
| — | — | 7.5pt | Helvetica | Footer, note, caption |

### 3.3 Aturan Tipografi

- **Tidak ada underline** pada teks biasa — underline hanya untuk link yang eksplisit
- **Bold** hanya untuk heading dan label tabel header — tidak untuk penekanan inline sembarangan
- **Italic** hanya untuk catatan, note, atau istilah asing
- **Monospace** (`Courier`) untuk: namespace state, variabel kode, ID teknis, path file
- **Line height body:** `leading = font_size × 1.5` (misal body 9pt → leading 13.5)
- **Sentence case** pada semua heading — tidak ALL CAPS kecuali badge/label pendek

---

## 4. Layout & Spacing

### 4.1 Ukuran Halaman

```python
pagesize = A4          # 595 × 842 points
# Margin:
left_margin   = 20mm   # 56.7pt
right_margin  = 20mm   # 56.7pt
top_margin    = 26mm   # 73.7pt  (ruang untuk header bar)
bottom_margin = 16mm   # 45.4pt  (ruang untuk footer bar)

# Lebar konten efektif:
content_width = 595 - (20mm × 2) = ≈ 453pt  (≈ 160mm)
```

### 4.2 Spacing System

Berdasarkan `base-unit: 4px` dari design system, dikonversi ke points:

| Token | Web | PDF (approx) | Penggunaan |
|---|---|---|---|
| `stack-sm` | 8px | 3pt | Spasi antar elemen kecil |
| `stack-md` | 16px | 6pt | Spasi antar paragraf, antar section kecil |
| `stack-lg` | 32px | 12pt | Spasi antar bab, sebelum H1 |
| `gutter` | 24px | 9pt | Padding dalam cell tabel |
| — | — | 14pt | `spaceBefore` untuk H1 |
| — | — | 10pt | `spaceBefore` untuk H2 |
| — | — | 7pt | `spaceBefore` untuk H3 |

### 4.3 Grid Tabel

Cell padding standar:
```python
TOPPADDING    = 5
BOTTOMPADDING = 5
LEFTPADDING   = 6
RIGHTPADDING  = 6
```

Lebar border tabel: `0.4pt` (tipis, tidak dominan).

---

## 5. Komponen Visual

### 5.1 Header Halaman (Page Header Bar)

Terinspirasi dari navbar aplikasi (`#000000` background di web):

```python
# Bar hitam penuh di atas setiap halaman
canvas.setFillColor("#000000")   # primary
canvas.rect(0, H - 20mm, W, 20mm, fill=1, stroke=0)

# Teks kiri: nama dokumen
canvas.setFillColor("#FFFFFF")
canvas.setFont("Helvetica-Bold", 9)
canvas.drawString(15mm, H - 12mm, "Nama Dokumen")

# Teks kanan: versi / tanggal
canvas.setFont("Helvetica", 8)
canvas.drawRightString(W - 15mm, H - 12mm, "Versi 1.0  |  11 Mei 2026")
```

### 5.2 Footer Halaman (Page Footer Bar)

```python
# Bar gelap di bawah
canvas.setFillColor("#1B1B1D")   # on-surface / near-black
canvas.rect(0, 0, W, 10mm, fill=1, stroke=0)

# Teks kiri: nama framework / subtitle
canvas.setFillColor("#FFFFFF")
canvas.setFont("Helvetica", 7.5)
canvas.drawString(15mm, 3.5mm, "PRD.ai — AI-Powered PRD Generator")

# Nomor halaman kanan
canvas.drawRightString(W - 15mm, 3.5mm, f"Halaman {doc.page}")
```

### 5.3 Tabel — Style Standar

Gaya tabel mengikuti tabel di UI web: header gelap, alternating rows, border tipis.

```python
GRID_STYLE = TableStyle([
    # Header row
    ("BACKGROUND",    (0, 0), (-1, 0),  "#000000"),   # primary
    ("TEXTCOLOR",     (0, 0), (-1, 0),  "#FFFFFF"),
    ("FONTNAME",      (0, 0), (-1, 0),  "Helvetica-Bold"),

    # Data rows
    ("FONTNAME",      (0, 1), (-1, -1), "Helvetica"),
    ("FONTSIZE",      (0, 0), (-1, -1), 8.5),
    ("LEADING",       (0, 0), (-1, -1), 12),

    # Alternating rows
    ("ROWBACKGROUNDS",(0, 1), (-1, -1), ["#FFFFFF", "#F6F3F5"]),
                                         # surface-canvas & surface-container-low

    # Border
    ("GRID",          (0, 0), (-1, -1), 0.4, "#C6C6CD"),  # outline-variant

    # Alignment & padding
    ("VALIGN",        (0, 0), (-1, -1), "TOP"),
    ("TOPPADDING",    (0, 0), (-1, -1), 5),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ("LEFTPADDING",   (0, 0), (-1, -1), 6),
    ("RIGHTPADDING",  (0, 0), (-1, -1), 6),
])
```

**Variasi tabel berdasarkan konteks:**

| Konteks | Header Background | Keterangan |
|---|---|---|
| Dokumen umum (PRD, TechSpec) | `#000000` primary | Standard |
| Tabel metadata cover | `#EAE7E9` surface-container-high | Lebih ringan |
| Tabel changelog / highlight baru | `#000000` + row `#EFF6FF` | Row baru di-highlight info |
| Tabel status / severity | Warna per baris sesuai semantic | Lihat §2.4 |

### 5.4 Callout Box

Digunakan untuk catatan penting, warning, atau highlight. Terinspirasi dari
panel "Tips dari AI" di wizard UI.

```python
# Callout ringan (informasi / catatan)
background = "#EFF6FF"   # info-bg
text_color = "#1D4ED8"   # info-text
left_bar   = "#0058BE"   # secondary (accent bar kiri)

# Callout AI (fitur AI)
background = "#F5F3FF"   # ai-accent-bg
text_color = "#6D28D9"   # ai-accent-text

# Callout warning / high
background = "#FFF3E0"
text_color = "#92400E"

# Callout critical
background = "#FFEBEE"
text_color = "#B91C1C"

# Callout sukses / baru
background = "#ECFDF5"
text_color = "#065F46"
```

Implementasi sebagai `Paragraph` dengan `backColor` + `leftIndent`:
```python
callout_style = ParagraphStyle(
    "callout",
    fontName    = "Helvetica",
    fontSize    = 9,
    leading     = 14,
    backColor   = "#EFF6FF",
    textColor   = "#1D4ED8",
    leftIndent  = 12,
    rightIndent = 8,
    spaceBefore = 6,
    spaceAfter  = 6,
)
```

### 5.5 Badge / Label Status

Dirender sebagai `Paragraph` berukuran kecil dengan background berwarna:

```python
# Contoh badge "Draft"
badge_style = ParagraphStyle(
    "badge",
    fontName  = "Helvetica-Bold",
    fontSize  = 8,
    backColor = "#FFF8E1",
    textColor = "#92400E",
    leftIndent  = 4,
    rightIndent = 4,
    spaceAfter  = 2,
)

# Contoh badge "Final"
badge_style_final = ParagraphStyle(
    ...
    backColor = "#D1FAE5",
    textColor = "#065F46",
)

# Contoh badge "AI" / fitur AI
badge_style_ai = ParagraphStyle(
    ...
    backColor = "#F5F3FF",
    textColor = "#6D28D9",
)
```

### 5.6 Divider / HR

```python
from reportlab.platypus import HRFlowable

# Divider berat (antar bab / H1)
HRFlowable(width="100%", thickness=1.0, color="#000000", spaceAfter=4, spaceBefore=4)

# Divider ringan (antar sub-section)
HRFlowable(width="100%", thickness=0.5, color="#C6C6CD", spaceAfter=4, spaceBefore=4)

# Divider tipis sekali (antar elemen dalam section)
HRFlowable(width="100%", thickness=0.3, color="#E2E8F0", spaceAfter=2, spaceBefore=2)
```

### 5.7 Blok Kode / Monospace

Terinspirasi dari elemen `<code>` di dokumen teknis. Background `#F8FAFC` (surface-background):

```python
code_style = ParagraphStyle(
    "code",
    fontName    = "Courier",
    fontSize    = 7.5,
    leading     = 11,
    backColor   = "#F8FAFC",
    textColor   = "#0F172A",
    leftIndent  = 8,
    rightIndent = 8,
    spaceBefore = 4,
    spaceAfter  = 6,
)
```

Untuk multi-baris kode, buat satu `Paragraph` per baris dengan `spaceAfter=0`
dan bungkus keseluruhan dalam background yang sama.

---

## 6. Halaman Cover

### 6.1 Struktur Cover

```
[Spacer 40pt]
[Judul dokumen — Helvetica-Bold 18pt, center, #000000]
[Judul proyek — Helvetica-Bold 24pt, center, #000000]
[Spacer 6pt]
[HR tipis #0058BE thickness 1.5]
[Subtitle / tagline — Helvetica-Italic 9pt, center, #64748B]
[Spacer 10pt]
[Tabel metadata cover]
[Spacer 10pt]
[Callout ringkasan (opsional)]
[PageBreak]
```

### 6.2 Tabel Metadata Cover

Dua kolom: label (kiri, bold, background `#EAE7E9`) + nilai (kanan, putih).
Lebar: `[60mm, 110mm]` atau `[60mm, 100mm]` tergantung margin.

Header tabel metadata **tidak menggunakan warna hitam** — pakai `#EAE7E9`
(surface-container-high) untuk kesan lebih ringan di cover.

```python
cover_meta_style = TableStyle([
    ("BACKGROUND",    (0, 0), (0, -1), "#EAE7E9"),   # kolom label
    ("FONTNAME",      (0, 0), (0, -1), "Helvetica-Bold"),
    ("FONTNAME",      (1, 0), (1, -1), "Helvetica"),
    ("FONTSIZE",      (0, 0), (-1, -1), 9),
    ("LEADING",       (0, 0), (-1, -1), 13),
    ("GRID",          (0, 0), (-1, -1), 0.4, "#C6C6CD"),
    ("VALIGN",        (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING",    (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ("LEFTPADDING",   (0, 0), (-1, -1), 8),
    ("RIGHTPADDING",  (0, 0), (-1, -1), 8),
])
```

---

## 7. Heading Hierarchy

### 7.1 H1 — Judul Bab Utama

```python
h1_style = ParagraphStyle(
    "H1",
    fontName    = "Helvetica-Bold",
    fontSize    = 14,        # ≈ headline-md
    textColor   = "#000000", # primary
    spaceBefore = 14,
    spaceAfter  = 4,
)
# Selalu diikuti HRFlowable thickness=1.0 color="#000000"
```

Contoh: `1. Ringkasan Eksekutif`, `2. Latar Belakang & Permasalahan`

### 7.2 H2 — Sub-bab

```python
h2_style = ParagraphStyle(
    "H2",
    fontName    = "Helvetica-Bold",
    fontSize    = 11,        # ≈ body-lg
    textColor   = "#0058BE", # secondary — biru aksen
    spaceBefore = 10,
    spaceAfter  = 3,
)
```

Contoh: `1.1 Visi Produk`, `3.1 Persona Utama`

### 7.3 H3 — Sub-sub-bab

```python
h3_style = ParagraphStyle(
    "H3",
    fontName    = "Helvetica-Bold",
    fontSize    = 10,
    textColor   = "#1B1B1D", # on-surface
    spaceBefore = 7,
    spaceAfter  = 2,
)
```

Contoh: `Persona 1: Product Manager Pemula`, `2.6.1 Rubrik Penilaian`

### 7.4 H4 — Level terdalam (jarang dipakai)

```python
h4_style = ParagraphStyle(
    "H4",
    fontName    = "Helvetica-Bold",
    fontSize    = 9,
    textColor   = "#45464D", # on-surface-variant
    spaceBefore = 5,
    spaceAfter  = 2,
)
```

---

## 8. Body Text & Bullet

### 8.1 Body Text

```python
body_style = ParagraphStyle(
    "body",
    fontName    = "Helvetica",
    fontSize    = 9,
    textColor   = "#0F172A",  # text-primary
    leading     = 14,         # 9 × 1.55
    spaceAfter  = 4,
)
```

### 8.2 Bullet / List

```python
bullet_style = ParagraphStyle(
    "bullet",
    fontName    = "Helvetica",
    fontSize    = 9,
    textColor   = "#0F172A",
    leading     = 13,
    leftIndent  = 14,
    bulletIndent= 4,
    spaceAfter  = 2,
)
# Gunakan: Paragraph("• Teks item", bullet_style)
```

Untuk sub-bullet (level 2):
```python
sub_bullet_style = ParagraphStyle(
    "sub_bullet",
    parent      = bullet_style,
    leftIndent  = 28,
    bulletIndent= 18,
)
```

### 8.3 Note / Caption

```python
note_style = ParagraphStyle(
    "note",
    fontName    = "Helvetica-Oblique",
    fontSize    = 8,
    textColor   = "#64748B",  # text-secondary
    leading     = 12,
    spaceAfter  = 4,
)
```

---

## 9. Panduan Penggunaan Warna Tabel Berdasarkan Konteks Proyek

### 9.1 Tabel Persona (Target Pengguna)
- Header: `#000000` (standar)
- Kolom label kiri: bold, background `#F6F3F5`
- Kolom nilai kanan: regular

### 9.2 Tabel OKR / Metrik
- Header: `#000000`
- Kolom target: bold, background `#ECFDF5` (success-green tint)

### 9.3 Tabel Risiko
- Header: `#000000`
- Row Probabilitas Tinggi: `#FFEBEE`
- Row Probabilitas Sedang: `#FFF3E0`
- Row Probabilitas Rendah: default alternating

### 9.4 Tabel Pricing
- Header: `#000000`
- Row Free: default
- Row Pro: background `#EFF6FF` ringan
- Row Team: background `#F5F3FF` (ai-accent tint)

### 9.5 Tabel Changelog
- Header: `#000000`
- Row versi terbaru (current): background `#EFF6FF` + font bold

### 9.6 Tabel Alur / Timeline
- Header: `#000000`
- Row "Completed" / "Done": background `#ECFDF5`
- Row "In Progress": background `#FFF3E0`
- Row "Planned": default

---

## 10. Aturan yang Tidak Boleh Dilanggar

1. **Tidak ada gradien** — semua fill adalah warna solid
2. **Tidak ada shadow** — tidak ada drop shadow pada elemen apapun
3. **Header bar wajib ada** di setiap halaman — nama dokumen + versi
4. **Footer bar wajib ada** — nama proyek + nomor halaman
5. **Font body tidak boleh < 8pt** — keterbacaan minimum
6. **Tabel selalu punya `repeatRows=1`** — header diulang di setiap halaman
7. **Cover page tidak punya konten teks di bawah tabel metadata** — langsung PageBreak
8. **Monospace (`Courier`) hanya untuk kode / ID teknis** — tidak untuk teks biasa
9. **Warna biru (`#0058BE`) hanya untuk H2** — tidak untuk teks body atau bullet
10. **Warna AI accent (`#8B5CF6`) hanya untuk elemen yang berkaitan dengan fitur AI**

---

## 11. Checklist Sebelum Output PDF

Sebelum memanggil `doc.build()`, pastikan:

- [ ] Cover page memiliki judul, tagline, tabel metadata, dan `PageBreak`
- [ ] Setiap H1 diikuti `HRFlowable` thickness 1.0
- [ ] Semua tabel memiliki `repeatRows=1`
- [ ] Header dan footer ter-register via `onFirstPage` dan `onLaterPages`
- [ ] Tidak ada teks dengan fontSize < 8pt
- [ ] Callout menggunakan warna semantic yang tepat (lihat §2.4)
- [ ] Kode / namespace menggunakan `Courier` (bukan `Helvetica`)
- [ ] Warna `#8B5CF6` (ai-accent) hanya pada elemen AI
- [ ] Tidak ada gradien atau shadow

---

## 12. Referensi Cepat — Warna ReportLab

```python
from reportlab.lib import colors

# Primary palette
C_PRIMARY      = colors.HexColor("#000000")
C_SECONDARY    = colors.HexColor("#0058BE")
C_SEC_CONT     = colors.HexColor("#2170E4")
C_AI_ACCENT    = colors.HexColor("#8B5CF6")
C_SUCCESS      = colors.HexColor("#10B981")
C_ERROR        = colors.HexColor("#BA1A1A")

# Surface
C_CANVAS       = colors.HexColor("#FFFFFF")
C_SURF_LOW     = colors.HexColor("#F6F3F5")
C_SURF         = colors.HexColor("#F0EDEF")
C_SURF_HIGH    = colors.HexColor("#EAE7E9")
C_SURF_BG      = colors.HexColor("#F8FAFC")

# Text
C_TEXT_PRI     = colors.HexColor("#0F172A")
C_TEXT_SEC     = colors.HexColor("#64748B")
C_ON_SURF      = colors.HexColor("#1B1B1D")
C_ON_SURF_VAR  = colors.HexColor("#45464D")

# Border
C_OUTLINE      = colors.HexColor("#76777D")
C_OUTLINE_VAR  = colors.HexColor("#C6C6CD")
C_BORDER_SUB   = colors.HexColor("#E2E8F0")

# Semantic backgrounds
C_BG_INFO      = colors.HexColor("#EFF6FF")
C_BG_SUCCESS   = colors.HexColor("#ECFDF5")
C_BG_WARN      = colors.HexColor("#FFF3E0")
C_BG_DANGER    = colors.HexColor("#FFEBEE")
C_BG_AI        = colors.HexColor("#F5F3FF")
C_BG_DRAFT     = colors.HexColor("#FFF8E1")

# Semantic text
C_TX_INFO      = colors.HexColor("#1D4ED8")
C_TX_SUCCESS   = colors.HexColor("#065F46")
C_TX_WARN      = colors.HexColor("#92400E")
C_TX_DANGER    = colors.HexColor("#B91C1C")
C_TX_AI        = colors.HexColor("#6D28D9")

C_WHITE        = colors.white
```

---

*DESIGN.md versi 1.0 — AI-Powered PRD Generator (PRD.ai)*
*Sumber: stitch_design_system_integration / screen observations / PDF audit*
