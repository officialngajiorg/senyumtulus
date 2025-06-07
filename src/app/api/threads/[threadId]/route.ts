import { NextResponse } from 'next/server';
import { getThreadWithPosts } from '@/lib/actions/forumActions';
import { getDatabase } from '@/lib/mongodb';

export async function GET(
  request: Request,
  { params }: { params: { threadId: string } }
) {
  try {
    const { thread, posts } = await getThreadWithPosts(params.threadId);
    
    if (!thread) {
      return NextResponse.json({ message: 'Thread not found' }, { status: 404 });
    }
    
    const processedThread = {
      ...thread,
      createdAt: typeof thread.createdAt === 'string' ? thread.createdAt : new Date(thread.createdAt).toISOString(),
      lastActivity: typeof thread.lastActivity === 'string' ? thread.lastActivity : new Date(thread.lastActivity).toISOString(),
    };

    const processedPosts = posts.map(post => ({
      ...post,
      timestamp: typeof post.timestamp === 'string' ? post.timestamp : new Date(post.timestamp).toISOString(),
    }));
    
    return NextResponse.json({ thread: processedThread, posts: processedPosts });
  } catch (error) {
    console.error('Error fetching thread from MongoDB:', error);
    return NextResponse.json({ message: 'Error fetching thread' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { threadId: string } }
) {
  try {
    const body = await request.json();
    const db = await getDatabase();
    const threadsCollection = db.collection('threads');
    
    const updateData: any = {};
    if (body.viewCount !== undefined) {
      updateData.$inc = { viewCount: 1 };
    }
    if (body.replyCount !== undefined) {
      updateData.$inc = { ...updateData.$inc, replyCount: 1 };
    }
    if (body.lastActivity) {
      updateData.$set = { lastActivity: body.lastActivity };
    }
    
    const result = await threadsCollection.updateOne(
      { id: params.threadId },
      updateData
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Thread not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Thread updated successfully' });
  } catch (error) {
    console.error('Error updating thread:', error);
    return NextResponse.json({ message: 'Error updating thread' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { threadId: string } }
) {
  try {
    const db = await getDatabase();
    const threadsCollection = db.collection('threads');
    const postsCollection = db.collection('posts');
    
    // Delete thread and all its posts
    await Promise.all([
      threadsCollection.deleteOne({ id: params.threadId }),
      postsCollection.deleteMany({ threadId: params.threadId })
    ]);
    
    return NextResponse.json({ message: 'Thread deleted successfully' });
  } catch (error) {
    console.error('Error deleting thread:', error);
    return NextResponse.json({ message: 'Error deleting thread' }, { status: 500 });
  }
}
