interface Props {
  fileName?: string;
  tint: string | null;
  onTintChange: (color: string | null) => void;
  scale: number;
  onScaleChange: (scale: number) => void;
}

export default function ImportControls({ fileName, tint, onTintChange, scale, onScaleChange }: Props) {
  return (
    <div className="panel parts-panel">
      <h2>Modèle importé</h2>
      <p className="hint">{fileName ?? 'Fichier importé'}</p>

      <label className="control-row">
        <input
          type="checkbox"
          checked={tint !== null}
          onChange={(e) => onTintChange(e.target.checked ? '#3d6cb9' : null)}
        />
        Teinter le modèle
      </label>
      {tint !== null && (
        <label className="control-row">
          Couleur
          <input type="color" value={tint} onChange={(e) => onTintChange(e.target.value)} />
        </label>
      )}

      <label className="control-row">
        Taille
        <input type="range" min={0.4} max={2} step={0.02} value={scale} onChange={(e) => onScaleChange(Number(e.target.value))} />
      </label>

      <p className="hint">
        Pour un modèle importé, utilise les annotations pour indiquer précisément les modifications souhaitées
        (couleur, forme, accessoires…).
      </p>
    </div>
  );
}
