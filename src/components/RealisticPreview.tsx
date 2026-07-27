import { Suspense, useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import type { AccessoryState } from '../types';
import AccessoryModel from './AccessoryModel';
import ProceduralAccessory from './ProceduralAccessory';
import { ACCESSORIES } from '../data/accessories';

const MODEL_URL = `${import.meta.env.BASE_URL}models/wheelchair-realistic.glb`;
const TARGET_HEIGHT = 1;

interface ModelProps {
  tint: string;
}

function Model({ tint }: ModelProps) {
  const { scene } = useGLTF(MODEL_URL);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    // The source asset's own scale/pivot is unknown ahead of time, so fit it
    // to the scene at runtime instead of hardcoding fragile constants: scale
    // to a known target height, then sit it on the ground, centered on X/Z.
    // Reset transform before measuring so this stays idempotent if the effect
    // re-runs against an already-fitted object (Suspense loads commonly do).
    cloned.scale.set(1, 1, 1);
    cloned.position.set(0, 0, 0);
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const scale = size.y > 0 ? TARGET_HEIGHT / size.y : 1;
    cloned.scale.setScalar(scale);
    cloned.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale);
  }, [cloned]);

  useEffect(() => {
    cloned.traverse((obj) => {
      if (obj instanceof THREE.Mesh && obj.material) {
        const mat = obj.material as THREE.MeshStandardMaterial;
        mat.color.set(tint);
      }
    });
  }, [cloned, tint]);

  return <primitive object={cloned} />;
}

useGLTF.preload(MODEL_URL);

interface Props {
  tint: string;
  accessories: AccessoryState;
}

/**
 * Single free-licensed real wheelchair model (Google, "Wheelchair", CC BY 3.0,
 * via the Icosa Gallery archive of Google Poly). It's one fused mesh with a
 * single material — no separate parts to color/remove individually, unlike
 * the procedural workspace — so this is a look-only preview with one overall
 * tint, not a replacement for the customizable editor.
 */
export default function RealisticPreview({ tint, accessories }: Props) {
  return (
    <Canvas
      shadows
      camera={{ position: [1.6, 1.2, 1.8], fov: 40 }}
      gl={{
        preserveDrawingBuffer: true,
        failIfMajorPerformanceCaveat: false,
        antialias: false,
        powerPreference: 'default',
      }}
    >
      <color attach="background" args={['#3a2f26']} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 5, 2]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-3, 2, -2]} intensity={0.6} />
      <directionalLight position={[0, 2, -4]} intensity={0.4} />
      <Suspense fallback={null}>
        <Model tint={tint} />
        {ACCESSORIES.filter((def) => accessories[def.id]?.enabled).map((def) =>
          def.kind === 'procedural' ? (
            <ProceduralAccessory key={def.id} def={def} tint={accessories[def.id].tint} />
          ) : (
            <AccessoryModel key={def.id} def={def} tint={accessories[def.id].tint} />
          ),
        )}
        <ContactShadows position={[0, 0, 0]} opacity={0.5} scale={4} blur={2.2} far={2} />
      </Suspense>
      <gridHelper args={[6, 24, '#7a6650', '#5a4a3a']} />
      <OrbitControls enablePan minDistance={0.6} maxDistance={5} target={[0, 0.4, 0]} />
    </Canvas>
  );
}
