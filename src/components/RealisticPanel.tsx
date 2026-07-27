interface Props {
  tint: string;
  onTintChange: (tint: string) => void;
}

export default function RealisticPanel({ tint, onTintChange }: Props) {
  return (
    <div className="panel realistic-panel">
      <h2>Aperçu réaliste</h2>
      <p className="hint">
        Vrai modèle 3D détaillé, à la place des formes simplifiées. Il n'a pas de pièces séparées à
        personnaliser individuellement — tu peux seulement changer sa teinte générale.
      </p>
      <label className="control-row">
        Teinte
        <input type="color" value={tint} onChange={(e) => onTintChange(e.target.value)} />
      </label>
      <p className="photo-credit">Modèle : Google, licence CC BY 3.0 (archive Google Poly / Icosa Gallery)</p>
    </div>
  );
}
