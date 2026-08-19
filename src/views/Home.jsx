import React, { useState, useEffect } from 'react';
import { getTrendingBooks, fetchBooksByCategory } from '../services/bookApi';
import BookCard from '../components/BookCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import { Loader2 } from 'lucide-react';
import CategoryFilter from '../components/CategoryFilter';

export default function Discover() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [activeCategory, setActiveCategory] = useState('fiction');
  const controllerRef = React.useRef(null);

  const PAGE_SIZE = 10;

  useEffect(() => {
    // Cancel any prior controller and create a new one for this category load
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    async function loadCategoryBooks() {
      setLoading(true);
      setError(null);
      setHasMore(true);

      try {
        const data = await fetchBooksByCategory(activeCategory, 0, PAGE_SIZE, controller.signal);
        setBooks(data);
        if (data.length < PAGE_SIZE) setHasMore(false);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message || 'Failed to load books.');
        }
      } finally {
        setLoading(false);
      }
    }

    loadCategoryBooks();

    return () => controller.abort();
  }, []);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    // Use current array length as offset for the next batch
    const currentOffset = books.length;

    try {
      // Parameters: offset (books.length), limit (12) — respect active category
      const newBooks = await fetchBooksByCategory(activeCategory, currentOffset, PAGE_SIZE);
      
      if (newBooks.length === 0) {
        setHasMore(false);
      } else {
        if (newBooks.length < PAGE_SIZE) setHasMore(false);
        
        // Append new books to existing list without duplicates
        setBooks((prevBooks) => {
          const existingIds = new Set(prevBooks.map((b) => b.id));
          const uniqueNewBooks = newBooks.filter((b) => !existingIds.has(b.id));
          return [...prevBooks, ...uniqueNewBooks];
        });
      }
    } catch (err) {
      console.error('Failed to load more books:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSelectCategory = (catId) => {
    if (catId === activeCategory) return;
    setActiveCategory(catId);
    // trigger reload via effect by calling fetch directly for immediate UX
    (async () => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBooksByCategory(catId, 0, PAGE_SIZE, controller.signal);
        setBooks(data);
        setHasMore(data.length >= PAGE_SIZE);
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message || 'Failed to load books.');
      } finally {
        setLoading(false);
      }
    })();
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <LoadingSkeleton count={8} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ErrorState message={error} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-[#d5c9b7]/90">
      <div className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-2">
          Discover Books
        </h1>
        <p className="text-stone-600 text-sm sm:text-base">
          Explore trending titles and popular reads across Open Library.
        </p>
      </div>

      <CategoryFilter activeCategory={activeCategory} onSelectCategory={handleSelectCategory} />


      {/* Book Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="inline-flex items-center space-x-2 bg-stone-900 text-white hover:bg-stone-800 px-6 py-3 rounded-xl font-medium text-sm transition-all shadow-sm disabled:opacity-50"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading more books...</span>
              </>
            ) : (
              <span>Load More Books</span>
            )}
          </button>
        </div>
      )}
    </div>
  );
}