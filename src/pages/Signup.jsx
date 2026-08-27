import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowRight, BookHeart } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

// Pull the dynamic API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Automatically log the user in after registration
      login(data.access_token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white/80 shadow-card backdrop-blur-sm lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#3d312b] via-[#857967] to-[#f3c18d] p-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.28),transparent_30%)]" />
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/90">
              <Sparkles className="h-3.5 w-3.5" />
              Join the reading movement
            </div>
            <h2 className="font-serif text-4xl font-bold leading-tight">Build a shelf that reflects who you are.</h2>
          </div>

          <div className="relative z-10 rounded-[1.6rem] border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <BookHeart className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-white/70">Your library</p>
                <p className="font-serif text-xl text-white">Curated, thoughtful, yours.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#857967]">Start here</p>
              <h1 className="font-serif text-3xl font-bold text-[#2c221e]">Create your account</h1>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="mb-2 block text-sm font-medium text-stone-700">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                  className="w-full rounded-2xl border border-stone-200 bg-[#faf8f5] px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:border-[#d6785a] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#d6785a]/10"
                  placeholder="bookishreader"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-stone-700">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-2xl border border-stone-200 bg-[#faf8f5] px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:border-[#d6785a] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#d6785a]/10"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-medium text-stone-700">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-stone-200 bg-[#faf8f5] px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:border-[#d6785a] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#d6785a]/10"
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" className="btn-primary w-full gap-2 px-5 py-3 text-base">
                Create account
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-stone-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#2c221e] underline-offset-4 hover:underline">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}