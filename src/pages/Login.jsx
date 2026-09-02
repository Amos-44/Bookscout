import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, ArrowRight, BookOpenText, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      login(data.access_token, data.user);
      navigate('/'); // Redirect to Home / My Books
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid w-full overflow-hidden rounded-[2rem] border border-stone-200/80 bg-white/80 shadow-card backdrop-blur-sm lg:grid-cols-2">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#2c221e] via-[#857967] to-[#d6785a] p-8 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.38),transparent_28%)]" />
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-white/90">
              <Sparkles className="h-3.5 w-3.5" />
              BookScout reading club
            </div>
            <h2 className="font-serif text-4xl font-bold leading-tight">Turn every shelf into a story worth telling.</h2>
          </div>

          <div className="relative z-10 rounded-[1.6rem] border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <BookOpenText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.12em] text-white/70">Reader note</p>
                <p className="font-serif text-xl text-white">"A library is a house full of dreams."</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mx-auto max-w-md">
            <div className="mb-8 text-center lg:text-left">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#857967]">Welcome back</p>
              <h1 className="font-serif text-3xl font-bold text-[#2c221e]">Log in to BookScout</h1>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
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
                  autoComplete="current-password"
                  className="w-full rounded-2xl border border-stone-200 bg-[#faf8f5] px-4 py-3 text-stone-800 placeholder:text-stone-400 focus:border-[#d6785a] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#d6785a]/10"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                className="btn-primary w-full gap-2 px-5 py-3 text-base disabled:cursor-wait disabled:opacity-80"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Log In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              {loading && (
                <p className="flex items-center justify-center gap-2 text-center text-xs font-medium text-stone-500" role="status">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#9b5d43]" />
                  Checking your account...
                </p>
              )}
            </form>

            <p className="mt-6 text-center text-sm text-stone-600">
              Don’t have an account?{' '}
              <Link to="/signup" className="font-semibold text-[#2c221e] underline-offset-4 hover:underline">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}