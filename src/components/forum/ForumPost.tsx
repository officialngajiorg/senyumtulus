
import type { Post as PostType, User } from '@/lib/types'; 
import UserAvatar from '@/components/shared/UserAvatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { format } from 'date-fns';
import { ThumbsUp, Flag, MessageSquare, Paperclip, Download } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ForumPostProps {
  post: PostType;
  isOriginalPost?: boolean;
}

export default function ForumPost({ post, isOriginalPost = false }: ForumPostProps) {
  const authorForAvatar: User = { 
    id: post.author.userId,
    name: post.author.name,
    avatarUrl: post.author.avatarUrl,
  };

  // Ensure post.timestamp is a Date object before formatting
  const postDate = typeof post.timestamp === 'string' ? new Date(post.timestamp) : post.timestamp;

  return (
    <Card className={`mb-4 shadow-md ${isOriginalPost ? 'border-primary/50' : ''}`}>
      <CardHeader className="flex flex-row items-start space-x-4 p-4 bg-secondary/30 rounded-t-lg">
        <UserAvatar user={authorForAvatar} className="h-12 w-12" />
        <div className="flex-1">
          <p className="font-semibold text-foreground">{post.author.name}</p>
          <p className="text-xs text-muted-foreground">
            {postDate instanceof Date && !isNaN(postDate.valueOf()) 
              ? format(postDate, "MMM d, yyyy 'at' h:mm a") 
              : 'Invalid date'}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-4 whitespace-pre-wrap">
        {post.content}
        {post.attachments && post.attachments.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Attachments:</h4>
            {post.attachments.map((att, index) => (
              <div key={index} className="p-2 border rounded-md bg-secondary/20 flex items-center gap-2">
                {att.type === 'image' ? (
                   <Image src={att.url} alt={att.name} width={80} height={80} className="rounded object-cover" data-ai-hint={att.hint || "attachment image"} />
                ) : (
                  <Paperclip className="h-6 w-6 text-primary" />
                )}
                <div className="flex-1">
                  <Link href={att.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline truncate">
                    {att.name}
                  </Link>
                </div>
                <Button variant="outline" size="sm" asChild>
                   <Link href={att.url} target="_blank" download={att.name}>
                    <Download className="h-4 w-4 mr-1"/> Download
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <ThumbsUp className="h-4 w-4 mr-1" /> Like ({post.likes})
          </Button>
          {!isOriginalPost && (
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
              <MessageSquare className="h-4 w-4 mr-1" /> Reply
            </Button>
          )}
        </div>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
          <Flag className="h-4 w-4 mr-1" /> Report
        </Button>
      </CardFooter>
    </Card>
  );
}
