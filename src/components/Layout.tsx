import { NavLink, Outlet } from 'react-router-dom';
import AccessibilityMenu from './AccessibilityMenu';

export default function Layout() {
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
        <Outlet />
      </main>
      <AccessibilityMenu />
    </>
  );
}
