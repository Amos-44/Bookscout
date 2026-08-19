import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search } from 'lucide-react';

export default function EmptyState({
  title = 'No books found',
  message = "We couldn't find matches for your request.",
  actionText,
  actionLink
}) {
  return (
    <div className="max-w-md mx-auto my-16 p-8 text-center">
      <div className="w-16 h-16 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto mb-4">
        <BookOpen className="w-8 h-8" />
      </div>
      <h3 className="font-serif text-2xl font-bold text-stone-800 mb-2">{title}</h3>
      <p className="text-stone-600 mb-6 text-sm leading-relaxed">{message}</p>
      {actionText && actionLink && (
        <Link
          to={actionLink}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-accent hover:bg-amber-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
        >
          <Search className="w-4 h-4" />
          <span>{actionText}</span>
        </Link>
      )}
    </div>
  );
}
