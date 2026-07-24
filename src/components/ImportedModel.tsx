import { useEffect, useMemo } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import type { ImportedExt, Vec3 } from '../types';

interface Props {
  fileUrl: string;
  fileExt: ImportedExt;
  tintColor: string | null;
  scale: number;
  offset: Vec3;
  annotationMode: boolean;
  onSurfaceClick?: (point: Vec3) => void;
  onGroupReady?: (group: THREE.Group) => void;
}

function useImportedObject(fileUrl: string, fileExt: ImportedExt): THREE.Object3D {
  if (fileExt === 'glb' || fileExt === 'gltf') {
    const gltf = useLoader(GLTFLoader, fileUrl);
    return gltf.scene;
  }
  if (fileExt === 'obj') {
    const obj = useLoader(OBJLoader, fileUrl);
    return obj;
  }
  const geometry = useLoader(STLLoader, fileUrl);
  const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: '#999999' }));
  mesh.name = 'imported-stl';
  return mesh;
}

export default function ImportedModel({ fileUrl, fileExt, tintColor, scale, offset, annotationMode, onSurfaceClick, onGroupReady }: Props) {
  const object = useImportedObject(fileUrl, fileExt);

  const centered = useMemo(() => {
    const clone = object.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const normalizeScale = 0.9 / maxDim;
    const center = new THREE.Vector3();
    box.getCenter(center);
    clone.position.set(-center.x, -box.min.y, -center.z);
    const wrapper = new THREE.Group();
    wrapper.add(clone);
    wrapper.scale.setScalar(normalizeScale);
    return wrapper;
  }, [object]);

  useEffect(() => {
    if (!tintColor) return;
    centered.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.MeshStandardMaterial;
        if (material && 'color' in material) {
          material.color = new THREE.Color(tintColor);
        }
      }
    });
  }, [centered, tintColor]);

  const handleClick = (e: ThreeEvent<PointerEvent>) => {
    if (!annotationMode || !onSurfaceClick) return;
    e.stopPropagation();
    onSurfaceClick([e.point.x, e.point.y, e.point.z]);
  };

  return (
    <group
      name="imported-model"
      ref={(g) => g && onGroupReady?.(g)}
      position={offset}
      scale={scale}
      onPointerDown={handleClick}
    >
      <primitive object={centered} />
    </group>
  );
}
