# Implementation Task Tracker (`TASK.md`)

> **Active Sprint:** MVP Core  
> **Source Spec:** `PRD.md` & `TSD.md` (Gate 2 Locked)  
> **Execution Rule:** Kerjakan task satu per satu secara linear. Jangan melompat ke task berikutnya sebelum Verification dan Containment Audit lulus serta diceklis.

---

## 📊 Summary Progress

- **Total Tasks:** 10
- **Completed:** 9
- **Blocked:** 0
- **Current Active Task:** `TASK-010`

---

## 📋 Task Backlog

### Phase A: Setup & Scaffolding

#### [x] `TASK-001`: Scaffold Vite + React + TS + Tailwind + Vitest (strict mode)

- **Status:** `DONE`
- **Change Boundary Contract:**
  - **Primary Affected Files:** `package.json`, `tsconfig.json`, `vite.config.ts`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `.gitignore`
  - **Justified Supporting Files:** None
- **Dependencies:** None
- **Pre-Conditions & Skills:**
  - Baca `ARCHITECTURE.md` §2 (stack) & §3 (struktur direktori).
  - Baca `RULES.md` §2.1 (strict flags) & §6 (testing).
- **Acceptance Criteria & Traceability:**
  - [x] `AC-01`: `npm run dev` serve halaman tanpa error.
  - [x] `AC-02`: `npm run lint`, `npm run typecheck`, `npm test` semua exit 0 (script terdefinisi).
  - [x] `AC-03`: Strict flags aktif (`strict`, `noUncheckedIndexedAccess`).
- **Implementation & TDD Steps:**
  1. [x] Setup config Vite + React TS + Tailwind manual.
  2. [x] Tambah Tailwind + Vitest + eslint config (flat, typescript-eslint).
  3. [x] Buat smoke test nyata (App export function check).
- **Verification Gates (Deterministic Proof):**
  - **Command:** `npm run lint && npm run typecheck && npm test`
  - **Evidence:** exit code 0.
- **Containment Audit (Pre-Done Gate):**
  - [x] `git status`/`git diff`: hanya file scaffold yang berubah.

---

### Phase B: Core Logic (Parser & Renderer)

#### [x] `TASK-002`: Normalized Slide Model + Validator file

- **Status:** `DONE`
- **Change Boundary Contract:**
  - **Primary Affected Files:** `src/lib/parser/types.ts`, `src/lib/validator/file-validator.ts`, `tests/unit/validator.test.ts`
  - **Justified Supporting Files:** None
- **Dependencies:** `TASK-001`
- **Pre-Conditions & Skills:**
  - Baca `TSD.md` §3.2 (schemas) & §4.1.
  - Baca `RULES.md` §2.3 (Result pattern), §4.1 (validation gates).
- **Acceptance Criteria & Traceability:**
  - [x] `AC-01`: File `.pptx` valid → `Result.success`. → `tests/unit/validator.test.ts`
  - [x] `AC-02`: Ekstensi/MIME salah → `INVALID_TYPE` dengan pesan jelas. → test
  - [x] `AC-03`: File > 25MB → `FILE_TOO_LARGE`. → test
- **Implementation & TDD Steps:**
  1. [x] RED: test 4 skenario validasi.
  2. [x] GREEN: implement `file-validator.ts` + tipe di `types.ts`.
  3. [x] REFACTOR: cek anti-slop.
- **Verification Gates (Deterministic Proof):**
  - **Command:** `npm test -- tests/unit/validator.test.ts && npm run typecheck`
  - **Evidence:** exit 0.
- **Containment Audit (Pre-Done Gate):**
  - [x] Mutasi hanya 3 file Primary.

#### [x] `TASK-003`: PPTX Parser Adapter — unzip + teks & bullet per slide

- **Status:** `DONE`
- **Change Boundary Contract:**
  - **Primary Affected Files:** `src/lib/parser/pptx-adapter.ts`, `src/lib/parser/text-extractor.ts`, `tests/unit/parser/text-extractor.test.ts`, `tests/fixtures/` (sample XML)
  - **Justified Supporting Files:** None
- **Dependencies:** `TASK-002`
- **Pre-Conditions & Skills:**
  - Baca `KNOWLEDGE.md` §2.1–2.3 (gotcha `<a:t>` runs, ordering slide numerik, title detection).
  - Baca `TSD.md` §4.2.
