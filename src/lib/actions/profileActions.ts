'use server';
import { getDatabase } from '@/lib/mongodb';

export async function getUserProfileData(userId: string) {
  try {
    console.log(`[Profile Action] Getting profile data for user ${userId}`);
    
    const db = await getDatabase();
    const postsCollection = db.collection('posts');
    
    // Mock profile data - replace with actual user data source
    const profile = {
      id: userId,
      name: 'Test User',
      email: 'test@example.com',
      avatarUrl: '',
      joinedAt: new Date().toISOString(),
      bio: 'Forum user'
    };
    
    // Get user's posts from forum
    const posts = await postsCollection
      .find({ 'author.userId': userId })
      .sort({ timestamp: -1 })
      .toArray();
    
    // Transform posts to include thread info if needed
    const processedPosts = posts.map(post => ({
      id: post.id,
      title: post.content.substring(0, 50) + '...', // Use content as title
      content: post.content,
      threadId: post.threadId,
      timestamp: post.timestamp,
      likes: post.likes || 0
    }));
    
    console.log(`[Profile Action] Retrieved profile for ${userId} with ${posts.length} posts`);
    
    return {
      profile,
      posts: processedPosts
    };
  } catch (error) {
    console.error(`[Profile Action] Error getting profile data for ${userId}:`, error);
    return {
      profile: null,
      posts: []
    };
  }
}
