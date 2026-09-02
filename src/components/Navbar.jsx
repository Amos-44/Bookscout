import React, { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bookmark, Compass, Search, BookOpen, Sparkles } from 'lucide-react';
import { useBookContext } from '../context/BookContext';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { savedCount } = useBookContext();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-2 rounded-full px-2.5 py-1.5 text-[0.92rem] sm:text-[1rem] font-semibold tracking-[0.04em] transition-all duration-150 ${
      isActive
        ? 'bg-white text-brand-800 shadow-sm ring-1 ring-brand-200'
        : 'text-brand-700 hover:bg-white/80 hover:text-brand-800'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-brand-200/80 bg-[#f7f0ea]/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-4 lg:px-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="group flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-800 text-stone-100 shadow-md transition-colors group-hover:bg-brand-accent sm:h-10 sm:w-10">
                <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="font-serif text-[1.45rem] font-bold tracking-tight text-brand-800 sm:text-[2rem]">
                Book<span className="text-brand-accent">Scout</span>
              </span>
            </Link>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:justify-center">
            <NavLink to="/" end className={navLinkStyle}>
              <Compass className="h-4 w-4" />
              <span>Discover</span>
            </NavLink>

            <NavLink to="/search" className={navLinkStyle}>
              <Search className="h-4 w-4" />
              <span>Search</span>
            </NavLink>

            {user && (
              <>
                <NavLink to="/my-books" className={navLinkStyle}>
                  <div className="relative flex items-center gap-2">
                    <Bookmark className="h-4 w-4" />
                    <span>My Books</span>
                    {savedCount > 0 && (
                      <span className="ml-1 rounded-full bg-brand-accent px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                        {savedCount}
                      </span>
                    )}
                  </div>
                </NavLink>

                <NavLink to="/ai-recommendations" className={navLinkStyle}>
                  <Sparkles className="h-4 w-4" />
                  <span>AI Recs</span>
                </NavLink>
              </>
            )}
          </nav>

          <div className="flex items-center justify-center gap-2 sm:gap-3 lg:justify-end">
            {user ? (
              <>
                <span className="font-serif text-[1rem] text-brand-700 sm:text-[1.2rem]">
                  Welcome, <span className="font-semibold text-brand-800">{user.username}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 font-serif text-[0.98rem] text-brand-700 transition-colors hover:bg-white hover:text-brand-800 sm:text-[1.15rem]"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-3 py-2 font-serif text-[0.98rem] text-brand-700 transition-colors hover:bg-white hover:text-brand-800 sm:text-[1.15rem]"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-brand-accent px-3 py-2 font-serif text-[0.98rem] text-white shadow-sm transition-colors hover:bg-brand-600 sm:text-[1.15rem]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}