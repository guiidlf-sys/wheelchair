import { useState } from 'react';
import type { Annotation, Vec3 } from '../types';

interface Props {
  annotationMode: boolean;
  onToggleMode: () => void;
  pendingPoint: Vec3 | null;
  onConfirmPending: (note: string) => void;
  onCancelPending: () => void;
  annotations: Annotation[];
  onDelete: (id: string) => void;
  disabled?: boolean;
}

export default function AnnotationPanel({
  annotationMode,
  onToggleMode,
  pendingPoint,
  onConfirmPending,
  onCancelPending,
  annotations,
  onDelete,
  disabled,
}: Props) {
  const [draft, setDraft] = useState('');

  const confirm = () => {
    if (!draft.trim()) return;
    onConfirmPending(draft.trim());
    setDraft('');
  };

  return (
    <div className="panel annotation-panel">
      <h2>Annotations</h2>
      <p className="hint">
        {disabled
          ? "Demande la vue 3D interactive (WebGL), indisponible sur cet appareil."
          : 'Clique un point du fauteuil pour laisser une note au fabricant.'}
      </p>
      <button type="button" className={annotationMode ? 'toggle active' : 'toggle'} onClick={onToggleMode} disabled={disabled}>
        {annotationMode ? 'Mode annotation actif — cliquer sur le modèle' : 'Activer le mode annotation'}
      </button>

      {pendingPoint && (
        <div className="pending-annotation">
          <textarea
            autoFocus
            placeholder="Décris la modification souhaitée à cet endroit…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="pending-actions">
            <button type="button" onClick={confirm} disabled={!draft.trim()}>
              Ajouter la note
            </button>
            <button type="button" className="secondary" onClick={() => { setDraft(''); onCancelPending(); }}>
              Annuler
            </button>
          </div>
        </div>
      )}

      <ul className="annotation-list">
        {annotations.map((a, i) => (
          <li key={a.id}>
            <span className="badge">{i + 1}</span>
            <span className="note-text">{a.note}</span>
            <button type="button" className="icon-btn" onClick={() => onDelete(a.id)} aria-label="Supprimer">
              ✕
            </button>
          </li>
        ))}
        {annotations.length === 0 && <li className="empty">Aucune annotation pour l’instant.</li>}
      </ul>
    </div>
  );
}
