import React from 'react';

const CATEGORIES = [
  { id: 'fiction', label: 'Fiction' },
  { id: 'nonfiction', label: 'Non-Fiction' },
  { id: 'technology', label: 'Technology' },
  { id: 'science', label: 'Science' },
  { id: 'romance', label: 'Romance' },
  { id: 'mystery', label: 'Mystery' },
  { id: 'fantasy', label: 'Fantasy' }
];

export default function CategoryFilter({ activeCategory, onSelectCategory }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 my-6">
      {CATEGORIES.map(cat => {
        const isActive = activeCategory.toLowerCase() === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              isActive
                ? 'bg-brand-800 text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
