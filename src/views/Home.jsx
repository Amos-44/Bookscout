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
  const [pointer, setPointer] = useState({ x: 50, y: 50 });
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section
        className="hero-shell relative mb-8 overflow-hidden rounded-[2.2rem] border border-[#d4b79b] p-6 sm:p-8 lg:p-10"
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const x = ((event.clientX - rect.left) / rect.width) * 100;
          const y = ((event.clientY - rect.top) / rect.height) * 100;
          setPointer({ x, y });
        }}
        onMouseLeave={() => setPointer({ x: 50, y: 50 })}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-100"
          style={{
            background: `radial-gradient(circle at ${pointer.x}% ${pointer.y}%, rgba(148, 82, 53, 0.22), rgba(148, 82, 53, 0.08) 18%, transparent 48%)`
          }}
        />
        <div className="ambient-orb ambient-orb-one" />
        <div className="ambient-orb ambient-orb-two" />

        <div className="relative flex min-h-[260px] items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold leading-[0.9] text-[#2a201c] sm:text-5xl lg:text-6xl">
              Find your <span className="gradient-text">next favorite</span> book.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-700 sm:text-base">
              Discover books that match your mood, your shelves and the kind of reading life you want to keep building.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-medium text-stone-600">
              <span className="rounded-full border border-[#caa887] bg-[#f9f2eb]/80 px-2.5 py-1.5">Browse picks</span>
              <span className="rounded-full border border-[#caa887] bg-[#f9f2eb]/80 px-2.5 py-1.5">Top rated</span>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-xs font-medium text-stone-600">
              <span className="rounded-full border border-[#caa887] bg-[#f9f2eb]/80 px-2.5 py-1.5">Literary fiction</span>
              <span className="rounded-full border border-[#caa887] bg-[#f9f2eb]/80 px-2.5 py-1.5">Classic romance</span>
              <span className="rounded-full border border-[#caa887] bg-[#f9f2eb]/80 px-2.5 py-1.5">Mystery picks</span>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-6">
        <CategoryFilter activeCategory={activeCategory} onSelectCategory={handleSelectCategory} />
      </div>

      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7b665b]">Trending now</p>
          <h2 className="font-serif text-3xl font-bold text-[#2c221e]">Fresh on the shelf</h2>
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5">
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
            className="glow-button inline-flex items-center space-x-2 rounded-xl bg-[#2c221e] px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loadingMore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
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