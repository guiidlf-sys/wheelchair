import type { ChairVariantDef, PartsState } from '../types';

interface Props {
  variant: ChairVariantDef;
  partsState: PartsState;
  onChange: (partId: string, updates: Partial<PartsState[string]>) => void;
  onResetPart: (partId: string) => void;
}

const AXES: Array<{ key: 0 | 1 | 2; label: string }> = [
  { key: 0, label: 'X' },
  { key: 1, label: 'Y' },
  { key: 2, label: 'Z' },
];

export default function PartsPanel({ variant, partsState, onChange, onResetPart }: Props) {
  return (
    <div className="panel parts-panel">
      <h2>Pièces du fauteuil</h2>
      <p className="hint">Couleur, position, taille et suppression de chaque pièce.</p>
      <div className="parts-list">
        {variant.parts.map((part) => {
          const state = partsState[part.id];
          if (!state) return null;
          return (
            <details key={part.id} className="part-item" open={false}>
              <summary>
                <span
                  className="swatch"
                  style={{ background: state.visible ? state.color : 'transparent', opacity: state.visible ? 1 : 0.3 }}
                />
                {part.label}
                {!state.visible && <span className="removed-tag">retiré</span>}
              </summary>

              <div className="part-controls">
                <label className="control-row">
                  Couleur
                  <input
                    type="color"
                    value={state.color}
                    onChange={(e) => onChange(part.id, { color: e.target.value })}
                    disabled={!state.visible}
                  />
                </label>

                {AXES.map(({ key, label }) => (
                  <label className="control-row" key={label}>
                    Position {label}
                    <input
                      type="range"
                      min={-0.25}
                      max={0.25}
                      step={0.005}
                      value={state.position[key]}
                      disabled={!state.visible}
                      onChange={(e) => {
                        const next = [...state.position] as [number, number, number];
                        next[key] = Number(e.target.value);
                        onChange(part.id, { position: next });
                      }}
                    />
                  </label>
                ))}

                <label className="control-row">
                  Taille
                  <input
                    type="range"
                    min={0.5}
                    max={1.8}
                    step={0.02}
                    value={state.scale[0]}
                    disabled={!state.visible}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      onChange(part.id, { scale: [v, v, v] });
                    }}
                  />
                </label>

                <div className="part-actions">
                  {part.removable && (
                    <button type="button" onClick={() => onChange(part.id, { visible: !state.visible })}>
                      {state.visible ? 'Retirer' : 'Remettre'}
                    </button>
                  )}
                  <button type="button" onClick={() => onResetPart(part.id)}>
                    Réinitialiser
                  </button>
                </div>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
