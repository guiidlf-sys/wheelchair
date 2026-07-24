import type { ChairVariantDef, PartsState } from '../types';

export function describeModifications(variant: ChairVariantDef, parts: PartsState): string[] {
  const lines: string[] = [];
  for (const def of variant.parts) {
    const state = parts[def.id];
    if (!state) continue;
    if (!state.visible) {
      lines.push(`${def.label} : retiré(e)`);
      continue;
    }
    const changes: string[] = [];
    if (state.color.toLowerCase() !== def.defaultColor.toLowerCase()) changes.push(`couleur ${state.color}`);
    if (state.position.some((v) => Math.abs(v) > 0.001)) changes.push('repositionné(e)');
    if (state.scale.some((v) => Math.abs(v - 1) > 0.01)) changes.push('redimensionné(e)');
    if (changes.length > 0) lines.push(`${def.label} : ${changes.join(', ')}`);
  }
  return lines;
}
