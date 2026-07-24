import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import type { Annotation } from '../types';

export function exportGroupAsGLB(group: THREE.Group): Promise<Blob> {
  const exporter = new GLTFExporter();
  return new Promise((resolve, reject) => {
    exporter.parse(
      group,
      (result) => {
        if (result instanceof ArrayBuffer) {
          resolve(new Blob([result], { type: 'model/gltf-binary' }));
        } else {
          resolve(new Blob([JSON.stringify(result)], { type: 'model/gltf+json' }));
        }
      },
      (error) => reject(error),
      { binary: true },
    );
  });
}

export function renderAnnotatedImage(
  renderer: THREE.WebGLRenderer,
  camera: THREE.Camera,
  annotations: Annotation[],
): string {
  const sourceCanvas = renderer.domElement;
  const canvas = document.createElement('canvas');
  canvas.width = sourceCanvas.width;
  canvas.height = sourceCanvas.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return sourceCanvas.toDataURL('image/png');

  ctx.drawImage(sourceCanvas, 0, 0);

  const point = new THREE.Vector3();
  annotations.forEach((annotation, index) => {
    point.set(...annotation.position);
    point.project(camera);
    if (point.z > 1) return;
    const x = ((point.x + 1) / 2) * canvas.width;
    const y = ((1 - point.y) / 2) * canvas.height;

    ctx.beginPath();
    ctx.arc(x, y, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#e63946';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(index + 1), x, y + 1);
  });

  return canvas.toDataURL('image/png');
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
