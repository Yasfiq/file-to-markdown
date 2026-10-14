import { afterEach, describe, it, expect } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { WarningList } from '../../src/components/WarningList';
import type { ExtractionWarning } from '../../src/lib/parser/types';

afterEach(() => cleanup());

describe('WarningList', () => {
  const warnings: ExtractionWarning[] = [
    { slideNumber: 1, elementType: 'image', message: 'Gambar tidak dapat diekstrak' },
    { slideNumber: 1, elementType: 'chart', message: 'Grafik tidak didukung' },
    { slideNumber: 3, elementType: 'diagram', message: 'Diagram SmartArt diabaikan' },
  ];

  it('displays warning count and details per slide (AC-02)', () => {
    render(<WarningList warnings={warnings} />);

    expect(screen.getByText(/3 peringatan/i)).toBeTruthy();
    expect(screen.getByText(/Slide 1/i)).toBeTruthy();
    expect(screen.getByText(/Gambar tidak dapat diekstrak/i)).toBeTruthy();
    expect(screen.getByText(/Grafik tidak didukung/i)).toBeTruthy();
    expect(screen.getByText(/Slide 3/i)).toBeTruthy();
  });

  it('hides warning section when no warnings (AC-03)', () => {
    const { container } = render(<WarningList warnings={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('groups warnings by slide number', () => {
    render(<WarningList warnings={warnings} />);
    
    const headings = screen.getAllByRole('heading', { level: 3 });
    const headingTexts = headings.map((h) => h.textContent);
    
    expect(headingTexts).toContain('Slide 1');
    expect(headingTexts).toContain('Slide 3');
  });
});
