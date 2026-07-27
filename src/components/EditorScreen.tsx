import { useMemo, useState } from 'react';
import type { AccessoryState, Annotation, ExportApi, PartsState, SelectedModel, Vec3 } from '../types';
import { defaultPartsState, getVariant } from '../data/chairVariants';
import { ACCESSORIES } from '../data/accessories';
import SceneCanvas from './SceneCanvas';
import ErrorBoundary from './ErrorBoundary';
import AssistantBar from './AssistantBar';
import CssFallbackScene from './CssFallbackScene';
import Flat2DScene from './Flat2DScene';
import RealisticPreview from './RealisticPreview';
import RealisticPanel from './RealisticPanel';
import AccessoriesPanel from './AccessoriesPanel';
import PartsPanel from './PartsPanel';
import ImportControls from './ImportControls';
import AnnotationPanel from './AnnotationPanel';
import ExportPanel from './ExportPanel';
import { describeModifications } from '../utils/modifications';
import { hasWebGL } from '../utils/webgl';
import { has3DTransformSupport } from '../utils/css3dSupport';

const defaultAccessoryState = (): AccessoryState => {
  const state: AccessoryState = {};
  for (const def of ACCESSORIES) {
    state[def.id] = { enabled: false, tint: def.defaultTint };
  }
  return state;
};

const REALISTIC_CRASH_MESSAGE = (
  <div className="preview-fallback large">
    L'aperçu réaliste n'a pas pu se charger sur cet appareil. Reviens à la vue simplifiée avec le bouton
    ci-dessus.
  </div>
);

const NO_WEBGL_IMPORTED_MESSAGE = (
  <div className="preview-fallback large">
    Ce navigateur n'a proposé aucun contexte WebGL (code E1), et un modèle importé ne peut s'afficher qu'en 3D
    réelle. Choisis un des modèles du catalogue à la place (visualisable même sans WebGL), ou essaie un autre
    navigateur.
  </div>
);

const WEBGL_CRASH_IMPORTED_MESSAGE = (
  <div className="preview-fallback large">
    La vue 3D a démarré mais a rencontré une erreur sur cet appareil (code E2). Essaie de recharger la page ou
    un autre navigateur.
  </div>
);

interface Props {
  model: SelectedModel;
  onBack: () => void;
  authorEmail?: string;
}

let annotationCounter = 0;

export default function EditorScreen({ model, onBack, authorEmail }: Props) {
  const variant = model.kind === 'procedural' && model.variantId ? getVariant(model.variantId) : undefined;
  const [partsState, setPartsState] = useState<PartsState>(() => (variant ? defaultPartsState(variant) : {}));
  const [webglAvailable] = useState(hasWebGL);
  const [css3dAvailable] = useState(has3DTransformSupport);

  const [importTint, setImportTint] = useState<string | null>(null);
  const [importScale, setImportScale] = useState(1);

  const [annotationMode, setAnnotationMode] = useState(false);
  const [pendingPoint, setPendingPoint] = useState<Vec3 | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);

  const [exportApi, setExportApi] = useState<ExportApi | null>(null);

  const [showRealistic, setShowRealistic] = useState(false);
  const [realisticTint, setRealisticTint] = useState('#5a6b7a');

  const [accessories, setAccessories] = useState<AccessoryState>(defaultAccessoryState);

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

  const handleResetAll = () => {
    if (!variant) return;
    setPartsState(defaultPartsState(variant));
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

  const toggleRealistic = () => {
    setExportApi(null);
    setShowRealistic((v) => !v);
  };

  const toggleAccessory = (id: string) => {
    setAccessories((prev) => ({ ...prev, [id]: { ...prev[id], enabled: !prev[id].enabled } }));
  };

  const setAccessoryEnabled = (id: string, enabled: boolean) => {
    setAccessories((prev) => ({ ...prev, [id]: { ...prev[id], enabled } }));
  };

  const setAccessoryTint = (id: string, tint: string) => {
    setAccessories((prev) => ({ ...prev, [id]: { ...prev[id], tint } }));
  };

  return (
    <div className="editor-screen">
      <header className="editor-header">
        <button type="button" className="secondary" onClick={onBack}>
          ← Choisir un autre fauteuil
        </button>
        <h1>{chairName}</h1>
        {webglAvailable && (
          <button type="button" className="secondary" onClick={toggleRealistic}>
            {showRealistic ? '← Retour à la personnalisation' : 'Voir un aperçu réaliste'}
          </button>
        )}
      </header>

      <AssistantBar
        variant={variant}
        partsState={partsState}
        onChange={handlePartChange}
        onResetPart={handleResetPart}
        onResetAll={handleResetAll}
        onAccessoryToggle={setAccessoryEnabled}
        accessoriesSupported={webglAvailable}
      />

      <div className="editor-body">
        <aside className="editor-side left">
          {showRealistic ? (
            <RealisticPanel tint={realisticTint} onTintChange={setRealisticTint} />
          ) : variant ? (
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
          {showRealistic ? (
            <ErrorBoundary fallback={REALISTIC_CRASH_MESSAGE}>
              <RealisticPreview tint={realisticTint} accessories={accessories} />
            </ErrorBoundary>
          ) : webglAvailable ? (
            <ErrorBoundary fallback={variant ? <CssFallbackScene variant={variant} partsState={partsState} /> : WEBGL_CRASH_IMPORTED_MESSAGE}>
              <SceneCanvas
                model={model}
                variant={variant}
                partsState={partsState}
                importTint={importTint}
                importScale={importScale}
                annotationMode={annotationMode}
                annotations={annotations}
                accessories={accessories}
                onSurfaceClick={handleSurfaceClick}
                onExportReady={setExportApi}
              />
            </ErrorBoundary>
          ) : variant && css3dAvailable ? (
            <>
              <div className="css3d-fallback-note">
                Aperçu 3D simplifié — WebGL indisponible sur cet appareil. Glisse pour tourner.
              </div>
              <CssFallbackScene variant={variant} partsState={partsState} />
            </>
          ) : variant ? (
            <Flat2DScene variant={variant} partsState={partsState} />
          ) : (
            NO_WEBGL_IMPORTED_MESSAGE
          )}
        </main>

        <aside className="editor-side right">
          {webglAvailable && (
            <AccessoriesPanel accessories={accessories} onToggle={toggleAccessory} onTintChange={setAccessoryTint} />
          )}
          <AnnotationPanel
            annotationMode={annotationMode}
            onToggleMode={() => setAnnotationMode((v) => !v)}
            pendingPoint={pendingPoint}
            onConfirmPending={confirmAnnotation}
            onCancelPending={() => setPendingPoint(null)}
            annotations={annotations}
            onDelete={(id) => setAnnotations((prev) => prev.filter((a) => a.id !== id))}
            disabled={!webglAvailable || showRealistic}
          />
          <ExportPanel
            chairName={chairName}
            modifications={showRealistic ? [] : modifications}
            annotations={showRealistic ? [] : annotations}
            exportApi={exportApi}
            canExportGLB={true}
            authorEmail={authorEmail}
          />
        </aside>
      </div>
    </div>
  );
}
