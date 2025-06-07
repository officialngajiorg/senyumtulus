import { NextResponse } from 'next/server';
import { moderateForumContent } from '@/ai/flows/moderate-forum-content';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content } = body;
    
    if (!content) {
      return NextResponse.json({ message: 'Content is required' }, { status: 400 });
    }
    
    const moderationResult = await moderateForumContent({ content });
    
    return NextResponse.json(moderationResult);
  } catch (error) {
    console.error('Error moderating content:', error);
    return NextResponse.json({ message: 'Error moderating content' }, { status: 500 });
  }
}
