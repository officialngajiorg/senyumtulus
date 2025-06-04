
"use client";

import React, { useEffect, useRef } from 'react';
import { useActionState } from 'react'; // Corrected import
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import MediaUpload from '@/components/shared/MediaUpload'; // Attachment upload deferred
import { submitPostForModeration } from '@/lib/actions/forumActions';
import type { PostSubmissionResult } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import FormSubmitButton from '@/components/shared/FormSubmitButton';
import { useAuth } from '@/contexts/AuthContext';

const ReplySchema = z.object({
  content: z.string().min(5, "Reply must be at least 5 characters long.").max(5000, "Reply cannot exceed 5000 characters."),
  userId: z.string().min(1, "User ID is required."),
  userName: z.string().min(1, "User name is required."),
  userAvatarUrl: z.string().url().optional().or(z.literal('')),
  threadId: z.string().min(1, "Thread ID is required."),
});

type ReplyFormValues = z.infer<typeof ReplySchema>;

interface NewReplyFormProps {
  threadId: string;
  onReplySubmitted?: () => void;
}

const initialState: PostSubmissionResult | null = null;

export default function NewReplyForm({ threadId, onReplySubmitted }: NewReplyFormProps) {
  const { user, loading: authLoading } = useAuth();
  const [state, formAction] = useActionState(submitPostForModeration, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(ReplySchema),
    defaultValues: {
      content: "",
      userId: user?.uid || "",
      userName: user?.displayName || "Anonymous",
      userAvatarUrl: user?.photoURL || "",
      threadId: threadId,
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue('userId', user.uid);
      form.setValue('userName', user.displayName || 'Anonymous');
      form.setValue('userAvatarUrl', user.photoURL || '');
    }
    form.setValue('threadId', threadId);
  }, [user, form, threadId]);

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Success!",
        description: state.message,
      });
      form.reset({ 
        content: '', 
        userId: user?.uid || '', 
        userName: user?.displayName || 'Anonymous', 
        userAvatarUrl: user?.photoURL || '', 
        threadId: threadId 
      });
      formRef.current?.reset();
      if (onReplySubmitted) {
        onReplySubmitted();
      }
    } else if (state && !state.success && state.message) {
      toast({
        title: "Error",
        description: state.message,
        variant: "destructive",
      });
      if (state.errorFields?.content) {
        form.setError("content", { type: "server", message: state.errorFields.content });
      }
    }
  }, [state, toast, form, onReplySubmitted, user, threadId]);

  if (authLoading) {
    return <p>Loading user information...</p>;
  }

  if (!user) {
    return <p>Please <a href="/login" className="underline text-primary">login</a> to reply.</p>;
  }

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={formAction}
        // onSubmit prop removed to rely on native form action with RHF validation
        className="space-y-6 p-4 border rounded-lg shadow-sm bg-card mt-6"
      >
        <h3 className="text-xl font-semibold font-headline">Post a Reply</h3>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="reply-content">Your Reply</FormLabel>
              <FormControl>
                <Textarea
                  id="reply-content"
                  placeholder="Share your thoughts..."
                  rows={5}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <input type="hidden" {...form.register("userId")} />
        <input type="hidden" {...form.register("userName")} />
        <input type="hidden" {...form.register("userAvatarUrl")} />
        <input type="hidden" {...form.register("threadId")} />
        
        {/* <FormField
          control={form.control}
          name="attachment" // Requires schema update and handling
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attach File (Optional)</FormLabel>
              <FormControl>
                 <MediaUpload onFileChange={(file) => field.onChange(file)} idSuffix="reply" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
        
        <FormSubmitButton buttonText="Submit Reply" pendingText="Submitting..." />

        {state && !state.success && state.message && !state.errorFields && (
          <p className="text-sm font-medium text-destructive">{state.message}</p>
        )}
      </form>
    </Form>
  );
}
