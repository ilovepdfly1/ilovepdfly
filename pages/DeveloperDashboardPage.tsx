import React, { useState, useEffect } from 'react';

const USERS_STORAGE_KEY = 'ilovepdfly_users_v2';
const CORRECT_PASSWORD = 'bishal@@@';

interface UserData {
  password?: string;
  profileImage?: string;
  isPremium?: boolean;
}

interface StoredUsers {
  [username: string]: UserData;
}

const DeveloperDashboardPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [users, setUsers] = useState<StoredUsers>({});

  useEffect(() => {
    if (isAuthenticated) {
      try {
        const storedUsers = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '{}');
        setUsers(storedUsers);
      } catch (e) {
        console.error("Failed to parse users from storage", e);
        setError("Could not load user data.");
      }
    }
  }, [isAuthenticated]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password.');
    }
  };
  
  const handleTogglePremium = (username: string) => {
    const updatedUsers = { ...users };
    if (updatedUsers[username]) {
      updatedUsers[username].isPremium = !updatedUsers[username].isPremium;
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      
      // Also update session storage if the modified user is the one currently logged in
      try {
        const sessionKey = 'ilovepdfly_session_v2';
        const currentSession = JSON.parse(localStorage.getItem(sessionKey) || 'null');
        if(currentSession && currentSession.username === username) {
            currentSession.isPremium = updatedUsers[username].isPremium;
            localStorage.setItem(sessionKey, JSON.stringify(currentSession));
        }
      } catch (e) {
        console.error("Could not update session storage", e);
      }
      
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Developer Access
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Enter the password to access the dashboard.
            </p>
          </div>
          <form className="mt-8 space-y-6 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 p-8 rounded-lg shadow-lg" onSubmit={handleAuth}>
            {error && <p className="text-center text-sm text-red-500 bg-red-100 dark:bg-red-900/30 p-3 rounded-md">{error}</p>}
            <div>
              <label htmlFor="password"className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full appearance-none rounded-md border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 bg-white dark:bg-gray-800 focus:z-10 focus:border-brand-red focus:outline-none focus:ring-brand-red sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-brand-red py-2 px-4 text-sm font-medium text-white hover:bg-brand-red-dark focus:outline-none focus:ring-2 focus:ring-brand-red-dark focus:ring-offset-2 transition-colors"
              >
                Authenticate
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100 mb-8">User Management Dashboard</h1>
          <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg shadow-md overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Username</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-center">Premium Status</th>
                  <th className="p-4 text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {Object.entries(users).map(([username, data]) => (
                  <tr key={username}>
                    <td className="p-4 font-medium text-gray-800 dark:text-gray-200">{username}</td>
                    <td className="p-4 text-center">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${data.isPremium ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}>
                            {data.isPremium ? 'PREMIUM' : 'BASIC'}
                        </span>
                    </td>
                    <td className="p-4 text-center">
                        <label htmlFor={`toggle-${username}`} className="flex items-center justify-center cursor-pointer">
                            <div className="relative">
                                <input type="checkbox" id={`toggle-${username}`} className="sr-only" checked={data.isPremium || false} onChange={() => handleTogglePremium(username)} />
                                <div className="block bg-gray-300 dark:bg-gray-600 w-12 h-7 rounded-full"></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${data.isPremium ? 'translate-x-full bg-brand-red' : ''}`}></div>
                            </div>
                        </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboardPage;