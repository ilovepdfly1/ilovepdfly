
import React, { useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isUpgradeFlow = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.has('plan');
  }, [location.search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    setError('');
    setIsLoading(true);
    try {
      await signup(username, password);
      const searchParams = new URLSearchParams(location.search);
      const plan = searchParams.get('plan');
      navigate(plan ? `/payment/${plan}` : '/');
    } catch (err: any) {
      setError(err.message || 'Failed to create an account. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            {isUpgradeFlow ? 'Upgrade to Premium' : 'Create a new account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {isUpgradeFlow ? 'Create an account to continue with your purchase.' : 'Or'}{' '}
            <Link to={isUpgradeFlow ? `/login${location.search}` : '/login'} className="font-medium text-brand-red hover:text-brand-red-dark">
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-8 rounded-lg shadow-lg" onSubmit={handleSubmit}>
          {error && <p className="text-center text-sm text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-md">{error}</p>}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800 focus:z-10 focus:border-brand-red focus:outline-none focus:ring-brand-red sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <label htmlFor="password"className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800 focus:z-10 focus:border-brand-red focus:outline-none focus:ring-brand-red sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-brand-red py-2 px-4 text-sm font-medium text-white hover:bg-brand-red-dark focus:outline-none focus:ring-2 focus:ring-brand-red-dark focus:ring-offset-2 disabled:bg-red-300 dark:disabled:bg-red-800 transition-colors"
            >
              {isLoading ? 'Creating account...' : isUpgradeFlow ? 'Create Account & Continue' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;