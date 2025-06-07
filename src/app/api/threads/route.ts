// src/app/api/threads/route.ts
import { NextResponse } from 'next/server';
import { getForumThreads } from '@/lib/actions/forumActions';

export async function GET() {
  try {
    const threads = await getForumThreads();
    const processedThreads = threads.map(thread => ({
      ...thread,
      createdAt: typeof thread.createdAt === 'string' ? thread.createdAt : new Date(thread.createdAt).toISOString(),
      lastActivity: typeof thread.lastActivity === 'string' ? thread.lastActivity : new Date(thread.lastActivity).toISOString(),
    }));
    return NextResponse.json(processedThreads);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching threads' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, author } = body;
    if (!title || !content || !author) {
      return NextResponse.json({ message: 'Title, content, and author are required' }, { status: 400 });
    }
    const { getDatabase } = await import('@/lib/mongodb');
    const { generateId } = await import('@/lib/mongodb-utils');
    const db = await getDatabase();
    const threadsCollection = db.collection('threads');
    const postsCollection = db.collection('posts');
    const currentDate = new Date().toISOString();
    const newThreadId = generateId();
    const newThread = {
      id: newThreadId,
      title,
      author,
      originalPostContent: content.substring(0, 200),
      originalPostId: generateId(),
      createdAt: currentDate,
      lastActivity: currentDate,
      replyCount: 0,
      viewCount: 0,
    };
    const newPost = {
      id: newThread.originalPostId,
      threadId: newThreadId,
      author,
      content,
      timestamp: currentDate,
      likes: 0,
      reports: 0,
    };
    await threadsCollection.insertOne(newThread);
    await postsCollection.insertOne(newPost);
    return NextResponse.json({ thread: newThread, post: newPost }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating thread' }, { status: 500 });
  }
}
