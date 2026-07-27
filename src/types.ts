export type Vec3 = [number, number, number];

export type PrimitiveKind = 'box' | 'cylinder' | 'torus' | 'sphere';

export interface PartDef {
  id: string;
  label: string;
  kind: PrimitiveKind;
  /** Args passed to the three.js geometry constructor for this kind. */
  args: number[];
  position: Vec3;
  rotation?: Vec3;
  defaultColor: string;
  removable?: boolean;
  metalness?: number;
  roughness?: number;
  /** Wheel-like cylinder parts get baked-in decorative spokes instead of a solid disc. */
  spoked?: boolean;
}

export interface ChairVariantDef {
  id: 'manual' | 'sport' | 'electric';
  name: string;
  description: string;
  parts: PartDef[];
}

/**
 * A catalog card. Most map 1:1 to a ChairVariantDef (baseVariantId === id),
 * but some are real-photo-only references (e.g. a beach or standing
 * wheelchair) that open the closest editable base model when personalized.
 */
export interface CatalogEntry {
  id: string;
  name: string;
  description: string;
  previewImage: string;
  photoCredit: string;
  baseVariantId: ChairVariantDef['id'];
}

export interface PartState {
  color: string;
  visible: boolean;
  position: Vec3;
  scale: Vec3;
}

export type PartsState = Record<string, PartState>;

export interface Annotation {
  id: string;
  position: Vec3;
  note: string;
}

export type ImportedExt = 'glb' | 'gltf' | 'obj' | 'stl';

export interface SelectedModel {
  kind: 'procedural' | 'imported';
  variantId?: ChairVariantDef['id'];
  fileUrl?: string;
  fileName?: string;
  fileExt?: ImportedExt;
}

export interface ExportApi {
  exportGLB: () => Promise<Blob>;
  exportImage: (annotations: Annotation[]) => string;
}

export interface AccessorySlotState {
  enabled: boolean;
  tint: string;
}

export type AccessoryState = Record<string, AccessorySlotState>;
