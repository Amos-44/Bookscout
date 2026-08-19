import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, BookOpen, Trash2 } from 'lucide-react';
import { useBookContext } from '../context/BookContext';
import StarRating from '../components/StarRating';

export default function MyBooks() {
  const { savedBooks, updateBookStatus, updatePersonalRating, removeBook } = useBookContext();
  const [activeTab, setActiveTab] = useState('all');

  // Counts & Stats
  const wantToReadCount = savedBooks.filter((b) => b.status === 'want-to-read').length;
  const readingCount = savedBooks.filter((b) => b.status === 'reading').length;
  const readBooks = savedBooks.filter((b) => b.status === 'read');
  const readCount = readBooks.length;

  // Calculate Average Rating ONLY for books with status === 'read' and personalRating !== null
  const ratedBooks = readBooks.filter((b) => typeof b.personalRating === 'number');
  const averageRating =
    ratedBooks.length > 0
      ? (
          ratedBooks.reduce((sum, b) => sum + b.personalRating, 0) / ratedBooks.length
        ).toFixed(1)
      : null;

  // Filter books for the selected tab
  const filteredBooks = savedBooks.filter((b) => {
    if (activeTab === 'all') return true;
    return b.status === activeTab;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-[#d5c9b7]/90">
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mb-8">
        My Library
      </h1>

      {/* Reading Summary Header */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 bg-amber-50/50 border border-amber-200/60 rounded-2xl p-6 mb-8 text-stone-800">
        <div>
          <div className="text-2xl font-serif font-bold">{savedBooks.length}</div>
          <div className="text-xs text-stone-500 font-medium uppercase tracking-wider">Saved</div>
        </div>
        <div>
          <div className="text-2xl font-serif font-bold text-amber-900">{wantToReadCount}</div>
          <div className="text-xs text-stone-500 font-medium uppercase tracking-wider">Want to Read</div>
        </div>
        <div>
          <div className="text-2xl font-serif font-bold text-blue-900">{readingCount}</div>
          <div className="text-xs text-stone-500 font-medium uppercase tracking-wider">Reading</div>
        </div>
        <div>
          <div className="text-2xl font-serif font-bold text-emerald-900">{readCount}</div>
          <div className="text-xs text-stone-500 font-medium uppercase tracking-wider">Read</div>
        </div>
        <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-amber-200/60 pt-4 sm:pt-0 sm:pl-4">
          <div className="text-2xl font-serif font-bold text-amber-700 flex items-center gap-1">
            {averageRating ? `${averageRating} ★` : '—'}
          </div>
          <div className="text-xs text-stone-500 font-medium uppercase tracking-wider">Avg Rating</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-stone-200 mb-8 overflow-x-auto">
        {[
          { id: 'all', label: `All (${savedBooks.length})` },
          { id: 'want-to-read', label: `Want to Read (${wantToReadCount})` },
          { id: 'reading', label: `Currently Reading (${readingCount})` },
          { id: 'read', label: `Read (${readCount})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'border-amber-800 text-amber-900'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Book List Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-16 bg-white border border-stone-200/80 rounded-2xl">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <p className="text-stone-500 text-sm">No books found in this section.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div
                key={book.id}
                className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col"
              >
              <div className="flex gap-4">
                <Link to={`/book/${book.id}`} className="w-20 h-28 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0 border border-stone-200 block">
                  {book.coverImage ? (
                    <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                      <BookOpen className="w-6 h-6" />
                    </div>
                  )}
                </Link>

                <div className="flex-1 min-w-0">
                  <Link to={`/book/${book.id}`} className="font-serif font-bold text-stone-900 line-clamp-1 hover:underline">
                    {book.title}
                  </Link>
                  <p className="text-xs text-stone-500 mb-2 truncate">
                    {Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}
                  </p>

                  {/* Status Selector */}
                  <select
                    value={book.status}
                    onChange={(e) => updateBookStatus(book.id, e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 text-xs rounded-md px-2 py-1 text-stone-700 font-medium mb-2 focus:outline-none"
                  >
                    <option value="want-to-read">Want to Read</option>
                    <option value="reading font-medium">Currently Reading</option>
                    <option value="read">Status: ✓ Read</option>
                  </select>

                  {/* Rating Block (Displayed ONLY for Read Books) */}
                  {book.status === 'read' ? (
                    <div className="mt-2 space-y-1">
                      <div className="text-[11px] font-semibold text-stone-500">Your Rating:</div>
                      <StarRating
                        size="sm"
                        rating={book.personalRating}
                        onRate={(rating) => updatePersonalRating(book.id, rating)}
                      />
                      {!book.personalRating && (
                        <div className="text-[11px] text-stone-400 italic">Not rated yet</div>
                      )}
                    </div>
                  ) : (
                    book.rating && (
                      <div className="text-[11px] text-stone-400 flex items-center gap-1 mt-1">
                        <span>Community:</span>
                        <span className="font-semibold text-stone-600">★ {book.rating}</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-center text-xs text-stone-400">
                <Link to={`/book/${book.id}`} className="text-amber-800 font-medium hover:underline">
                  View details
                </Link>
                <button
                  onClick={() => removeBook(book.id)}
                  className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                  title="Remove book"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}