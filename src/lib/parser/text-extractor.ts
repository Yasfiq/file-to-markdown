import type { ContentElement, SlideModel } from './types';

import { extractTables } from './table-extractor';

interface Namespaces {
  p: string;
  a: string;
}

const DEFAULT_NAMESPACES: Namespaces = {
  p: 'http://schemas.openxmlformats.org/presentationml/2006/main',
  a: 'http://schemas.openxmlformats.org/drawingml/2006/main',
};

/** Sort slide XML filenames by numeric slide index. */
export function sortSlideFilenames(files: string[]): string[] {
  return [...files].sort((left, right) => slideNumber(left) - slideNumber(right));
}

function slideNumber(filename: string): number {
  return Number(filename.match(/slide(\d+)\.xml$/)?.[1] ?? Number.MAX_SAFE_INTEGER);
}

/** Extract title from shape carrying a title placeholder. */
export function extractTitle(document: Document, namespaces: Namespaces = DEFAULT_NAMESPACES): string | null {
  const placeholders = elements(document, namespaces.p, 'ph');
  const titlePlaceholder = placeholders.find((node) => node.getAttribute('type') === 'title');
  if (!titlePlaceholder) return null;

  const shape = ancestor(titlePlaceholder, 'sp');
  if (!shape) return null;
  return textFromParagraphs(elements(shape, namespaces.a, 'p'), namespaces.a) || null;
}

/** Extract text and bullet elements from one slide XML document. */
export function extractSlide(
  document: Document,
  slideNumberValue: number,
  namespaces: Namespaces = DEFAULT_NAMESPACES,
): SlideModel {
  const title = extractTitle(document, namespaces);
  const content: ContentElement[] = [];

  // Extract tables first
  const tables = extractTables(document, namespaces);
  content.push(...tables);

  const paragraphs = elements(document, namespaces.a, 'p');

  for (const paragraph of paragraphs) {
    const text = elements(paragraph, namespaces.a, 't')
      .map((node) => node.textContent ?? '')
      .join('');
    if (!text) continue;
    if (ancestor(paragraph, 'sp') && elements(ancestor(paragraph, 'sp') as Element, namespaces.p, 'ph')[0]?.getAttribute('type') === 'title') continue;
    if (ancestor(paragraph, 'tc')) continue; // Skip paragraphs inside tables (handled by table-extractor)

    const pPr = elements(paragraph, namespaces.a, 'pPr')[0];
    const hasBullet = pPr !== undefined && elements(pPr, namespaces.a, 'buChar').length === 1;
    const marL = Number(pPr?.getAttribute('marL') ?? 0);
    const level = hasBullet ? Math.max(0, Math.round(marL / 342900)) : 0;
    content.push(hasBullet ? { type: 'bullet', level, text } : { type: 'paragraph', text });
  }

  return { slideNumber: slideNumberValue, title, content, notes: null, warnings: [] };
}

function textFromParagraphs(paragraphs: Element[], aNamespace = DEFAULT_NAMESPACES.a): string {
  return paragraphs
    .map((paragraph) => elements(paragraph, aNamespace, 't').map((node) => node.textContent ?? '').join(''))
    .join('\n')
    .trim();
}

function ancestor(element: Element, localName: string): Element | null {
  let current: Element | null = element.parentElement;
  while (current) {
    if (current.localName === localName) return current;
    current = current.parentElement;
  }
  return null;
}

function elements(root: Document | Element, namespace: string, localName: string): Element[] {
  return Array.from(root.getElementsByTagName('*')).filter(
    (element) => element.localName === localName && element.namespaceURI === namespace,
  );
}
