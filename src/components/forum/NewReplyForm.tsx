"use client";

import React, { useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { submitPostForModeration } from '@/lib/actions/forumActions';

interface NewReplyFormProps {
  threadId: string;
}

export default function NewReplyForm({ threadId }: NewReplyFormProps) {
  const [state, formAction] = useFormState(submitPostForModeration, null);
  const formRef = useRef<HTMLFormElement>(null);

  // Hardcode user for testing - replace with your auth system
  const user = {
    id: 'test-user-123',
    fullName: 'Test User',
    imageUrl: ''
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post a Reply</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          ref={formRef}
          action={formAction}
          className="space-y-4"
        >
          <input type="hidden" name="threadId" value={threadId} />
          <input type="hidden" name="userId" value={user.id} />
          <input type="hidden" name="userName" value={user.fullName || 'Anonymous'} />
          <input type="hidden" name="userAvatarUrl" value={user.imageUrl || ''} />

          <div className="space-y-2">
            <Label htmlFor="content">Your Reply</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Write your reply..."
              rows={6}
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
            Post Reply
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
