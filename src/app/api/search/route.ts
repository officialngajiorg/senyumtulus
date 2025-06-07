import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'threads'; // threads or posts
    
    if (!query) {
      return NextResponse.json({ message: 'Search query is required' }, { status: 400 });
    }
    
    const db = await getDatabase();
    
    if (type === 'threads') {
      const threadsCollection = db.collection('threads');
      const threads = await threadsCollection.find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { originalPostContent: { $regex: query, $options: 'i' } }
        ]
      }).sort({ lastActivity: -1 }).toArray();
      
      return NextResponse.json(threads);
    } else if (type === 'posts') {
      const postsCollection = db.collection('posts');
      const posts = await postsCollection.find({
        content: { $regex: query, $options: 'i' }
      }).sort({ timestamp: -1 }).toArray();
      
      return NextResponse.json(posts);
    }
    
    return NextResponse.json({ message: 'Invalid search type' }, { status: 400 });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json({ message: 'Error performing search' }, { status: 500 });
  }
}
