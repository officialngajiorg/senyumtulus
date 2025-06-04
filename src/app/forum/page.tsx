
"use client"; 
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ThreadItem from '@/components/forum/ThreadItem';
import type { Thread } from '@/lib/types';
import Link from 'next/link';
import { PlusCircle, Search, MessageSquare, Loader2, Frown } from 'lucide-react';
// Removed Firestore imports, will read from JSON later if needed or use client-side mock data

// Mock data directly in the component for now, or fetch from a JSON file via an API route/server component
// For initial refactor, let's assume threads are passed as props or fetched client-side.
// We will update this to read from src/data/threads.json in a server component later.

// This function would ideally be a server component utility
async function fetchThreadsFromLocal(): Promise<Thread[]> {
  // In a real app with client-side data fetching for JSON, you'd use fetch('/api/threads')
  // For now, this component is client-side, so direct fs access isn't possible.
  // We'll simulate an async fetch and use data passed or fetched differently.
  // This part will be significantly refactored if this page becomes a Server Component
  // or if we use API routes to serve JSON.

  // For now, we'll fetch data in a useEffect hook, simulating an API call.
  try {
    const response = await fetch('/api/threads'); // We will need to create this API route
    if (!response.ok) {
      console.error("Failed to fetch threads:", response.statusText);
      return [];
    }
    const data = await response.json();
    return data.map((thread: any) => ({
      ...thread,
      createdAt: new Date(thread.createdAt), // Ensure dates are Date objects
      lastActivity: new Date(thread.lastActivity),
    }));
  } catch (error) {
    console.error("Error fetching threads from API:", error);
    return [];
  }
}


export default function ForumPage() {
  const [allThreads, setAllThreads] = useState<Thread[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  // Pagination state (can be re-added if reading from a paginated JSON source)
  // const [isLoadingMore, setIsLoadingMore] = useState(false);
  // const [lastVisibleThreadId, setLastVisibleThreadId] = useState<string | null>(null);
  // const [hasMoreThreads, setHasMoreThreads] = useState(true);


  useEffect(() => {
    const loadThreads = async () => {
      setIsLoading(true);
      const threads = await fetchThreadsFromLocal();
      setAllThreads(threads);
      setIsLoading(false);
      // setHasMoreThreads(threads.length >= THREADS_PER_PAGE); // Adjust if pagination implemented
    };
    loadThreads();
  }, []);

  // const handleLoadMore = async () => { /* Logic for JSON pagination if implemented */ };
  
  const filteredThreads = useMemo(() => {
    if (!searchTerm) return allThreads;
    return allThreads.filter(thread =>
      thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (thread.originalPostContent && thread.originalPostContent.toLowerCase().includes(searchTerm.toLowerCase())) ||
      thread.author.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allThreads, searchTerm]);

  return (
    <div className="space-y-8">
      <section className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-card shadow rounded-lg">
        <div>
          <h1 className="text-3xl font-bold font-headline text-primary">Community Forum</h1>
          <p className="text-muted-foreground">Share, discuss, and find support.</p>
        </div>
        <Button asChild size="lg" className="shadow hover:shadow-md transition-shadow">
          <Link href="/forum/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Thread
          </Link>
        </Button>
      </section>

      <section className="bg-card p-4 shadow rounded-lg">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search threads by title, content, or author..." 
            className="pl-10 w-full md:w-1/2 lg:w-1/3"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {isLoading && allThreads.length === 0 ? (
          <div className="text-center py-12">
            <Loader2 className="mx-auto h-16 w-16 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading threads...</p>
          </div>
        ) : !isLoading && filteredThreads.length === 0 ? (
          <div className="text-center py-12">
            <Frown className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold text-muted-foreground mb-2">
              {searchTerm ? "No Threads Match Your Search" : "No Threads Yet"}
            </h2>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "Try a different search term or " : "Be the first to "} 
              start a discussion!
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link href="/forum/new">
                  <PlusCircle className="mr-2 h-5 w-5" /> Create New Thread
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredThreads.map((thread) => (
              <ThreadItem key={thread.id} thread={thread} />
            ))}
          </div>
        )}
      </section>
      
      {/* Pagination button can be re-added here if JSON pagination is implemented
      {hasMoreThreads && !isLoading && filteredThreads.length > 0 && (
         <div className="flex justify-center mt-8">
          <Button 
            variant="outline" 
            onClick={handleLoadMore}
            disabled={isLoadingMore}
          >
            {isLoadingMore ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Load More Threads
          </Button>
        </div>
      )}
      */}
    </div>
  );
}

// We need an API route to serve threads.json
// Create src/app/api/threads/route.ts
