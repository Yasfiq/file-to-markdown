import JSZip from 'jszip';
import { slideXml, titleShape, bodyShape, paragraph } from './slide-xml';

export async function createMinimalPptx(title = 'Presentation'): Promise<File> {
  const zip = new JSZip();
  const xml = slideXml(titleShape(title) + bodyShape(paragraph('Konten paragraf')));
  zip.file('ppt/slides/slide1.xml', xml);
  const blob = await zip.generateAsync({ type: 'blob' });
  return new File([blob], `${title}.pptx`, {
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  });
}
