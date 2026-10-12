# Implementation Task Tracker (`TASK.md`)

> **Active Sprint:** MVP Core  
> **Source Spec:** `PRD.md` & `TSD.md` (Gate 2 Locked)  
> **Execution Rule:** Kerjakan task satu per satu secara linear. Jangan melompat ke task berikutnya sebelum Verification dan Containment Audit lulus serta diceklis.

---

## 📊 Summary Progress

- **Total Tasks:** 10
- **Completed:** 1
- **Blocked:** 0
- **Current Active Task:** `TASK-002`

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

#### [ ] `TASK-002`: Normalized Slide Model + Validator file

- **Status:** `PENDING`
- **Change Boundary Contract:**
  - **Primary Affected Files:** `src/lib/parser/types.ts`, `src/lib/validator/file-validator.ts`, `tests/unit/validator.test.ts`
  - **Justified Supporting Files:** None
- **Dependencies:** `TASK-001`
- **Pre-Conditions & Skills:**
  - Baca `TSD.md` §3.2 (schemas) & §4.1.
  - Baca `RULES.md` §2.3 (Result pattern), §4.1 (validation gates).
- **Acceptance Criteria & Traceability:**
  - [ ] `AC-01`: File `.pptx` valid → `Result.success`. → `tests/unit/validator.test.ts`
  - [ ] `AC-02`: Ekstensi/MIME salah → `INVALID_TYPE` dengan pesan jelas. → test
  - [ ] `AC-03`: File > 25MB → `FILE_TOO_LARGE`. → test
- **Implementation & TDD Steps:**
  1. [ ] RED: test 3 skenario di atas.
  2. [ ] GREEN: implement `file-validator.ts` + tipe di `types.ts`.
  3. [ ] REFACTOR: cek anti-slop.
- **Verification Gates (Deterministic Proof):**
  - **Command:** `npm test -- tests/unit/validator.test.ts && npm run typecheck`
  - **Evidence:** exit 0.
- **Containment Audit (Pre-Done Gate):**
  - [ ] Mutasi hanya 3 file Primary.

#### [ ] `TASK-003`: PPTX Parser Adapter — unzip + teks & bullet per slide

- **Status:** `PENDING`
- **Change Boundary Contract:**
  - **Primary Affected Files:** `src/lib/parser/pptx-adapter.ts`, `src/lib/parser/text-extractor.ts`, `tests/unit/parser/text-extractor.test.ts`, `tests/fixtures/` (sample XML)
  - **Justified Supporting Files:** None
- **Dependencies:** `TASK-002`
- **Pre-Conditions & Skills:**
  - Baca `KNOWLEDGE.md` §2.1–2.3 (gotcha `<a:t>` runs, ordering slide numerik, title detection).
  - Baca `TSD.md` §4.2.
- **Acceptance Criteria & Traceability:**
  - [ ] `AC-01`: Slide terurut numerik (slide10 SETELAH slide9). → test
  - [ ] `AC-02`: Multi-run `<a:r>` dalam satu `<a:p>` digabung jadi satu teks. → test
  - [ ] `AC-03`: Bullet level (indent) terdeteksi → `ContentElement.bullet`. → test
  - [ ] `AC-04`: Judul via `<p:ph type="title">`; slide tanpa judul → `null`. → test
  - [ ] `AC-05`: File ZIP rusak → `Result.error CORRUPTED_FILE`, tanpa throw. → test
- **Implementation & TDD Steps:**
  1. [ ] RED: 5 test di atas dengan fixture XML nyata (kecil, hand-crafted).
  2. [ ] GREEN: implement `pptx-adapter.ts` + `text-extractor.ts`.
  3. [ ] REFACTOR: helper namespace DOM terpisah rapi.
- **Verification Gates (Deterministic Proof):**
  - **Command:** `npm test -- tests/unit/parser && npm run typecheck`
  - **Evidence:** exit 0.
- **Containment Audit (Pre-Done Gate):**
  - [ ] Mutasi hanya file Primary.

#### [ ] `TASK-004`: Table extractor (merged cells, empty cells, fidelity angka)

- **Status:** `PENDING`
- **Change Boundary Contract:**
  - **Primary Affected Files:** `src/lib/parser/table-extractor.ts`, `tests/unit/parser/table-extractor.test.ts`, `tests/fixtures/` (table XML)
  - **Justified Supporting Files:** None
