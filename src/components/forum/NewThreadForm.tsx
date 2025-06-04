
"use client";

import React, { useEffect, useRef } from 'react';
import { useActionState } from 'react'; // Corrected import
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import MediaUpload from '@/components/shared/MediaUpload'; // Attachment upload deferred
import { submitPostForModeration } from '@/lib/actions/forumActions';
import type { PostSubmissionResult } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import FormSubmitButton from '@/components/shared/FormSubmitButton';
import { useAuth } from '@/contexts/AuthContext';

const NewThreadSchema = z.object({
  title: z.string(), // Validation for min/max length removed
  content: z.string(), // Validation for min/max length removed
  userId: z.string().min(1, "User ID is required."),
  userName: z.string().min(1, "User name is required."),
  userAvatarUrl: z.string().url().optional().or(z.literal('')).nullable(),
});

type NewThreadFormValues = z.infer<typeof NewThreadSchema>;

const initialState: PostSubmissionResult | null = null;

export default function NewThreadForm() {
  const { user, loading: authLoading } = useAuth();
  const [state, formAction] = useActionState(submitPostForModeration, initialState);
  const { toast } = useToast();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<NewThreadFormValues>({
    resolver: zodResolver(NewThreadSchema),
    defaultValues: {
      title: "",
      content: "",
      userId: user?.id || "",
      userName: user?.name || "Anonymous",
      userAvatarUrl: user?.avatarUrl || null,
    },
  });
  
  useEffect(() => {
    if (user) {
      form.setValue('userId', user.id);
      form.setValue('userName', user.name || 'Anonymous');
      form.setValue('userAvatarUrl', user.avatarUrl || null);
    }
  }, [user, form]);

  useEffect(() => {
    if (state?.success) {
      toast({
        title: "Success!",
        description: state.message,
      });
      router.push(state.newThreadId ? `/forum/${state.newThreadId}` : '/forum'); 
      form.reset({ 
        title: "", 
        content: "", 
        userId: user?.id || '', 
        userName: user?.name || 'Anonymous', 
        userAvatarUrl: user?.avatarUrl || null
      });
      formRef.current?.reset();
    } else if (state && !state.success && state.message) {
      toast({
        title: "Error Creating Thread",
        description: state.message,
        variant: "destructive",
      });
      if (state.errorFields?.title) {
        form.setError("title", { type: "server", message: state.errorFields.title });
      }
      if (state.errorFields?.content) {
        form.setError("content", { type: "server", message: state.errorFields.content });
      }
    }
  }, [state, toast, router, form, user]);

  if (authLoading) {
    return <p>Loading user information...</p>;
  }

  if (!user) {
    return <p>Please <a href="/login" className="underline text-primary">login</a> to create a new thread.</p>;
  }

  return (
    <Form {...form}>
      <form
        ref={formRef}
        action={formAction}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="thread-title">Thread Title</FormLabel>
              <FormControl>
                <Input id="thread-title" placeholder="Enter a descriptive title for your thread" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="thread-content">Your Post Content</FormLabel>
              <FormControl>
                <Textarea
                  id="thread-content"
                  placeholder="Share details, ask questions, or start a discussion..."
                  rows={8}
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <input type="hidden" {...form.register("userId")} value={user?.id || ""} />
        <input type="hidden" {...form.register("userName")} value={user?.name || "Anonymous"} />
        <input type="hidden" {...form.register("userAvatarUrl")} value={user?.avatarUrl || ""} />
        
        {/* <FormField
          control={form.control}
          name="attachment" // This would need proper schema and handling
          render={({ field }) => (
            <FormItem>
              <FormLabel>Attach File (Optional)</FormLabel>
              <FormControl>
                 <MediaUpload onFileChange={(file) => field.onChange(file)} idSuffix="newthread" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormSubmitButton buttonText="Create Thread" pendingText="Creating..." />

        {state && !state.success && state.message && !state.errorFields && (
           <p className="text-sm font-medium text-destructive">{state.message}</p>
        )}
      </form>
    </Form>
  );
}
