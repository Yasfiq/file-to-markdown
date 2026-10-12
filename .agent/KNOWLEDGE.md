# KNOWLEDGE.md — Living Domain Knowledge & Gotchas

**Status:** LOCKED | **Project:** PPTX to Markdown Converter | **Updated:** 2026-10-12

---

## 1. Domain Glossary (Business Logic Terms)

| Term | Meaning | Notes for Parsing |
|------|---------|-------------------|
| **PPTX** | Office Open XML presentation format | ZIP archive; data stored in `ppt/slides/slide{N}.xml` |
| **Slide** | Unit of presentation content | Each = one XML file |
| **Speaker Notes** | Private text below slides | Stored in `ppt/notesSlides/notesSlide{N}.xml` |
| **Shape / Placeholder** | Container for text/table/image on slide | Identified by `<p:sp>` (shape), `<p:pic>` (image) |
| **Text Body (`txBody`)** | Text content container inside shape | Contains paragraphs `<a:p>`, runs `<a:r>`, text `<a:t>` |
| **Table** | Grid of cells | `<a:tbl>` with `<a:tr>` rows, `<a:tc>` cells |
| **Chart** | Embedded chart object | Lives in `<p:graphicFrame>` with `c:chart` |
| **Bullet Level** | List indentation depth | `marL` attribute on `<a:pPr>` paragraph properties |
| **Placeholder Type** | Semantic role (title, body, etc.) | `type` attribute on `<p:ph>` placeholder element |

## 2. Critical PPTX Parsing Gotchas

### 2.1 Text Extraction Pitfalls
- **Text is NOT in a single `<a:t>` tag**: Split across multiple `<a:r>` runs within one paragraph. MUST concat all `<a:t>` inside each `<a:p>`.
- **Whitespace**: XML `xml:space="preserve"` attribute matters — do NOT trim text that genuinely has trailing spaces.
- **Line breaks**: `<a:br/>` inside paragraph = line break; render as `\n`.
- **Empty paragraphs**: `<a:p>` with no `<a:t>` = empty line; preserve or skip based on context.

### 2.2 Table Extraction Pitfalls
- **Merged cells**: `gridSpan` and `rowSpan` attributes on `<a:tc>`; merged region only has content in top-left cell.
- **Header detection**: NOT reliable by XML alone; treat first row as header only if explicitly styled or user-confirmable.
- **Empty cells**: `<a:tc>` with only `<a:txBody>` containing empty paragraph = legitimately empty cell, not a bug.

### 2.3 Title Detection Pitfalls
- **`cNvPr@name` values are NOT standardized**: Can be "Title 1", "Title 2", "Judul", or arbitrary text depending on template.
- **Most reliable signal**: `type="title"` on `<p:ph>` placeholder + `idx="0"` (first title placeholder on slide).
- **Fallback**: First slide shape is NOT always the title. Use placeholder type first, then heuristic.

## 3. Technical Environment Notes

- Browser-only parsing; `DOMParser` handles XML namespaces fine but QName lookups (`getElementsByTagNameNS`) are verbose — use helper to namespace-map.
- JSZip returns files with `dir: true` for folders; iterate `Object.keys(zip.files)` to find slide files matching `/^ppt\/slides\/slide\d+\.xml$/`.
- Slide ordering: `slide10.xml` sorts AFTER `slide9.xml` lexically — MUST sort numerically by slide number extracted from filename.
- Notes matching: `notesSlide{N}.xml` corresponds to `slide{N}.xml`.

## 4. Known Limitations (Be Honest, Don't Fake)

| Element | Status in MVP | Message Shown |
|---------|--------------|----------------|
| Text, bullets, tables | ✅ Extracted | — |
| Speaker notes | ✅ Extracted (labeled) | — |
| Images | ⚠️ Warning only | "gambar tidak diekstrak" |
| Charts/Diagrams | ⚠️ Warning only | "diagram/chart tidak diekstrak" |
| Video/Audio | ⚠️ Warning only | "media tidak diekstrak" |
| SmartArt | ⚠️ Warning only | "SmartArt tidak diekstrak" |
| Embedded objects (Excel, etc.) | ⚠️ Warning only | "embedded object tidak diekstrak" |
| Math equations (OMML) | ⚠️ Warning only | "rumus matematika tidak diekstrak" |

## 5. Append-Only Log (Updated per Task)

| Date | Context | Insight / Gotcha |
|------|---------|------------------|
| 2026-10-12 | Initial setup | Browser-local confirmed. JSZip handles PPTX unzip; DOMParser for XML. |