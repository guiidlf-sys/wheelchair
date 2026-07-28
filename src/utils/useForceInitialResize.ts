import { useEffect } from 'react';

/**
 * Nudges @react-three/fiber's <Canvas> (via react-use-measure) into taking
 * its first real size measurement.
 *
 * react-use-measure's ResizeObserver.observe() normally provides that first
 * measurement automatically — but on at least one real device,
 * ResizeObserver exists (nothing throws, even with a polyfill patched in
 * globally, and even passed explicitly via Canvas's resize.polyfill prop —
 * the well-known `resize-observer-polyfill` package turns out to just
 * re-export whatever's already on window.ResizeObserver when present,
 * broken or not) yet its callback is never actually invoked, leaving the
 * canvas permanently stuck at the browser's default 300x150 box with no
 * error at all.
 *
 * Dispatching a genuine window 'resize' event is what react-use-measure
 * listens for independent of ResizeObserver entirely, so this works
 * regardless of whether that API is present, absent, or silently inert.
 * Fired a few times with increasing delay to ride out any layout settling
 * from sibling content/Suspense still resolving after mount.
 */
export function useForceInitialResize() {
  useEffect(() => {
    const timers = [50, 250, 800].map((delay) =>
      window.setTimeout(() => window.dispatchEvent(new Event('resize')), delay),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);
}
