import type { ContentElement, Presentation, SlideModel } from '../parser/types';

/** Convert normalized presentation data to Markdown. */
export function renderToMarkdown(presentation: Presentation): string {
  const slides = [...presentation.slides].sort((a, b) => a.slideNumber - b.slideNumber);
  return `# ${presentation.title}\n\n${slides.map(renderSlide).join('\n\n---\n\n')}\n`;
}

function renderSlide(slide: SlideModel): string {
  const blocks = [`## Slide ${String(slide.slideNumber).padStart(2, '0')} - ${slide.title ?? 'Untitled'}`];
  let previous: ContentElement['type'] | null = null;

  for (const element of slide.content) {
    const block = renderElement(element);
    // Consecutive bullets form one list.
    if (element.type === 'bullet' && previous === 'bullet') blocks[blocks.length - 1] += `\n${block}`;
    else blocks.push(block);
    previous = element.type;
  }
  for (const warning of slide.warnings) blocks.push(`> ⚠️ ${warning.message}`);
  if (slide.notes) {
    blocks.push(['> **Catatan pembicara:**', ...slide.notes.split('\n').map((line) => `> ${line}`)].join('\n'));
  }

  return blocks.join('\n\n');
}

function renderElement(element: ContentElement): string {
  switch (element.type) {
    case 'paragraph':
      return element.text;
    case 'bullet':
      return `${'  '.repeat(Math.max(0, element.level))}- ${element.text}`;
    case 'table':
      return renderTable(element.headers, element.rows);
    case 'unsupported':
      return `> ⚠️ ${element.message}`;
  }
}

function renderTable(headers: string[] | null, rows: string[][]): string {
  const width = Math.max(headers?.length ?? 0, ...rows.map((row) => row.length));
  const head = headers ?? Array<string>(width).fill('');
  return [head, Array<string>(width).fill('---'), ...rows].map((row) => tableRow(row, width)).join('\n');
}

function tableRow(cells: string[], width: number): string {
  const padded = Array.from({ length: width }, (_, index) => cells[index] ?? '');
  return `| ${padded.map((cell) => cell.replace(/\|/g, '\\|').replace(/\n/g, '<br>')).join(' | ')} |`;
}
