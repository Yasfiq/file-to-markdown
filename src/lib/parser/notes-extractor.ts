import type { ExtractionWarning } from './types';

interface Namespaces {
  p: string;
  a: string;
  c: string;
}

const DEFAULT_NAMESPACES: Namespaces = {
  p: 'http://schemas.openxmlformats.org/presentationml/2006/main',
  a: 'http://schemas.openxmlformats.org/drawingml/2006/main',
  c: 'http://schemas.openxmlformats.org/drawingml/2006/chart',
};

/**
 * Extract speaker notes from a notesSlide XML document.
 * Excludes slide-number placeholder shapes.
 */
export function extractNotes(
  document: Document,
  namespaces: Namespaces = DEFAULT_NAMESPACES,
): string | null {
  const paragraphs = elements(document, namespaces.a, 'p');
  const texts: string[] = [];

  for (const paragraph of paragraphs) {
    const shape = ancestor(paragraph, 'sp');
    const ph = shape ? elements(shape, namespaces.p, 'ph')[0] : null;
    const phType = ph?.getAttribute('type');
    if (phType === 'sldNum' || phType === 'dt' || phType === 'hdr' || phType === 'ftr') {
      continue;
    }

    const runTexts = elements(paragraph, namespaces.a, 't')
      .map((node) => node.textContent ?? '')
      .join('');
    if (runTexts.trim()) {
      texts.push(runTexts.trim());
    }
  }

  return texts.length > 0 ? texts.join('\n') : null;
}

/**
 * Scan slide XML for unsupported visual elements (FR8 / FR10).
 */
export function extractUnsupportedWarnings(
  document: Document,
  slideNumber: number,
  namespaces: Namespaces = DEFAULT_NAMESPACES,
): ExtractionWarning[] {
  const warnings: ExtractionWarning[] = [];

  const pictures = elements(document, namespaces.p, 'pic');
  for (let i = 0; i < pictures.length; i += 1) {
    warnings.push({
      slideNumber,
      elementType: 'image',
      message: `Slide ${slideNumber}: gambar tidak diekstrak.`,
    });
  }

  const charts = elements(document, namespaces.c, 'chart');
  for (let i = 0; i < charts.length; i += 1) {
    warnings.push({
      slideNumber,
      elementType: 'chart',
      message: `Slide ${slideNumber}: chart tidak diekstrak.`,
    });
  }

  return warnings;
}

function elements(root: Document | Element, namespace: string, localName: string): Element[] {
  return Array.from(root.getElementsByTagName('*')).filter(
    (element) => element.localName === localName && element.namespaceURI === namespace,
  );
}

function ancestor(element: Element, localName: string): Element | null {
  let current: Element | null = element.parentElement;
  while (current) {
    if (current.localName === localName) return current;
    current = current.parentElement;
  }
  return null;
}
