import ResizeObserverPolyfill from 'resize-observer-polyfill';

/**
 * @react-three/fiber's <Canvas> relies on ResizeObserver internally (via
 * react-use-measure) to size the WebGL viewport to its container — without
 * it, mounting a Canvas throws synchronously. Most browsers have supported
 * it natively for years, but it's still missing in some locked-down/older
 * mobile browser configurations, so this only steps in when it's genuinely
 * absent.
 */
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = ResizeObserverPolyfill as unknown as typeof ResizeObserver;
}
