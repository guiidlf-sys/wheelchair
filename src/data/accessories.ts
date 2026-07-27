interface AccessoryDefBase {
  id: string;
  label: string;
  /** Mount point on the chair, roughly matching the manual/electric base geometry. */
  position: [number, number, number];
  rotation?: [number, number, number];
  defaultTint: string;
  credit: string;
  category: 'personnel' | 'medical';
}

/** Loads a sourced free-licensed GLB (see AccessoryModel.tsx). */
export interface ModelAccessoryDef extends AccessoryDefBase {
  kind: 'model';
  file: string;
  /** Target real-world size (metres) of the model's *largest* dimension, used to auto-scale it regardless of its native unit scale or orientation. */
  targetSize: number;
}

/** Builds simple primitive geometry at runtime (see ProceduralAccessory.tsx) — used for generic equipment where no free-licensed real model exists. */
export interface ProceduralAccessoryDef extends AccessoryDefBase {
  kind: 'procedural';
}

export type AccessoryDef = ModelAccessoryDef | ProceduralAccessoryDef;

const accessorySrc = (file: string) => `${import.meta.env.BASE_URL}accessories/${file}`;

export const ACCESSORIES: AccessoryDef[] = [
  {
    id: 'backpack',
    label: 'Sac à dos',
    kind: 'model',
    file: accessorySrc('backpack.glb'),
    targetSize: 0.32,
    position: [0, 0.75, -0.24],
    defaultTint: '#4a5a6b',
    credit: 'Modèle : Google, CC BY 3.0 (archive Google Poly / Icosa Gallery)',
    category: 'personnel',
  },
  {
    id: 'basket',
    label: 'Panier avant',
    kind: 'model',
    file: accessorySrc('basket.glb'),
    targetSize: 0.22,
    position: [0, 0.62, 0.34],
    defaultTint: '#8a6b47',
    credit: 'Modèle : Lisa Tixier, CC BY 3.0 (archive Google Poly / Icosa Gallery)',
    category: 'personnel',
  },
  {
    id: 'bottle',
    label: 'Porte-bouteille',
    kind: 'model',
    file: accessorySrc('bottle.glb'),
    targetSize: 0.22,
    position: [0.26, 0.62, 0.05],
    defaultTint: '#2969b0',
    credit: 'Modèle : Google, CC BY 3.0 (archive Google Poly / Icosa Gallery)',
    category: 'personnel',
  },
  {
    id: 'umbrella',
    label: 'Parapluie',
    kind: 'model',
    file: accessorySrc('umbrella.glb'),
    targetSize: 0.6,
    position: [-0.3, 0.55, -0.15],
    defaultTint: '#c0392b',
    credit: 'Modèle : Google, CC BY 3.0 (archive Google Poly / Icosa Gallery)',
    category: 'personnel',
  },
  {
    id: 'flag',
    label: 'Fanion de sécurité',
    kind: 'model',
    file: accessorySrc('flag.glb'),
    targetSize: 0.7,
    position: [0.28, 0.9, -0.22],
    defaultTint: '#e67e22',
    credit: 'Modèle : Google, CC BY 3.0 (archive Google Poly / Icosa Gallery)',
    category: 'personnel',
  },
  {
    id: 'blanket',
    label: 'Couverture',
    kind: 'model',
    file: accessorySrc('blanket.glb'),
    targetSize: 1.2,
    position: [0, 0.4, 0.15],
    defaultTint: '#6b3f2a',
    credit: 'Modèle : Google, CC BY 3.0 (archive Google Poly / Icosa Gallery)',
    category: 'personnel',
  },
  {
    id: 'medHeadrest',
    label: 'Appui-tête réglable',
    kind: 'procedural',
    position: [0, 1.0, -0.15],
    defaultTint: '#f2f0e9',
    credit: "Représentation générique simplifiée, à titre d'illustration — ne remplace pas un appareillage réel prescrit par un professionnel.",
    category: 'medical',
  },
  {
    id: 'trunkSupport',
    label: 'Soutiens de tronc latéraux',
    kind: 'procedural',
    position: [0, 0.68, -0.06],
    defaultTint: '#f2f0e9',
    credit: "Représentation générique simplifiée, à titre d'illustration — ne remplace pas un appareillage réel prescrit par un professionnel.",
    category: 'medical',
  },
  {
    id: 'ventilator',
    label: 'Respirateur portable',
    kind: 'procedural',
    position: [0.28, 0.5, -0.24],
    defaultTint: '#e8e8e8',
    credit: "Représentation générique simplifiée, à titre d'illustration — ne remplace pas un dispositif médical réel prescrit par un professionnel.",
    category: 'medical',
  },
  {
    id: 'chinControl',
    label: 'Commande au menton',
    kind: 'procedural',
    position: [0.2, 0.72, 0.12],
    defaultTint: '#c0392b',
    credit: "Représentation générique simplifiée, à titre d'illustration — un vrai dispositif de commande alternative doit être installé et réglé par un professionnel.",
    category: 'medical',
  },
  {
    id: 'ivPole',
    label: 'Potence à perfusion',
    kind: 'procedural',
    position: [-0.36, 0.78, -0.32],
    defaultTint: '#cfe8f5',
    credit: "Représentation générique simplifiée, à titre d'illustration — ne remplace pas un équipement médical réel.",
    category: 'medical',
  },
];
