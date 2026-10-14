import { afterEach, describe, it, expect, vi } from 'vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExportButtons } from '../../src/components/ExportButtons';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('ExportButtons', () => {
  const markdown = '# Sample Deck\n\n- Slide 1 content';
  const fileName = 'presentation.pptx';

  it('copies markdown to clipboard and shows feedback (AC-01)', async () => {
    const writeTextMock = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: writeTextMock },
      configurable: true,
      writable: true,
    });

    render(<ExportButtons markdown={markdown} fileName={fileName} />);

    const copyBtn = screen.getByRole('button', { name: /salin markdown/i });
    fireEvent.click(copyBtn);

    expect(writeTextMock).toHaveBeenCalledWith(markdown);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /tersalin/i })).toBeTruthy();
    });
  });

  it('triggers markdown file download with .md extension (AC-02)', () => {
    const createObjectURLMock = vi.fn().mockReturnValue('blob:test-url');
    const revokeObjectURLMock = vi.fn();
    window.URL.createObjectURL = createObjectURLMock;
    window.URL.revokeObjectURL = revokeObjectURLMock;

    let clickedAnchor: { download: string; href: string } | null = null;
    const originalCreateElement = document.createElement.bind(document);
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation(((tagName: string) => {
      const element = originalCreateElement(tagName) as HTMLAnchorElement;
      if (tagName === 'a') {
        vi.spyOn(element, 'click').mockImplementation(() => {
          clickedAnchor = { download: element.download, href: element.href };
        });
      }
      return element as unknown as HTMLElementTagNameMap[keyof HTMLElementTagNameMap];
    }) as typeof document.createElement);

    try {
      render(<ExportButtons markdown={markdown} fileName={fileName} />);

      const downloadBtn = screen.getByRole('button', { name: /unduh \.md/i });
      fireEvent.click(downloadBtn);

      expect(createObjectURLMock).toHaveBeenCalledTimes(1);
      const blob = createObjectURLMock.mock.calls[0]?.[0] as Blob;
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toContain('text/markdown');

      expect(clickedAnchor).not.toBeNull();
      expect(clickedAnchor!.download).toBe('presentation.md');
      expect(clickedAnchor!.href).toContain('blob:test-url');
      expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:test-url');
    } finally {
      createElementSpy.mockRestore();
    }
  });
});