- **Dependencies:** `TASK-003`
- **Pre-Conditions & Skills:**
  - Baca `KNOWLEDGE.md` §2.2 (gridSpan/rowSpan, empty cell).
  - Baca `RULES.md` §3.1 (fidelity: angka & satuan tidak boleh berubah).
- **Acceptance Criteria & Traceability:**
  - [ ] `AC-01`: Tabel sederhana → `headers` + `rows` benar. → test
  - [ ] `AC-02`: `gridSpan`/`rowSpan` → cell gabungan direpresentasikan (kosong untuk cell merge). → test
  - [ ] `AC-03`: Cell kosong tetap `""`, tidak dihilangkan. → test
  - [ ] `AC-04`: Fidelity: `237,6 kWp` → `237,6 kWp` persis (tanpa transformasi angka). → test
- **Implementation & TDD Steps:**
  1. [ ] RED: 4 test.
  2. [ ] GREEN: implement `table-extractor.ts`.
  3. [ ] REFACTOR.
- **Verification Gates (Deterministic Proof):**
  - **Command:** `npm test -- tests/unit/parser/table-extractor.test.ts && npm run typecheck`
  - **Evidence:** exit 0.
- **Containment Audit (Pre-Done Gate):**
  - [ ] Mutasi terisolasi.

#### [ ] `TASK-005`: Notes extractor + unsupported element warnings

- **Status:** `PENDING`
- **Change Boundary Contract:**
  - **Primary Affected Files:** `src/lib/parser/notes-extractor.ts`, `src/lib/parser/pptx-adapter.ts` (integrasikan warnings & notes), `tests/unit/parser/notes-extractor.test.ts`, `tests/fixtures/`
  - **Justified Supporting Files:** None
- **Dependencies:** `TASK-003`
- **Pre-Conditions & Skills:**
  - Baca `PRD.md` FR8/FR10, `RULES.md` §3.2.
- **Acceptance Criteria & Traceability:**
  - [ ] `AC-01`: Notes terbaca dari `notesSlide{N}.xml` → `SlideModel.notes`. → test
  - [ ] `AC-02`: Slide tanpa notes → `notes: null`. → test
  - [ ] `AC-03`: `<p:pic>` → warning `image`; `c:chart` → warning `chart`; dst per `UnsupportedElementType`. → test
  - [ ] `AC-04`: Konten gagal TIDAK dianggap sukses (muncul di `warnings`, FR8). → test
- **Implementation & TDD Steps:**
  1. [ ] RED: 4 test.
  2. [ ] GREEN: implement.
  3. [ ] REFACTOR.
- **Verification Gates (Deterministic Proof):**
  - **Command:** `npm test -- tests/unit/parser && npm run typecheck`
  - **Evidence:** exit 0.
- **Containment Audit (Pre-Done Gate):**
  - [ ] Mutasi terisolasi.

#### [ ] `TASK-006`: Markdown renderer

- **Status:** `PENDING`
- **Change Boundary Contract:**
  - **Primary Affected Files:** `src/lib/renderer/markdown-renderer.ts`, `tests/unit/renderer/markdown-renderer.test.ts`
  - **Justified Supporting Files:** None
- **Dependencies:** `TASK-004`, `TASK-005`
- **Pre-Conditions & Skills:**
  - Baca `TSD.md` §4.3 & `ARCHITECTURE.md` §6 (format output).
- **Acceptance Criteria & Traceability:**
  - [ ] `AC-01`: `# Judul` dari `Presentation.title`; `## Slide NN — Judul` per slide (NN dua digit, urut). → test
  - [ ] `AC-02`: Bullet → `- ` dengan indent 2 spasi per level. → test
  - [ ] `AC-03`: Tabel → GFM table (`| a | b |` + separator row). → test
  - [ ] `AC-04`: Warning → `> ⚠️ Slide N: pesan`. → test
  - [ ] `AC-05`: Notes → `> **Catatan pembicara:**\n> teks`. → test
  - [ ] `AC-06`: Slide dipisah `---`. → test
  - [ ] `AC-07`: Text passthrough tanpa transformasi angka/satuan. → test
