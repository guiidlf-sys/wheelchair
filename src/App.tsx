import { useEffect, useRef } from 'react';
import { HashRouter, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import CataloguePage from './pages/CataloguePage';
import PersonalizationPage from './pages/PersonalizationPage';
import AboutPage from './pages/AboutPage';

/**
 * Sends the visitor to the home page whenever the app boots up fresh (a full
 * page load/reload/relaunch), regardless of what route was left in the URL —
 * but only once per app session, so it never interferes with in-app
 * navigation to other pages afterwards.
 */
function RedirectToHomeOnLoad() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    if (location.pathname !== '/') {
      navigate('/', { replace: true });
    }
  }, [navigate, location.pathname]);

  return null;
}

function App() {
  return (
    <HashRouter>
      <RedirectToHomeOnLoad />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/personnalisation" element={<PersonalizationPage />} />
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="*" element={<HomePage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
