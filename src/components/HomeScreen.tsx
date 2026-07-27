interface Props {
  onStart: () => void;
  onBrowse: () => void;
}

const STEPS = [
  {
    title: '1. Choisis ou importe',
    text: 'Pars d’un modèle du catalogue (manuel, sport, électrique) ou importe ton propre fichier 3D.',
  },
  {
    title: '2. Personnalise',
    text: 'Change les couleurs, déplace ou retire des pièces, et ajoute des annotations directement sur le modèle.',
  },
  {
    title: '3. Exporte',
    text: 'Télécharge le modèle 3D, une image annotée ou une fiche PDF à montrer à un fabricant.',
  },
];

const STATS = [
  { value: '3', label: 'Modèles de base' },
  { value: '11', label: 'Accessoires & équipements' },
  { value: '100%', label: 'Gratuit, sans compte' },
  { value: '0', label: 'Donnée envoyée à un serveur' },
];

const FEATURES = [
  {
    title: 'Sur-mesure, vraiment',
    text: 'Couleur, taille et position de chaque pièce — retire ce qui ne sert pas, ajoute ce qu’il te faut.',
  },
  {
    title: 'Aperçu quasi réaliste',
    text: 'Bascule sur un vrai modèle 3D détaillé pour voir le résultat avant d’imprimer quoi que ce soit.',
  },
  {
    title: "Pensé pour l'accessibilité",
    text: 'Contraste élevé, texte agrandi, police adaptée dyslexie, animations réductibles — réglable en un clic.',
  },
  {
    title: 'Prêt pour le fabricant',
    text: 'Exporte un modèle 3D ou une image annotée, et va directement discuter avec un professionnel.',
  },
];

function HomeWheel() {
  const spokes = Array.from({ length: 8 }, (_, i) => {
    const angle = (i * Math.PI) / 4;
    return {
      x1: 50 + 10 * Math.cos(angle),
      y1: 50 + 10 * Math.sin(angle),
      x2: 50 + 46 * Math.cos(angle),
      y2: 50 + 46 * Math.sin(angle),
    };
  });

  return (
    <span className="home-wheel" aria-hidden="true">
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" />
        {spokes.map((s, i) => (
          <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="currentColor" strokeWidth="1.5" />
        ))}
      </svg>
    </span>
  );
}

export default function HomeScreen({ onStart, onBrowse }: Props) {
  return (
    <div className="home-screen">
      <section className="home-hero">
        <HomeWheel />
        <p className="home-badge">Gratuit · Sans compte · 100% dans le navigateur</p>
        <h1>Personnalise ton fauteuil roulant</h1>
        <p>
          Prépare une demande claire et visuelle avant d’aller voir un fabricant : choisis un fauteuil, indique
          les modifications que tu veux, et repars avec un fichier prêt à partager.
        </p>
        <div className="home-actions">
          <button type="button" className="cta" onClick={onStart}>
            Commencer la personnalisation
          </button>
          <button type="button" className="secondary" onClick={onBrowse}>
            Voir le catalogue
          </button>
        </div>
      </section>

      <section className="home-stats" aria-label="Whells en chiffres">
        {STATS.map((stat) => (
          <div className="home-stat" key={stat.label}>
            <span className="home-stat-value">{stat.value}</span>
            <span className="home-stat-label">{stat.label}</span>
          </div>
        ))}
      </section>

      <section className="home-steps">
        <h2>Comment ça marche</h2>
        <div className="home-steps-grid">
          {STEPS.map((step) => (
            <div className="home-step" key={step.title}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home-features">
        <h2>Pourquoi Whells</h2>
        <div className="home-features-grid">
          {FEATURES.map((feature) => (
            <div className="home-feature" key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
