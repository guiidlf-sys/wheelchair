import jsPDF from 'jspdf';
import type { Annotation } from '../types';

interface BuildPdfArgs {
  chairName: string;
  imageDataUrl: string;
  modifications: string[];
  annotations: Annotation[];
  authorEmail?: string;
}

export function buildSpecPdf({ chairName, imageDataUrl, modifications, annotations, authorEmail }: BuildPdfArgs): jsPDF {
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 40;
  let y = margin;

  pdf.setFontSize(18);
  pdf.text('Fiche de personnalisation — fauteuil roulant', margin, y);
  y += 20;

  pdf.setFontSize(11);
  pdf.setTextColor(90);
  pdf.text(`Modèle de base : ${chairName}`, margin, y);
  y += 14;
  pdf.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, margin, y);
  y += 14;
  if (authorEmail) {
    pdf.text(`Contact : ${authorEmail}`, margin, y);
    y += 14;
  }
  pdf.setTextColor(0);
  y += 10;

  const imgWidth = pageWidth - margin * 2;
  const imgHeight = imgWidth * 0.6;
  pdf.addImage(imageDataUrl, 'PNG', margin, y, imgWidth, imgHeight);
  y += imgHeight + 24;

  pdf.setFontSize(14);
  pdf.text('Modifications demandées', margin, y);
  y += 18;
  pdf.setFontSize(11);
  if (modifications.length === 0) {
    pdf.text('— Aucune modification par rapport au modèle de base —', margin, y);
    y += 16;
  } else {
    for (const line of modifications) {
      if (y > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(`•  ${line}`, margin, y);
      y += 16;
    }
  }

  y += 10;
  pdf.setFontSize(14);
  pdf.text('Annotations (repères sur l’image)', margin, y);
  y += 18;
  pdf.setFontSize(11);
  if (annotations.length === 0) {
    pdf.text('— Aucune annotation —', margin, y);
  } else {
    annotations.forEach((a, i) => {
      if (y > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        y = margin;
      }
      const wrapped = pdf.splitTextToSize(`${i + 1}. ${a.note}`, pageWidth - margin * 2);
      pdf.text(wrapped, margin, y);
      y += 16 * wrapped.length;
    });
  }

  return pdf;
}
