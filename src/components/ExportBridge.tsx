import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import type { RefObject } from 'react';
import * as THREE from 'three';
import type { Annotation, ExportApi } from '../types';
import { exportGroupAsGLB, renderAnnotatedImage } from '../utils/export';

interface Props {
  modelGroupRef: RefObject<THREE.Group | null>;
  onReady: (api: ExportApi) => void;
}

export default function ExportBridge({ modelGroupRef, onReady }: Props) {
  const { gl, camera } = useThree();

  useEffect(() => {
    const api: ExportApi = {
      exportGLB: () => {
        if (!modelGroupRef.current) return Promise.reject(new Error('Modèle non prêt'));
        return exportGroupAsGLB(modelGroupRef.current);
      },
      exportImage: (annotations: Annotation[]) => renderAnnotatedImage(gl, camera, annotations),
    };
    onReady(api);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, camera]);

  return null;
}
