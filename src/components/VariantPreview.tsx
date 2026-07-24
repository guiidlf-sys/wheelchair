import { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import type { ChairVariantDef } from '../types';
import { defaultPartsState } from '../data/chairVariants';
import ProceduralWheelchair from './ProceduralWheelchair';

function AimCamera() {
  const { camera } = useThree();
  useEffect(() => {
    camera.lookAt(0, 0.55, 0);
  }, [camera]);
  return null;
}

export default function VariantPreview({ variant }: { variant: ChairVariantDef }) {
  const partsState = defaultPartsState(variant);
  return (
    <Canvas camera={{ position: [1.5, 1.15, 1.8], fov: 38 }} dpr={[1, 1.5]}>
      <color attach="background" args={['#3a2f26']} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 5, 2]} intensity={1.4} />
      <directionalLight position={[-2, 1, -2]} intensity={0.5} />
      <AimCamera />
      <Suspense fallback={null}>
        <ProceduralWheelchair variant={variant} partsState={partsState} annotationMode={false} />
      </Suspense>
    </Canvas>
  );
}
