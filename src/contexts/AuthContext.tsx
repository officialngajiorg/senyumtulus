
"use client";

import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import type { User } from '@/lib/types'; // Use our User type
// Removed Firebase imports

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (name: string) => Promise<void>; // Simplified login
  signup: (name: string) => Promise<void>; // Simplified signup
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Still useful for initial load
  const router = useRouter();

  useEffect(() => {
    // Try to load user from localStorage for a very basic persistence
    const storedUser = localStorage.getItem('senyumtulus-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('senyumtulus-user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (name: string) => {
    setLoading(true);
    // In a real JSON backend, you might read users.json here.
    // For simplicity, we'll create a mock user or find one.
    // This is NOT secure and only for demonstration.
    const mockUser: User = {
      id: `user-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      name: name,
      avatarUrl: `https://placehold.co/100x100.png?text=${name.substring(0,2).toUpperCase()}`,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`
    };
    setUser(mockUser);
    localStorage.setItem('senyumtulus-user', JSON.stringify(mockUser));
    setLoading(false);
  };
  
  const signup = async (name: string) => {
    // Similar to login for this mock setup
    await login(name); 
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('senyumtulus-user');
    router.push('/'); 
  };

  if (loading && !user) { // Show loader only if truly loading and no user yet
    // This simple loader for context might be too intrusive.
    // We can rely on page-level loaders for initial data fetching if this causes issues.
    // For now, keeping it to show context is loading.
    // Consider removing this full-page loader if it's disruptive.
    // setLoading(false) happens quickly now.
  }


  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
