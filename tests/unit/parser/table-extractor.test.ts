import { describe, it, expect } from 'vitest';
import { extractTables } from '../../../src/lib/parser/table-extractor';
import { slideXml } from '../../fixtures/slide-xml';
import { tableCell, tableRow, tableFrame } from '../../fixtures/table-xml';

const parse = (xml: string): Document => new DOMParser().parseFromString(xml, 'application/xml');

describe('extractTables', () => {
  it('extracts simple table with header and data rows (AC-01)', () => {
    const rows =
      tableRow(tableCell('Kolom A') + tableCell('Kolom B')) +
      tableRow(tableCell('Nilai 1') + tableCell('Nilai 2'));
    const doc = parse(slideXml(tableFrame(rows)));

    const tables = extractTables(doc);
    expect(tables).toHaveLength(1);
    expect(tables[0]).toEqual({
      type: 'table',
      headers: ['Kolom A', 'Kolom B'],
      rows: [['Nilai 1', 'Nilai 2']],
    });
  });

  it('handles gridSpan merged cells by padding empty cells (AC-02)', () => {
    const rows =
      tableRow(tableCell('Header Gabung', { gridSpan: 2 })) +
      tableRow(tableCell('Sub 1') + tableCell('Sub 2'));
    const doc = parse(slideXml(tableFrame(rows)));

    const tables = extractTables(doc);
    expect(tables).toHaveLength(1);
    expect(tables[0]?.type).toBe('table');
    if (tables[0]?.type !== 'table') throw new Error('Expected table');
    expect(tables[0].headers).toEqual(['Header Gabung', '']);
    if (tables[0]?.type !== 'table') throw new Error('Expected table');
    expect(tables[0].rows).toEqual([['Sub 1', 'Sub 2']]);
  });

  it('preserves empty cell as empty string, not omitted (AC-03)', () => {
    const rows =
      tableRow(tableCell('Nama') + tableCell('Skor')) +
      tableRow(tableCell('Alice') + tableCell('')) +
      tableRow(tableCell('') + tableCell('80'));
    const doc = parse(slideXml(tableFrame(rows)));

    const tables = extractTables(doc);
    expect(tables).toHaveLength(1);
    if (tables[0]?.type !== 'table') throw new Error('Expected table');
    expect(tables[0].rows).toEqual([
      ['Alice', ''],
      ['', '80'],
    ]);
  });

  it('guarantees strict numeric and unit fidelity (AC-04 / FR7)', () => {
    const rows =
      tableRow(tableCell('Parameter') + tableCell('Nilai')) +
      tableRow(tableCell('Kapasitas') + tableCell('237,6 kWp')) +
      tableRow(tableCell('Biaya') + tableCell('Rp 1.500.000,00'));
    const doc = parse(slideXml(tableFrame(rows)));

    const tables = extractTables(doc);
    if (tables[0]?.type !== 'table') throw new Error('Expected table');
    expect(tables[0].rows).toEqual([
      ['Kapasitas', '237,6 kWp'],
      ['Biaya', 'Rp 1.500.000,00'],
    ]);
  });
});
