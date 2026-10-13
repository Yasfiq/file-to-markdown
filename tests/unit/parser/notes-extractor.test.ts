import { describe, it, expect } from 'vitest';
import { extractNotes, extractUnsupportedWarnings } from '../../../src/lib/parser/notes-extractor';
import { slideXml } from '../../fixtures/slide-xml';
import { pictureShape, chartFrame } from '../../fixtures/notes-xml';
import { notesSlideXml } from '../../fixtures/notes-xml';

const parse = (xml: string): Document => new DOMParser().parseFromString(xml, 'application/xml');

describe('extractNotes', () => {
  it('extracts speaker notes text (AC-01)', () => {
    const notes = extractNotes(parse(notesSlideXml('Catatan untuk pembicara')));
    expect(notes).toBe('Catatan untuk pembicara');
  });

  it('returns null when notes document has no text (AC-02)', () => {
    expect(extractNotes(parse(notesSlideXml('')))).toBeNull();
  });
});

describe('extractUnsupportedWarnings', () => {
  it('reports image and chart elements explicitly (AC-03/AC-04)', () => {
    const document = parse(slideXml(pictureShape('Foto') + chartFrame('Grafik')));
    const warnings = extractUnsupportedWarnings(document, 5);
    expect(warnings).toEqual([
      { slideNumber: 5, elementType: 'image', message: 'Slide 5: gambar tidak diekstrak.' },
      { slideNumber: 5, elementType: 'chart', message: 'Slide 5: chart tidak diekstrak.' },
    ]);
  });

  it('returns no warnings for text-only slide', () => {
    const warnings = extractUnsupportedWarnings(parse(slideXml('')), 1);
    expect(warnings).toEqual([]);
  });
});
