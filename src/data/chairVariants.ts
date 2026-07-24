import type { ChairVariantDef } from '../types';

const previewSrc = (file: string) => `${import.meta.env.BASE_URL}previews/${file}`;

const manual: ChairVariantDef = {
  id: 'manual',
  name: 'Fauteuil manuel standard',
  description: 'Châssis pliable classique, grandes roues à main courante.',
  previewImage: previewSrc('manual.png'),
  parts: [
    { id: 'frame', label: 'Châssis', kind: 'box', args: [0.42, 0.05, 0.42], position: [0, 0.42, 0], defaultColor: '#274472', metalness: 0.6, roughness: 0.35 },
    { id: 'seat', label: 'Assise', kind: 'box', args: [0.42, 0.06, 0.42], position: [0, 0.48, 0], defaultColor: '#2b2b2b', roughness: 0.9 },
    { id: 'backrest', label: 'Dossier', kind: 'box', args: [0.42, 0.5, 0.06], position: [0, 0.75, -0.19], defaultColor: '#2b2b2b', roughness: 0.9 },
    { id: 'wheelLeft', label: 'Roue gauche', kind: 'cylinder', args: [0.3, 0.3, 0.045, 32], position: [-0.29, 0.3, 0.03], rotation: [0, 0, Math.PI / 2], defaultColor: '#111111', roughness: 0.8 },
    { id: 'wheelRight', label: 'Roue droite', kind: 'cylinder', args: [0.3, 0.3, 0.045, 32], position: [0.29, 0.3, 0.03], rotation: [0, 0, Math.PI / 2], defaultColor: '#111111', roughness: 0.8 },
    { id: 'handrimLeft', label: 'Main courante gauche', kind: 'torus', args: [0.26, 0.009, 12, 32], position: [-0.335, 0.3, 0.03], rotation: [0, Math.PI / 2, 0], defaultColor: '#b0b0b0', metalness: 0.8, roughness: 0.3 },
    { id: 'handrimRight', label: 'Main courante droite', kind: 'torus', args: [0.26, 0.009, 12, 32], position: [0.335, 0.3, 0.03], rotation: [0, Math.PI / 2, 0], defaultColor: '#b0b0b0', metalness: 0.8, roughness: 0.3 },
    { id: 'casterLeft', label: 'Roulette avant gauche', kind: 'cylinder', args: [0.065, 0.065, 0.03, 20], position: [-0.18, 0.065, 0.34], rotation: [0, 0, Math.PI / 2], defaultColor: '#1a1a1a' },
    { id: 'casterRight', label: 'Roulette avant droite', kind: 'cylinder', args: [0.065, 0.065, 0.03, 20], position: [0.18, 0.065, 0.34], rotation: [0, 0, Math.PI / 2], defaultColor: '#1a1a1a' },
    { id: 'footrest', label: 'Repose-pieds', kind: 'box', args: [0.35, 0.025, 0.16], position: [0, 0.15, 0.33], defaultColor: '#8a8a8a', metalness: 0.5, roughness: 0.5, removable: true },
    { id: 'armrestLeft', label: 'Accoudoir gauche', kind: 'box', args: [0.045, 0.045, 0.34], position: [-0.225, 0.63, 0], defaultColor: '#8a8a8a', metalness: 0.5, roughness: 0.5, removable: true },
    { id: 'armrestRight', label: 'Accoudoir droit', kind: 'box', args: [0.045, 0.045, 0.34], position: [0.225, 0.63, 0], defaultColor: '#8a8a8a', metalness: 0.5, roughness: 0.5, removable: true },
    { id: 'pushHandleLeft', label: 'Poignée gauche', kind: 'cylinder', args: [0.018, 0.018, 0.16, 12], position: [-0.16, 1.0, -0.2], rotation: [Math.PI / 2, 0, 0], defaultColor: '#8a8a8a', metalness: 0.5, roughness: 0.5, removable: true },
    { id: 'pushHandleRight', label: 'Poignée droite', kind: 'cylinder', args: [0.018, 0.018, 0.16, 12], position: [0.16, 1.0, -0.2], rotation: [Math.PI / 2, 0, 0], defaultColor: '#8a8a8a', metalness: 0.5, roughness: 0.5, removable: true },
  ],
};

