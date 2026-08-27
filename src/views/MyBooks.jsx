import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, BookOpen, Trash2, CheckCircle2, Clock3, Sparkles } from 'lucide-react';
import { useBookContext } from '../context/BookContext';
import StarRating from '../components/StarRating';

const tabConfig = [
  { id: 'all', label: 'All' },
  { id: 'want-to-read', label: 'Want to Read' },
  { id: 'reading', label: 'Reading' },
  { id: 'read', label: 'Read' }
];

export default function MyBooks() {
  const { savedBooks, updateBookStatus, updatePersonalRating, removeBook } = useBookContext();
  const [activeTab, setActiveTab] = useState('all');

  const wantToReadCount = savedBooks.filter((b) => b.status === 'want-to-read').length;
  const readingCount = savedBooks.filter((b) => b.status === 'reading').length;
  const readBooks = savedBooks.filter((b) => b.status === 'read');
  const readCount = readBooks.length;

  // Calculate Average Rating ONLY for books with status === 'read' and personalRating !== null
  const ratedBooks = readBooks.filter((b) => typeof b.personalRating === 'number');
  const averageRating =
    ratedBooks.length > 0
      ? (ratedBooks.reduce((sum, b) => sum + b.personalRating, 0) / ratedBooks.length).toFixed(1)
      : null;

  // Filter books for the selected tab
  const filteredBooks = savedBooks.filter((b) => {
    if (activeTab === 'all') return true;
    return b.status === activeTab;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-[2rem] border border-[#d7bca4]/80 bg-[radial-gradient(circle_at_top_left,rgba(124,74,49,0.18),transparent_30%),linear-gradient(135deg,#e9d5c2_0%,#f6efe8_100%)] p-6 shadow-soft sm:p-8">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#857967]">My library</p>
            <h1 className="font-serif text-3xl font-bold text-[#2c221e] sm:text-4xl">Your reading life</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#d9b15c]/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-amber-700">
            <Sparkles className="h-3.5 w-3.5" />
            Curated shelf
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-[1.5rem] border border-[#d9c1a9] bg-[#f9f3ee]/90 p-4 shadow-sm">
            <div className="text-2xl font-bold text-[#2c221e]">{savedBooks.length}</div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-500">Saved</div>
          </div>
          <div className="rounded-[1.5rem] border border-amber-300 bg-amber-500/15 p-4 shadow-sm">
            <div className="text-2xl font-bold text-amber-700">{wantToReadCount}</div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-700">Want to Read</div>
          </div>
          <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-500/10 p-4 shadow-sm">
            <div className="text-2xl font-bold text-emerald-700">{readingCount}</div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-emerald-700">Reading</div>
          </div>
          <div className="rounded-[1.5rem] border border-indigo-200 bg-indigo-500/10 p-4 shadow-sm">
            <div className="text-2xl font-bold text-indigo-700">{readCount}</div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-indigo-700">Read</div>
          </div>
          <div className="rounded-[1.5rem] border border-violet-200 bg-violet-500/10 p-4 shadow-sm">
            <div className="text-2xl font-bold text-violet-700">{averageRating ? `${averageRating}★` : '—'}</div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-violet-700">Avg Rating</div>
          </div>
        </div>
      </div>

      <div className="mb-8 rounded-[1.5rem] border border-[#d9c8b6]/80 bg-[#f7f1ea]/90 p-2 shadow-soft backdrop-blur-sm">
        <div className="flex flex-wrap gap-2">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-[#2c221e] text-white shadow-md'
                  : 'border border-stone-200 bg-white text-stone-600 hover:border-[#d8c7b1] hover:bg-[#faf1eb] hover:text-[#2c221e]'
              }`}
            >
              {tab.label}{' '}
              {tab.id === 'all' ? `(${savedBooks.length})` : tab.id === 'want-to-read' ? `(${wantToReadCount})` : tab.id === 'reading' ? `(${readingCount})` : `(${readCount})`}
            </button>
          ))}
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-[#d7c0ac] bg-[#f6efe7]/90 py-16 text-center shadow-sm">
          <BookOpen className="mx-auto mb-3 h-12 w-12 text-stone-300" />
          <p className="text-sm text-stone-500">No books found in this section.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredBooks.map((book) => {
            const detailBookId = book.openlibrary_id || book.id;
            const statusStyles = {
              'want-to-read': 'border-amber-200 bg-amber-50 text-amber-700',
              reading: 'border-emerald-200 bg-emerald-50 text-emerald-700',
              read: 'border-indigo-200 bg-indigo-50 text-indigo-700'
            };

            return (
              <div
                key={book.id}
                className="group relative flex flex-col overflow-hidden rounded-[1.8rem] border border-[#d9c4ae] bg-[linear-gradient(180deg,#f8f1ea_0%,#efe3d6_100%)] p-4 shadow-[0_18px_50px_rgba(63,46,38,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(63,46,38,0.16)]"
              >
                <div className="absolute inset-x-0 top-0 h-20 bg-[radial-gradient(circle_at_top_left,rgba(214,120,90,0.18),transparent_50%)]" />

                <div className="relative flex gap-4">
                  <Link to={`/books/${detailBookId}`} className="block h-28 w-20 shrink-0 overflow-hidden rounded-[1.2rem] border border-stone-200 bg-stone-100 shadow-sm transition-transform duration-300 group-hover:scale-[1.02]">
                    {book.coverImage ? (
                      <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-stone-400">
                        <BookOpen className="h-6 w-6" />
                      </div>
                    )}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className={`rounded-full border px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] ${statusStyles[book.status] || 'border-stone-200 bg-stone-100 text-stone-600'}`}>
                        {book.status === 'want-to-read' ? 'Want to Read' : book.status === 'reading' ? 'Reading' : 'Read'}
                      </span>
                    </div>

                    <Link to={`/books/${detailBookId}`} className="block font-serif text-[1.7rem] font-bold leading-tight text-[#2c221e] transition-colors hover:text-[#6d5f54]">
                      {book.title}
                    </Link>
                    <p className="mt-1 text-xs text-stone-500">
                      {Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}
                    </p>

                    {book.status === 'read' ? (
                      <div className="mt-3 space-y-2">
                        <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-500">Your rating</div>
                        <StarRating size="sm" rating={book.personalRating} onRate={(rating) => updatePersonalRating(book.id, rating)} />
                        {!book.personalRating && <div className="text-[11px] italic text-stone-400">Not rated yet</div>}
                      </div>
                    ) : (
                      book.rating && (
                        <div className="mt-3 flex items-center gap-1 text-[11px] text-stone-500">
                          <span>Community:</span>
                          <span className="font-semibold text-stone-700">★ {book.rating}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="relative mt-4 rounded-[1.2rem] border border-[#dcc6b0] bg-[#f9f5f1]/90 p-3 shadow-inner shadow-[#e5d5c7]">
                  <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-500">
                    Update status
                  </label>
                  <select
                    value={book.status}
                    onChange={(e) => updateBookStatus(book.id, e.target.value)}
                    className="w-full rounded-xl border border-stone-200 bg-stone-50 px-2.5 py-2 text-xs font-medium text-stone-700 transition-colors focus:border-[#d6785a] focus:outline-none focus:ring-2 focus:ring-[#d6785a]/20"
                  >
                    <option value="want-to-read">Want to Read</option>
                    <option value="reading">Reading</option>
                    <option value="read">Read</option>
                  </select>
                </div>

                <div className="relative mt-3 flex items-center justify-between gap-3 border-t border-stone-200/80 pt-3 text-xs text-stone-400">
                  <Link to={`/books/${detailBookId}`} className="font-semibold text-[#6d5f54] transition-colors hover:text-[#2c221e] hover:underline">
                    View details
                  </Link>
                  <button
                    onClick={() => removeBook(book.id)}
                    className="rounded-full p-1.5 text-stone-400 transition-all duration-200 hover:bg-rose-50 hover:text-rose-600"
                    title="Remove book"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}