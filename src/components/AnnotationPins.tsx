import { Html } from '@react-three/drei';
import type { Annotation } from '../types';

export default function AnnotationPins({ annotations }: { annotations: Annotation[] }) {
  return (
    <>
      {annotations.map((a, i) => (
        <group key={a.id} position={a.position}>
          <mesh>
            <sphereGeometry args={[0.014, 16, 16]} />
            <meshStandardMaterial color="#e63946" emissive="#e63946" emissiveIntensity={0.4} />
          </mesh>
          <Html distanceFactor={4} occlude={false}>
            <div className="pin-badge">{i + 1}</div>
          </Html>
        </group>
      ))}
    </>
  );
}
