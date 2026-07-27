import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
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
      <main className="site-main">
        <Outlet />
      </main>
    </>
  );
}
