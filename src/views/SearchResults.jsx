import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import BookGrid from '../components/BookGrid';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { searchBooks } from '../services/bookApi';

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [books, setBooks] = useState([]);
  // Start loading as true if a query exists in the URL to prevent  "No matching books" flash
  const [loading, setLoading] = useState(Boolean(query));
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      setBooks([]);
      return;
    }

    const controller = new AbortController();
    
    async function executeSearch() {
      setLoading(true);
      setError(null);
      try {
        const results = await searchBooks(query, controller.signal);
        setBooks(results);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    executeSearch();
    return () => controller.abort();
  }, [query]);

  const handleSearchSubmit = (newQuery) => {
    if (newQuery !== query) {
      setLoading(true); // Immediately enter loading state on new submit
      setSearchParams({ q: newQuery });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-[#d5c9b7]/90">
      <div className="mb-10 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-6">Search Catalog</h1>
        <SearchBar initialQuery={query} onSearch={handleSearchSubmit} />
      </div>

      {query && (
        <div className="mb-6 border-b border-stone-200 pb-4">
          <p className="text-stone-600 text-sm">
            Showing results for <span className="font-semibold text-stone-900">"{query}"</span>
          </p>
        </div>
      )}

      {/* Render priority: Loading -> Error -> Grid -> Empty */}
      {loading && <LoadingSkeleton count={8} />}
      
      {!loading && error && (
        <ErrorState message={error} onRetry={() => setSearchParams({ q: query })} />
      )}
      
      {!loading && !error && books.length > 0 && (
        <BookGrid books={books} />
      )}
      
      {!loading && !error && query && books.length === 0 && (
        <EmptyState
          title="No Matching Books"
          message={`We couldn't find any books matching "${query}". Try searching by title or author.`}
        />
      )}
    </div>
  );
}