export interface AccessoryDef {
  id: string;
  label: string;
  file: string;
  /** Target real-world size (metres) of the model's *largest* dimension, used to auto-scale it regardless of its native unit scale or orientation. */
  targetSize: number;
  /** Mount point on the chair, roughly matching the manual/electric base geometry. */
  position: [number, number, number];
  rotation?: [number, number, number];
  defaultTint: string;
  credit: string;
}

const accessorySrc = (file: string) => `${import.meta.env.BASE_URL}accessories/${file}`;

export const ACCESSORIES: AccessoryDef[] = [
  {
    id: 'backpack',
    label: 'Sac à dos',
    file: accessorySrc('backpack.glb'),
    targetSize: 0.32,
    position: [0, 0.75, -0.24],
    defaultTint: '#4a5a6b',
    credit: 'Modèle : Google, CC BY 3.0 (archive Google Poly / Icosa Gallery)',
  },
  {
    id: 'basket',
    label: 'Panier avant',
    file: accessorySrc('basket.glb'),
    targetSize: 0.22,
    position: [0, 0.62, 0.34],
    defaultTint: '#8a6b47',
    credit: 'Modèle : Lisa Tixier, CC BY 3.0 (archive Google Poly / Icosa Gallery)',
  },
  {
    id: 'bottle',
    label: 'Porte-bouteille',
    file: accessorySrc('bottle.glb'),
    targetSize: 0.22,
    position: [0.26, 0.62, 0.05],
    defaultTint: '#2969b0',
    credit: 'Modèle : Google, CC BY 3.0 (archive Google Poly / Icosa Gallery)',
  },
  {
    id: 'umbrella',
    label: 'Parapluie',
    file: accessorySrc('umbrella.glb'),
    targetSize: 0.6,
    position: [-0.3, 0.55, -0.15],
    defaultTint: '#c0392b',
    credit: 'Modèle : Google, CC BY 3.0 (archive Google Poly / Icosa Gallery)',
  },
  {
    id: 'flag',
    label: 'Fanion de sécurité',
    file: accessorySrc('flag.glb'),
    targetSize: 0.7,
    position: [0.28, 0.9, -0.22],
    defaultTint: '#e67e22',
    credit: 'Modèle : Google, CC BY 3.0 (archive Google Poly / Icosa Gallery)',
  },
  {
    id: 'blanket',
    label: 'Couverture',
    file: accessorySrc('blanket.glb'),
    targetSize: 1.2,
    position: [0, 0.4, 0.15],
    defaultTint: '#6b3f2a',
    credit: 'Modèle : Google, CC BY 3.0 (archive Google Poly / Icosa Gallery)',
  },
];
