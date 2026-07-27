import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import type { Annotation, ChairVariantDef, ExportApi, PartsState, SelectedModel, Vec3 } from '../types';
import ProceduralWheelchair from './ProceduralWheelchair';
import ImportedModel from './ImportedModel';
import AnnotationPins from './AnnotationPins';
import ExportBridge from './ExportBridge';

interface Props {
  model: SelectedModel;
  variant?: ChairVariantDef;
  partsState?: PartsState;
  importTint: string | null;
  importScale: number;
  annotationMode: boolean;
  annotations: Annotation[];
  onSurfaceClick: (point: Vec3) => void;
  onExportReady: (api: ExportApi) => void;
}

export default function SceneCanvas({
  model,
  variant,
  partsState,
  importTint,
  importScale,
  annotationMode,
  annotations,
  onSurfaceClick,
  onExportReady,
}: Props) {
  const modelGroupRef = useRef<THREE.Group>(null);

  return (
    <Canvas
      shadows
      gl={{
        preserveDrawingBuffer: true,
        failIfMajorPerformanceCaveat: false,
        antialias: false,
        powerPreference: 'default',
      }}
      camera={{ position: [1.9, 1.4, 2.2], fov: 50 }}
      className={annotationMode ? 'annotation-cursor' : undefined}
    >
      <color attach="background" args={['#3a2f26']} />
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 5, 2]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-3, 2, -2]} intensity={0.6} />
      <directionalLight position={[0, 2, -4]} intensity={0.4} />

      <Suspense fallback={null}>
        <group ref={modelGroupRef}>
          {model.kind === 'procedural' && variant && partsState && (
            <ProceduralWheelchair
              variant={variant}
              partsState={partsState}
              annotationMode={annotationMode}
              onSurfaceClick={onSurfaceClick}
            />
          )}
          {model.kind === 'imported' && model.fileUrl && model.fileExt && (
            <ImportedModel
              fileUrl={model.fileUrl}
              fileExt={model.fileExt}
              tintColor={importTint}
              scale={importScale}
              offset={[0, 0, 0]}
              annotationMode={annotationMode}
              onSurfaceClick={onSurfaceClick}
            />
          )}
        </group>
        <ContactShadows position={[0, 0, 0]} opacity={0.55} scale={4} blur={2.2} far={2} />
      </Suspense>

      <AnnotationPins annotations={annotations} />

      <gridHelper args={[6, 24, '#7a6650', '#5a4a3a']} />
      <OrbitControls enablePan minDistance={0.6} maxDistance={5} target={[0, 0.5, 0]} />

      <ExportBridge modelGroupRef={modelGroupRef} onReady={onExportReady} />
    </Canvas>
  );
}
