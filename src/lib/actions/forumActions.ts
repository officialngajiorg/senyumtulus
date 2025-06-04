// src/lib/actions/forumActions.ts
'use server';
import { moderateForumContent, type ModerateForumContentInput } from '@/ai/flows/moderate-forum-content';
import { z } from 'zod';
import type { PostSubmissionResult, AuthorInfo, Thread, Post } from '@/lib/types';
import { createThread, createPost, updateThreadActivity, getThreadById, generateId } from '@/lib/mongodb-utils';
import { revalidatePath } from 'next/cache';

// Schema for new thread creation from FormData - VALIDATION DISABLED FOR TITLE AND CONTENT LENGTH
const NewThreadFormSchema = z.object({
  title: z.string(), // Validation for min/max length removed
  content: z.string(), // Validation for min/max length removed
  userId: z.string().min(1, "User ID is required."),
  userName: z.string().min(1, "User name is required."),
  userAvatarUrl: z.string().url().optional().or(z.literal('')).nullable(), 
});

// Schema for new reply creation from FormData
const ReplyFormSchema = z.object({
  content: z.string().min(5, "Reply must be at least 5 characters.").max(5000, "Reply must be 5000 characters or less."),
  userId: z.string().min(1, "User ID is required."),
  userName: z.string().min(1, "User name is required."),
  userAvatarUrl: z.string().url().optional().or(z.literal('')).nullable(),
  threadId: z.string().min(1, "Thread ID is required."),
});


export async function submitPostForModeration(
  prevState: PostSubmissionResult | null,
  formData: FormData
): Promise<PostSubmissionResult> {
  console.log("[Forum Action MongoDB] Received form data submission.");

  const isNewThread = formData.has('title');
  
  const rawFormData = {
    title: isNewThread ? formData.get('title') as string : undefined,
    content: formData.get('content') as string,
    userId: formData.get('userId') as string,
    userName: formData.get('userName') as string,
    userAvatarUrl: (formData.get('userAvatarUrl') as string | null) || '',
    threadId: isNewThread ? undefined : formData.get('threadId') as string,
  };
  console.log("[Forum Action MongoDB] Raw form data:", rawFormData);
  
  const validationSchema = isNewThread ? NewThreadFormSchema : ReplyFormSchema;
  const validatedFields = validationSchema.safeParse({
    ...rawFormData,
    userAvatarUrl: rawFormData.userAvatarUrl === "" ? null : rawFormData.userAvatarUrl,
  });

  if (!validatedFields.success) {
    console.warn("[Forum Action MongoDB] Validation failed:", validatedFields.error.flatten().fieldErrors);
    const errorFields: { [key: string]: string } = {};
    validatedFields.error.errors.forEach(err => {
      if (err.path[0]) {
        errorFields[err.path[0] as string] = err.message;
      }
    });
    return {
      success: false,
      message: "Validation failed. Please check the fields.",
      errorFields: errorFields,
      submittedContent: { ...rawFormData, title: rawFormData.title || undefined, threadId: rawFormData.threadId || undefined },
    };
  }
  
  console.log("[Forum Action MongoDB] Validated fields:", validatedFields.data);
  const { content, userId, userName } = validatedFields.data;
  const userAvatarForAuthor = validatedFields.data.userAvatarUrl === null || validatedFields.data.userAvatarUrl === "" ? undefined : validatedFields.data.userAvatarUrl;

  const authorInfo: AuthorInfo = {
    userId: userId,
    name: userName,
    avatarUrl: userAvatarForAuthor,
  };
  console.log("[Forum Action MongoDB] AuthorInfo:", authorInfo);

  try {
    const moderationInput: ModerateForumContentInput = { content: content };
    console.log("[Forum Action MongoDB] Moderation input:", moderationInput);
    const moderationResult = await moderateForumContent(moderationInput);
    console.log("[Forum Action MongoDB] Moderation result:", moderationResult);

    if (!moderationResult.isAppropriate) {
      return {
        success: false,
        message: `Your content was flagged. Reason: ${moderationResult.reason || 'Please review community guidelines.'}`,
        moderation: moderationResult,
        submittedContent: { ...validatedFields.data, title: (validatedFields.data as any).title || undefined, threadId: (validatedFields.data as any).threadId || undefined },
      };
    }

    // Content is appropriate, save to MongoDB
    const currentDate = new Date().toISOString();

    if (isNewThread && validatedFields.data.title) { // New Thread
      console.log("[Forum Action MongoDB] Attempting to save new thread to MongoDB...");
      
      const newThreadId = generateId();
      const newPostId = generateId();

      const newThreadData: Thread = {
        id: newThreadId,
        title: validatedFields.data.title,
        author: authorInfo,
        originalPostContent: validatedFields.data.content.substring(0, 200),
        originalPostId: newPostId,
        createdAt: currentDate,
        lastActivity: currentDate,
        replyCount: 0,
        viewCount: 0, 
      };

      const newPostData: Omit<Post, 'id'> = {
        threadId: newThreadId, 
        author: authorInfo,
        content: validatedFields.data.content,
        timestamp: currentDate,
        likes: 0,
        reports: 0,
      };

      // Use transaction-like approach - create thread first, then post
      try {
        await createThread(newThreadData);
        await createPost(newPostData);
        
        console.log("[Forum Action MongoDB] New thread and post saved to MongoDB.");
        
        // Revalidate paths to refresh data from MongoDB
        revalidatePath('/forum');
        revalidatePath(`/forum/${newThreadId}`);
        revalidatePath('/'); // If forum data is shown on homepage

        return {
          success: true,
          message: 'Thread submitted successfully!',
          newThreadId: newThreadId,
          moderation: moderationResult,
          submittedContent: { ...validatedFields.data, title: validatedFields.data.title || undefined },
        };
      } catch (dbError: any) {
        console.error("[Forum Action MongoDB] Database error creating thread/post:", dbError);
        throw new Error(`Database operation failed: ${dbError.message}`);
      }

    } else if (!isNewThread && (validatedFields.data as any).threadId) { // New Reply
      const threadId = (validatedFields.data as any).threadId;
      console.log(`[Forum Action MongoDB] Attempting to save new reply to thread ${threadId} in MongoDB...`);
      
      const newReplyData: Omit<Post, 'id'> = {
        threadId: threadId,
        author: authorInfo,
        content: validatedFields.data.content,
        timestamp: currentDate,
        likes: 0,
        reports: 0,
      };

      try {
        await createPost(newReplyData);
        await updateThreadActivity(threadId, currentDate);

        console.log("[Forum Action MongoDB] New reply saved to MongoDB.");
        
        // Revalidate paths to refresh data from MongoDB
        revalidatePath(`/forum/${threadId}`);
        revalidatePath('/forum');

        return {
          success: true,
          message: 'Reply submitted successfully!',
          moderation: moderationResult,
          submittedContent: { ...validatedFields.data, threadId: (validatedFields.data as any).threadId || undefined },
        };
      } catch (dbError: any) {
        console.error("[Forum Action MongoDB] Database error creating reply:", dbError);
        throw new Error(`Database operation failed: ${dbError.message}`);
      }
    } else {
      console.error("[Forum Action MongoDB] Invalid form submission type or missing required fields for MongoDB operation.");
      return { success: false, message: "Invalid form submission type or missing required fields." };
    }

  } catch (error: any) {
    console.error("[Forum Action MongoDB] ERROR:", error);
    console.error("[Forum Action MongoDB] Error message:", error.message);
    console.error("[Forum Action MongoDB] Error stack:", error.stack);
    
    // More specific error messages
    let errorMessage = "An error occurred while submitting your post. Please try again later.";
    if (error.message?.includes('Database operation failed')) {
      errorMessage = "Database connection error. Please check your internet connection and try again.";
    } else if (error.message?.includes('moderation')) {
      errorMessage = "Content moderation service is temporarily unavailable. Please try again later.";
    }
    
    return {
      success: false,
      message: errorMessage,
      submittedContent: { ...validatedFields.data, title: (validatedFields.data as any).title || undefined, threadId: (validatedFields.data as any).threadId || undefined },
    };
  }
}

