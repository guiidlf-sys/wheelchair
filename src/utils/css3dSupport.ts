/** Detects support for CSS 3D transforms (perspective + preserve-3d), used by CssFallbackScene. */
export function has3DTransformSupport(): boolean {
  try {
    if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
      return (
        CSS.supports('transform-style', 'preserve-3d') || CSS.supports('-webkit-transform-style', 'preserve-3d')
      );
    }
    const el = document.createElement('div');
    el.style.transformStyle = 'preserve-3d';
    return el.style.transformStyle === 'preserve-3d';
  } catch {
    return false;
  }
}
