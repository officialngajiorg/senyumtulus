"use client";

import React, { useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { submitPostForModeration } from '@/lib/actions/forumActions';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

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
  const { user } = useUser();
  const router = useRouter();
  const [state, formAction] = useFormState(submitPostForModeration, initialState);
  const { toast } = useToast();
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

  if (!user) {
    return (
      <Alert>
        <AlertDescription>
          Please sign in to create a new thread.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form
            ref={formRef}
            action={formAction}
            className="space-y-4"
          >
            <input type="hidden" {...form.register("userId")} value={user?.id || ""} />
            <input type="hidden" {...form.register("userName")} value={user?.name || "Anonymous"} />
            <input type="hidden" {...form.register("userAvatarUrl")} value={user?.avatarUrl || ""} />

            <div className="space-y-2">
              <Label htmlFor="title">Thread Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter your thread title..."
                required
                className={state?.errorFields?.title ? 'border-red-500' : ''}
                {...form.register("title")}
              />
              {state?.errorFields?.title && (
                <p className="text-sm text-red-500">{state.errorFields.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="Write your post content..."
                rows={8}
                required
                className={state?.errorFields?.content ? 'border-red-500' : ''}
                {...form.register("content")}
              />
              {state?.errorFields?.content && (
                <p className="text-sm text-red-500">{state.errorFields.content}</p>
              )}
            </div>

            {state?.message && !state.success && (
              <Alert variant="destructive">
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}

            {state?.success && (
              <Alert>
                <AlertDescription className="text-green-600">
                  {state.message}
                </AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full">
              Create Thread
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
