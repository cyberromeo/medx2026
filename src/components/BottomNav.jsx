import { NavLink } from 'react-router-dom';

export default function BottomNav({ activePage = 'subjects' }) {
  return (
    <nav className="bottom-nav" id="bottom-nav">
      <NavLink
        to="/subjects"
        className={`bottom-nav__item ${activePage === 'subjects' ? 'bottom-nav__item--active' : ''}`}
        id="bottom-nav-subjects"
      >
        <span
          className={`material-symbols-outlined ${activePage === 'subjects' ? 'filled' : ''}`}
        >
          grid_view
        </span>
        <span className="bottom-nav__label">Subjects</span>
      </NavLink>

      <NavLink
        to="/pdfs"
        className={`bottom-nav__item ${activePage === 'pdfs' ? 'bottom-nav__item--active' : ''}`}
        id="bottom-nav-pdfs"
      >
        <span
          className={`material-symbols-outlined ${activePage === 'pdfs' ? 'filled' : ''}`}
        >
          picture_as_pdf
        </span>
        <span className="bottom-nav__label">PDFs</span>
      </NavLink>

      <NavLink
        to="/pyts"
        className={`bottom-nav__item ${activePage === 'pyts' ? 'bottom-nav__item--active' : ''}`}
        id="bottom-nav-pyts"
      >
        <span className={`material-symbols-outlined ${activePage === 'pyts' ? 'filled' : ''}`}>
          description
        </span>
        <span className="bottom-nav__label">PYTs</span>
      </NavLink>
    </nav>
  );
}
