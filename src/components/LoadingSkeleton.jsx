import React from 'react';

export default function LoadingSkeleton({ count = 10 }) {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 my-8">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-stone-200/80 rounded-2xl overflow-hidden shadow-sm animate-pulse flex flex-col"
        >
          <div>
            <div className="w-full bg-stone-200 aspect-[3/4] max-h-80" />
            <div className="p-3 sm:p-4 space-y-2">
              <div className="h-3 bg-stone-200 rounded w-1/3" />
              <div className="h-4 bg-stone-200 rounded w-5/6" />
              <div className="h-3 bg-stone-200 rounded w-1/2" />
            </div>
          </div>
          <div className="p-3 sm:p-4 pt-0 border-t border-stone-100 flex justify-between">
            <div className="h-3 bg-stone-200 rounded w-1/4" />
            <div className="h-3 bg-stone-200 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
