import { getDatabase } from '@/lib/mongodb';
import type { Thread, Post } from '@/lib/types';

export function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export async function createThread(threadData: Thread): Promise<string> {
  try {
    const db = await getDatabase();
    const threadsCollection = db.collection<Thread>('threads');
    
    await threadsCollection.insertOne(threadData);
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

    await postsCollection.insertOne(newPost);
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
    const threadsCollection = db.collection('threads');
    
    await threadsCollection.updateOne(
      { id: threadId },
      { 
        $set: { lastActivity },
        $inc: { replyCount: 1 }
      }
    );
    console.log(`[MongoDB] Thread ${threadId} activity updated`);
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
    console.log(`[MongoDB] Retrieved thread ${threadId}: ${thread ? 'found' : 'not found'}`);
    return thread;
  } catch (error) {
    console.error('[MongoDB] Error getting thread by ID:', error);
    return null;
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
    return [];
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
    return [];
  }
}
