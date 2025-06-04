// src/components/shared/ForumStats.tsx
import { getForumStats } from '@/lib/actions/forumActions';

export default async function ForumStats() {
  const { totalThreads, totalPosts } = await getForumStats();
  
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold">{totalThreads}</div>
        <div className="text-sm text-muted-foreground">Threads</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">{totalPosts}</div>
        <div className="text-sm text-muted-foreground">Posts</div>
      </div>
    </div>
  );
}