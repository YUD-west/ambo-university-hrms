import { NavLink, Outlet } from 'react-router-dom';
import BilingualText from '../BilingualText';
import ThemeToggle from '../ThemeToggle';
import './LibraryLayout.css';

export default function LibraryLayout() {
  return (
    <div className="library-layout">
      <nav className="library-nav">
        <div className="nav-header">
          <h2>📚 <BilingualText translationKey="library.title" /></h2>
          <ThemeToggle />
        </div>
        <ul className="nav-menu">
          <li>
            <NavLink to="/library" end>
              <BilingualText translationKey="library.dashboard" />
            </NavLink>
          </li>
          <li>
            <NavLink to="/library/books">
              <BilingualText translationKey="library.books" />
            </NavLink>
          </li>
          <li>
            <NavLink to="/library/members">
              <BilingualText translationKey="library.members" />
            </NavLink>
          </li>
          <li>
            <NavLink to="/library/borrowings">
              <BilingualText translationKey="library.borrowings" />
            </NavLink>
          </li>
        </ul>
      </nav>
      <main className="library-content">
        <Outlet />
      </main>
    </div>
  );
}

