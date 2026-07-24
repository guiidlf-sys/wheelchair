import { useRef, useState } from 'react';
import { CHAIR_VARIANTS } from '../data/chairVariants';
import type { ChairVariantDef, ImportedExt, SelectedModel } from '../types';
import VariantPreview from './VariantPreview';
import ErrorBoundary from './ErrorBoundary';

const ACCEPTED_EXT: ImportedExt[] = ['glb', 'gltf', 'obj', 'stl'];

interface Props {
  onSelect: (model: SelectedModel) => void;
  onBack: () => void;
}

export default function CatalogScreen({ onSelect, onBack }: Props) {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

      <section className="catalog-grid">
        {CHAIR_VARIANTS.map((variant: ChairVariantDef) => (
          <button
            key={variant.id}
            type="button"
            className="catalog-card"
            onClick={() => onSelect({ kind: 'procedural', variantId: variant.id })}
          >
            <div className="catalog-card-preview">
              <ErrorBoundary fallback={<div className="preview-fallback">Aperçu 3D indisponible</div>}>
                <VariantPreview variant={variant} />
              </ErrorBoundary>
            </div>
            <div className="catalog-card-body">
              <h3>{variant.name}</h3>
              <p>{variant.description}</p>
            </div>
          </button>
        ))}
      </section>

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
