import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATALOG_ENTRIES } from '../data/chairVariants';

export default function CataloguePage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATALOG_ENTRIES;
    return CATALOG_ENTRIES.filter(
      (entry) => entry.name.toLowerCase().includes(q) || entry.description.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <div className="catalog-screen">
      <header className="catalog-header">
        <h1>Le catalogue</h1>
        <p>
          Plusieurs catégories de fauteuils pour t'aider à visualiser tes envies. Choisis-en une pour ouvrir
          l'atelier de personnalisation, ou importe directement ton propre modèle 3D depuis la page
          Personnalisation.
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
          {results.map((entry) => {
            const isExactMatch = entry.id === entry.baseVariantId;
            return (
              <div key={entry.id} className="catalog-card">
                <div className="catalog-card-preview">
                  <img src={entry.previewImage} alt={entry.name} loading="lazy" />
                </div>
                <div className="catalog-card-body">
                  <h3>{entry.name}</h3>
                  <p>{entry.description}</p>
                  <button
                    type="button"
                    className="cta small"
                    onClick={() => navigate(`/personnalisation?variant=${entry.baseVariantId}`)}
                  >
                    {isExactMatch ? 'Personnaliser celui-ci' : 'Personnaliser un modèle proche'}
                  </button>
                  <p className="photo-credit">{entry.photoCredit}</p>
                </div>
              </div>
            );
          })}
        </section>
      )}

      <p className="catalog-note">
        Ce ne sont pas des fauteuils précis du commerce, mais des photos réelles représentatives de chaque
        catégorie — on n'a pas de base de données de tous les fauteuils existants au monde. L'atelier de
        personnalisation 3D reste basé sur trois modèles éditables (manuel, sport, électrique) ; les catégories
        supplémentaires s'ouvrent sur le modèle éditable le plus proche. Tu peux aussi importer ton propre modèle
        3D depuis la page Personnalisation si tu as un fauteuil précis en tête.
      </p>
    </div>
  );
}
