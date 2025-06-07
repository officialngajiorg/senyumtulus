'use server';
import { getDatabase } from '@/lib/mongodb';

export async function getUserProfileData(userId: string) {
  try {
    const db = await getDatabase();
    const postsCollection = db.collection('posts');

    // Mock profile data - replace with actual user data source if available
    const profile = {
      id: userId,
      name: 'Test User',
      email: 'test@example.com',
      avatarUrl: '',
      joinedAt: new Date().toISOString(),
      bio: 'Forum user'
    };

    const posts = await postsCollection
      .find({ 'author.userId': userId })
      .sort({ timestamp: -1 })
      .toArray();

    const processedPosts = posts.map((post: any) => ({
      id: post.id,
      title: post.content.substring(0, 50) + '...',
      content: post.content,
      threadId: post.threadId,
      timestamp: post.timestamp,
      likes: post.likes || 0
    }));

    return {
      profile,
      posts: processedPosts
    };
  } catch (error) {
    return {
      profile: null,
      posts: []
    };
  }
}
