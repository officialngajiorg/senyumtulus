import NewThreadForm from '@/components/forum/NewThreadForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NewThreadPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/forum">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Forum
        </Link>
      </Button>
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-bold font-headline text-primary">Create a New Thread</CardTitle>
          <CardDescription>Share your thoughts, questions, or experiences with the community.</CardDescription>
        </CardHeader>
        <CardContent>
          <NewThreadForm />
        </CardContent>
      </Card>
    </div>
  );
}
