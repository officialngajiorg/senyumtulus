import { getAllThreads, getPostsByThreadId, getThreadById } from './mongodb-utils';
import type { Thread, Post, ForumData } from './types';

export async function getForumData(): Promise<ForumData> {
  try {
    const threads = await getAllThreads();
    console.log(`[Forum Data] Retrieved ${threads.length} threads from MongoDB`);
    
    return {
      threads,
      totalThreads: threads.length,
      totalPosts: 0, // You can add a count function if needed
    };
  } catch (error) {
    console.error('[Forum Data] Error getting forum data:', error);
    return {
      threads: [],
      totalThreads: 0,
      totalPosts: 0,
    };
  }
}

export async function getThreadWithPosts(threadId: string): Promise<{ thread: Thread | null; posts: Post[] }> {
  try {
    const [thread, posts] = await Promise.all([
      getThreadById(threadId),
      getPostsByThreadId(threadId)
    ]);
    
    console.log(`[Forum Data] Retrieved thread ${threadId} with ${posts.length} posts from MongoDB`);
    
    return {
      thread,
      posts,
    };
  } catch (error) {
    console.error(`[Forum Data] Error getting thread ${threadId}:`, error);
    return {
      thread: null,
      posts: [],
    };
  }
}

export async function incrementThreadViews(threadId: string): Promise<void> {
  try {
    const { getDatabase } = await import('./mongodb');
    const db = await getDatabase();
    const threadsCollection = db.collection<Thread>('threads');
    
    await threadsCollection.updateOne(
      { id: threadId },
      { $inc: { viewCount: 1 } }
    );
    
    console.log(`[Forum Data] Incremented view count for thread ${threadId}`);
  } catch (error) {
    console.error(`[Forum Data] Error incrementing views for thread ${threadId}:`, error);
  }
}
