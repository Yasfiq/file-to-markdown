import { describe, it, expect } from 'vitest';
import { parsePptx } from '../../src/lib/parser/pptx-adapter';
import { renderToMarkdown } from '../../src/lib/renderer/markdown-renderer';
import { createFullFeaturedPptx } from '../fixtures/create-pptx';

describe('Full Pipeline Integration (AC-01, AC-02)', () => {
  it('converts multi-slide PPTX with tables, nested bullets, notes, and fidelity intact (AC-01)', async () => {
    const file = await createFullFeaturedPptx();
    const parseResult = await parsePptx(file);

    expect(parseResult.success).toBe(true);
    if (!parseResult.success) return;

    const markdown = renderToMarkdown(parseResult.data);

    // Hard Gate: No em dash
    expect(markdown).not.toContain('—');

    // Title from file name
    expect(markdown).toContain('# laporan-lengkap');

    // Slide 1 checks: title + nested bullets
    expect(markdown).toContain('## Slide 01 - Ikhtisar Proyek');
    expect(markdown).toContain('- Poin utama level 0');
    expect(markdown).toContain('  - Sub-poin level 1');
    expect(markdown).toContain('    - Sub-sub-poin level 2');

    // Slide 2 checks: title + GFM table + exact number fidelity
    expect(markdown).toContain('## Slide 02 - Data Teknis');
    expect(markdown).toContain('| Komponen | Kapasitas |');
    expect(markdown).toContain('| --- | --- |');
    expect(markdown).toContain('| Inverter | 237,6 kWp |');
    expect(markdown).toContain('| Biaya | Rp 1.500.000,00 |');

    // Slide 3 checks: unsupported warnings + speaker notes
    expect(markdown).toContain('## Slide 03 - Arsitektur Sistem');
    expect(markdown).toContain('> ⚠️ Slide 3: gambar tidak diekstrak.');
    expect(markdown).toContain('> ⚠️ Slide 3: chart tidak diekstrak.');
    expect(markdown).toContain('> **Catatan pembicara:**\n> Ingatkan audiens tentang batasan memori.');

    // Slides separated by '---'
    expect(markdown).toContain('---');
  });

  it('handles corrupted binary file safely with error Result (AC-02)', async () => {
    const corruptedFile = new File([new Uint8Array([0x00, 0x11, 0x22, 0x33])], 'corrupt.pptx', {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    });

    const parseResult = await parsePptx(corruptedFile);
    expect(parseResult.success).toBe(false);
    if (parseResult.success) return;

    expect(parseResult.error.code).toBe('CORRUPTED_FILE');
    expect(parseResult.error.message).toBeTruthy();
  });
});
