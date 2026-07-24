import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { SelectedModel } from '../types';
import { CHAIR_VARIANTS } from '../data/chairVariants';
import CatalogScreen from '../components/CatalogScreen';
import EditorScreen from '../components/EditorScreen';

export default function PersonalizationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [model, setModel] = useState<SelectedModel | null>(null);

  useEffect(() => {
    const variantParam = searchParams.get('variant');
    if (!variantParam) return;
    const known = CHAIR_VARIANTS.find((v) => v.id === variantParam);
    if (known) setModel({ kind: 'procedural', variantId: known.id });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (!model) {
    return <CatalogScreen onSelect={setModel} onBack={() => navigate('/')} />;
  }

  return <EditorScreen model={model} onBack={() => setModel(null)} />;
}