const sport: ChairVariantDef = {
  id: 'sport',
  name: 'Fauteuil sport / léger',
  description: 'Châssis rigide bas, roues carrossées, sans accoudoirs.',
  previewImage: previewSrc('sport.png'),
  parts: [
    { id: 'frame', label: 'Châssis', kind: 'box', args: [0.4, 0.045, 0.46], position: [0, 0.36, 0], defaultColor: '#a11d1d', metalness: 0.7, roughness: 0.3 },
    { id: 'seat', label: 'Assise', kind: 'box', args: [0.4, 0.05, 0.4], position: [0, 0.41, 0], defaultColor: '#111111', roughness: 0.9 },
    { id: 'backrest', label: 'Dossier', kind: 'box', args: [0.4, 0.32, 0.05], position: [0, 0.6, -0.2], rotation: [-0.12, 0, 0], defaultColor: '#111111', roughness: 0.9 },
    { id: 'wheelLeft', label: 'Roue gauche', kind: 'cylinder', args: [0.32, 0.32, 0.04, 32], position: [-0.31, 0.32, 0.02], rotation: [0, 0, Math.PI / 2 - 0.12], defaultColor: '#161616', roughness: 0.8 },
    { id: 'wheelRight', label: 'Roue droite', kind: 'cylinder', args: [0.32, 0.32, 0.04, 32], position: [0.31, 0.32, 0.02], rotation: [0, 0, Math.PI / 2 + 0.12], defaultColor: '#161616', roughness: 0.8 },
    { id: 'handrimLeft', label: 'Main courante gauche', kind: 'torus', args: [0.27, 0.008, 12, 32], position: [-0.35, 0.32, 0.02], rotation: [0.12, Math.PI / 2, 0], defaultColor: '#c9c9c9', metalness: 0.8, roughness: 0.25 },
    { id: 'handrimRight', label: 'Main courante droite', kind: 'torus', args: [0.27, 0.008, 12, 32], position: [0.35, 0.32, 0.02], rotation: [-0.12, Math.PI / 2, 0], defaultColor: '#c9c9c9', metalness: 0.8, roughness: 0.25 },
    { id: 'casterLeft', label: 'Roulette avant gauche', kind: 'cylinder', args: [0.05, 0.05, 0.025, 20], position: [-0.16, 0.05, 0.36], rotation: [0, 0, Math.PI / 2], defaultColor: '#1a1a1a' },
    { id: 'casterRight', label: 'Roulette avant droite', kind: 'cylinder', args: [0.05, 0.05, 0.025, 20], position: [0.16, 0.05, 0.36], rotation: [0, 0, Math.PI / 2], defaultColor: '#1a1a1a' },
    { id: 'footrest', label: 'Repose-pieds', kind: 'box', args: [0.32, 0.02, 0.13], position: [0, 0.11, 0.35], defaultColor: '#6f6f6f', metalness: 0.6, roughness: 0.4, removable: true },
    { id: 'antiTip', label: 'Roulette anti-bascule', kind: 'sphere', args: [0.035, 16, 16], position: [0, 0.035, -0.34], defaultColor: '#1a1a1a', removable: true },
  ],
};

