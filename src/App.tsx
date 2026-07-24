import { useState } from 'react';
import type { SelectedModel } from './types';
import CatalogScreen from './components/CatalogScreen';
import EditorScreen from './components/EditorScreen';

function App() {
  const [model, setModel] = useState<SelectedModel | null>(null);

  if (!model) {
    return <CatalogScreen onSelect={setModel} />;
  }

  return <EditorScreen model={model} onBack={() => setModel(null)} />;
}

export default App;
