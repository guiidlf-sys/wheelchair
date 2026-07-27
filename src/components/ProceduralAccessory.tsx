import type { AccessoryDef } from '../data/accessories';

interface Props {
  def: AccessoryDef;
  tint: string;
}

const METAL = '#9a9a9a';

/**
 * Simple primitive-geometry stand-ins for generic assistive equipment that
 * has no real, freely-licensed 3D model available (unlike the sourced GLBs
 * in AccessoryModel.tsx). Built the same way as ProceduralWheelchair — boxes,
 * cylinders, spheres — so there's no licensing question and no fit-at-runtime
 * guesswork. Purely illustrative, not a reproduction of any specific product.
 */
export default function ProceduralAccessory({ def, tint }: Props) {
  return (
    <group position={def.position} rotation={def.rotation}>
      {renderDevice(def.id, tint)}
    </group>
  );
}

function renderDevice(id: string, tint: string) {
  switch (id) {
    case 'medHeadrest':
      return (
        <group>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.22, 0.15, 0.08]} />
            <meshStandardMaterial color={tint} roughness={0.85} />
          </mesh>
          <mesh position={[-0.13, 0, 0.02]} rotation={[0, 0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.05, 0.13, 0.06]} />
            <meshStandardMaterial color={tint} roughness={0.85} />
          </mesh>
          <mesh position={[0.13, 0, 0.02]} rotation={[0, -0.4, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.05, 0.13, 0.06]} />
            <meshStandardMaterial color={tint} roughness={0.85} />
          </mesh>
          <mesh position={[0, -0.14, 0]} castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.12, 10]} />
            <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.3} />
          </mesh>
        </group>
      );

    case 'trunkSupport':
      return (
        <group>
          {[-1, 1].map((side) => (
            <group key={side} position={[side * 0.24, 0, 0]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.05, 0.22, 0.09]} />
                <meshStandardMaterial color={tint} roughness={0.85} />
              </mesh>
              <mesh position={[side * -0.05, -0.06, 0.02]} rotation={[0, 0, side * 0.3]} castShadow>
                <cylinderGeometry args={[0.012, 0.012, 0.16, 10]} />
                <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.3} />
              </mesh>
            </group>
          ))}
        </group>
      );

    case 'ventilator':
      return (
        <group>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.15, 0.19, 0.09]} />
            <meshStandardMaterial color={tint} roughness={0.4} metalness={0.15} />
          </mesh>
          <mesh position={[0, 0.06, 0.05]} castShadow>
            <boxGeometry args={[0.08, 0.04, 0.005]} />
            <meshStandardMaterial color="#1c2733" roughness={0.5} />
          </mesh>
          <mesh position={[0.04, -0.11, 0.03]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.05, 10]} />
            <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.3} />
          </mesh>
          <mesh position={[-0.05, -0.2, -0.02]} rotation={[0.3, 0, 0.15]} castShadow>
            <torusGeometry args={[0.09, 0.012, 8, 20, Math.PI]} />
            <meshStandardMaterial color="#dcdcdc" roughness={0.6} />
          </mesh>
        </group>
      );

    case 'chinControl':
      return (
        <group>
          <mesh castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.22, 10]} />
            <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.13, 0.06]} rotation={[Math.PI / 2.4, 0, 0]} castShadow>
            <cylinderGeometry args={[0.01, 0.01, 0.1, 10]} />
            <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.18, 0.1]} castShadow>
            <sphereGeometry args={[0.022, 16, 16]} />
            <meshStandardMaterial color={tint} roughness={0.5} />
          </mesh>
        </group>
      );

    case 'ivPole':
      return (
        <group>
          <mesh castShadow>
            <cylinderGeometry args={[0.012, 0.012, 0.7, 10]} />
            <meshStandardMaterial color={METAL} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.3, 0]} castShadow>
            <torusGeometry args={[0.05, 0.008, 8, 16]} />
            <meshStandardMaterial color={METAL} metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0.03, 0.24, 0]} castShadow>
            <boxGeometry args={[0.07, 0.12, 0.035]} />
            <meshStandardMaterial color={tint} roughness={0.3} transparent opacity={0.75} />
          </mesh>
          <mesh position={[0, -0.35, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.045, 0.02, 16]} />
            <meshStandardMaterial color={METAL} metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
      );

    default:
      return null;
  }
}