const electric: ChairVariantDef = {
  id: 'electric',
  name: 'Fauteuil électrique',
  description: 'Base motorisée, batterie, roues motrices arrière, joystick.',
  previewImage: previewSrc('electric.png'),
  parts: [
    { id: 'base', label: 'Base motorisée', kind: 'box', args: [0.5, 0.14, 0.62], position: [0, 0.14, 0], defaultColor: '#1c1c1c', metalness: 0.4, roughness: 0.6 },
    { id: 'battery', label: 'Batterie', kind: 'box', args: [0.34, 0.09, 0.16], position: [0, 0.24, -0.16], defaultColor: '#333333', metalness: 0.3, roughness: 0.6, removable: true },
    { id: 'frame', label: 'Châssis siège', kind: 'box', args: [0.44, 0.05, 0.44], position: [0, 0.46, 0.02], defaultColor: '#2f4858', metalness: 0.6, roughness: 0.35 },
    { id: 'seat', label: 'Assise', kind: 'box', args: [0.44, 0.08, 0.44], position: [0, 0.53, 0.02], defaultColor: '#3a3a3a', roughness: 0.85 },
    { id: 'backrest', label: 'Dossier', kind: 'box', args: [0.44, 0.55, 0.07], position: [0, 0.82, -0.19], defaultColor: '#3a3a3a', roughness: 0.85 },
    { id: 'headrest', label: 'Appui-tête', kind: 'box', args: [0.22, 0.14, 0.06], position: [0, 1.15, -0.19], defaultColor: '#3a3a3a', roughness: 0.85, removable: true },
    { id: 'driveWheelLeft', label: 'Roue motrice gauche', kind: 'cylinder', args: [0.19, 0.19, 0.09, 24], position: [-0.32, 0.19, -0.02], rotation: [0, 0, Math.PI / 2], defaultColor: '#111111', roughness: 0.8 },
    { id: 'driveWheelRight', label: 'Roue motrice droite', kind: 'cylinder', args: [0.19, 0.19, 0.09, 24], position: [0.32, 0.19, -0.02], rotation: [0, 0, Math.PI / 2], defaultColor: '#111111', roughness: 0.8 },
    { id: 'casterLeft', label: 'Roulette avant gauche', kind: 'cylinder', args: [0.08, 0.08, 0.05, 20], position: [-0.22, 0.08, 0.27], rotation: [0, 0, Math.PI / 2], defaultColor: '#1a1a1a' },
    { id: 'casterRight', label: 'Roulette avant droite', kind: 'cylinder', args: [0.08, 0.08, 0.05, 20], position: [0.22, 0.08, 0.27], rotation: [0, 0, Math.PI / 2], defaultColor: '#1a1a1a' },
    { id: 'footrest', label: 'Repose-pieds', kind: 'box', args: [0.4, 0.03, 0.18], position: [0, 0.18, 0.36], defaultColor: '#8a8a8a', metalness: 0.5, roughness: 0.5, removable: true },
    { id: 'armrestLeft', label: 'Accoudoir gauche', kind: 'box', args: [0.05, 0.05, 0.36], position: [-0.235, 0.68, 0.02], defaultColor: '#8a8a8a', metalness: 0.5, roughness: 0.5, removable: true },
    { id: 'armrestRight', label: 'Accoudoir droit', kind: 'box', args: [0.05, 0.05, 0.36], position: [0.235, 0.68, 0.02], defaultColor: '#8a8a8a', metalness: 0.5, roughness: 0.5, removable: true },
    { id: 'joystick', label: 'Joystick', kind: 'cylinder', args: [0.014, 0.014, 0.08, 12], position: [0.235, 0.73, 0.14], defaultColor: '#c0392b', metalness: 0.3, roughness: 0.5, removable: true },
  ],
};

export const CHAIR_VARIANTS: ChairVariantDef[] = [manual, sport, electric];

export function getVariant(id: ChairVariantDef['id']): ChairVariantDef {
  const v = CHAIR_VARIANTS.find((c) => c.id === id);
  if (!v) throw new Error(`Unknown variant ${id}`);
  return v;
}

export function defaultPartsState(variant: ChairVariantDef) {
  const state: Record<string, { color: string; visible: boolean; position: [number, number, number]; scale: [number, number, number] }> = {};
  for (const part of variant.parts) {
    state[part.id] = { color: part.defaultColor, visible: true, position: [0, 0, 0], scale: [1, 1, 1] };
  }
  return state;
}
