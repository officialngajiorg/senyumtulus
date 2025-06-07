import { getDatabase } from './mongodb';
import { ObjectId } from 'mongodb';
import type { Thread, Post } from './types';

export function generateId(): string {
  return new ObjectId().toHexString();
}

export async function createThread(threadData: Thread): Promise<string> {
  try {
    const db = await getDatabase();
    const threadsCollection = db.collection<Thread>('threads');
    
    const result = await threadsCollection.insertOne(threadData);
    console.log(`[MongoDB] Thread created with ID: ${threadData.id}`);
    return threadData.id;
  } catch (error) {
    console.error('[MongoDB] Error creating thread:', error);
    throw new Error('Failed to create thread in database');
  }
}

export async function createPost(postData: Omit<Post, 'id'>, customId?: string): Promise<string> {
  try {
    const db = await getDatabase();
    const postsCollection = db.collection<Post>('posts');
    
    const newPost: Post = {
      ...postData,
      id: customId || generateId(),
    };

    const result = await postsCollection.insertOne(newPost);
    console.log(`[MongoDB] Post created with ID: ${newPost.id}`);
    return newPost.id;
  } catch (error) {
    console.error('[MongoDB] Error creating post:', error);
    throw new Error('Failed to create post in database');
  }
}

export async function updateThreadActivity(threadId: string, lastActivity: string): Promise<void> {
  try {
    const db = await getDatabase();
    const threadsCollection = db.collection<Thread>('threads');
    
    const result = await threadsCollection.updateOne(
      { id: threadId },
      { 
        $set: { lastActivity },
        $inc: { replyCount: 1 }
      }
    );
    
    if (result.matchedCount === 0) {
      console.warn(`[MongoDB] Thread with ID ${threadId} not found for update`);
    } else {
      console.log(`[MongoDB] Thread ${threadId} activity updated`);
    }
  } catch (error) {
    console.error('[MongoDB] Error updating thread activity:', error);
    throw new Error('Failed to update thread activity');
  }
}

export async function getThreadById(threadId: string): Promise<Thread | null> {
  try {
    const db = await getDatabase();
    const threadsCollection = db.collection<Thread>('threads');
    
    const thread = await threadsCollection.findOne({ id: threadId });
    return thread;
  } catch (error) {
    console.error('[MongoDB] Error getting thread by ID:', error);
    throw new Error('Failed to get thread from database');
  }
}

export async function getAllThreads(): Promise<Thread[]> {
  try {
    const db = await getDatabase();
    const threadsCollection = db.collection<Thread>('threads');
    
    const threads = await threadsCollection.find({}).sort({ lastActivity: -1 }).toArray();
    console.log(`[MongoDB] Retrieved ${threads.length} threads`);
    return threads;
  } catch (error) {
    console.error('[MongoDB] Error getting all threads:', error);
    throw new Error('Failed to get threads from database');
  }
}

export async function getPostsByThreadId(threadId: string): Promise<Post[]> {
  try {
    const db = await getDatabase();
    const postsCollection = db.collection<Post>('posts');
    
    const posts = await postsCollection.find({ threadId }).sort({ timestamp: 1 }).toArray();
    console.log(`[MongoDB] Retrieved ${posts.length} posts for thread ${threadId}`);
    return posts;
  } catch (error) {
    console.error('[MongoDB] Error getting posts by thread ID:', error);
    throw new Error('Failed to get posts from database');
  }
}

export async function getThreadStats(): Promise<{ totalThreads: number; totalPosts: number }> {
  try {
    const db = await getDatabase();
    const threadsCollection = db.collection<Thread>('threads');
    const postsCollection = db.collection<Post>('posts');
    
    const [totalThreads, totalPosts] = await Promise.all([
      threadsCollection.countDocuments(),
      postsCollection.countDocuments()
    ]);
    
    return { totalThreads, totalPosts };
  } catch (error) {
    console.error('[MongoDB] Error getting thread stats:', error);
    return { totalThreads: 0, totalPosts: 0 };
  }
}
