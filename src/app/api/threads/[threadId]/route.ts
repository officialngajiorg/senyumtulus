import { NextResponse } from 'next/server';
import { getThreadWithPosts } from '@/lib/actions/forumActions';

export async function GET(
  request: Request,
  { params }: { params: { threadId: string } }
) {
  try {
    const { thread, posts } = await getThreadWithPosts(params.threadId);
    
    if (!thread) {
      return NextResponse.json({ message: 'Thread not found' }, { status: 404 });
    }
    
    return NextResponse.json({ thread, posts });
  } catch (error) {
    console.error('Error fetching thread from MongoDB:', error);
    return NextResponse.json({ message: 'Error fetching thread' }, { status: 500 });
  }
}
