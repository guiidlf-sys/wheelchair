import { ACCESSORIES } from '../data/accessories';
import type { AccessoryState } from '../types';

interface Props {
  accessories: AccessoryState;
  onToggle: (id: string) => void;
  onTintChange: (id: string, tint: string) => void;
}

function AccessoryItem({
  def,
  state,
  onToggle,
  onTintChange,
}: {
  def: (typeof ACCESSORIES)[number];
  state: AccessoryState[string] | undefined;
  onToggle: (id: string) => void;
  onTintChange: (id: string, tint: string) => void;
}) {
  return (
    <div className="accessory-item">
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
}

export default function AccessoriesPanel({ accessories, onToggle, onTintChange }: Props) {
  const personnel = ACCESSORIES.filter((def) => def.category === 'personnel');
  const medical = ACCESSORIES.filter((def) => def.category === 'medical');

  return (
    <div className="panel accessories-panel">
      <h2>Accessoires</h2>
      <p className="hint">
        Objets réels sous licence libre à ajouter au fauteuil — demande la vue 3D interactive (WebGL).
      </p>
      <div className="accessories-list">
        {personnel.map((def) => (
          <AccessoryItem key={def.id} def={def} state={accessories[def.id]} onToggle={onToggle} onTintChange={onTintChange} />
        ))}
      </div>

      <h3>Équipements d'assistance</h3>
      <p className="hint">
        Représentations génériques simplifiées pour visualiser un fauteuil équipé pour une mobilité ou une
        respiration réduites — ne remplacent pas un appareillage réel, à faire évaluer par un ergothérapeute ou
        un fournisseur de matériel médical.
      </p>
      <div className="accessories-list">
        {medical.map((def) => (
          <AccessoryItem key={def.id} def={def} state={accessories[def.id]} onToggle={onToggle} onTintChange={onTintChange} />
        ))}
      </div>
    </div>
  );
}
