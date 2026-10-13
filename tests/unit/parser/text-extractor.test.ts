import { describe, it, expect } from 'vitest';
import { extractSlide, extractTitle, sortSlideFilenames } from '../../../src/lib/parser/text-extractor';
import { slideXml, titleShape, bodyShape, paragraph, multiRunParagraph, NAMESPACES } from '../../fixtures/slide-xml';

const parse = (xml: string): Document => new DOMParser().parseFromString(xml, 'application/xml');

describe('sortSlideFilenames — AC-01 numeric order', () => {
  it('orders slide10 after slide9 numerically', () => {
    expect(sortSlideFilenames(['slide1.xml', 'slide10.xml', 'slide2.xml', 'slide9.xml'])).toEqual([
      'slide1.xml',
      'slide2.xml',
      'slide9.xml',
      'slide10.xml',
    ]);
  });
});

describe('extractTitle — AC-04 title placeholder', () => {
  it('reads title from <p:ph type="title"> placeholder', () => {
    const doc = parse(slideXml(titleShape('Judul Slide')));
    expect(extractTitle(doc, NAMESPACES)).toBe('Judul Slide');
  });

  it('returns null when no title placeholder', () => {
    const doc = parse(slideXml(bodyShape(paragraph('konten'))));
    expect(extractTitle(doc, NAMESPACES)).toBeNull();
  });
});

describe('extractSlide — AC-02/AC-03 content extraction', () => {
  it('merges multi-run <a:r> within one <a:p> into a single text', () => {
    const doc = parse(slideXml(bodyShape(multiRunParagraph(['Hi ', 'there']))));
    const slide = extractSlide(doc, 1);
    expect(slide.content).toEqual([{ type: 'paragraph', text: 'Hi there' }]);
  });

  it('detects bullet level from marL indentation', () => {
    const doc = parse(
      slideXml(
        bodyShape(
          paragraph('level nol', { bullet: true }) +
            paragraph('level satu', { bullet: true, marL: 342900 })
        )
      )
    );
    const slide = extractSlide(doc, 1);
    expect(slide.content).toEqual([
      { type: 'bullet', level: 0, text: 'level nol' },
      { type: 'bullet', level: 1, text: 'level satu' },
    ]);
  });

  it('returns plain paragraph when no bullet indent', () => {
    const doc = parse(slideXml(bodyShape(paragraph('paragraf biasa', { bullet: false }))));
    const slide = extractSlide(doc, 1);
    expect(slide.content).toEqual([{ type: 'paragraph', text: 'paragraf biasa' }]);
  });
});
