
// src/lib/actions/forumActions.ts
'use server';
import { moderateForumContent, type ModerateForumContentInput } from '@/ai/flows/moderate-forum-content';
import { z } from 'zod';
import type { PostSubmissionResult, AuthorInfo, Thread, Post } from '@/lib/types';
import { readJsonFile, writeJsonFile, generateId } from '@/lib/json-utils'; // Using JSON utils
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
  console.log("[Forum Action JSON] Received form data submission.");

  const isNewThread = formData.has('title');
  
  const rawFormData = {
    title: isNewThread ? formData.get('title') as string : undefined,
    content: formData.get('content') as string,
    userId: formData.get('userId') as string,
    userName: formData.get('userName') as string,
    userAvatarUrl: (formData.get('userAvatarUrl') as string | null) || '', // Ensure it's a string for Zod, or empty string
    threadId: isNewThread ? undefined : formData.get('threadId') as string,
  };
  console.log("[Forum Action JSON] Raw form data:", rawFormData);
  
  const validationSchema = isNewThread ? NewThreadFormSchema : ReplyFormSchema;
  // Ensure userAvatarUrl is correctly handled for Zod (empty string is fine if optional and nullable or literal empty)
  const validatedFields = validationSchema.safeParse({
    ...rawFormData,
    userAvatarUrl: rawFormData.userAvatarUrl === "" ? null : rawFormData.userAvatarUrl,
  });

  if (!validatedFields.success) {
    console.warn("[Forum Action JSON] Validation failed:", validatedFields.error.flatten().fieldErrors);
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
  
  console.log("[Forum Action JSON] Validated fields:", validatedFields.data);
  const { content, userId, userName } = validatedFields.data;
  const userAvatarForAuthor = validatedFields.data.userAvatarUrl === null || validatedFields.data.userAvatarUrl === "" ? undefined : validatedFields.data.userAvatarUrl;

  const authorInfo: AuthorInfo = {
    userId: userId,
    name: userName,
    avatarUrl: userAvatarForAuthor,
  };
  console.log("[Forum Action JSON] AuthorInfo:", authorInfo);

  try {
    const moderationInput: ModerateForumContentInput = { content: content };
    console.log("[Forum Action JSON] Moderation input:", moderationInput);
    const moderationResult = await moderateForumContent(moderationInput);
    console.log("[Forum Action JSON] Moderation result:", moderationResult);

    if (!moderationResult.isAppropriate) {
      return {
        success: false,
        message: `Your content was flagged. Reason: ${moderationResult.reason || 'Please review community guidelines.'}`,
        moderation: moderationResult,
        submittedContent: { ...validatedFields.data, title: (validatedFields.data as any).title || undefined, threadId: (validatedFields.data as any).threadId || undefined },
      };
    }

    // Content is appropriate, save to JSON files
    const currentDate = new Date().toISOString();

    if (isNewThread && validatedFields.data.title) { // New Thread
      console.log("[Forum Action JSON] Attempting to save new thread to JSON...");
      
      const threads = readJsonFile<Thread>('threads.json');
      const posts = readJsonFile<Post>('posts.json');

      const newPostId = generateId();
      const newThreadId = generateId();

      const newPostData: Post = {
        id: newPostId,
        threadId: newThreadId, 
        author: authorInfo,
        content: validatedFields.data.content,
        timestamp: currentDate,
        likes: 0,
        reports: 0,
        // attachments handling can be added later
      };
      posts.unshift(newPostData); // Add to the beginning for chronological order (newest first)

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
      threads.unshift(newThreadData); // Add to the beginning

      const postsWritten = writeJsonFile<Post>('posts.json', posts);
      const threadsWritten = writeJsonFile<Thread>('threads.json', threads);
      
      if (!postsWritten || !threadsWritten) {
        throw new Error("Failed to write data to JSON files.");
      }
      
      console.log("[Forum Action JSON] New thread and post saved to JSON.");
      revalidatePath('/forum'); // Revalidate forum page
      revalidatePath(`/forum/${newThreadId}`); // Revalidate new thread page

      return {
        success: true,
        message: 'Thread submitted successfully!',
        newThreadId: newThreadId,
        moderation: moderationResult,
        submittedContent: { ...validatedFields.data, title: validatedFields.data.title || undefined },
      };

    } else if (!isNewThread && (validatedFields.data as any).threadId) { // New Reply
      const threadId = (validatedFields.data as any).threadId;
      console.log(`[Forum Action JSON] Attempting to save new reply to thread ${threadId} in JSON...`);
      
      const posts = readJsonFile<Post>('posts.json');
      const threads = readJsonFile<Thread>('threads.json');

      const newReplyData: Post = {
        id: generateId(),
        threadId: threadId,
        author: authorInfo,
        content: validatedFields.data.content,
        timestamp: currentDate,
        likes: 0,
        reports: 0,
      };
      posts.unshift(newReplyData);

      // Update thread lastActivity and replyCount
      const threadIndex = threads.findIndex(t => t.id === threadId);
      if (threadIndex > -1) {
        threads[threadIndex].lastActivity = currentDate;
        threads[threadIndex].replyCount += 1;
      } else {
        console.warn(`[Forum Action JSON] Thread with ID ${threadId} not found for updating reply count.`);
      }
      
      const postsWritten = writeJsonFile<Post>('posts.json', posts);
      const threadsWritten = writeJsonFile<Thread>('threads.json', threads);

      if (!postsWritten || !threadsWritten) {
        throw new Error("Failed to write reply data to JSON files.");
      }

      console.log("[Forum Action JSON] New reply saved to JSON.");
      revalidatePath(`/forum/${threadId}`); // Revalidate thread page

      return {
        success: true,
        message: 'Reply submitted successfully!',
        moderation: moderationResult,
        submittedContent: { ...validatedFields.data, threadId: (validatedFields.data as any).threadId || undefined },
      };
    } else {
      console.error("[Forum Action JSON] Invalid form submission type or missing required fields for JSON operation.");
      return { success: false, message: "Invalid form submission type or missing required fields." };
    }

  } catch (error: any) {
    console.error("[Forum Action JSON] ERROR:", error);
    console.error("[Forum Action JSON] Error message:", error.message);
    console.error("[Forum Action JSON] Error stack:", error.stack);
    return {
      success: false,
      message: error.message || `An error occurred while submitting your post. Please try again later.`,
      submittedContent: { ...validatedFields.data, title: (validatedFields.data as any).title || undefined, threadId: (validatedFields.data as any).threadId || undefined },
    };
  }
}
