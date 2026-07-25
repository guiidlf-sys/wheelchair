import type { ChairVariantDef, PartsState } from '../types';

const PX = 260;

function sizeFor(part: { kind: string; args: number[] }): { w: number; h: number } {
  if (part.kind === 'box') return { w: Math.max(6, part.args[0] * PX), h: Math.max(6, part.args[1] * PX) };
  if (part.kind === 'cylinder') return { w: part.args[0] * 2 * PX, h: part.args[0] * 2 * PX };
  if (part.kind === 'torus') return { w: (part.args[0] + part.args[1]) * 2 * PX, h: (part.args[0] + part.args[1]) * 2 * PX };
  return { w: part.args[0] * 2 * PX, h: part.args[0] * 2 * PX };
}

interface Item {
  id: string;
  label: string;
  color: string;
  w: number;
  h: number;
  x: number;
  y: number;
  z: number;
}

interface Props {
  variant: ChairVariantDef;
  partsState: PartsState;
}

/**
 * Plain 2D fallback (absolute-positioned divs, no CSS 3D transforms at all)
 * for the rare browser that can render this React app but doesn't support
 * `transform-style: preserve-3d`. Not rotatable — a static front view plus
 * a color legend, so the customization is still legible and exportable.
 */
export default function Flat2DScene({ variant, partsState }: Props) {
  const items: Item[] = variant.parts
    .map((part) => {
      const state = partsState[part.id];
      if (!state || !state.visible) return null;
      const { w, h } = sizeFor(part);
      const x = (part.position[0] + state.position[0]) * PX;
      const y = -(part.position[1] + state.position[1]) * PX;
      const z = part.position[2] + state.position[2];
      return { id: part.id, label: part.label, color: state.color, w, h, x, y, z };
    })
    .filter((v): v is Item => v !== null)
    .sort((a, b) => a.z - b.z);

  return (
    <div className="flat2d-scene">
      <div className="flat2d-stage">
        {items.map((item) => (
          <div
            key={item.id}
            className="flat2d-part"
            style={{
              width: item.w,
              height: item.h,
              marginLeft: -item.w / 2,
              marginTop: -item.h / 2,
              left: `calc(50% + ${item.x}px)`,
              top: `calc(58% + ${item.y}px)`,
              background: item.color,
            }}
            title={item.label}
          />
        ))}
      </div>
      <ul className="flat2d-legend">
        {items.map((item) => (
          <li key={item.id}>
            <span className="flat2d-swatch" style={{ background: item.color }} />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
