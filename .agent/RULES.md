# RULES.md — Hard Constraints & Quality Standards

**Status:** LOCKED | **Project:** PPTX to Markdown Converter | **Updated:** 2026-10-12

---

## 1. Dependency Discipline

### 1.1 Allowed Dependencies (Exhaustive List)
```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "jszip": "^3.10.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "eslint": "^8.57.0",
    "eslint-plugin-react-hooks": "^4.6.2",
    "typescript-eslint": "^7.18.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0",
    "vite": "^5.4.0",
    "vitest": "^1.6.0"
  }
}
```

### 1.2 Dependency Boundaries
- **FORBIDDEN**: Menginstall package di luar daftar 1.1 tanpa update TSD dan human sign-off.
- **FORBIDDEN**: Menggunakan library PPTX parser third-party (pptxgenjs, officegen, mammoth) di MVP.
- **FORBIDDEN**: Menambahkan AI API, OCR library, atau backend framework.
- **REQUIRED**: Gunakan native Web APIs (`DOMParser`, `FileReader`, `Blob`, `URL.createObjectURL`).

---

## 2. Code Quality Standards

### 2.1 TypeScript Strict Mode
```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "noUncheckedIndexedAccess": true
}
```

### 2.2 Anti-Slop Rules (Enforced)
- **FORBIDDEN**: Komentar apologetik (`// TODO: make this better`, `// hack`, `// this is ugly`).
- **FORBIDDEN**: Utility function tidak terpakai (`formatDate` tanpa caller, `debounce` tanpa use case).
- **FORBIDDEN**: Type `any` kecuali pada boundary eksternal (`FileReader.result as ArrayBuffer`).
- **FORBIDDEN**: Mock data palsu di production code (`const mockSlides = [...]`).
- **REQUIRED**: Setiap fungsi publik punya JSDoc dengan `@param`, `@returns`, `@throws`.

### 2.3 Error Handling Contract
```typescript
// REQUIRED pattern
type Result<T, E = Error> = { success: true; data: T } | { success: false; error: E };

// FORBIDDEN pattern
function parseSlide(xml: string): Slide {
  try {
    return parse(xml);
  } catch (e) {
    return {} as Slide; // ❌ silent failure
  }
}
```

---

## 3. Extraction Accuracy Constraints

### 3.1 Fidelity Rules
- **REQUIRED**: Angka dan satuan tidak boleh dimodifikasi (`237,6 kWp` → `237,6 kWp`, bukan `237.6 kWp` atau `238 kWp`).
- **REQUIRED**: Urutan slide, bullet, paragraf harus identik dengan sumber.
- **REQUIRED**: Tabel cell kosong tetap kosong, bukan dihilangkan atau diisi placeholder.

### 3.2 Unsupported Content Reporting
```typescript
// REQUIRED: explicit warning tracking
interface ExtractionWarning {
  slideNumber: number;
  elementType: 'image' | 'chart' | 'diagram' | 'video' | 'embedded-object';
  message: string;
}

// FORBIDDEN: silent skipping tanpa log
```

---

## 4. File & Security Boundaries

### 4.1 Validation Gates
```typescript
const FILE_RULES = {
  maxSize: 25 * 1024 * 1024, // 25MB
  allowedMimeTypes: ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
  allowedExtensions: ['.pptx']
} as const;
```

### 4.2 Execution Safety
- **FORBIDDEN**: Mengeksekusi kode dari file upload (`eval`, `Function()`, dynamic import dari blob).
- **FORBIDDEN**: Mengirim file atau konten ke server eksternal (analytics, CDN, API).
- **REQUIRED**: Semua processing di main thread atau Web Worker, tidak boleh keluar dari browser sandbox.

---

## 5. Git & Version Control

### 5.1 Commit Discipline
- **REQUIRED**: Commit message format: `[TASK-XXX] verb: description` (contoh: `[TASK-003] feat: add table extraction`).
- **FORBIDDEN**: Commit file build artifacts (`dist/`, `.cache/`, `node_modules/`).
- **FORBIDDEN**: Commit secrets atau API keys (`.env`, credential files).

### 5.2 Branch Strategy
- **REQUIRED**: Setiap task baru = branch baru dari `main` (`git checkout -b task-003-table-extraction`).
- **REQUIRED**: Panggil `git diff` sebelum mark task DONE; pastikan mutasi terisolasi.

---

## 6. Testing Standards

### 6.1 Coverage Thresholds
```javascript
{
  branches: 80,
  functions: 85,
  lines: 85,
  statements: 85
}
```

### 6.2 Test Contracts
- **REQUIRED**: Setiap parser module punya unit test dengan sample XML real dari PPTX.
- **REQUIRED**: Setiap renderer function punya test dengan expected Markdown output.
- **FORBIDDEN**: Test yang selalu pass (`expect(true).toBe(true)`).
- **FORBIDDEN**: Snapshot test tanpa assertion eksplisit di MVP.

---

## 7. UI/UX Constraints

### 7.1 Accessibility Baseline
- **REQUIRED**: Semantic HTML (`<button>` untuk action, bukan `<div onclick>`).
- **REQUIRED**: ARIA labels untuk dropzone dan interactive elements.
- **REQUIRED**: Keyboard navigation (Tab, Enter, Escape) untuk semua action.

### 7.2 Error Messaging
```typescript
// REQUIRED pattern: user-facing, actionable
"File terlalu besar (30MB). Maksimum 25MB."

// FORBIDDEN pattern: technical jargon
"DOMException: Quota exceeded."
```

---

## 8. Performance Budgets

- **REQUIRED**: Bundle size < 500KB (gzipped).
- **REQUIRED**: Processing time < 5 detik untuk file 10MB dengan 50 slide.
- **REQUIRED**: UI tetap responsif saat processing (gunakan `requestIdleCallback` atau Web Worker jika blocking).

---

## 9. Containment Audit Checklist (Pre-Done Gate)

Sebelum mark task DONE, agent WAJIB:
- [ ] Panggil `git status` & `git diff`.
- [ ] Konfirmasi hanya Primary Affected Files dan Justified Supporting Files yang berubah.
- [ ] Konfirmasi zero secrets, zero formatting sprawl, zero test skip.
- [ ] Jalankan `npm run lint && npm run typecheck && npm test`.
- [ ] Report hasil verification di task checklist.
