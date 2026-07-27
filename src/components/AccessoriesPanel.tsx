import { ACCESSORIES } from '../data/accessories';
import type { AccessoryState } from '../types';

interface Props {
  accessories: AccessoryState;
  onToggle: (id: string) => void;
  onTintChange: (id: string, tint: string) => void;
}

export default function AccessoriesPanel({ accessories, onToggle, onTintChange }: Props) {
  return (
    <div className="panel accessories-panel">
      <h2>Accessoires</h2>
      <p className="hint">
        Objets réels sous licence libre à ajouter au fauteuil — demande la vue 3D interactive (WebGL).
      </p>
      <div className="accessories-list">
        {ACCESSORIES.map((def) => {
          const state = accessories[def.id];
          return (
            <div key={def.id} className="accessory-item">
              <label className="control-row">
                <input type="checkbox" checked={state?.enabled ?? false} onChange={() => onToggle(def.id)} />
                {def.label}
              </label>
              {state?.enabled && (
                <>
                  <label className="control-row">
                    Teinte
                    <input type="color" value={state.tint} onChange={(e) => onTintChange(def.id, e.target.value)} />
                  </label>
                  <p className="photo-credit">{def.credit}</p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
