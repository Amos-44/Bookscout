import React, { createContext, useContext, useState } from 'react';

const BookContext = createContext();

export function BookProvider({ children }) {
  // Saved books list where each entry holds { ...book, status, personalRating }
  const [savedBooks, setSavedBooks] = useState([]);

  // Check if book exists in saved list
  const isBookSaved = (id) => savedBooks.some((book) => book.id === id);

  // Get a specific saved book
  const getSavedBook = (id) => savedBooks.find((book) => book.id === id);

  // Add book or update existing book status / rating
  const addBook = (book, status = 'want-to-read', personalRating = null) => {
    setSavedBooks((prev) => {
      const existing = prev.find((item) => item.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.id === book.id
            ? {
                ...item,
                status,
                // Preserve existing rating if changing to read without specifying a new rating
                personalRating:
                  personalRating !== undefined ? personalRating : item.personalRating ?? null
              }
            : item
        );
      }
      return [
        ...prev,
        {
          id: book.id,
          title: book.title,
          authors: Array.isArray(book.authors) ? book.authors : [book.authors].filter(Boolean),
          coverImage: book.coverImage || null,
          rating: book.rating || null, // API/Community rating
          publishedDate: book.publishedDate || 'N/A',
          publisher: book.publisher || 'N/A',
          description: book.description || '',
          categories: book.categories || [],
          status,
          personalRating: status === 'read' ? personalRating : null
        }
      ];
    });
  };

  // Update status (Preserves rating in state!)
  const updateBookStatus = (id, newStatus) => {
    setSavedBooks((prev) =>
      prev.map((book) => {
        if (book.id === id) {
          return {
            ...book,
            status: newStatus
          };
        }
        return book;
      })
    );
  };

  // Update or clear rating
  const updatePersonalRating = (id, rating) => {
    setSavedBooks((prev) =>
      prev.map((book) => {
        if (book.id === id) {
          return {
            ...book,
            personalRating: rating // 1-5 or null to reset
          };
        }
        return book;
      })
    );
  };

  // Remove book from reading list entirely
  const removeBook = (id) => {
    setSavedBooks((prev) => prev.filter((book) => book.id !== id));
  };

  return (
    <BookContext.Provider
      value={{
        savedBooks,
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

export const useBookContext = () => useContext(BookContext);