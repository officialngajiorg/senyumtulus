// src/app/api/threads/route.ts
import { NextResponse } from 'next/server';
import { getForumThreads } from '@/lib/actions/forumActions';

export async function GET() {
  try {
    const threads = await getForumThreads();
    // Ensure dates are ISO strings if they aren't already
    const processedThreads = threads.map(thread => ({
      ...thread,
      createdAt: typeof thread.createdAt === 'string' ? thread.createdAt : new Date(thread.createdAt).toISOString(),
      lastActivity: typeof thread.lastActivity === 'string' ? thread.lastActivity : new Date(thread.lastActivity).toISOString(),
    }));
    return NextResponse.json(processedThreads);
  } catch (error) {
    console.error('Error fetching threads from MongoDB:', error);
    return NextResponse.json({ message: 'Error fetching threads' }, { status: 500 });
  }
}
