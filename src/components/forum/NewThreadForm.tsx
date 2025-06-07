"use client";

import { useFormState } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { submitPostForModeration } from '@/lib/actions/forumActions';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NewThreadForm() {
  const router = useRouter();
  const [state, formAction] = useFormState(submitPostForModeration, null);

  // Hardcode user for testing - replace with your auth system
  const user = {
    id: 'test-user-123',
    fullName: 'Test User',
    imageUrl: ''
  };

  useEffect(() => {
    if (state?.success && state?.newThreadId) {
      router.push(`/forum/${state.newThreadId}`);
    }
  }, [state, router]);

  return (
    <Card>
      <CardContent className="p-6">
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="userId" value={user.id} />
          <input type="hidden" name="userName" value={user.fullName || 'Anonymous'} />
          <input type="hidden" name="userAvatarUrl" value={user.imageUrl || ''} />

          <div className="space-y-2">
            <Label htmlFor="title">Thread Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter your thread title..."
              required
              className={state?.errorFields?.title ? 'border-red-500' : ''}
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
      </CardContent>
    </Card>
  );
}
