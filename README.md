# Personnalise ton fauteuil roulant

Application web pour préparer une demande de personnalisation de fauteuil roulant à
présenter à un fabricant :

1. **Choisir** un modèle de fauteuil dans le catalogue (manuel, sport, électrique) ou
   **importer** son propre modèle 3D (`.glb`, `.gltf`, `.obj`, `.stl`).
2. **Modifier** : couleur, position, taille ou suppression de chaque pièce, et poser des
   annotations directement sur le modèle 3D pour décrire une demande précise.
3. **Exporter** le résultat : fichier 3D (`.glb`), image annotée (`.png`), ou fiche PDF
   récapitulative à envoyer au fabricant.

## Stack technique

- React + TypeScript + Vite
- [react-three-fiber](https://r3f.docs.pmnd.rs/) / three.js pour la scène 3D
- jsPDF pour la génération de la fiche PDF

## Développement

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
