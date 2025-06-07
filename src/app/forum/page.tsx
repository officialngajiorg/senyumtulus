import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import ForumThreadList from '@/components/forum/ForumThreadList';
import { getForumThreads } from '@/lib/actions/forumActions';

export default async function ForumPage() {
  const threads = await getForumThreads();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">Community Forum</h1>
        <Button asChild>
          <Link href="/forum/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Thread
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Discussions</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Loading threads...</div>}>
            <ForumThreadList threads={threads} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
