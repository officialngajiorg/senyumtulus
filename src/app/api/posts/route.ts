import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const threadId = searchParams.get('threadId');
    
    const db = await getDatabase();
    const postsCollection = db.collection('posts');
    
    let query = {};
    if (threadId) {
      query = { threadId };
    }
    
    const posts = await postsCollection.find(query).sort({ timestamp: 1 }).toArray();
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts from MongoDB:', error);
    return NextResponse.json({ message: 'Error fetching posts' }, { status: 500 });
  }
}
