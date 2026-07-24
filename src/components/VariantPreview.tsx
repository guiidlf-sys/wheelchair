import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import type { ChairVariantDef } from '../types';
import { defaultPartsState } from '../data/chairVariants';
import ProceduralWheelchair from './ProceduralWheelchair';

export default function VariantPreview({ variant }: { variant: ChairVariantDef }) {
  const partsState = defaultPartsState(variant);
  return (
    <Canvas camera={{ position: [1.2, 0.9, 1.4], fov: 40 }} dpr={[1, 1.5]}>
      <color attach="background" args={['#f2eadd']} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 5, 2]} intensity={1.3} />
      <directionalLight position={[-2, 1, -2]} intensity={0.4} />
      <Suspense fallback={null}>
        <ProceduralWheelchair variant={variant} partsState={partsState} annotationMode={false} />
      </Suspense>
    </Canvas>
  );
}
