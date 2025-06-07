// src/app/organizations/[organizationId]/page.tsx
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
import { getThreadWithPosts } from '@/lib/actions/forumActions';

export default async function OrganizationPage({ 
  params 
}: { 
  params: Promise<{ organizationId: string }> 
}) {
  const { organizationId } = await params;
  
  const { thread, posts } = await getThreadWithPosts(organizationId);

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

  const originalPost = posts.find(p => p.id === thread.originalPostId);
  const replies = posts.filter(p => p.id !== thread.originalPostId);

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
            <span>{format(new Date(thread.createdAt), "MMM d, yyyy")}</span>
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