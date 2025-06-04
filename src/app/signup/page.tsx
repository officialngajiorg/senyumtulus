
"use client";
import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
// Removed Firebase imports
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

export default function SignupPage() {
  const [name, setName] = useState('');
  // Email and password fields can be kept for UI consistency, but won't be used for complex auth
  const [email, setEmail] = useState(''); 
  // const [password, setPassword] = useState(''); 
  // const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { signup } = useAuth(); // Get signup from useAuth

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // if (password !== confirmPassword) {
    //   setError("Passwords do not match.");
    //   toast({ title: "Signup Error", description: "Passwords do not match.", variant: "destructive" });
    //   return;
    // }
    if (!name) {
      setError("Name is required.");
      toast({ title: "Signup Error", description: "Name is required.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // Simplified signup, just uses name. Email might be stored in users.json if implemented.
      await signup(name); 
      toast({ title: "Signup Successful", description: "Your mock account has been created." });
      router.push('/'); 
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred.";
      setError(errorMessage);
      toast({ title: "Signup Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold font-headline text-primary">Create Account</CardTitle>
          <CardDescription>Join SenyumTulus Connect (mock signup).</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
             <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // not required for mock
                disabled={isLoading}
              />
            </div>
            {/* Password fields removed for mock signup
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>
            */}
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign Up
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-sm">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