// Add these new functions for reading data from MongoDB
export async function getForumThreads() {
  try {
    console.log("[Forum Action MongoDB] Getting all threads from MongoDB");
    const { getAllThreads } = await import('@/lib/mongodb-utils');
    const threads = await getAllThreads();
    console.log(`[Forum Action MongoDB] Retrieved ${threads.length} threads from MongoDB`);
    return threads;
  } catch (error) {
    console.error("[Forum Action MongoDB] Error getting threads:", error);
    return [];
  }
}

export async function getThreadWithPosts(threadId: string) {
  try {
    console.log(`[Forum Action MongoDB] Getting thread ${threadId} with posts from MongoDB`);
    const { getThreadById, getPostsByThreadId } = await import('@/lib/mongodb-utils');
    
    const [thread, posts] = await Promise.all([
      getThreadById(threadId),
      getPostsByThreadId(threadId)
    ]);
    
    if (!thread) {
      console.warn(`[Forum Action MongoDB] Thread ${threadId} not found in MongoDB`);
      return { thread: null, posts: [] };
    }
    
    // Increment view count
    try {
      const { getDatabase } = await import('@/lib/mongodb');
      const db = await getDatabase();
      const threadsCollection = db.collection('threads');
      await threadsCollection.updateOne(
        { id: threadId },
        { $inc: { viewCount: 1 } }
      );
    } catch (viewError) {
      console.warn("[Forum Action MongoDB] Failed to increment view count:", viewError);
    }
    
    console.log(`[Forum Action MongoDB] Retrieved thread ${threadId} with ${posts.length} posts from MongoDB`);
    return { thread, posts };
  } catch (error) {
    console.error(`[Forum Action MongoDB] Error getting thread ${threadId}:`, error);
    return { thread: null, posts: [] };
  }
}

export async function getForumStats() {
  try {
    console.log("[Forum Action MongoDB] Getting forum stats from MongoDB");
    const { getDatabase } = await import('@/lib/mongodb');
    const db = await getDatabase();
    
    const [totalThreads, totalPosts] = await Promise.all([
      db.collection('threads').countDocuments(),
      db.collection('posts').countDocuments()
    ]);
    
    return { totalThreads, totalPosts };
  } catch (error) {
    console.error("[Forum Action MongoDB] Error getting forum stats:", error);
    return { totalThreads: 0, totalPosts: 0 };
  }
}
