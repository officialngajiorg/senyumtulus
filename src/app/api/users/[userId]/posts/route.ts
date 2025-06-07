import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const db = await getDatabase();
    const postsCollection = db.collection('posts');
    
    const posts = await postsCollection
      .find({ 'author.userId': params.userId })
      .sort({ timestamp: -1 })
      .toArray();
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json({ message: 'Error fetching user posts' }, { status: 500 });
  }
}
