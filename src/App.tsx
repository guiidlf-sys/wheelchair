import { useState } from 'react';
import type { SelectedModel } from './types';
import HomeScreen from './components/HomeScreen';
import CatalogScreen from './components/CatalogScreen';
import EditorScreen from './components/EditorScreen';

type Screen = 'home' | 'catalog';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [model, setModel] = useState<SelectedModel | null>(null);

  if (model) {
    return <EditorScreen model={model} onBack={() => setModel(null)} />;
  }

  if (screen === 'catalog') {
    return <CatalogScreen onSelect={setModel} onBack={() => setScreen('home')} />;
  }

  return <HomeScreen onStart={() => setScreen('catalog')} />;
}

export default App;
