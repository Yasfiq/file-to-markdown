# ARCHITECTURE.md — Technical Blueprint

**Status:** LOCKED | **Project:** PPTX to Markdown Converter | **Updated:** 2026-10-12

---

## 1. System Architecture

### 1.1 Pattern
**Browser-local, Single-page Application (SPA) dengan pipeline processing linear.**

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│   Upload    │────▶│  Validation  │────▶│   Parser    │────▶│   Renderer   │
│   (User)    │     │   (Guard)    │     │  (Extract)  │     │ (Markdown)   │
└─────────────┘     └──────────────┘     └─────────────┘     └──────────────┘
                                                │
                                                ▼
                                         ┌─────────────┐
                                         │   Preview   │
                                         │  & Export   │
                                         └─────────────┘
```

### 1.2 Core Principles
1. **Zero-Server**: Semua processing di browser (privasi, zero infrastructure cost).
2. **Fail-Explicit**: Setiap kegagalan ekstraksi dilaporkan, tidak pernah silent skip.
3. **Adapter Isolation**: Parser terisolasi dari renderer; mudah swap parser tanpa ubah UI.
4. **Type Safety**: Strict TypeScript di semua layer, zero `any` kecuali boundary eksternal.

---

## 2. Technology Stack

| Layer | Technology | Version | Justification |
|-------|-----------|---------|---------------|
| **Build Tool** | Vite | ^5.0.0 | Fast dev server, optimal bundling, native ESM |
| **Framework** | React | ^18.3.0 | Component model, hooks, large ecosystem |
| **Language** | TypeScript | ^5.3.0 | Type safety, LSP support, refactor confidence |
| **Styling** | Tailwind CSS | ^3.4.0 | Utility-first, minimal custom CSS, fast iteration |
| **PPTX Unzip** | JSZip | ^3.10.1 | Mature, zero-dependency, supports PPTX structure |
| **XML Parsing** | Native `DOMParser` | Browser API | Zero bundle cost, standards-compliant |
| **Testing** | Vitest | ^1.0.0 | Vite-native, fast, Jest-compatible API |

---

## 3. Directory Structure

```
pptx-to-markdown/
├── .agent/                      # AI agent context
│   ├── RULES.md                 # Hard constraints (always loaded)
│   ├── ARCHITECTURE.md          # This file
│   ├── KNOWLEDGE.md             # Domain glossary
│   ├── TASK.md                  # Atomic task tracker
│   ├── SKILLS/                  # Reusable agent capabilities
│   └── WORKFLOWS/               # Step-by-step procedures
│
├── src/
│   ├── lib/                     # Core business logic (framework-agnostic)
│   │   ├── parser/
│   │   │   ├── types.ts         # Normalized slide model
│   │   │   ├── pptx-adapter.ts  # JSZip + XML → SlideModel
│   │   │   ├── text-extractor.ts
│   │   │   ├── table-extractor.ts
│   │   │   └── notes-extractor.ts
│   │   ├── renderer/
│   │   │   ├── markdown-renderer.ts  # SlideModel → Markdown string
│   │   │   └── formatter.ts          # Markdown cleanup utilities
│   │   └── validator/
│   │       └── file-validator.ts     # File type, size, safety checks
│   │
│   ├── components/              # React UI components
│   │   ├── FileUpload.tsx       # Dropzone + validation UI
│   │   ├── PreviewPane.tsx      # Markdown preview
│   │   ├── ExportButtons.tsx    # Copy/Download actions
│   │   ├── WarningList.tsx      # Extraction warnings display
│   │   └── Layout.tsx           # App shell
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useFileProcessor.ts  # File → Markdown pipeline orchestrator
│   │   └── useClipboard.ts      # Copy to clipboard abstraction
│   │
│   ├── types/                   # Shared TypeScript types
│   │   └── index.ts
│   │
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Entry point
│   └── index.css                # Tailwind imports
│
├── tests/
│   ├── unit/
│   │   ├── parser/              # Parser module unit tests
│   │   └── renderer/            # Renderer unit tests
│   ├── integration/
│   │   └── full-pipeline.test.ts # End-to-end pipeline tests
│   └── fixtures/                # Sample PPTX files + expected output
│       ├── simple-text.pptx
│       ├── simple-text.expected.md
│       ├── with-tables.pptx
│       └── with-tables.expected.md
│
├── public/                      # Static assets
├── index.html                   # HTML entry
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript strict config
├── tailwind.config.js           # Tailwind config
└── package.json
```

---

## 4. Data Flow & State Management

### 4.1 Pipeline Execution Model
**Synchronous, single-threaded processing** (Web Worker jika profiling menunjukkan UI blocking >100ms).

```typescript
// Main orchestration flow
async function processFile(file: File): Promise<ProcessingResult> {
  // 1. Validation
  const validationResult = validateFile(file);
  if (!validationResult.success) return validationResult;

  // 2. Parse PPTX
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  const slides = await parseSlidesFromZip(zip);

  // 3. Render Markdown
  const markdown = renderToMarkdown(slides);

  // 4. Return result + warnings
  return {
    success: true,
    data: { markdown, warnings: slides.flatMap(s => s.warnings) }
  };
}
```

### 4.2 State Management
**React `useState` + `useReducer`** (no external state library di MVP).

```typescript
// App-level state shape
interface AppState {
  file: File | null;
  status: 'idle' | 'processing' | 'success' | 'error';
  markdown: string | null;
  warnings: ExtractionWarning[];
  error: string | null;
}
```

---

## 5. Core Data Models

### 5.1 Normalized Slide Model
```typescript
interface SlideModel {
  slideNumber: number;
  title: string | null;
  content: ContentElement[];
  notes: string | null;
  warnings: ExtractionWarning[];
}

