import { useMemo } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import type { ChairVariantDef, PartDef, PartsState, Vec3 } from '../types';

function addVec(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

const SPOKE_COUNT = 5;
const SPOKE_THICKNESS = 0.012;
const SPOKE_COLOR = '#c7c7c7';
const HUB_RATIO = 0.16;
const RIM_RATIO = 0.92;
const RIM_TUBE_RATIO = 0.075;

/**
 * Wheels whose main geometry is rotated purely around Z (every wheel in this
 * app) always end up with their flat disc face spanning roughly the Y-Z
 * plane, no matter the exact angle — so a spoke box built long-along-Z and
 * swept with rotateX(theta) stays in that plane regardless of the wheel's
 * own tilt. A spoked wheel is rendered as a small hub (instead of a full
 * solid disc — otherwise the spokes would be hidden inside it), an outer rim
 * ring, and the spokes connecting them, instead of one flat cylinder.
 */
function spokeAngles(count: number): number[] {
  return Array.from({ length: count }, (_, i) => (i * Math.PI) / count);
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
      else if (part.kind === 'cylinder') {
        const args = part.args as [number, number, number, number];
        geom = part.spoked
          ? new THREE.CylinderGeometry(args[0] * HUB_RATIO, args[1] * HUB_RATIO, args[2], args[3])
          : new THREE.CylinderGeometry(...args);
      } else if (part.kind === 'torus') geom = new THREE.TorusGeometry(...(part.args as [number, number, number, number]));
      else geom = new THREE.SphereGeometry(...(part.args as [number, number, number]));
      map.set(part.id, geom);
    }
    return map;
  }, [variant]);

  const rimGeometry = useMemo(() => {
    const map = new Map<string, THREE.BufferGeometry>();
    for (const part of variant.parts) {
      if (part.kind === 'cylinder' && part.spoked) {
        const radius = part.args[0];
        map.set(part.id, new THREE.TorusGeometry(radius * RIM_RATIO, radius * RIM_TUBE_RATIO, 10, 28));
      }
    }
    return map;
  }, [variant]);

  const spokeGeometry = useMemo(() => {
    const map = new Map<string, THREE.BufferGeometry>();
    for (const part of variant.parts) {
      if (part.kind === 'cylinder' && part.spoked) {
        const radius = part.args[0];
        map.set(part.id, new THREE.BoxGeometry(SPOKE_THICKNESS, SPOKE_THICKNESS, radius * RIM_RATIO * 2));
      }
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
      {variant.parts.map((part: PartDef) => {
        const state = partsState[part.id];
        if (!state || !state.visible) return null;
        const position = addVec(part.position, state.position);
        return (
          <group key={part.id}>
            <mesh
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
            {part.spoked && rimGeometry.get(part.id) && (
              <mesh geometry={rimGeometry.get(part.id)} position={position} rotation={[0, Math.PI / 2, 0]} scale={state.scale} castShadow receiveShadow>
                <meshStandardMaterial color={SPOKE_COLOR} metalness={0.7} roughness={0.25} />
              </mesh>
            )}
            {part.spoked &&
              spokeGeometry.get(part.id) &&
              spokeAngles(SPOKE_COUNT).map((theta, i) => (
                <mesh
                  key={`${part.id}-spoke-${i}`}
                  geometry={spokeGeometry.get(part.id)}
                  position={position}
                  rotation={[theta, 0, 0]}
                  scale={state.scale}
                  castShadow
                >
                  <meshStandardMaterial color={SPOKE_COLOR} metalness={0.7} roughness={0.3} />
                </mesh>
              ))}
          </group>
        );
      })}
    </group>
  );
}