- **Acceptance Criteria & Traceability:**
  - [x] `AC-01`: Slide terurut numerik (slide10 SETELAH slide9). → test
  - [x] `AC-02`: Multi-run `<a:r>` dalam satu `<a:p>` digabung jadi satu teks. → test
  - [x] `AC-03`: Bullet level (indent) terdeteksi → `ContentElement.bullet`. → test
  - [x] `AC-04`: Judul via `<p:ph type="title">`; slide tanpa judul → `null`. → test
  - [x] `AC-05`: File ZIP rusak → `Result.error CORRUPTED_FILE`, tanpa throw. → test
- **Implementation & TDD Steps:**
  1. [x] RED: test parser dengan fixture XML hand-crafted.
  2. [x] GREEN: implement `pptx-adapter.ts` + `text-extractor.ts`.
  3. [x] REFACTOR: helper namespace DOM dan numeric sorting.
- **Verification Gates (Deterministic Proof):**
  - **Command:** `npm test -- tests/unit/parser && npm run typecheck`
  - **Evidence:** exit 0.
- **Containment Audit (Pre-Done Gate):**
  - [x] Mutasi hanya file Primary + fixture parser.

#### [x] `TASK-004`: Table extractor (merged cells, empty cells, fidelity angka)

- **Status:** `DONE`
- **Change Boundary Contract:**
  - **Primary Affected Files:** `src/lib/parser/table-extractor.ts`, `tests/unit/parser/table-extractor.test.ts`, `tests/fixtures/` (table XML)
  - **Justified Supporting Files:** None
- **Dependencies:** `TASK-003`
- **Pre-Conditions & Skills:**
  - Baca `KNOWLEDGE.md` §2.2 (gridSpan/rowSpan, empty cell).
  - Baca `RULES.md` §3.1 (fidelity: angka & satuan tidak boleh berubah).
- **Acceptance Criteria & Traceability:**
  - [x] `AC-01`: Tabel sederhana → `headers` + `rows` benar. → test
  - [x] `AC-02`: `gridSpan`/`rowSpan` → cell gabungan direpresentasikan (kosong untuk cell merge). → test
  - [x] `AC-03`: Cell kosong tetap `""`, tidak dihilangkan. → test
  - [x] `AC-04`: Fidelity: `237,6 kWp` → `237,6 kWp` persis (tanpa transformasi angka). → test
- **Implementation & TDD Steps:**
  1. [x] RED: 4 unit test dengan fixture OpenXML table.
  2. [x] GREEN: implement `table-extractor.ts` dan hubungkan ke `extractSlide`.
  3. [x] REFACTOR: gridSpan/rowSpan padding algorithm.
- **Verification Gates (Deterministic Proof):**
  - **Command:** `npm test -- tests/unit/parser/table-extractor.test.ts && npm run typecheck`
  - **Evidence:** exit 0.
- **Containment Audit (Pre-Done Gate):**
  - [x] Mutasi terisolasi.

#### [x] `TASK-005`: Notes extractor + unsupported element warnings

- **Status:** `DONE`
- **Change Boundary Contract:**
  - **Primary Affected Files:** `src/lib/parser/notes-extractor.ts`, `src/lib/parser/pptx-adapter.ts` (integrasikan warnings & notes), `tests/unit/parser/notes-extractor.test.ts`, `tests/fixtures/`
  - **Justified Supporting Files:** None
- **Dependencies:** `TASK-003`
- **Pre-Conditions & Skills:**
  - Baca `PRD.md` FR8/FR10, `RULES.md` §3.2.
- **Acceptance Criteria & Traceability:**
  - [x] `AC-01`: Notes terbaca dari `notesSlide{N}.xml` → `SlideModel.notes`. → test
  - [x] `AC-02`: Slide tanpa notes → `notes: null`. → test
  - [x] `AC-03`: `<p:pic>` → warning `image`; `c:chart` → warning `chart`; dst per `UnsupportedElementType`. → test
  - [x] `AC-04`: Konten gagal TIDAK dianggap sukses (muncul di `warnings`, FR8). → test
- **Implementation & TDD Steps:**
  1. [x] RED: 4 test untuk notes + unsupported warnings.
  2. [x] GREEN: implement `notes-extractor.ts` dan integrasikan ke `pptx-adapter.ts`.
  3. [x] REFACTOR: notes filename keying by slide number.
