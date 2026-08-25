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

export default function App() {
  return (
    <AuthProvider>
      <BookProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/books/:bookId" element={<BookDetails />} />
                <Route path="/my-books" element={<MyBooks />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <footer className="bg-stone-900 text-stone-400 py-8 text-center text-xs border-t border-stone-800">
              <p>BookScout © 2026 Powered by Open Library API.</p>
            </footer>
          </div>
        </Router>
      </BookProvider>
    </AuthProvider>
  );
}