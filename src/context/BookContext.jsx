import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const BookContext = createContext();

const normalizeStatus = (status) => {
  switch (status) {
    case 'want_to_read':
    case 'want to read':
      return 'want-to-read';
    case 'currently_reading':
    case 'reading':
      return 'reading';
    case 'read':
      return 'read';
    default:
      return 'want-to-read';
  }
};

export function BookProvider({ children }) {
  const [savedBooks, setSavedBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Retrieve token and API URL from AuthContext
  const { token, API_URL } = useAuth();

  // 1. FETCH BOOKS FROM BACKEND ON RELOAD
  const fetchBooks = async () => {
    const activeToken = token || localStorage.getItem('token');
    
    if (!activeToken) {
      setSavedBooks([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/books`, {
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load saved books');
      }

      const data = await response.json();
      
      // Normalize API response fields to match UI expectations
      const formattedBooks = (data.books || []).map((b) => ({
        id: b.id,
        openlibrary_id: b.openlibrary_id,
        title: b.title,
        authors: b.author ? [b.author] : [],
        coverImage: b.cover_url,
        status: normalizeStatus(b.status),
        personalRating: b.rating
      }));

      setSavedBooks(formattedBooks);
      setError(null);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch books whenever token state updates or page refreshes
  useEffect(() => {
    fetchBooks();
  }, [token]);

  // Check if book exists in saved list by ID or OpenLibrary ID
  const isBookSaved = (id) => savedBooks.some((book) => book.id === id || book.openlibrary_id === id);

  // Get a specific saved book
  const getSavedBook = (id) => savedBooks.find((book) => book.id === id || book.openlibrary_id === id);

  // 2. ADD BOOK TO BACKEND DATABASE
  const addBook = async (book, status = 'want-to-read', personalRating = null) => {
    const activeToken = token || localStorage.getItem('token');
    if (!activeToken) return;

    const normalizedStatus = normalizeStatus(status);

    try {
      const response = await fetch(`${API_URL}/api/books`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          openlibrary_id: String(book.id || book.openlibrary_id),
          title: book.title,
          author: Array.isArray(book.authors) ? book.authors[0] : (book.author || 'Unknown Author'),
          cover_url: book.coverImage || book.cover_url || null,
          status: normalizedStatus,
          rating: personalRating
        })
      });

      if (!response.ok) throw new Error('Failed to save book');

      // Re-fetch books from backend to update state with actual Database ID
      await fetchBooks();
    } catch (err) {
      console.error('Error adding book:', err);
      setError(err.message);
    }
  };

  // 3. UPDATE STATUS IN BACKEND DATABASE
  const updateBookStatus = async (id, newStatus) => {
    const activeToken = token || localStorage.getItem('token');
    const targetBook = savedBooks.find((b) => b.id === id || b.openlibrary_id === id);
    if (!activeToken || !targetBook) return;

    // Optimistic UI update
    setSavedBooks((prev) =>
      prev.map((book) => (book.id === targetBook.id ? { ...book, status: newStatus } : book))
    );

    try {
      const response = await fetch(`${API_URL}/api/books/${targetBook.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');
    } catch (err) {
      console.error('Error updating status:', err);
      // Revert state on failure
      fetchBooks();
    }
  };

  // 4. UPDATE RATING IN BACKEND DATABASE
  const updatePersonalRating = async (id, rating) => {
    const activeToken = token || localStorage.getItem('token');
    const targetBook = savedBooks.find((b) => b.id === id || b.openlibrary_id === id);
    if (!activeToken || !targetBook) return;

    // Optimistic UI update
    setSavedBooks((prev) =>
      prev.map((book) => (book.id === targetBook.id ? { ...book, personalRating: rating } : book))
    );

    try {
      const response = await fetch(`${API_URL}/api/books/${targetBook.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${activeToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating })
      });

      if (!response.ok) throw new Error('Failed to update rating');
    } catch (err) {
      console.error('Error updating rating:', err);
      // Revert state on failure
      fetchBooks();
    }
  };

  // 5. REMOVE BOOK FROM BACKEND DATABASE
  const removeBook = async (id) => {
    const activeToken = token || localStorage.getItem('token');
    const targetBook = savedBooks.find((b) => b.id === id || b.openlibrary_id === id);
    if (!activeToken || !targetBook) return;

    // Optimistic UI update
    setSavedBooks((prev) => prev.filter((book) => book.id !== targetBook.id));

    try {
      const response = await fetch(`${API_URL}/api/books/${targetBook.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${activeToken}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete book');
    } catch (err) {
      console.error('Error removing book:', err);
      // Revert state on failure
      fetchBooks();
    }
  };

  return (
    <BookContext.Provider
      value={{
        savedBooks,
        savedCount: savedBooks.length,
        loading,
        error,
        fetchBooks,
        isBookSaved,
        getSavedBook,
        addBook,
        updateBookStatus,
        updatePersonalRating,
        removeBook
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

export const useBookContext = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBookContext must be used within a BookProvider');
  }
  return context;
};