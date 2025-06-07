import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const db = await getDatabase();
    const postsCollection = db.collection('posts');
    
    const post = await postsCollection.findOne({ id: params.postId });
    
    if (!post) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ message: 'Error fetching post' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const body = await request.json();
    const db = await getDatabase();
    const postsCollection = db.collection('posts');
    
    const updateData: any = {};
    if (body.likes !== undefined) {
      updateData.$inc = { likes: body.likes };
    }
    if (body.reports !== undefined) {
      updateData.$inc = { ...updateData.$inc, reports: body.reports };
    }
    if (body.content) {
      updateData.$set = { content: body.content, editedAt: new Date().toISOString() };
    }
    
    const result = await postsCollection.updateOne(
      { id: params.postId },
      updateData
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ message: 'Error updating post' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const db = await getDatabase();
    const postsCollection = db.collection('posts');
    
    const result = await postsCollection.deleteOne({ id: params.postId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json({ message: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ message: 'Error deleting post' }, { status: 500 });
  }
}
