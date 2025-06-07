// src/components/forum/ForumThreadList.tsx
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MessageSquare, Eye, Clock } from 'lucide-react';
import UserAvatar from '@/components/shared/UserAvatar';
import { format } from 'date-fns';
import ThreadItem from '@/components/forum/ThreadItem';
import type { Thread } from '@/lib/types';

interface ForumThreadListProps {
  threads: Thread[];
}

export default function ForumThreadList({ threads }: ForumThreadListProps) {
  if (threads.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No threads found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <ThreadItem key={thread.id} thread={thread} />
      ))}
    </div>
  );
}