import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import type { ModelAccessoryDef } from '../data/accessories';

interface Props {
  def: ModelAccessoryDef;
  tint: string;
}

/**
 * Loads one of the free-licensed accessory props and auto-fits it (source
 * models come from varied third-party exports with wildly different native
 * unit scales — see accessories.ts) to its target size, then places it at
 * the def's mount point. Same fit-at-runtime approach as RealisticPreview.
 *
 * Scale is derived from the object's *largest* dimension, not just height:
 * a flat object like a blanket has a tiny Y extent relative to its X/Z
 * spread, so normalizing on height alone would scale its width up to
 * several metres trying to make that thin Y dimension reach the target.
 *
 * The fit effect resets scale/position to identity before measuring, so it
 * stays idempotent no matter how many times it fires — Suspense-wrapped
 * loads commonly re-run mount effects once, and since Box3.setFromObject
 * measures world-space bounds *including* the object's current transform, a
 * second run against an already-fitted object would otherwise compound into
 * a wrong result.
 */
export default function AccessoryModel({ def, tint }: Props) {
  const { scene } = useGLTF(def.file);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    cloned.scale.set(1, 1, 1);
    cloned.position.set(0, 0, 0);
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const largest = Math.max(size.x, size.y, size.z);
    const scale = largest > 0 ? def.targetSize / largest : 1;
    cloned.scale.setScalar(scale);
    cloned.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
  }, [cloned, def.targetSize]);

  useEffect(() => {
    cloned.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.material) {
        const mat = obj.material as THREE.MeshStandardMaterial;
        mat.color.set(tint);
      }
    });
  }, [cloned, tint]);

  return (
    <group position={def.position} rotation={def.rotation}>
      <primitive object={cloned} />
    </group>
  );
}
