import { useState } from 'react';
import type { Annotation, ExportApi } from '../types';
import { downloadBlob, downloadDataUrl } from '../utils/export';
import { buildSpecPdf } from '../utils/pdf';

interface Props {
  chairName: string;
  modifications: string[];
  annotations: Annotation[];
  exportApi: ExportApi | null;
  canExportGLB: boolean;
  authorEmail?: string;
}

export default function ExportPanel({ chairName, modifications, annotations, exportApi, canExportGLB, authorEmail }: Props) {
  const [busy, setBusy] = useState<string | null>(null);

  const handleGLB = async () => {
    if (!exportApi) return;
    setBusy('glb');
    try {
      const blob = await exportApi.exportGLB();
      downloadBlob(blob, `${slug(chairName)}.glb`);
    } finally {
      setBusy(null);
    }
  };

  const handleImage = () => {
    if (!exportApi) return;
    const dataUrl = exportApi.exportImage(annotations);
    downloadDataUrl(dataUrl, `${slug(chairName)}.png`);
  };

  const handlePdf = () => {
    setBusy('pdf');
    try {
      const imageDataUrl = exportApi?.exportImage(annotations);
      const pdf = buildSpecPdf({ chairName, imageDataUrl, modifications, annotations, authorEmail });
      pdf.save(`${slug(chairName)}-fiche.pdf`);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="panel export-panel">
      <h2>Résumé & export</h2>
      <div className="modifications-summary">
        <h3>Modifications ({modifications.length})</h3>
        <ul>
          {modifications.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
          {modifications.length === 0 && <li className="empty">Aucune modification pour l’instant.</li>}
        </ul>
      </div>

      <div className="export-buttons">
        <button type="button" onClick={handleGLB} disabled={!exportApi || !canExportGLB || busy !== null}>
          {busy === 'glb' ? 'Export…' : 'Télécharger le modèle 3D (.glb)'}
        </button>
        <button type="button" onClick={handleImage} disabled={!exportApi || busy !== null}>
          Télécharger une image annotée
        </button>
        <button type="button" onClick={handlePdf} disabled={busy !== null}>
          {busy === 'pdf' ? 'Génération…' : 'Générer la fiche PDF pour le fabricant'}
        </button>
      </div>
      {!exportApi && (
        <p className="hint">
          Le modèle 3D et l'image annotée demandent WebGL, indisponible sur cet appareil. La fiche PDF reste
          disponible avec la liste des modifications, sans aperçu visuel.
        </p>
      )}
    </div>
  );
}

function slug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
