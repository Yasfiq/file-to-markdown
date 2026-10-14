import JSZip from 'jszip';
import { slideXml, titleShape, bodyShape, paragraph } from './slide-xml';
import { tableFrame, tableRow, tableCell } from './table-xml';
import { notesSlideXml, pictureShape, chartFrame } from './notes-xml';

export async function createMinimalPptx(title = 'Presentation'): Promise<File> {
  const zip = new JSZip();
  const xml = slideXml(titleShape(title) + bodyShape(paragraph('Konten paragraf')));
  zip.file('ppt/slides/slide1.xml', xml);
  const blob = await zip.generateAsync({ type: 'blob' });
  return new File([blob], `${title}.pptx`, {
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  });
}

export async function createFullFeaturedPptx(): Promise<File> {
  const zip = new JSZip();

  // Slide 1: Title + Bullets (nested)
  const slide1Xml = slideXml(
    titleShape('Ikhtisar Proyek') +
      bodyShape(
        paragraph('Poin utama level 0', { bullet: true, marL: 0 }) +
          paragraph('Sub-poin level 1', { bullet: true, marL: 342900 }) +
          paragraph('Sub-sub-poin level 2', { bullet: true, marL: 685800 }),
      ),
  );
  zip.file('ppt/slides/slide1.xml', slide1Xml);

  // Slide 2: Table with exact fidelity numbers
  const rows =
    tableRow(tableCell('Komponen') + tableCell('Kapasitas')) +
    tableRow(tableCell('Inverter') + tableCell('237,6 kWp')) +
    tableRow(tableCell('Biaya') + tableCell('Rp 1.500.000,00'));
  const slide2Xml = slideXml(titleShape('Data Teknis') + tableFrame(rows));
  zip.file('ppt/slides/slide2.xml', slide2Xml);

  // Slide 3: Images + Charts (unsupported) + Speaker notes
  const slide3Xml = slideXml(
    titleShape('Arsitektur Sistem') +
      bodyShape(paragraph('Deskripsi diagram')) +
      pictureShape('Diagram1.png') +
      chartFrame('Chart1'),
  );
  zip.file('ppt/slides/slide3.xml', slide3Xml);
  zip.file('ppt/notesSlides/notesSlide3.xml', notesSlideXml('Ingatkan audiens tentang batasan memori.'));

  const blob = await zip.generateAsync({ type: 'blob' });
  return new File([blob], 'laporan-lengkap.pptx', {
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  });
}

