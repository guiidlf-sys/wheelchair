import { NavLink, Outlet, useLocation } from 'react-router-dom';
import AccessibilityMenu from './AccessibilityMenu';

export default function Layout() {
  const location = useLocation();

  return (
    <>
      <div className="ambient-bg" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <a href="#main-content" className="skip-link">
        Aller au contenu principal
      </a>
      <header className="site-header">
        <NavLink to="/" className="brand">
          Whells
        </NavLink>
        <nav className="site-nav">
          <NavLink to="/" end>
            Accueil
          </NavLink>
          <NavLink to="/catalogue">Catalogue</NavLink>
          <NavLink to="/a-propos">À propos</NavLink>
          <NavLink to="/personnalisation" className="nav-cta">
            Personnalisation
          </NavLink>
        </nav>
      </header>
      <main id="main-content" className="site-main" tabIndex={-1}>
        {/* Keyed on pathname so this wrapper remounts (and its entrance
            animation re-fires) on every top-level navigation and on first
            load, without resetting state on in-page changes like ?variant=. */}
        <div key={location.pathname} className="page-transition">
          <Outlet />
        </div>
      </main>
      <AccessibilityMenu />
    </>
  );
}
