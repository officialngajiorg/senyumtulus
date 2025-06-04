
import type { Thread, User } from '@/lib/types'; 
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import UserAvatar from '@/components/shared/UserAvatar';
import { MessageSquare, Eye, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ThreadItemProps {
  thread: Thread;
}

export default function ThreadItem({ thread }: ThreadItemProps) {
   const authorForAvatar: User = { 
    id: thread.author.userId,
    name: thread.author.name,
    avatarUrl: thread.author.avatarUrl,
  };

  // Ensure dates are Date objects before formatting
  const createdAtDate = typeof thread.createdAt === 'string' ? new Date(thread.createdAt) : thread.createdAt;
  const lastActivityDate = typeof thread.lastActivity === 'string' ? new Date(thread.lastActivity) : thread.lastActivity;

  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow duration-200 ease-in-out">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg md:text-xl font-headline">
          <Link href={`/forum/${thread.id}`} className="hover:text-primary transition-colors">
            {thread.title}
          </Link>
        </CardTitle>
        <CardDescription className="flex items-center text-xs pt-1">
          <UserAvatar user={authorForAvatar} className="h-5 w-5 mr-1.5" />
          <span>Started by {thread.author.name}</span>
          <Clock className="h-3 w-3 ml-2 mr-1" /> 
          <span>
            {createdAtDate instanceof Date && !isNaN(createdAtDate.valueOf())
              ? formatDistanceToNow(createdAtDate, { addSuffix: true })
              : 'Invalid date'}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-foreground/80 pt-0 pb-3">
        <p className="line-clamp-2">{thread.originalPostContent}</p>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground flex justify-between items-center pt-2 pb-3">
        <div className="flex items-center space-x-4">
          <span className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" /> {thread.replyCount} Replies
          </span>
          <span className="flex items-center">
            <Eye className="h-4 w-4 mr-1" /> {thread.viewCount} Views
          </span>
        </div>
        <div>
          Last activity: {lastActivityDate instanceof Date && !isNaN(lastActivityDate.valueOf())
            ? formatDistanceToNow(lastActivityDate, { addSuffix: true })
            : 'Invalid date'}
        </div>
      </CardFooter>
    </Card>
  );
}
