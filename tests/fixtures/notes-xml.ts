import { NAMESPACES } from './slide-xml';

/** Notes slide XML untuk slide tertentu */
export function notesSlideXml(notesText: string): string {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:notes xmlns:p="${NAMESPACES.p}" xmlns:a="${NAMESPACES.a}">
  <p:cSld>
    <p:spTree>
      <p:sp>
        <p:nvSpPr><p:cNvPr id="2" name="Notes Placeholder 1"/><p:nvPr><p:ph type="body" idx="1"/></p:nvPr></p:nvSpPr>
        <p:txBody><a:bodyPr/><a:p><a:r><a:t>${notesText}</a:t></a:r></a:p></p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
</p:notes>`;
}

/** Picture shape (image) untuk unsupported warning */
export function pictureShape(name: string): string {
  return `<p:pic xmlns:p="${NAMESPACES.p}">
    <p:nvPicPr><p:cNvPr id="4" name="${name}"/><p:nvPr/></p:nvPicPr>
  </p:pic>`;
}

/** Chart graphicFrame untuk unsupported warning */
export function chartFrame(name: string): string {
  return `<p:graphicFrame xmlns:p="${NAMESPACES.p}" xmlns:a="${NAMESPACES.a}" xmlns:c="${NAMESPACES.c}">
    <p:nvGraphicFramePr><p:cNvPr id="6" name="${name}"/><p:nvPr/></p:nvGraphicFramePr>
    <a:graphic>
      <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/chart">
        <c:chart/>
      </a:graphicData>
    </a:graphic>
  </p:graphicFrame>`;
}
