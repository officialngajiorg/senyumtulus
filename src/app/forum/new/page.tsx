import NewThreadForm from '@/components/forum/NewThreadForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewThreadPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" asChild>
          <Link href="/forum">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Forum
          </Link>
        </Button>
        <h1 className="text-3xl font-bold font-headline">Create New Thread</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Start a New Discussion</CardTitle>
        </CardHeader>
        <CardContent>
          <NewThreadForm />
        </CardContent>
      </Card>
    </div>
  );
}