- **Verification Gates (Deterministic Proof):**
  - **Command:** `npm test -- tests/unit/parser && npm run typecheck`
  - **Evidence:** exit 0.
- **Containment Audit (Pre-Done Gate):**
  - [x] Mutasi terisolasi.

#### [x] `TASK-006`: Markdown renderer

- **Status:** `DONE`
- **Change Boundary Contract:**
  - **Primary Affected Files:** `src/lib/renderer/markdown-renderer.ts`, `tests/unit/renderer/markdown-renderer.test.ts`
  - **Justified Supporting Files:** None
- **Dependencies:** `TASK-004`, `TASK-005`
- **Pre-Conditions & Skills:**
  - Baca `TSD.md` §4.3 & `ARCHITECTURE.md` §6 (format output).
- **Acceptance Criteria & Traceability:**
  - [x] `AC-01`: `# Judul` dari `Presentation.title`; `## Slide NN - Judul` per slide (NN dua digit, urut). → test
  - [x] `AC-02`: Bullet → `- ` dengan indent 2 spasi per level. → test
  - [x] `AC-03`: Tabel → GFM table (`| a | b |` + separator row). → test
  - [x] `AC-04`: Warning → `> ⚠️ Slide N: pesan`. → test
  - [x] `AC-05`: Notes → `> **Catatan pembicara:**\n> teks`. → test
  - [x] `AC-06`: Slide dipisah `---`. → test
  - [x] `AC-07`: Text passthrough tanpa transformasi angka/satuan. → test
- **Implementation & TDD Steps:**
  1. [x] RED: 7 test (pure function).
  2. [x] GREEN: implement renderer.
  3. [x] REFACTOR: block join & table cell escaping.
- **Verification Gates (Deterministic Proof):**
  - **Command:** `npm test -- tests/unit/renderer && npm run typecheck`
  - **Evidence:** exit 0.
- **Containment Audit (Pre-Done Gate):**
  - [x] Mutasi terisolasi.

---

### Phase C: UI Layer

#### [x] `TASK-007`: FileUpload + pipeline hook (state machine)

- **Status:** `DONE`
- **Change Boundary Contract:**
  - **Primary Affected Files:** `src/components/FileUpload.tsx`, `src/hooks/useFileProcessor.ts`, `tests/unit/useFileProcessor.test.ts`
  - **Justified Supporting Files:** `src/App.tsx` (render upload)
- **Dependencies:** `TASK-006`
- **Pre-Conditions & Skills:**
  - Baca `TSD.md` §4.4, `RULES.md` §7 (a11y, pesan error user-facing).
- **Acceptance Criteria & Traceability:**
  - [x] `AC-01`: Dropzone + click-to-browse, keyboard accessible (ARIA). → test
  - [x] `AC-02`: File invalid → pesan error jelas (bukan jargon). → test
  - [x] `AC-03`: State machine `idle→processing→success|error` benar. → test
- **Implementation & TDD Steps:**
  1. [x] RED: test hook + komponen.
  2. [x] GREEN: implement.
  3. [x] REFACTOR.
- **Verification Gates (Deterministic Proof):**
  - **Command:** `npm test -- tests/unit/useFileProcessor.test.ts && npm run typecheck && npm run lint`
  - **Evidence:** `npm test` (39 passed), `npm run typecheck`, `npm run lint`, `npm run build` exit 0.
- **Containment Audit (Pre-Done Gate):**
  - [x] Mutasi terisolasi (`.agent/RULES.md`, package files, `src/App.tsx`, `src/components/FileUpload.tsx`, `src/hooks/useFileProcessor.ts`, fixture and tests).

#### [x] `TASK-008`: PreviewPane + WarningList

- **Status:** `DONE`
- **Change Boundary Contract:**
  - **Primary Affected Files:** `src/components/PreviewPane.tsx`, `src/components/WarningList.tsx`, `src/App.tsx`
  - **Justified Supporting Files:** `src/hooks/useFileProcessor.ts` (expose `ExtractionWarning[]`, bukan hitungan saja), `tests/unit/PreviewPane.test.tsx`, `tests/unit/WarningList.test.tsx`
- **Dependencies:** `TASK-007`
- **Pre-Conditions & Skills:**
  - Baca `RULES.md` §7.2 (error messaging), PRD FR8 ilustrasi.
