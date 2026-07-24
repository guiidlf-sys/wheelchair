import { useNavigate } from 'react-router-dom';
import { CHAIR_VARIANTS } from '../data/chairVariants';
import ErrorBoundary from '../components/ErrorBoundary';
import VariantPreview from '../components/VariantPreview';

export default function CataloguePage() {
  const navigate = useNavigate();

  return (
    <div className="catalog-screen">
      <header className="catalog-header">
        <h1>Le catalogue</h1>
        <p>
          Trois bases de départ pour t'aider à visualiser tes envies. Choisis-en une pour l'ouvrir dans l'atelier
          de personnalisation, ou importe directement ton propre modèle 3D depuis la page Personnalisation.
        </p>
      </header>

      <section className="catalog-grid">
        {CHAIR_VARIANTS.map((variant) => (
          <div key={variant.id} className="catalog-card" style={{ cursor: 'default' }}>
            <div className="catalog-card-preview">
              <ErrorBoundary fallback={<div className="preview-fallback">Aperçu 3D indisponible</div>}>
                <VariantPreview variant={variant} />
              </ErrorBoundary>
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
    </div>
  );
}
