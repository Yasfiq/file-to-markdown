import type { ContentElement } from './types';

export type TableElement = Extract<ContentElement, { type: 'table' }>;

interface Namespaces {
  a: string;
}

const DEFAULT_NAMESPACES: Namespaces = {
  a: 'http://schemas.openxmlformats.org/drawingml/2006/main',
};

/**
 * Extract all tables from slide XML document.
 * 
 * @param document - Parsed XML document
 * @param namespaces - XML namespaces (default: OpenXML)
 * @returns Array of table ContentElements
 */
export function extractTables(
  document: Document,
  namespaces: Namespaces = DEFAULT_NAMESPACES,
): TableElement[] {
  const tables = elements(document, namespaces.a, 'tbl');
  return tables.map((tbl) => parseTable(tbl, namespaces));
}

function parseTable(tblElement: Element, namespaces: Namespaces): TableElement {
  const rows = elements(tblElement, namespaces.a, 'tr');
  if (rows.length === 0) {
    return { type: 'table', headers: null, rows: [] };
  }

  const matrix = rows.map((row) => extractRow(row, namespaces));
  const width = Math.max(...matrix.map((row) => row.length));
  const normalized = matrix.map((row) => [...row, ...Array(Math.max(0, width - row.length)).fill('')]);

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex += 1) {
    const cells = elements(rows[rowIndex]!, namespaces.a, 'tc');
    let columnIndex = 0;
    for (const cell of cells) {
      const gridSpan = Number(cell.getAttribute('gridSpan') ?? 1);
      const rowSpan = Number(cell.getAttribute('rowSpan') ?? 1);
      for (let rowOffset = 1; rowOffset < rowSpan; rowOffset += 1) {
        const target = normalized[rowIndex + rowOffset];
        if (target) {
          for (let columnOffset = 0; columnOffset < gridSpan; columnOffset += 1) {
            target[columnIndex + columnOffset] = '';
          }
        }
      }
      columnIndex += gridSpan;
    }
  }

  const [normalizedHeaders = [], ...normalizedRows] = normalized;
  return { type: 'table', headers: normalizedHeaders, rows: normalizedRows };
}

function extractRow(trElement: Element, namespaces: Namespaces): string[] {
  const cells = elements(trElement, namespaces.a, 'tc');
  const result: string[] = [];

  for (const cell of cells) {
    const text = extractCellText(cell, namespaces);
    const gridSpan = Number(cell.getAttribute('gridSpan') ?? 1);
    const rowSpan = Number(cell.getAttribute('rowSpan') ?? 1);
    result.push(rowSpan > 1 ? text : text);
    for (let i = 1; i < gridSpan; i += 1) result.push('');
  }

  return result;
}

function extractCellText(tcElement: Element, namespaces: Namespaces): string {
  const textNodes = elements(tcElement, namespaces.a, 't');
  return textNodes.map((node) => node.textContent ?? '').join('');
}

function elements(root: Document | Element, namespace: string, localName: string): Element[] {
  return Array.from(root.getElementsByTagName('*')).filter(
    (element) => element.localName === localName && element.namespaceURI === namespace,
  );
}
