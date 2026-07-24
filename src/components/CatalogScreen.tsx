import { useMemo, useRef, useState } from 'react';
import { CHAIR_VARIANTS } from '../data/chairVariants';
import type { ImportedExt, SelectedModel } from '../types';

const ACCEPTED_EXT: ImportedExt[] = ['glb', 'gltf', 'obj', 'stl'];

interface Props {
  onSelect: (model: SelectedModel) => void;
  onBack: () => void;
}

export default function CatalogScreen({ onSelect, onBack }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CHAIR_VARIANTS;
    return CHAIR_VARIANTS.filter(
      (variant) => variant.name.toLowerCase().includes(q) || variant.description.toLowerCase().includes(q),
    );
  }, [query]);

  const handleFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() as ImportedExt | undefined;
    if (!ext || !ACCEPTED_EXT.includes(ext)) {
      setError('Formats acceptés : .glb, .gltf, .obj, .stl');
      return;
    }
    setError(null);
    const url = URL.createObjectURL(file);
    onSelect({ kind: 'imported', fileUrl: url, fileName: file.name, fileExt: ext });
  };

  return (
    <div className="catalog-screen">
      <button type="button" className="secondary back-link" onClick={onBack}>
        ← Accueil
      </button>
      <header className="catalog-header">
        <h1>Choisis ton point de départ</h1>
        <p>
          Choisis un modèle de départ ou importe le tien, ajoute les modifications que tu veux, puis télécharge
          le résultat pour le montrer à un fabricant.
        </p>
      </header>

      <div className="search-bar">
        <input
          type="search"
          placeholder="Rechercher un fauteuil…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Rechercher un fauteuil"
        />
      </div>

      {results.length === 0 ? (
        <p className="search-empty">Aucun fauteuil ne correspond à "{query}".</p>
      ) : (
        <section className="catalog-grid">
          {results.map((variant) => (
            <button
              key={variant.id}
              type="button"
              className="catalog-card"
              onClick={() => onSelect({ kind: 'procedural', variantId: variant.id })}
            >
              <div className="catalog-card-preview">
                <img src={variant.previewImage} alt={variant.name} loading="lazy" />
              </div>
              <div className="catalog-card-body">
                <h3>{variant.name}</h3>
                <p>{variant.description}</p>
              </div>
            </button>
          ))}
        </section>
      )}

      <section className="import-section">
        <h2>Ou importe ton propre modèle 3D</h2>
        <div
          className="dropzone"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <p>Glisse-dépose un fichier .glb, .gltf, .obj ou .stl, ou clique pour choisir un fichier.</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".glb,.gltf,.obj,.stl"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
        </div>
        {error && <p className="error-text">{error}</p>}
      </section>
    </div>
  );
}
