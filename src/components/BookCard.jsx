import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Star, BookOpen } from 'lucide-react';
import { useBookContext } from '../context/BookContext';
import { useAuth } from '../context/AuthContext';

export default function BookCard({ book }) {
  const { isBookSaved, addBook, removeBook } = useBookContext();
  const { token } = useAuth();
  const navigate = useNavigate();
  const isSaved = isBookSaved(book.id);

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token) {
      window.alert('Please log in first to add books to your library.');
      navigate('/login');
      return;
    }
    if (isSaved) removeBook(book.id);
    else addBook(book);
  };

  return (
    <div className="group relative card flex flex-col">
      <div>
        <div className="relative aspect-[2/3] w-full bg-stone-100 overflow-hidden flex items-center justify-center">
          {book.coverImage ? (
            <img
              src={book.coverImage}
              alt={`Cover image for ${book.title}`}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-stone-400 p-4 text-center">
              <BookOpen className="w-12 h-12 mb-2 stroke-[1.5]" />
              <span className="text-xs font-medium">No Cover Available</span>
            </div>
          )}

          <button
            onClick={handleBookmarkClick}
            aria-label={isSaved ? 'Remove from my books' : 'Save to my books'}
            className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-2 sm:p-2.5 rounded-full shadow-md backdrop-blur-md transition-all duration-200 ${
              isSaved
                ? 'bg-brand-accent text-white scale-105'
                : 'bg-white/80 text-stone-600 hover:bg-white hover:text-brand-accent'
            }`}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
        </div>

        <div className="p-3 sm:p-4">
          {book.categories && book.categories.length > 0 && (
            <span className="inline-block px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-stone-500 bg-stone-100 rounded-md mb-2">
              {book.categories[0]}
            </span>
          )}

          <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 leading-snug line-clamp-2 group-hover:text-brand-accent transition-colors">
            <Link to={`/books/${book.id}`}>{book.title}</Link>
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 mt-1 line-clamp-1 font-medium">
            {book.authors ? book.authors.join(', ') : 'Unknown Author'}
          </p>
        </div>
      </div>

      <div className="p-3 sm:p-4 pt-0 mt-auto border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
        <div className="flex items-center space-x-1">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="font-semibold text-stone-700">{book.rating || 'N/A'}</span>
        </div>
        <span>{book.publishedDate !== 'N/A' ? `Pub: ${book.publishedDate}` : ''}</span>
      </div>
    </div>
  );
}
