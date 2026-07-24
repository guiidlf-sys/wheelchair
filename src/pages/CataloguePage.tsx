import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CHAIR_VARIANTS } from '../data/chairVariants';

export default function CataloguePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CHAIR_VARIANTS;
    return CHAIR_VARIANTS.filter(
      (variant) => variant.name.toLowerCase().includes(q) || variant.description.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="catalog-screen">
      <header className="catalog-header">
        <h1>Le catalogue</h1>
        <p>
          Trois bases de départ pour t'aider à visualiser tes envies. Choisis-en une pour l'ouvrir dans l'atelier
          de personnalisation, ou importe directement ton propre modèle 3D depuis la page Personnalisation.
        </p>
      </header>

      <div className="search-bar">
        <input
          type="search"
          placeholder="Rechercher un fauteuil (nom, type, caractéristique)…"
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
            <div key={variant.id} className="catalog-card">
              <div className="catalog-card-preview">
                <img src={variant.previewImage} alt={variant.name} loading="lazy" />
              </div>
              <div className="catalog-card-body">
                <h3>{variant.name}</h3>
                <p>{variant.description}</p>
                <button
                  type="button"
                  className="cta small"
                  onClick={() => navigate(`/personnalisation?variant=${variant.id}`)}
                >
                  Personnaliser celui-ci
                </button>
              </div>
            </div>
          ))}
        </section>
      )}

      <p className="catalog-note">
        Ce sont des rendus 3D des modèles que tu peux personnaliser ici, pas des photos de fauteuils du commerce —
        on n'a pas de base de données de tous les fauteuils existants. Tu peux importer le tien depuis la page
        Personnalisation si tu as un modèle 3D précis en tête.
      </p>
    </div>
  );
}
