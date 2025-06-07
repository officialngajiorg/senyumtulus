import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Link from 'next/link';
import { MessageSquare, Eye, Clock } from 'lucide-react';
import UserAvatar from '@/components/shared/UserAvatar';
import { format } from 'date-fns';
import type { Thread } from '@/lib/types';

interface ThreadItemProps {
  thread: Thread;
}

export default function ThreadItem({ thread }: ThreadItemProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold line-clamp-2">
              <Link 
                href={`/forum/${thread.id}`}
                className="hover:text-primary transition-colors"
              >
                {thread.title}
              </Link>
            </h3>
            <div className="flex items-center space-x-2 mt-2">
              <UserAvatar 
                user={{ 
                  name: thread.author.name, 
                  avatarUrl: thread.author.avatarUrl, 
                  id: thread.author.userId 
                }} 
                className="h-5 w-5" 
              />
              <span className="text-sm text-muted-foreground">
                by {thread.author.name}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {format(new Date(thread.createdAt), "MMM d, yyyy")}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1 text-sm text-muted-foreground ml-4">
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-3 w-3" />
              <span>{thread.replyCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{thread.viewCount}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {thread.originalPostContent}
        </p>
      </CardContent>
    </Card>
  );
}
