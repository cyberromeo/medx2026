import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ showBack = false }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="navbar" id="main-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {showBack && (
          <button
            className="navbar__icon-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
              arrow_back
            </span>
          </button>
        )}
        <NavLink to="/subjects" className="navbar__brand" id="navbar-brand">
          MEDX 2026
        </NavLink>
      </div>

      <ul className="navbar__links">
        <li>
          <NavLink
            to="/subjects"
            className={({ isActive }) =>
              `navbar__link ${isActive ? 'navbar__link--active' : ''}`
            }
            id="nav-subjects"
          >
            SUBJECTS
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/subjects/pathology"
            className={({ isActive }) =>
              `navbar__link ${isActive ? 'navbar__link--active' : ''}`
            }
            id="nav-gallery"
          >
            GALLERY
          </NavLink>
        </li>
      </ul>

      <div className="navbar__right">
        <ThemeToggle />
        <button
          className="navbar__icon-btn"
          onClick={logout}
          aria-label="Logout"
          id="navbar-logout"
        >
          <span className="material-symbols-outlined">logout</span>
        </button>
      </div>
    </nav>
  );
}
