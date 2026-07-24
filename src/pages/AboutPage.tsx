import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <header className="catalog-header">
        <h1>Le concept</h1>
        <p>Une façon simple de préparer un vrai échange avec un fabricant de fauteuils roulants.</p>
      </header>

      <section className="about-content">
        <div className="about-step">
          <h3>1. Tu as une idée</h3>
          <p>
            Que tu partes d'un fauteuil existant ou que tu importes le tien, l'idée reste la même : tu sais ce que
            tu veux changer, mais c'est difficile à décrire avec des mots seuls.
          </p>
        </div>
        <div className="about-step">
          <h3>2. Tu montres, tu ne décris plus</h3>
          <p>
            En plaçant des annotations directement sur le modèle 3D et en ajustant les pièces une à une, tu
            transformes une idée floue en une liste précise de modifications.
          </p>
        </div>
        <div className="about-step">
          <h3>3. Tu repars avec un dossier complet</h3>
          <p>
            Modèle 3D, image annotée, fiche PDF récapitulative : de quoi montrer exactement ce que tu veux à un
            fabricant, sans perdre de temps en allers-retours.
          </p>
        </div>
      </section>

      <div className="about-cta">
        <button type="button" className="cta" onClick={() => navigate('/personnalisation')}>
          Essayer maintenant
        </button>
      </div>
    </div>
  );
}
