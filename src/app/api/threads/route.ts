
// src/app/api/threads/route.ts
import { NextResponse } from 'next/server';
import { readJsonFile } from '@/lib/json-utils';
import type { Thread } from '@/lib/types';

export async function GET() {
  try {
    const threads = readJsonFile<Thread>('threads.json');
    // Ensure dates are ISO strings if they aren't already
    const processedThreads = threads.map(thread => ({
      ...thread,
      createdAt: typeof thread.createdAt === 'string' ? thread.createdAt : new Date(thread.createdAt).toISOString(),
      lastActivity: typeof thread.lastActivity === 'string' ? thread.lastActivity : new Date(thread.lastActivity).toISOString(),
    }));
    return NextResponse.json(processedThreads);
  } catch (error) {
    console.error('Error fetching threads:', error);
    return NextResponse.json({ message: 'Error fetching threads' }, { status: 500 });
  }
}
