export const NAMESPACES = {
  p: 'http://schemas.openxmlformats.org/presentationml/2006/main',
  a: 'http://schemas.openxmlformats.org/drawingml/2006/main',
  r: 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
  c: 'http://schemas.openxmlformats.org/drawingml/2006/chart',
};

export function slideXml(bodyXml: string): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:p="${NAMESPACES.p}" xmlns:a="${NAMESPACES.a}" xmlns:r="${NAMESPACES.r}">
  <p:cSld><p:spTree>${bodyXml}</p:spTree></p:cSld>
</p:sld>`;
}

/** Shape dengan title placeholder */
export function titleShape(text: string): string {
  return `<p:sp>
    <p:nvSpPr><p:cNvPr id="2" name="Title 1"/><p:nvPr><p:ph type="title"/></p:nvPr></p:nvSpPr>
    <p:txBody><a:bodyPr/><a:p><a:r><a:t>${text}</a:t></a:r></a:p></p:txBody>
  </p:sp>`;
}

/** Body shape berisi paragraf/bullet */
export function bodyShape(paragraphsXml: string): string {
  return `<p:sp>
    <p:nvSpPr><p:cNvPr id="3" name="Content Placeholder 2"/><p:nvPr><p:ph type="body" idx="1"/></p:nvPr></p:nvSpPr>
    <p:txBody><a:bodyPr/><a:lstStyle/>${paragraphsXml}</p:txBody>
  </p:sp>`;
}

/**
 * Satu paragraf; marL menentukan bullet level.
 * bullet: true → beri buChar (indikator bullet); false/undefined → buNone (plain text).
 */
export function paragraph(text: string, opts: { bullet?: boolean; marL?: number } = {}): string {
  const marL = opts.marL ?? 0;
  const pPr = opts.bullet
    ? `<a:pPr marL="${marL}" indent="-285750"><a:buFont typeface="Arial"/><a:buChar char="•"/></a:pPr>`
    : `<a:pPr marL="${marL}"><a:buNone/></a:pPr>`;
  const runs = `<a:r><a:t>${text}</a:t></a:r>`;
  return `<a:p>${pPr}${runs}</a:p>`;
}

/** Paragraf multi-run: beberapa <a:r> dalam satu <a:p> */
export function multiRunParagraph(runTexts: string[]): string {
  const inner = runTexts.map((t) => `<a:r><a:t>${t}</a:t></a:r>`).join('');
  return `<a:p>${inner}</a:p>`;
}