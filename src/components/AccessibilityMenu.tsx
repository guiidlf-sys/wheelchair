import { useEffect, useId, useRef, useState } from 'react';
import { useAccessibility, type FontSize } from '../utils/accessibility';

const FONT_SIZE_LABELS: Record<FontSize, string> = {
  normal: 'Normale',
  large: 'Grande',
  xlarge: 'Très grande',
};

export default function AccessibilityMenu() {
  const { settings, setFontSize, toggleHighContrast, toggleReduceMotion, toggleDyslexiaFont, reset } = useAccessibility();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    panelRef.current?.querySelector<HTMLElement>('button, input')?.focus();
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (!open) return;
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || toggleRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  return (
    <>
      <button
        type="button"
        ref={toggleRef}
        className="a11y-toggle"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="Options d'accessibilité"
        onClick={() => setOpen((v) => !v)}
      >
        <span aria-hidden="true">♿</span>
      </button>

      {open && (
        <div id={panelId} ref={panelRef} className="a11y-panel" role="dialog" aria-label="Options d'accessibilité">
          <h2>Accessibilité</h2>

          <fieldset className="a11y-group">
            <legend>Taille du texte</legend>
            <div className="a11y-segmented">
              {(Object.keys(FONT_SIZE_LABELS) as FontSize[]).map((size) => (
                <button
                  key={size}
                  type="button"
                  className={settings.fontSize === size ? 'active' : undefined}
                  aria-pressed={settings.fontSize === size}
                  onClick={() => setFontSize(size)}
                >
                  {FONT_SIZE_LABELS[size]}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="a11y-switch">
            <input type="checkbox" checked={settings.highContrast} onChange={toggleHighContrast} />
            Contraste élevé
          </label>

          <label className="a11y-switch">
            <input type="checkbox" checked={settings.reduceMotion} onChange={toggleReduceMotion} />
            Réduire les animations
          </label>

          <label className="a11y-switch">
            <input type="checkbox" checked={settings.dyslexiaFont} onChange={toggleDyslexiaFont} />
            Police adaptée dyslexie
          </label>

          <button type="button" className="secondary a11y-reset" onClick={reset}>
            Réinitialiser
          </button>
        </div>
      )}
    </>
  );
}
