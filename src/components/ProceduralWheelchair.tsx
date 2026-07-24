import { useMemo } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { ChairVariantDef, PartsState, Vec3 } from '../types';

function addVec(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

interface Props {
  variant: ChairVariantDef;
  partsState: PartsState;
  annotationMode: boolean;
  onSurfaceClick?: (point: Vec3) => void;
}

export default function ProceduralWheelchair({ variant, partsState, annotationMode, onSurfaceClick }: Props) {
  const geometries = useMemo(() => {
    const map = new Map<string, THREE.BufferGeometry>();
    for (const part of variant.parts) {
      let geom: THREE.BufferGeometry;
      if (part.kind === 'box') geom = new THREE.BoxGeometry(...(part.args as [number, number, number]));
      else if (part.kind === 'cylinder') geom = new THREE.CylinderGeometry(...(part.args as [number, number, number, number]));
      else if (part.kind === 'torus') geom = new THREE.TorusGeometry(...(part.args as [number, number, number, number]));
      else geom = new THREE.SphereGeometry(...(part.args as [number, number, number]));
      map.set(part.id, geom);
    }
    return map;
  }, [variant]);

  const handleClick = (e: ThreeEvent<PointerEvent>) => {
    if (!annotationMode || !onSurfaceClick) return;
    e.stopPropagation();
    onSurfaceClick([e.point.x, e.point.y, e.point.z]);
  };

  return (
    <group name={variant.name}>
      {variant.parts.map((part) => {
        const state = partsState[part.id];
        if (!state || !state.visible) return null;
        const position = addVec(part.position, state.position);
        return (
          <mesh
            key={part.id}
            name={part.id}
            geometry={geometries.get(part.id)}
            position={position}
            rotation={part.rotation as Vec3 | undefined}
            scale={state.scale}
            castShadow
            receiveShadow
            onPointerDown={handleClick}
          >
            <meshStandardMaterial
              color={state.color}
              metalness={part.metalness ?? 0.1}
              roughness={part.roughness ?? 0.6}
            />
          </mesh>
        );
      })}
    </group>
  );
}
