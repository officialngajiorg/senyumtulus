// src/components/dashboard/ForumActivity.tsx
import { getForumThreads } from '@/lib/actions/forumActions';

export default async function ForumActivity() {
  const threads = await getForumThreads();
  const recentThreads = threads.slice(0, 5); // Get 5 most recent threads

  // ...existing code...
}