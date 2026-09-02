import React from 'react';
import BookCard from './BookCard';

export default function BookGrid({ books }) {
  if (!books || books.length === 0) return null;

  return (
    <div className="my-8 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {books.map(book => <BookCard key={book.id} book={book} />)}
    </div>
  );
}
