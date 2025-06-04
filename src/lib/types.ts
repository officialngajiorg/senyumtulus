
// No longer importing Timestamp from firebase/firestore

// User information stored with posts/threads (denormalized)
export type AuthorInfo = {
  userId: string;
  name: string; // displayName from Firebase Auth or mock user
  avatarUrl?: string; // photoURL from Firebase Auth or mock user
};

// Represents a User object for client-side use and mock auth
export type User = {
  id: string; // Mock User ID or Firebase Auth UID
  name: string; 
  avatarUrl?: string; 
  email?: string | null; // Kept for potential future use or if users.json stores it
};


// Forum Post (can be original post or reply)
export interface Post {
  id: string; // Unique ID for the post
  threadId: string; // ID of the thread this post belongs to
  author: AuthorInfo;
  content: string;
  timestamp: string; // ISO date string
  likes: number;
  reports: number; // count of reports
  attachments?: Array<{ type: 'image' | 'document'; url: string; name: string; hint?: string }>;
}

// Forum Thread
export type Thread = {
  id: string; // Unique ID for the thread
  title: string;
  author: AuthorInfo; // Author of the original post
  originalPostContent: string; // A snippet or full content of the first post for list display
  originalPostId: string; // ID of the first post document
  createdAt: string; // ISO date string
  lastActivity: string; // ISO date string
  replyCount: number;
  viewCount: number; 
  isLocked?: boolean;
  isPinned?: boolean;
};

// Volunteer
export type Volunteer = {
  id: string; // Unique ID for the volunteer
  name: string;
  province: string; 
  city: string;
  contact?: { 
    whatsapp?: string;
    email?: string;
  };
  experience: string;
  specialization?: string[]; 
  availability?: string; 
  socialMedia?: { 
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
};

// For AI Moderation server action
import type { ModerateForumContentOutput } from '@/ai/flows/moderate-forum-content';
export type PostSubmissionResult = {
  success: boolean;
  message: string;
  newThreadId?: string; // To redirect after creating a new thread
  moderation?: ModerateForumContentOutput;
  submittedContent?: { title?: string; content: string; userId?: string; userName?: string; userAvatarUrl?: string; threadId?: string; };
  errorFields?: { [key: string]: string };
};
