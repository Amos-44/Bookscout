import React from 'react';
import BookCard from './BookCard';

export default function BookGrid({ books }) {
  if (!books || books.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 my-8">
      {books.map(book => <BookCard key={book.id} book={book} />)}
    </div>
  );
}
