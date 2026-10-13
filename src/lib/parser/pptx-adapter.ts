import JSZip from 'jszip';
import type { Presentation, Result } from './types';
import { extractSlide, sortSlideFilenames } from './text-extractor';

/** Parse a PPTX file into normalized presentation data. */
export async function parsePptx(file: File): Promise<Result<Presentation>> {
  try {
    const zip = await JSZip.loadAsync(await file.arrayBuffer());
    const slideNames = sortSlideFilenames(
      Object.keys(zip.files).filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name)),
    );
    if (slideNames.length === 0) {
      return { success: false, error: { code: 'NO_SLIDES', message: 'File tidak berisi slide.' } };
    }

    const slides = [];
    for (let index = 0; index < slideNames.length; index += 1) {
      const name = slideNames[index];
      if (!name) continue;
      const xml = await zip.file(name)?.async('string');
      if (!xml) continue;
      const document = new DOMParser().parseFromString(xml, 'application/xml');
      slides.push(extractSlide(document, index + 1));
    }
    return { success: true, data: { title: file.name.replace(/\.pptx$/i, ''), slides } };
  } catch {
    return { success: false, error: { code: 'CORRUPTED_FILE', message: 'File PPTX rusak atau tidak valid.' } };
  }
}