type ContentElement =
  | { type: 'paragraph'; text: string }
  | { type: 'bullet'; level: number; text: string }
  | { type: 'table'; rows: string[][]; headers: string[] | null }
  | { type: 'unsupported'; elementType: string; message: string };

interface ExtractionWarning {
  slideNumber: number;
  elementType: 'image' | 'chart' | 'diagram' | 'video' | 'embedded-object';
  message: string;
}
```

### 5.2 PPTX XML Structure (Reference)
```
presentation.xml     ─── Metadata, slide relationships
├── slides/
│   ├── slide1.xml   ─── Slide content (shapes, text, tables)
│   ├── slide2.xml
│   └── ...
└── notesSlides/
    ├── notesSlide1.xml  ─── Speaker notes
    └── ...
```

**Key XML paths:**
- Slide title: `//p:sld//p:cNvPr[@name="Title 1"]/..//a:t`
- Paragraphs: `//p:txBody//a:p//a:t`
- Tables: `//a:tbl//a:tr//a:tc//a:t`
- Notes: `//p:notes//p:txBody//a:t`

---

## 6. Markdown Output Format

### 6.1 Structure Template
```markdown
# [Presentation Title from metadata or filename]

## Slide 1 — [Slide Title or "Untitled"]

[Paragraph text]

- Bullet point level 1
  - Bullet point level 2

| Header 1 | Header 2 |
|----------|----------|
| Cell 1   | Cell 2   |

> ⚠️ Peringatan: Slide ini berisi 1 gambar yang tidak diekstrak.

> **Catatan pembicara:**  
> [Speaker notes jika ada]

---

## Slide 2 — [Slide Title]
...
```

### 6.2 Formatting Rules
- H1: Presentation title
- H2: Slide title dengan prefix `Slide N —`
- Paragraphs: Plain text, preserve whitespace/newlines
- Bullets: Markdown list dengan indentation (2 spaces per level)
- Tables: GitHub-flavored Markdown table
- Warnings: Blockquote dengan emoji `⚠️`
- Notes: Blockquote dengan bold prefix `**Catatan pembicara:**`

---

## 7. Error Handling Strategy

