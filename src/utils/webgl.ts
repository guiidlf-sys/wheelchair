/**
 * Context attributes to try, from best to most compatible. Some browsers on
 * older/blocklisted GPUs refuse the default attribute set (antialiasing,
 * high-performance power preference) but will still hand back a
 * software-rendered context if asked more permissively.
 */
const ATTEMPTS: WebGLContextAttributes[] = [
  {},
  { failIfMajorPerformanceCaveat: false },
  { failIfMajorPerformanceCaveat: false, antialias: false, powerPreference: 'default' },
];

/** Cheap synchronous check so we can skip mounting <Canvas> entirely on devices without WebGL. */
export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    for (const attrs of ATTEMPTS) {
      const gl =
        canvas.getContext('webgl2', attrs) || canvas.getContext('webgl', attrs) || canvas.getContext('experimental-webgl', attrs);
      if (gl) return true;
    }
    return false;
  } catch {
    return false;
  }
}
