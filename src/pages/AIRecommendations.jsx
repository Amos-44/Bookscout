import React, { useState } from 'react';
import ReadingDNA from '../components/ReadingDNA';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AIRecommendations() {
  const [prompt, setPrompt] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      setResults(data.recommendations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <ReadingDNA />

      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-2xl font-serif font-bold text-brand-800 mb-4">
          ✨ AI Book Finder
        </h2>

        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="e.g., Fast-paced thriller set in Tokyo"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-accent"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-brand-accent text-white rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Get Recs'}
          </button>
        </form>

        <div className="space-y-4">
          {results.map((b, i) => (
            <div key={i} className="border border-stone-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-brand-800">{b.title}</h3>
                <span className="text-sm font-bold text-brand-accent bg-brand-50 px-2 py-1 rounded">
                  {b.match_percentage}% Match
                </span>
              </div>
              <p className="text-stone-600 text-sm">By {b.author}</p>
              <p className="text-stone-500 text-sm mt-2">{b.reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}