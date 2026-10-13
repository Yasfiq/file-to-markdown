import { NAMESPACES } from './slide-xml';

/** Buat satu cell XML */
export function tableCell(text: string, attrs: { gridSpan?: number; rowSpan?: number } = {}): string {
  const gridSpanAttr = attrs.gridSpan ? ` gridSpan="${attrs.gridSpan}"` : '';
  const rowSpanAttr = attrs.rowSpan ? ` rowSpan="${attrs.rowSpan}"` : '';
  const textBody = text
    ? `<a:txBody><a:bodyPr/><a:p><a:r><a:t>${text}</a:t></a:r></a:p></a:txBody>`
    : '<a:txBody><a:bodyPr/><a:p/></a:txBody>';
  return `<a:tc${gridSpanAttr}${rowSpanAttr}>${textBody}</a:tc>`;
}

/** Buat satu row XML */
export function tableRow(cellsXml: string): string {
  return `<a:tr h="370840">${cellsXml}</a:tr>`;
}

/** Buat element graphicFrame berisi tabel */
export function tableFrame(rowsXml: string): string {
  return `<p:graphicFrame xmlns:p="${NAMESPACES.p}" xmlns:a="${NAMESPACES.a}">
    <p:nvGraphicFramePr><p:cNvPr id="5" name="Table 1"/><p:nvPr/></p:nvGraphicFramePr>
    <a:graphic>
      <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/table">
        <a:tbl>
          <a:tblPr/>
          <a:tblGrid><a:gridCol w="1000"/><a:gridCol w="1000"/></a:tblGrid>
          ${rowsXml}
        </a:tbl>
      </a:graphicData>
    </a:graphic>
  </p:graphicFrame>`;
}
