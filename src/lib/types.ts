// Interfaces for the forum data structures
export interface AuthorInfo {
  userId: string;
  name: string;
  avatarUrl?: string;
}

export interface Thread {
  id: string;
  title: string;
  author: AuthorInfo;
  originalPostContent: string;
  originalPostId: string;
  createdAt: string;
  lastActivity: string;
  replyCount: number;
  viewCount: number;
}

export interface Post {
  id: string;
  threadId: string;
  author: AuthorInfo;
  content: string;
  timestamp: string;
  likes: number;
  reports: number;
}

export interface ForumData {
  threads: Thread[];
  totalThreads: number;
  totalPosts: number;
}

export interface PostSubmissionResult {
  success: boolean;
  message: string;
  newThreadId?: string;
  errorFields?: { [key: string]: string };
  moderation?: {
    isAppropriate: boolean;
    reason?: string;
    score?: number;
  };
  submittedContent?: any;
}

export interface Volunteer {
  id: string;
  name: string;
  avatarUrl?: string;
  bannerUrl?: string;
  city: string;
  province: string;
  bio?: string;
  experience?: string;
  specialization?: string[];
  availability?: string;
  contact?: {
    email?: string;
    whatsapp?: string;
  };
  socialMedia?: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}