### 7.1 Error Boundaries
```typescript
// Level 1: File validation (pre-processing)
validateFile(file) → Result<ValidFile, ValidationError>

// Level 2: PPTX structure parsing (zip + XML)
parseZip(buffer) → Result<JSZip, ParseError>

// Level 3: Content extraction (per-slide)
extractSlide(xml) → SlideModel (with warnings array, never throws)

// Level 4: Markdown rendering (deterministic)
renderMarkdown(slides) → string (always succeeds)
```

### 7.2 Failure Modes & Recovery
| Failure | Detection | Recovery | User Message |
|---------|-----------|----------|--------------|
| Wrong file type | MIME check | Reject upload | "File harus .pptx" |
| File > 25MB | Size check | Reject upload | "Maksimum 25MB" |
| Corrupted ZIP | JSZip.loadAsync() | Catch & report | "File rusak/tidak valid" |
| Missing slides/ | Directory check | Report & continue | "Struktur tidak standar" |
| Malformed XML | DOMParser error | Log warning, skip element | "Beberapa elemen gagal" |

---

## 8. Performance Considerations

### 8.1 Optimization Targets
- **Bundle size**: < 500KB gzipped (JSZip ≈ 110KB, React ≈ 130KB, App code < 100KB)
- **Processing time**: < 5 detik untuk 50-slide deck (10MB)
- **Memory**: < 150MB heap usage selama processing

### 8.2 Profiling Checkpoints
```typescript
// ponytail: No performance optimization di MVP kecuali profiling tunjukkan bottleneck.
// Upgrade path: Web Worker untuk parsing jika main thread blocked >100ms.
```

---

## 9. Security Boundaries

### 9.1 Browser Sandbox Constraints
- **Allowed**: `FileReader.readAsArrayBuffer()`, `Blob`, `URL.createObjectURL()`
- **Forbidden**: Dynamic `eval()`, `Function()`, external script injection
- **Enforced**: Content Security Policy (CSP) di `index.html`

### 9.2 Data Privacy Guarantee
- File never leaves browser (zero network requests during processing)
- No analytics, no telemetry, no server upload
- Processed data cleared on page reload

---

## 10. Testing Strategy

### 10.1 Test Pyramid
```
       ┌─────────┐
       │   E2E   │  ← 5% (Playwright: upload → download flow)
       ├─────────┤
       │ Integration │  ← 15% (Vitest: full pipeline with fixture PPTX)
       ├──────────┤
       │   Unit   │  ← 80% (Vitest: parser, renderer, validator modules)
       └──────────┘
```

### 10.2 Test Fixtures
- `simple-text.pptx`: 3 slides, paragraphs only
- `with-bullets.pptx`: 5 slides, nested bullets
- `with-tables.pptx`: 2 slides, tables with merged cells
- `with-notes.pptx`: 3 slides, speaker notes
- `with-images.pptx`: 4 slides, images (expect warnings)
- `corrupted.pptx`: Invalid ZIP (expect error)

---

## 11. Deployment

### 11.1 Build Process
```bash
npm run build  # Vite production build → dist/
```

### 11.2 Hosting
**Static hosting** (Vercel, Netlify, Cloudflare Pages, GitHub Pages)
- No server required
- No environment variables
- Single `index.html` + assets

### 11.3 Browser Support
- Chrome/Edge ≥ 90 (ES2020, DOMParser)
- Firefox ≥ 88
- Safari ≥ 14
- No IE11 support

---

## 12. Non-Goals & Future Scope

### 12.1 Explicit Out-of-Scope (MVP)
- ❌ DOCX, XLSX, PDF conversion
- ❌ OCR for image text
- ❌ AI summarization/analysis
- ❌ User accounts, database, cloud storage
- ❌ Batch processing multiple files
- ❌ Real-time collaboration
- ❌ PPTX → PPTX editing

### 12.2 Future Considerations (Post-MVP)
```typescript
// ponytail: Features below require validation dari real usage data.
// Add only if users demand & willing to pay/donate.
```
- Web Worker parallelization (if blocking UI)
- IndexedDB caching (if repeat conversions common)
- Drag-drop batch upload (if users need bulk)
- Export to JSON format (if programmatic use case emerges)
