import { describe, it, expect } from 'vitest';
import { renderToMarkdown } from '../../../src/lib/renderer/markdown-renderer';
import type { Presentation, SlideModel } from '../../../src/lib/parser/types';

describe('renderToMarkdown', () => {
  it('renders presentation title and two-digit slide header (AC-01 / R-02 no em dash)', () => {
    const presentation: Presentation = {
      title: 'Laporan Kuartal',
      slides: [
        {
          slideNumber: 1,
          title: 'Ikhtisar',
          content: [],
          notes: null,
          warnings: [],
        },
        {
          slideNumber: 2,
          title: null,
          content: [],
          notes: null,
          warnings: [],
        },
      ],
    };

    const md = renderToMarkdown(presentation);
    expect(md).toContain('# Laporan Kuartal');
    expect(md).toContain('## Slide 01 - Ikhtisar');
    expect(md).toContain('## Slide 02 - Untitled');
    expect(md).not.toContain('—'); // R-02 Hard Gate
  });

  it('renders nested bullets with 2-space indentation (AC-02)', () => {
    const slide: SlideModel = {
      slideNumber: 1,
      title: 'Poin',
      content: [
        { type: 'bullet', level: 0, text: 'Top level' },
        { type: 'bullet', level: 1, text: 'Sub level' },
        { type: 'bullet', level: 2, text: 'Sub sub level' },
      ],
      notes: null,
      warnings: [],
    };

    const md = renderToMarkdown({ title: 'Deck', slides: [slide] });
    expect(md).toContain('- Top level\n  - Sub level\n    - Sub sub level');
  });

  it('renders GFM table with separator row (AC-03)', () => {
    const slide: SlideModel = {
      slideNumber: 1,
      title: 'Tabel',
      content: [
        {
          type: 'table',
          headers: ['Item', 'Jumlah'],
          rows: [
            ['Buku', '10'],
            ['Pena', '5'],
          ],
        },
      ],
      notes: null,
      warnings: [],
    };

    const md = renderToMarkdown({ title: 'Deck', slides: [slide] });
    expect(md).toContain('| Item | Jumlah |\n| --- | --- |\n| Buku | 10 |\n| Pena | 5 |');
  });

  it('renders warnings as blockquotes with emoji (AC-04)', () => {
    const slide: SlideModel = {
      slideNumber: 1,
      title: 'Visual',
      content: [],
      notes: null,
      warnings: [{ slideNumber: 1, elementType: 'image', message: 'Slide 1: gambar tidak diekstrak.' }],
    };

    const md = renderToMarkdown({ title: 'Deck', slides: [slide] });
    expect(md).toContain('> ⚠️ Slide 1: gambar tidak diekstrak.');
  });

  it('renders speaker notes in blockquote with bold label (AC-05)', () => {
    const slide: SlideModel = {
      slideNumber: 1,
      title: 'Catatan',
      content: [],
      notes: 'Ingatkan audiens tentang deadline.\nPoin penting.',
      warnings: [],
    };

    const md = renderToMarkdown({ title: 'Deck', slides: [slide] });
    expect(md).toContain('> **Catatan pembicara:**\n> Ingatkan audiens tentang deadline.\n> Poin penting.');
  });

  it('separates slides with horizontal rule (AC-06)', () => {
    const slides: SlideModel[] = [
      { slideNumber: 1, title: 'Satu', content: [], notes: null, warnings: [] },
      { slideNumber: 2, title: 'Dua', content: [], notes: null, warnings: [] },
    ];

    const md = renderToMarkdown({ title: 'Deck', slides });
    expect(md).toContain('\n---\n\n## Slide 02');
  });

  it('preserves numbers and units exactly without alteration (AC-07 / FR7)', () => {
    const slide: SlideModel = {
      slideNumber: 1,
      title: 'Kapasitas',
      content: [
        { type: 'paragraph', text: 'Total daya terpasang: 237,6 kWp dengan biaya Rp 1.500.000,00' },
      ],
      notes: null,
      warnings: [],
    };

    const md = renderToMarkdown({ title: 'Deck', slides: [slide] });
    expect(md).toContain('237,6 kWp');
    expect(md).toContain('Rp 1.500.000,00');
  });
});
