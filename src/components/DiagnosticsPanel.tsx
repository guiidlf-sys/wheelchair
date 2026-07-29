import { useState } from 'react';
import { collectDiagnostics } from '../utils/diagnostics';

/**
 * On-demand technical report, screenshot-friendly, for devices where the 3D
 * view fails silently (no thrown error, so the usual crash-message +
 * error-detail path never fires) and the user has no way to open devtools.
 */
export default function DiagnosticsPanel() {
  const [open, setOpen] = useState(false);
  const [report, setReport] = useState('');

  const toggle = () => {
    if (!open) setReport(collectDiagnostics());
    setOpen((v) => !v);
  };

  return (
    <div className="diagnostics">
      <button type="button" className="secondary small" onClick={toggle}>
        {open ? 'Masquer le diagnostic technique' : 'Diagnostic technique'}
      </button>
      {open && (
        <div className="diagnostics-report">
          <p className="hint">Si la vue 3D ne s'affiche pas, capture cet écran et envoie-le.</p>
          <pre>{report}</pre>
        </div>
      )}
    </div>
  );
}
