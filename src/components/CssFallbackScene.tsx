import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { ChairVariantDef, PartDef, PartsState, Vec3 } from '../types';

const PX = 260;
const CENTER_Y = 0.45;

function addVec(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function shade(hex: string, amount: number): string {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((ch) => ch + ch).join('') : clean;
  const num = parseInt(full, 16) || 0;
  const channel = (shift: number) => {
    const v = (num >> shift) & 255;
    const adjusted = amount >= 0 ? v + (255 - v) * amount : v + v * amount;
    return Math.max(0, Math.min(255, Math.round(adjusted)));
  };
  return `rgb(${channel(16)}, ${channel(8)}, ${channel(0)})`;
}

const faceBase: CSSProperties = { position: 'absolute', top: '50%', left: '50%' };

/** Older Safari/iOS needs the -webkit- prefixed forms alongside the standard ones; React doesn't autoprefix inline styles. */
const PRESERVE_3D: CSSProperties = { transformStyle: 'preserve-3d', WebkitTransformStyle: 'preserve-3d' } as CSSProperties;

function withTransform(transform: string, extra?: CSSProperties): CSSProperties {
  return { ...extra, transform, WebkitTransform: transform } as CSSProperties;
}

function Cuboid({ w, h, d, color }: { w: number; h: number; d: number; color: string }) {
  const W = w * PX;
  const H = h * PX;
  const D = d * PX;
  return (
    <div style={PRESERVE_3D}>
      <div style={withTransform(`translateZ(${D / 2}px)`, { ...faceBase, width: W, height: H, marginLeft: -W / 2, marginTop: -H / 2, background: shade(color, 0.08) })} />
      <div style={withTransform(`translateZ(${-D / 2}px) rotateY(180deg)`, { ...faceBase, width: W, height: H, marginLeft: -W / 2, marginTop: -H / 2, background: shade(color, -0.25) })} />
      <div style={withTransform(`translateX(${W / 2}px) rotateY(90deg)`, { ...faceBase, width: D, height: H, marginLeft: -D / 2, marginTop: -H / 2, background: shade(color, -0.1) })} />
      <div style={withTransform(`translateX(${-W / 2}px) rotateY(-90deg)`, { ...faceBase, width: D, height: H, marginLeft: -D / 2, marginTop: -H / 2, background: shade(color, -0.1) })} />
      <div style={withTransform(`translateY(${-H / 2}px) rotateX(90deg)`, { ...faceBase, width: W, height: D, marginLeft: -W / 2, marginTop: -D / 2, background: shade(color, 0.25) })} />
      <div style={withTransform(`translateY(${H / 2}px) rotateX(-90deg)`, { ...faceBase, width: W, height: D, marginLeft: -W / 2, marginTop: -D / 2, background: shade(color, -0.35) })} />
    </div>
  );
}

function Disc({ r, h, color }: { r: number; h: number; color: string }) {
  const D = r * 2 * PX;
  const H = h * PX;
  const base: CSSProperties = { ...faceBase, width: D, height: D, marginLeft: -D / 2, marginTop: -D / 2, borderRadius: '50%' };
  return (
    <div style={PRESERVE_3D}>
      <div style={withTransform(`translateY(${-H / 2}px) rotateX(90deg)`, { ...base, background: shade(color, 0.1) })} />
      <div style={withTransform(`translateY(${H / 2}px) rotateX(-90deg)`, { ...base, background: shade(color, -0.3) })} />
    </div>
  );
}

function Ring({ r, tube, color }: { r: number; tube: number; color: string }) {
  const outer = (r + tube) * 2 * PX;
  const border = Math.max(1, tube * 2 * PX);
  return (
    <div
      style={withTransform('rotateX(90deg)', {
        ...faceBase,
        width: outer,
        height: outer,
        marginLeft: -outer / 2,
        marginTop: -outer / 2,
        borderRadius: '50%',
        border: `${border}px solid ${color}`,
        background: 'transparent',
      })}
    />
  );
}

function SphereDot({ r, color }: { r: number; color: string }) {
  const D = r * 2 * PX;
  return (
    <div
      style={{
        ...faceBase,
        width: D,
        height: D,
        marginLeft: -D / 2,
        marginTop: -D / 2,
        borderRadius: '50%',
        background: `radial-gradient(circle at 35% 30%, ${shade(color, 0.4)}, ${color} 60%, ${shade(color, -0.4)})`,
      }}
    />
  );
}

function PartShape({ part, color }: { part: PartDef; color: string }) {
  if (part.kind === 'box') {
    const [w, h, d] = part.args;
    return <Cuboid w={w} h={h} d={d} color={color} />;
  }
  if (part.kind === 'cylinder') {
    const [r, , h] = part.args;
    return <Disc r={r} h={h} color={color} />;
  }
  if (part.kind === 'torus') {
    const [r, tube] = part.args;
    return <Ring r={r} tube={tube} color={color} />;
  }
  const [r] = part.args;
  return <SphereDot r={r} color={color} />;
}

interface Props {
  variant: ChairVariantDef;
  partsState: PartsState;
}

/**
 * CSS-3D-transform based renderer, used when WebGL is unavailable. CSS 3D
 * transforms (perspective + preserve-3d) have been supported since iOS 5 /
 * Android 4.x / IE10 — far more universally than WebGL — so this lets a
 * procedural model stay viewable/rotatable on devices that can't run
 * three.js at all. It can't render imported GLB/OBJ files (those need a
 * real 3D engine), only the built-in editable models.
 */
export default function CssFallbackScene({ variant, partsState }: Props) {
  const [rot, setRot] = useState({ x: -14, y: -35 });
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Native listeners instead of React's synthetic pointer/touch events: React
  // attaches touch listeners as passive by default, which silently breaks
  // preventDefault() on touchmove in some mobile browsers, and Pointer Events
  // support is inconsistent enough on tablets that mouse+touch is more
  // reliable. Move/up are on window so the drag keeps tracking even if the
  // finger/cursor leaves the stage element mid-gesture.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const applyDelta = (dx: number, dy: number) => {
      setRot((prev) => ({
        x: Math.max(-75, Math.min(75, prev.x - dy * 0.4)),
        y: prev.y + dx * 0.4,
      }));
    };

    const onMouseDown = (e: MouseEvent) => {
      dragRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      applyDelta(e.clientX - dragRef.current.x, e.clientY - dragRef.current.y);
      dragRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => {
      dragRef.current = null;
    };

    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      dragRef.current = { x: t.clientX, y: t.clientY };
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!dragRef.current) return;
      const t = e.touches[0];
      if (!t) return;
      e.preventDefault();
      applyDelta(t.clientX - dragRef.current.x, t.clientY - dragRef.current.y);
      dragRef.current = { x: t.clientX, y: t.clientY };
    };
    const onTouchEnd = () => {
      dragRef.current = null;
    };

    stage.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    stage.addEventListener('touchstart', onTouchStart, { passive: true });
    stage.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);

    return () => {
      stage.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      stage.removeEventListener('touchstart', onTouchStart);
      stage.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

  return (
    <div className="css3d-stage" ref={stageRef}>
      <div
        className="css3d-world"
        style={withTransform(`rotateX(${rot.x}deg) rotateY(${rot.y}deg) translateY(${CENTER_Y * PX}px)`)}
      >
        {variant.parts.map((part) => {
          const state = partsState[part.id];
          if (!state || !state.visible) return null;
          const pos = addVec(part.position, state.position);
          const [rx = 0, ry = 0, rz = 0] = part.rotation ?? [0, 0, 0];
          const scale = state.scale[0];
          const transform = `translate3d(${pos[0] * PX}px, ${-pos[1] * PX}px, ${pos[2] * PX}px) rotateZ(${rz}rad) rotateY(${ry}rad) rotateX(${rx}rad) scale3d(${scale}, ${scale}, ${scale})`;
          return (
            <div key={part.id} className="css3d-part" style={withTransform(transform)}>
              <PartShape part={part} color={state.color} />
            </div>
          );
        })}
      </div>
      <div className="css3d-hint">Glisse pour faire tourner</div>
    </div>
  );
}
