import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Bookmark,
  Star,
  Calendar,
  Building,
  BookOpen,
  ExternalLink,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react';
import { getBookDetails } from '../services/bookApi';
import { useBookContext } from '../context/BookContext';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ErrorState from '../components/ErrorState';
import StarRating from '../components/StarRating';

export default function BookDetails() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const { getSavedBook, addBook, updateBookStatus, updatePersonalRating, removeBook } = useBookContext();
  const [book, setBook] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  const controllerRef = React.useRef(null);
  const requestIdRef = React.useRef(0);

  const loadDetails = React.useCallback(async () => {
    // abort previous request if any and mark a new request id
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    requestIdRef.current += 1;
    const thisRequestId = requestIdRef.current;

    setLoading(true);
    setError(null);
    setBook(null);

    try {
      const data = await getBookDetails(bookId, controller.signal);
      // Only update state if this is the latest request
      if (requestIdRef.current === thisRequestId) {
        setBook(data);
        setError(null);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        if (requestIdRef.current === thisRequestId) {
          setError(err.message || 'Failed to load book details.');
        }
      }
    } finally {
      if (requestIdRef.current === thisRequestId) {
        setLoading(false);
      }
    }
  }, [bookId]);

  React.useEffect(() => {
    if (bookId) {
      loadDetails();
    }

    return () => {
      controllerRef.current?.abort();
    };
  }, [bookId, loadDetails]);

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-12"><LoadingSkeleton count={1} /></div>;

  // If we have a book, prefer rendering it even if an earlier error flag lingered.
  if (book) {
    // render the existing UI below by falling through
  } else if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <ErrorState
          title="Error loading book"
          message={error}
          onRetry={() => loadDetails()}
        />
      </div>
    );
  } else {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <ErrorState
          title="Book not found"
          message="We couldn't find that book. It may have been removed or is unavailable."
          onRetry={() => loadDetails()}
        />
      </div>
    );
  }

  const savedRecord = getSavedBook(book.id);
  const saved = Boolean(savedRecord);
  const currentStatus = savedRecord?.status || null;
  const personalRating = savedRecord?.personalRating || null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-sm text-stone-600 hover:text-stone-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to results</span>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-10 shadow-sm">
        <div className="md:col-span-5 flex flex-col items-center">
          <div className="aspect-[2/3] w-full max-w-full sm:max-w-xs bg-stone-100 rounded-xl overflow-hidden shadow-md border border-stone-200">
            {book.coverImage ? (
              <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400">
                <BookOpen className="w-16 h-16" />
              </div>
            )}
          </div>

          {/* Status & Save Control */}
          <div className="w-full max-w-xs mt-6 space-y-3">
            {!saved ? (
              <button
                onClick={() => addBook(book, 'want-to-read')}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                <Bookmark className="w-4 h-4" />
                <span>Add to My Books</span>
              </button>
            ) : (
              <div className="space-y-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Reading Status
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => updateBookStatus(book.id, e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-sm font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-700"
                >
                  <option value="want-to-read">Want to Read</option>
                  <option value="reading">Currently Reading</option>
                  <option value="read">Read</option>
                </select>

                {/* Star Rating Section - Revealed ONLY when status === 'read' */}
                {currentStatus === 'read' && (
                  <div className="pt-3 border-t border-stone-200/80 space-y-2">
                    <div className="text-xs font-semibold text-stone-700">How would you rate this book?</div>
                    <StarRating
                      rating={personalRating}
                      onRate={(rating) => updatePersonalRating(book.id, rating)}
                    />
                    {!personalRating && (
                      <p className="text-xs text-stone-400 italic">Not rated yet</p>
                    )}
                  </div>
                )}

                <button
                  onClick={() => removeBook(book.id)}
                  className="w-full text-xs text-rose-600 hover:text-rose-800 pt-2 text-center underline block"
                >
                  Remove from My Books
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-7 flex flex-col justify-between">
          <div>
            {book.categories && book.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {book.categories.map((cat, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-stone-600 bg-stone-100 rounded-md"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-2">
              {book.title}
            </h1>

            <p className="text-lg font-medium text-stone-600 mb-6">
              By {Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-stone-50 rounded-xl border border-stone-200/60 mb-6 text-xs text-stone-600">
              {/* Community Rating */}
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <div>
                  <div className="font-bold text-stone-800">{book.rating || 'N/A'}</div>
                  <div>Community Rating</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-stone-400" />
                <div>
                  <div className="font-bold text-stone-800">{book.publishedDate}</div>
                  <div>Published</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-stone-400" />
                <div>
                  <div className="font-bold text-stone-800 truncate">{book.publisher}</div>
                  <div>Publisher</div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">Description</h3>
              <p className="text-stone-600 leading-relaxed text-sm whitespace-pre-line">
                {book.description}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>ISBN: {book.isbn || 'Unavailable'}</span>
            {book.externalUrl && (
              <a
                href={book.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center space-x-1 text-amber-800 hover:underline font-medium"
              >
                <span>Open Library Profile</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}