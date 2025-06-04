
// src/app/forum/[threadId]/page.tsx
import ForumPost from '@/components/forum/ForumPost';
import NewReplyForm from '@/components/forum/NewReplyForm';
import type { Thread, Post as PostType } from '@/lib/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import UserAvatar from '@/components/shared/UserAvatar';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { readJsonFile } from '@/lib/json-utils'; // Using JSON utils

async function getThreadById(id: string): Promise<Thread | undefined> {
  const threads = readJsonFile<Thread>('threads.json');
  const thread = threads.find(t => t.id === id);
  if (thread) {
    return {
      ...thread,
      createdAt: new Date(thread.createdAt), // Convert ISO string to Date
      lastActivity: new Date(thread.lastActivity), // Convert ISO string to Date
    } as Thread; // Cast to ensure Date types are used internally by the component
  }
  return undefined;
}

async function getPostsForThread(threadId: string): Promise<PostType[]> {
  const allPosts = readJsonFile<PostType>('posts.json');
  const threadPosts = allPosts.filter(p => p.threadId === threadId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  
  return threadPosts.map(post => ({
    ...post,
    timestamp: new Date(post.timestamp), // Convert ISO string to Date
  })) as PostType[]; // Cast to ensure Date types
}

export default async function ThreadPage({ params }: { params: { threadId: string } }) {
  const thread = await getThreadById(params.threadId);

  if (!thread) {
    return (
      <div className="text-center py-12">
         <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTitle className="text-2xl font-semibold">Thread Not Found</AlertTitle>
          <AlertDescription>
            The thread you are looking for does not exist or has been removed.
          </AlertDescription>
        </Alert>
        <Button asChild variant="link" className="mt-6">
          <Link href="/forum">Back to Forum</Link>
        </Button>
      </div>
    );
  }

  const allPosts = await getPostsForThread(params.threadId);
  const originalPost = allPosts.find(p => p.id === thread.originalPostId);
  const replies = allPosts.filter(p => p.id !== thread.originalPostId);

  return (
    <div className="space-y-6">
      <Button variant="outline" asChild className="mb-2">
        <Link href="/forum">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Forum
        </Link>
      </Button>

      <Card className="shadow-lg">
        <CardHeader className="bg-secondary/20 p-4 md:p-6 rounded-t-lg">
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-primary">{thread.title}</h1>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-2">
            <UserAvatar user={{ name: thread.author.name, avatarUrl: thread.author.avatarUrl, id: thread.author.userId }} className="h-6 w-6" />
            <span>By {thread.author.name}</span>
            <span>•</span>
            {/* Ensure createdAt is a Date before formatting */}
            <span>{thread.createdAt instanceof Date ? format(thread.createdAt, "MMM d, yyyy") : 'Invalid Date'}</span>
            <span>•</span>
            <MessageSquare className="h-4 w-4 inline-block mr-1" /> {thread.replyCount} replies
          </div>
        </CardHeader>
        <CardContent className="p-0">
           {originalPost ? (
            <div className="p-4 md:p-6">
              <ForumPost post={originalPost} isOriginalPost />
            </div>
           ) : (
            <p className="p-4 md:p-6 text-muted-foreground">Original post not found.</p>
           )}
          
          {replies.length > 0 && (
            <>
              <Separator />
              <div className="p-4 md:p-6 space-y-4">
                <h2 className="text-xl font-semibold font-headline">Replies ({replies.length})</h2>
                {replies.map((reply) => (
                  <ForumPost key={reply.id} post={reply} />
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      <NewReplyForm threadId={thread.id} />
    </div>
  );
}
