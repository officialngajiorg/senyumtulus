"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import type { User } from '@/lib/types'; // Use our User type
// Removed Firebase imports

interface AuthContextType {
  user: User | null;
  login: (name: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: async () => {},
  isLoading: false,
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Mock authentication check - replace with your actual auth check
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (name: string) => {
    // Mock login - replace with your actual authentication logic
    const newUser: User = {
      id: 'mock-user-id',
      name: name,
      email: `${name.toLowerCase().replace(/\s/g, '')}@example.com`,
      image: '',
    };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    router.push('/');
  };

  const logout = async () => {
    // Mock logout - replace with your actual logout logic
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading...
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
