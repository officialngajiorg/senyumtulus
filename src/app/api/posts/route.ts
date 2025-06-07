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
    
    const processedPosts = posts.map(post => ({
      ...post,
      timestamp: typeof post.timestamp === 'string' ? post.timestamp : new Date(post.timestamp).toISOString(),
    }));
    
    return NextResponse.json(processedPosts);
  } catch (error) {
    console.error('Error fetching posts from MongoDB:', error);
    return NextResponse.json({ message: 'Error fetching posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const db = await getDatabase();
    const postsCollection = db.collection('posts');
    
    const newPost = {
      ...body,
      id: new Date().getTime().toString(),
      timestamp: new Date().toISOString(),
      likes: 0,
      reports: 0,
    };
    
    await postsCollection.insertOne(newPost);
    
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ message: 'Error creating post' }, { status: 500 });
  }
}