- **Acceptance Criteria & Traceability:**
  - [x] `AC-01`: Markdown hasil tampil di preview (pre-wrap, monospace). → test
  - [x] `AC-02`: Ringkasan peringatan tampil ("N peringatan") + daftar per slide. → test
  - [x] `AC-03`: 0 warning → area warning tidak tampil. → test
- **Implementation & TDD Steps:**
  1. [x] RED: 3 test.
  2. [x] GREEN: implement.
  3. [x] REFACTOR.
- **Verification Gates (Deterministic Proof):**
  - **Command:** `npm test && npm run lint && npm run typecheck`
  - **Evidence:** `npm test` (44 passed), lint, typecheck, build exit 0.
- **Containment Audit (Pre-Done Gate):**
  - [x] Mutasi terisolasi.

#### [x] `TASK-009`: Copy & Download (.md)

- **Status:** `DONE`
- **Change Boundary Contract:**
  - **Primary Affected Files:** `src/components/ExportButtons.tsx`, `tests/unit/ExportButtons.test.tsx`
  - **Justified Supporting Files:** `src/App.tsx`, `src/hooks/useFileProcessor.ts` (nama file asli untuk output `.md`).
- **Dependencies:** `TASK-008`
- **Pre-Conditions & Skills:**
  - Baca `RULES.md` §7 (semantics: `<button>`).
- **Acceptance Criteria & Traceability:**
  - [x] `AC-01`: Copy → `navigator.clipboard.writeText` terpanggil; feedback "Tersalin". → test
  - [x] `AC-02`: Download → Blob `text/markdown` + filename `{namafile}.md`. → test
- **Implementation & TDD Steps:**
  1. [x] RED: 2 test.
  2. [x] GREEN: implement.
  3. [x] REFACTOR.
- **Verification Gates (Deterministic Proof):**
  - **Command:** `npm test -- tests/unit/ExportButtons.test.tsx && npm run typecheck`
  - **Evidence:** `npm test` (46 passed), lint, typecheck, build exit 0.
- **Containment Audit (Pre-Done Gate):**
  - [x] Mutasi terisolasi.

---

### Phase D: Integration & Polish

#### [ ] `TASK-010`: Integration test full pipeline + halaman keterbatasan

- **Status:** `PENDING`
- **Change Boundary Contract:**
  - **Primary Affected Files:** `tests/integration/full-pipeline.test.ts`, `tests/fixtures/*.pptx` (minimal 3: teks, tabel, images+notes), `src/components/Layout.tsx`
  - **Justified Supporting Files:** None
- **Dependencies:** `TASK-009`
- **Pre-Conditions & Skills:**
  - Baca PRD Bagian 7 (Acceptance Criteria) & FR8.
- **Acceptance Criteria & Traceability:**
  - [ ] `AC-01`: Fixture `.pptx` nyata → Markdown sesuai `.expected.md` (golden file). → integration test
  - [ ] `AC-02`: File rusak → error state, tanpa crash. → test
  - [ ] `AC-03`: Halaman/bagian keterbatasan menjelaskan privasi aktual (browser-local) + elemen tak didukung (FR/F11, NFR privasi). → review manual
- **Implementation & TDD Steps:**
  1. [ ] Buat fixture PPTX kecil (script python-pptx atau manual zip).
  2. [ ] RED: integration test golden-file.
  3. [ ] GREEN: perbaiki parser/renderer sampai cocok.
  4. [ ] Tulis bagian keterbatasan di UI.
- **Verification Gates (Deterministic Proof):**
  - **Command:** `npm run lint && npm run typecheck && npm test`
  - **Evidence:** exit 0, semua suite lulus.
- **Containment Audit (Pre-Done Gate):**
  - [ ] Mutasi terisolasi; zero secret di fixtures.

---

## 🛑 Stop & Escalate Rules (Human-in-the-Loop Triggers)

AI Agent **WAJIB BERHENTI** dan meminta konfirmasi manusia jika:

1. Menemukan kontradiksi antara `PRD.md` dan `TSD.md`.
2. Verifikasi gagal lebih dari 3 kali percobaan (Circuit Breaker).
3. Terjadi kebutuhan menginstall package baru atau mengubah lockfile tanpa otorisasi task.
4. Terdeteksi mutasi file di luar `Primary Affected Files` yang tidak dapat dijustifikasi.
5. Diperlukan perubahan kontrak publik yang merusak backward compatibility.
