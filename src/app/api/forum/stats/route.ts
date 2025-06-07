import { NextResponse } from 'next/server';
import { getForumStats } from '@/lib/actions/forumActions';

export async function GET() {
  try {
    const stats = await getForumStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching forum stats from MongoDB:', error);
    return NextResponse.json({ message: 'Error fetching forum stats' }, { status: 500 });
  }
}
