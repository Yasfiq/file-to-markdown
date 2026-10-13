import { describe, it, expect } from 'vitest';
import JSZip from 'jszip';
import { parsePptx } from '../../../src/lib/parser/pptx-adapter';
import { slideXml, titleShape, paragraph, bodyShape } from '../../fixtures/slide-xml';

function makePptxBlob(files: Record<string, string>): Promise<File> {
  const zip = new JSZip();
  for (const [path, content] of Object.entries(files)) {
    zip.file(path, content);
  }
  return zip.generateAsync({ type: 'blob' }).then(
    (blob) =>
      new File([blob], 'deck.pptx', {
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      }),
  );
}

describe('parsePptx — AC-05 error handling & zip integration', () => {
  it('returns CORRUPTED_FILE without throwing on corrupted data', async () => {
    const corruptFile = new File([new Uint8Array([0, 1, 2, 3])], 'broken.pptx');
    const result = await parsePptx(corruptFile);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('CORRUPTED_FILE');
    }
  });

  it('returns NO_SLIDES when zip contains no ppt/slides/slide*.xml', async () => {
    const emptyZip = await makePptxBlob({ 'README.txt': 'no slides here' });
    const result = await parsePptx(emptyZip);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe('NO_SLIDES');
    }
  });

  it('parses valid minimal pptx with title and body paragraph', async () => {
    const xml = slideXml(titleShape('Pengantar') + bodyShape(paragraph('Halo dunia')));
    const file = await makePptxBlob({
      '[Content_Types].xml': '<Types/>',
      'ppt/slides/slide1.xml': xml,
    });

    const result = await parsePptx(file);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('deck');
      expect(result.data.slides).toHaveLength(1);
      expect(result.data.slides[0]?.title).toBe('Pengantar');
      expect(result.data.slides[0]?.content).toEqual([
        { type: 'paragraph', text: 'Halo dunia' },
      ]);
    }
  });
});
