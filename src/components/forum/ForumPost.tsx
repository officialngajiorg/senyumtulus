import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Flag, Reply } from 'lucide-react';
import UserAvatar from '@/components/shared/UserAvatar';
import { format } from 'date-fns';
import type { Post } from '@/lib/types';

interface ForumPostProps {
  post: Post;
  isOriginalPost?: boolean;
}

export default function ForumPost({ post, isOriginalPost = false }: ForumPostProps) {
  return (
    <Card className={`${isOriginalPost ? 'border-primary/20 bg-primary/5' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <UserAvatar
              user={{
                name: post.author.name,
                avatarUrl: post.author.avatarUrl,
                id: post.author.userId
              }}
              className="h-8 w-8"
            />
            <div>
              <p className="font-semibold">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(post.timestamp), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
          </div>
          {isOriginalPost && (
            <Badge variant="secondary">Original Post</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="prose prose-sm max-w-none mb-4">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Heart className="h-4 w-4 mr-1" />
            {post.likes}
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Reply className="h-4 w-4 mr-1" />
            Reply
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Flag className="h-4 w-4 mr-1" />
            Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
