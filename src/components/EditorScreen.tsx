import { useMemo, useState } from 'react';
import type { Annotation, ExportApi, PartsState, SelectedModel, Vec3 } from '../types';
import { defaultPartsState, getVariant } from '../data/chairVariants';
import SceneCanvas from './SceneCanvas';
import ErrorBoundary from './ErrorBoundary';
import PartsPanel from './PartsPanel';
import ImportControls from './ImportControls';
import AnnotationPanel from './AnnotationPanel';
import ExportPanel from './ExportPanel';
import { describeModifications } from '../utils/modifications';

interface Props {
  model: SelectedModel;
  onBack: () => void;
  authorEmail?: string;
}

let annotationCounter = 0;

export default function EditorScreen({ model, onBack, authorEmail }: Props) {
  const variant = model.kind === 'procedural' && model.variantId ? getVariant(model.variantId) : undefined;
  const [partsState, setPartsState] = useState<PartsState>(() => (variant ? defaultPartsState(variant) : {}));

  const [importTint, setImportTint] = useState<string | null>(null);
  const [importScale, setImportScale] = useState(1);

  const [annotationMode, setAnnotationMode] = useState(false);
  const [pendingPoint, setPendingPoint] = useState<Vec3 | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const [exportApi, setExportApi] = useState<ExportApi | null>(null);

  const chairName = variant ? variant.name : model.fileName ?? 'Modèle importé';

  const modifications = useMemo(() => {
    if (!variant) return [];
    return describeModifications(variant, partsState);
  }, [variant, partsState]);

  const handlePartChange = (partId: string, updates: Partial<PartsState[string]>) => {
    setPartsState((prev) => ({ ...prev, [partId]: { ...prev[partId], ...updates } }));
  };

  const handleResetPart = (partId: string) => {
    if (!variant) return;
    const def = variant.parts.find((p) => p.id === partId);
    if (!def) return;
    setPartsState((prev) => ({
      ...prev,
      [partId]: { color: def.defaultColor, visible: true, position: [0, 0, 0], scale: [1, 1, 1] },
    }));
  };

  const handleSurfaceClick = (point: Vec3) => {
    setPendingPoint(point);
  };

  const confirmAnnotation = (note: string) => {
    if (!pendingPoint) return;
    annotationCounter += 1;
    setAnnotations((prev) => [...prev, { id: `a-${annotationCounter}`, position: pendingPoint, note }]);
    setPendingPoint(null);
  };

  return (
    <div className="editor-screen">
      <header className="editor-header">
        <button type="button" className="secondary" onClick={onBack}>
          ← Choisir un autre fauteuil
        </button>
        <h1>{chairName}</h1>
      </header>

      <div className="editor-body">
        <aside className="editor-side left">
          {variant ? (
            <PartsPanel variant={variant} partsState={partsState} onChange={handlePartChange} onResetPart={handleResetPart} />
          ) : (
            <ImportControls
              fileName={model.fileName}
              tint={importTint}
              onTintChange={setImportTint}
              scale={importScale}
              onScaleChange={setImportScale}
            />
          )}
        </aside>

        <main className="editor-canvas">
          <ErrorBoundary
            fallback={
              <div className="preview-fallback large">
                La vue 3D n'a pas pu s'afficher sur cet appareil. Essaie de recharger la page ou d'utiliser un
                autre navigateur.
              </div>
            }
          >
            <SceneCanvas
              model={model}
              variant={variant}
              partsState={partsState}
              importTint={importTint}
              importScale={importScale}
              annotationMode={annotationMode}
              annotations={annotations}
              onSurfaceClick={handleSurfaceClick}
              onExportReady={setExportApi}
            />
          </ErrorBoundary>
        </main>

        <aside className="editor-side right">
          <AnnotationPanel
            annotationMode={annotationMode}
            onToggleMode={() => setAnnotationMode((v) => !v)}
            pendingPoint={pendingPoint}
            onConfirmPending={confirmAnnotation}
            onCancelPending={() => setPendingPoint(null)}
            annotations={annotations}
            onDelete={(id) => setAnnotations((prev) => prev.filter((a) => a.id !== id))}
          />
          <ExportPanel
            chairName={chairName}
            modifications={modifications}
            annotations={annotations}
            exportApi={exportApi}
            canExportGLB={true}
            authorEmail={authorEmail}
          />
        </aside>
      </div>
    </div>
  );
}
