import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { format } from 'date-fns';

interface UserPostsProps {
  posts: Array<{
    id: string;
    title: string;
    content: string;
    threadId: string;
    timestamp: string;
    likes: number;
  }>;
  userName: string;
}

export default function UserPosts({ posts, userName }: UserPostsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Posts by {userName}</CardTitle>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <p className="text-muted-foreground">No posts found.</p>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="p-4 bg-secondary/50 rounded-lg">
                <h3 className="font-semibold">{post.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {post.content.substring(0, 150)}...
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(post.timestamp), 'MMM d, yyyy')}
                  </span>
                  <Link 
                    href={`/forum/${post.threadId}`} 
                    className="text-primary hover:underline text-sm"
                  >
                    View Thread
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
