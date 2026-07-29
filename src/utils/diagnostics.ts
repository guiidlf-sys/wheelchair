/**
 * On-demand device/browser capability report, meant to be shown directly in
 * the UI and screenshotted — most users hitting a silent 3D rendering
 * failure have no way to open devtools (especially on a tablet), so this is
 * the only practical way to see what's actually happening on their device
 * instead of guessing from afar.
 */
export function collectDiagnostics(): string {
  const lines: string[] = [];
  lines.push(`userAgent: ${navigator.userAgent}`);
  lines.push(`devicePixelRatio: ${window.devicePixelRatio}`);
  lines.push(`viewport: ${window.innerWidth}x${window.innerHeight}`);
  lines.push(`ResizeObserver: ${typeof window.ResizeObserver !== 'undefined' ? 'present' : 'ABSENT'}`);
  lines.push(`MutationObserver: ${typeof window.MutationObserver !== 'undefined' ? 'present' : 'ABSENT'}`);

  try {
    const canvas = document.createElement('canvas');
    let contextType = 'none';
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    for (const type of ['webgl2', 'webgl', 'experimental-webgl'] as const) {
      gl = canvas.getContext(type) as WebGLRenderingContext | WebGL2RenderingContext | null;
      if (gl) {
        contextType = type;
        break;
      }
    }
    lines.push(`WebGL context: ${contextType}`);
    if (gl) {
      lines.push(`WebGL version: ${gl.getParameter(gl.VERSION)}`);
      lines.push(`GLSL version: ${gl.getParameter(gl.SHADING_LANGUAGE_VERSION)}`);
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      if (dbg) {
        lines.push(`GPU vendor: ${gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL)}`);
        lines.push(`GPU renderer: ${gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)}`);
      } else {
        lines.push('GPU vendor/renderer: (debug extension unavailable)');
      }
      lines.push(`Max texture size: ${gl.getParameter(gl.MAX_TEXTURE_SIZE)}`);
    }
  } catch (e) {
    lines.push(`WebGL check error: ${e instanceof Error ? e.message : String(e)}`);
  }

  const editorCanvas = document.querySelector('.editor-canvas');
  if (editorCanvas) {
    const rect = editorCanvas.getBoundingClientRect();
    lines.push(`.editor-canvas box: ${Math.round(rect.width)}x${Math.round(rect.height)}`);
  } else {
    lines.push('.editor-canvas: not found in DOM');
  }

  const liveCanvas = document.querySelector('.editor-canvas canvas');
  if (liveCanvas instanceof HTMLCanvasElement) {
    lines.push(`live <canvas> buffer: ${liveCanvas.width}x${liveCanvas.height}`);
    lines.push(`live <canvas> style: ${liveCanvas.getAttribute('style') ?? '(none)'}`);
  } else {
    lines.push('live <canvas>: not found in DOM');
  }

  return lines.join('\n');
}
