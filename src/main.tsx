import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'

const appCrashFallback = (
  <div style={{ padding: 40, textAlign: 'center', fontFamily: 'sans-serif' }}>
    <h1 style={{ fontSize: 22 }}>Un problème est survenu</h1>
    <p>Essaie de recharger la page. Si le problème persiste, essaie avec un autre navigateur.</p>
    <button type="button" onClick={() => window.location.reload()} style={{ marginTop: 16, padding: '10px 20px' }}>
      Recharger
    </button>
  </div>
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallback={appCrashFallback}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
