import { afterEach, describe, it, expect } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { PreviewPane } from '../../src/components/PreviewPane';

afterEach(() => cleanup());

describe('PreviewPane', () => {
  it('renders markdown with pre-wrap and monospace (AC-01)', () => {
    const markdown = '# Test\n\n## Slide 01 - Demo\n\n- Bullet satu\n- Bullet dua';
    render(<PreviewPane markdown={markdown} />);

    const pre = screen.getByRole('region', { name: /markdown hasil/i }).querySelector('pre');
    expect(pre).not.toBeNull();
    expect(pre!.textContent).toBe(markdown);
    expect(pre!.className).toMatch(/whitespace-pre-wrap/);
  });

  it('displays full markdown content without truncation', () => {
    const longMarkdown = Array(100)
      .fill('## Slide 01 - Test\n\n- Item\n\n')
      .join('');
    render(<PreviewPane markdown={longMarkdown} />);

    const pre = screen.getByRole('region').querySelector('pre');
    expect(pre!.textContent).toBe(longMarkdown);
  });
});