- **Implementation & TDD Steps:**
  1. [ ] RED: 7 test (pure function, mudah dites).
  2. [ ] GREEN: implement renderer.
  3. [ ] REFACTOR.
- **Verification Gates (Deterministic Proof):**
  - **Command:** `npm test -- tests/unit/renderer && npm run typecheck`
  - **Evidence:** exit 0.
- **Containment Audit (Pre-Done Gate):**
  - [ ] Mutasi terisolasi.

---

### Phase C: UI Layer

#### [ ] `TASK-007`: FileUpload + pipeline hook (state machine)

- **Status:** `PENDING`
- **Change Boundary Contract:**
  - **Primary Affected Files:** `src/components/FileUpload.tsx`, `src/hooks/useFileProcessor.ts`, `tests/unit/useFileProcessor.test.ts`
  - **Justified Supporting Files:** `src/App.tsx` (render upload)
- **Dependencies:** `TASK-006`
- **Pre-Conditions & Skills:**
  - Baca `TSD.md` §4.4, `RULES.md` §7 (a11y, pesan error user-facing).
- **Acceptance Criteria & Traceability:**
  - [ ] `AC-01`: Dropzone + click-to-browse, keyboard accessible (ARIA). → test
  - [ ] `AC-02`: File invalid → pesan error jelas (bukan jargon). → test
  - [ ] `AC-03`: State machine `idle→processing→success|error` benar. → test
- **Implementation & TDD Steps:**
  1. [ ] RED: test hook + komponen.
  2. [ ] GREEN: implement.
  3. [ ] REFACTOR.
- **Verification Gates (Deterministic Proof):**
  - **Command:** `npm test -- tests/unit/useFileProcessor.test.ts && npm run typecheck && npm run lint`
  - **Evidence:** exit 0.
- **Containment Audit (Pre-Done Gate):**
  - [ ] Mutasi terisolasi.

#### [ ] `TASK-008`: PreviewPane + WarningList

- **Status:** `PENDING`
- **Change Boundary Contract:**
  - **Primary Affected Files:** `src/components/PreviewPane.tsx`, `src/components/WarningList.tsx`, `src/App.tsx`
  - **Justified Supporting Files:** None
- **Dependencies:** `TASK-007`
- **Pre-Conditions & Skills:**
  - Baca `RULES.md` §7.2 (error messaging), PRD FR8 ilustrasi.
- **Acceptance Criteria & Traceability:**
  - [ ] `AC-01`: Markdown hasil tampil di preview (pre-wrap, monospace). → test
  - [ ] `AC-02`: Ringkasan peringatan tampil ("N peringatan") + daftar per slide. → test
  - [ ] `AC-03`: 0 warning → area warning tidak tampil. → test
- **Implementation & TDD Steps:**
  1. [ ] RED: 3 test.
  2. [ ] GREEN: implement.
  3. [ ] REFACTOR.
- **Verification Gates (Deterministic Proof):**
  - **Command:** `npm test && npm run lint && npm run typecheck`
  - **Evidence:** exit 0.
- **Containment Audit (Pre-Done Gate):**
  - [ ] Mutasi terisolasi.

#### [ ] `TASK-009`: Copy & Download (.md)

- **Status:** `PENDING`
- **Change Boundary Contract:**
  - **Primary Affected Files:** `src/components/ExportButtons.tsx`, `src/hooks/useClipboard.ts`, `tests/unit/export.test.ts`
  - **Justified Supporting Files:** `src/App.tsx`
- **Dependencies:** `TASK-008`
- **Pre-Conditions & Skills:**
  - Baca `RULES.md` §7 (semantics: `<button>`).
- **Acceptance Criteria & Traceability:**
  - [ ] `AC-01`: Copy → `navigator.clipboard.writeText` terpanggil; feedback "Tersalin". → test
  - [ ] `AC-02`: Download → Blob `text/markdown` + filename `{namafile}.md`. → test
- **Implementation & TDD Steps:**
  1. [ ] RED: 2 test.
  2. [ ] GREEN: implement.
  3. [ ] REFACTOR.
- **Verification Gates (Deterministic Proof):**
  - **Command:** `npm test -- tests/unit/export.test.ts && npm run typecheck`
  - **Evidence:** exit 0.
- **Containment Audit (Pre-Done Gate):**
  - [ ] Mutasi terisolasi.

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
