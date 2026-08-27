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
    `flex items-center space-x-2 text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'text-brand-accent border-b-2 border-brand-accent pb-1'
        : 'text-stone-600 hover:text-stone-900'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-[#857967]/90 backdrop-blur-md border-b border-stone-200/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-brand-800 flex items-center justify-center text-stone-100 shadow-md group-hover:bg-brand-accent transition-colors">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <span className="font-serif text-lg sm:text-2xl font-bold tracking-tight text-brand-800">
            Book<span className="text-brand-accent">Scout</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-4 sm:space-x-8 overflow-x-auto">
          <NavLink to="/" end className={navLinkStyle}>
            <Compass className="w-4 h-4" />
            <span>Discover</span>
          </NavLink>

          <NavLink to="/search" className={navLinkStyle}>
            <Search className="w-4 h-4" />
            <span>Search</span>
          </NavLink>

          {user && (
            <>
              <NavLink to="/my-books" className={navLinkStyle}>
                <div className="relative flex items-center space-x-2">
                  <Bookmark className="w-4 h-4" />
                  <span>My Books</span>
                  {savedCount > 0 && (
                    <span className="ml-1.5 px-2 py-0.5 text-xs font-bold rounded-full bg-brand-accent text-white shadow-sm">
                      {savedCount}
                    </span>
                  )}
                </div>
              </NavLink>

              <NavLink to="/ai-recommendations" className={navLinkStyle}>
                <Sparkles className="w-4 h-4" />
                <span>AI Recs</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-stone-700">
                Welcome, <span className="text-brand-800 font-semibold">{user.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors duration-150"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors duration-150"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-brand-accent hover:bg-brand-600 rounded-lg transition-colors duration-150 shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}