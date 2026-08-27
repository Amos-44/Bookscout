import React, { useState, useEffect } from 'react';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function ReadingDNA() {
  const [dna, setDna] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_URL}/api/reading-dna`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => res.json())
      .then((data) => { setDna(data.traits || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse bg-white rounded-lg shadow-md p-6">
        <div className="h-6 bg-stone-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-stone-200 rounded w-full"></div>
          <div className="h-4 bg-stone-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-brand-800 mb-4">🧬 Your Reading DNA</h3>
      {dna.length === 0 ? (
        <p className="text-stone-500 text-sm">Add rated books to reveal your DNA profile.</p>
      ) : (
        dna.map((t, i) => (
          <div key={i} className="mb-3">
            <div className="flex justify-between text-sm mb-1 font-medium">
              <span>{t.name}</span>
              <span>{t.percentage}%</span>
            </div>
            <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
              <div className="bg-brand-accent h-full rounded-full transition-all duration-500" style={{ width: `${t.percentage}%` }} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}