import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookProvider } from './context/BookContext';
import Navbar from './components/Navbar';
import Home from './views/Home';
import SearchResults from './views/SearchResults';
import BookDetails from './views/BookDetails';
import MyBooks from './views/MyBooks';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AIRecommendations from './pages/AIRecommendations';

export default function App() {
  const [pointer, setPointer] = React.useState({ x: 50, y: 50 });

  return (
    <AuthProvider>
      <BookProvider>
        <Router>
          <div
            className="page-shell flex min-h-screen flex-col text-[#2C221E] antialiased"
            onMouseMove={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              const x = ((event.clientX - rect.left) / rect.width) * 100;
              const y = ((event.clientY - rect.top) / rect.height) * 100;
              setPointer({ x, y });
            }}
            onMouseLeave={() => setPointer({ x: 50, y: 50 })}
          >
            <div
              className="page-glow pointer-events-none fixed inset-0"
              style={{
                background: `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgba(154, 93, 67, 0.16), rgba(154, 93, 67, 0.06) 20%, transparent 45%)`
              }}
            />
            <div className="relative flex flex-1 flex-col">
              <Navbar />
              <main className="relative flex-1 overflow-hidden">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/books/:bookId" element={<BookDetails />} />
                  <Route path="/my-books" element={<MyBooks />} />
                  <Route path="/ai-recommendations" element={<AIRecommendations />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="*" element={<Home />} />
                </Routes>
              </main>
            </div>
            <footer className="mt-auto border-t border-stone-800 bg-[#1d1917] text-stone-300">
              <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-8 text-center text-xs sm:flex-row sm:text-left">
                <div>
                  <span className="font-serif text-base text-stone-100">BookScout</span>
                  <span className="ml-2 text-stone-400">© 2026</span>
                </div>
                <p className="text-stone-400">Powered by Open Library API • Discover smarter, read deeper</p>
              </div>
            </footer>
          </div>
        </Router>
      </BookProvider>
    </AuthProvider>
  );
}