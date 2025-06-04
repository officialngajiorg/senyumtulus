'use server';
import { getForumData, getThreadWithPosts, incrementThreadViews } from '@/lib/forum-data';
import type { Thread, Post, ForumData } from '@/lib/types';

export async function getForumThreads(): Promise<ForumData> {
  console.log('[Forum Read Action] Getting forum threads from MongoDB');
  return await getForumData();
}

export async function getThreadDetails(threadId: string): Promise<{ thread: Thread | null; posts: Post[] }> {
  console.log(`[Forum Read Action] Getting thread details for ${threadId} from MongoDB`);
  
  // Increment view count when thread is accessed
  await incrementThreadViews(threadId);
  
  return await getThreadWithPosts(threadId);
}

export async function refreshForumData(): Promise<void> {
  console.log('[Forum Read Action] Refreshing forum data cache');
  // This can be used to trigger cache refresh if needed
}
