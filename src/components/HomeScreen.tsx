interface Props {
  onStart: () => void;
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

export default function HomeScreen({ onStart }: Props) {
  return (
    <div className="home-screen">
      <section className="home-hero">
        <h1>Personnalise ton fauteuil roulant</h1>
        <p>
          Prépare une demande claire et visuelle avant d’aller voir un fabricant : choisis un fauteuil, indique
          les modifications que tu veux, et repars avec un fichier prêt à partager.
        </p>
        <button type="button" className="cta" onClick={onStart}>
          Commencer
        </button>
      </section>

      <section className="home-steps">
        {STEPS.map((step) => (
          <div className="home-step" key={step.title}>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
