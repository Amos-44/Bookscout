import React, { useState, useRef } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  initialQuery = '',
  onSearch,
  placeholder = 'Search by title, author or keyword...'
}) {
  const [query, setQuery] = useState(initialQuery);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setError('');
      onSearch(query.trim());
    } else {
      setError('Please enter a search term.');
      // focus the input for convenience
      inputRef.current?.focus();
    }
  };

  const handleClear = () => {
    setQuery('');
    // focus the input after clearing for convenience
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-2xl w-full mx-auto">
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); if (error) setError(''); }}
          placeholder={placeholder}
          aria-label="Search books"
          aria-invalid={Boolean(error)}
          className="w-full pl-12 pr-32 py-4 text-base bg-white border border-stone-300 rounded-xl shadow-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-brand-accent/40 focus:border-brand-accent transition-all"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />

        {query && (
          <button
            type="button"
              onClick={handleClear}
              className="absolute right-28 text-stone-400 hover:text-stone-600 p-1"
            aria-label="Clear search input"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-brand-800 hover:bg-stone-900 text-white font-medium text-sm rounded-lg transition-colors shadow-sm z-10"
        >
          Search
        </button>
      </div>
      {error && (
        <div className="mt-2 text-xs text-rose-600" role="alert" aria-live="assertive">
          {error}
        </div>
      )}
    </form>
  );
}
