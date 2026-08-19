import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = 'Error',
  message = 'Something went wrong. Please try again.',
  onRetry
}) {
  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-amber-50/50 border border-amber-200 rounded-2xl text-center shadow-sm">
      <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="font-serif text-xl font-bold text-stone-900 mb-2">{title}</h3>
      <p className="text-sm text-stone-600 mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-800 hover:bg-stone-900 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
