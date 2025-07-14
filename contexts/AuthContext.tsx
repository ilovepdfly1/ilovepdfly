
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

// NOTE: This is a mock authentication system.
// In a real-world app, this would be handled by a secure backend.

interface User {
  username: string;
  profileImage?: string; // Stored as base64 string
  isPremium?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, pass: string) => Promise<void>;
  signup: (username: string, pass: string) => Promise<void>;
  logout: () => void;
  updateProfileImage: (username: string, image: string) => Promise<void>;
  changePassword: (username: string, oldPass: string, newPass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'ilovepdfly_users_v2';
const SESSION_STORAGE_KEY = 'ilovepdfly_session_v2';

// Helper to get users from storage
const getStoredUsers = () => {
    return JSON.parse(localStorage.getItem(USERS_STORAGE_KEY) || '{}');
};

// Helper to save users to storage
const setStoredUsers = (users: any) => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for an active session on initial load
    try {
        const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
        if (savedSession) {
          setUser(JSON.parse(savedSession));
        }
    } catch (e) {
        console.error("Failed to parse session data:", e);
        localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  }, []);

  const login = async (username: string, pass: string): Promise<void> => {
    const storedUsers = getStoredUsers();
    const userData = storedUsers[username];
    if (userData && userData.password === pass) {
      const loggedInUser: User = { 
        username,
        profileImage: userData.profileImage,
        isPremium: userData.isPremium || false,
      };
      setUser(loggedInUser);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(loggedInUser));
    } else {
      throw new Error('Invalid username or password');
    }
  };

  const signup = async (username: string, pass: string): Promise<void> => {
    const storedUsers = getStoredUsers();
    if (storedUsers[username]) {
      throw new Error('Username already exists');
    }
    storedUsers[username] = { password: pass, profileImage: undefined, isPremium: false };
    setStoredUsers(storedUsers);
    
    // Automatically log in after signup
    const loggedInUser: User = { username, isPremium: false };
    setUser(loggedInUser);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(loggedInUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    navigate('/');
  };

  const updateProfileImage = async (username: string, image: string): Promise<void> => {
      const storedUsers = getStoredUsers();
      if (storedUsers[username]) {
          storedUsers[username].profileImage = image;
          setStoredUsers(storedUsers);

          const updatedUser = { ...user, profileImage: image } as User;
          setUser(updatedUser);
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updatedUser));
      } else {
          throw new Error("User not found.");
      }
  };

  const changePassword = async (username: string, oldPass: string, newPass: string): Promise<void> => {
    const storedUsers = getStoredUsers();
    const userData = storedUsers[username];
    if (userData && userData.password === oldPass) {
        if (newPass.length < 6) {
            throw new Error("New password must be at least 6 characters long.");
        }
        storedUsers[username].password = newPass;
        setStoredUsers(storedUsers);
    } else {
        throw new Error("Incorrect old password.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfileImage, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};