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
}

export interface ChairVariantDef {
  id: 'manual' | 'sport' | 'electric';
  name: string;
  description: string;
  parts: PartDef[];
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
