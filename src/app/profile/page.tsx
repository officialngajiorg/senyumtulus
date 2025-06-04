
"use client";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import UserAvatar from '@/components/shared/UserAvatar';
import { Button } from '@/components/ui/button';
import { Loader2, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast(); 

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login'); 
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push('/');
    } catch (error: any) {
      toast({ title: "Logout Error", description: error.message || "Failed to log out. Please try again.", variant: "destructive" });
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <UserAvatar user={{ name: user.name, avatarUrl: user.avatarUrl, id: user.id }} className="h-24 w-24 text-2xl" />
          </div>
          <CardTitle className="text-3xl font-bold font-headline text-primary">{user.name || "User Profile"}</CardTitle>
          <CardDescription>{user.email || 'No email provided'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Account Details (Mock)</h3>
            <p><span className="font-medium">Display Name:</span> {user.name || 'Not set'}</p>
            <p><span className="font-medium">Email:</span> {user.email || 'Not set'}</p>
            <p><span className="font-medium">User ID:</span> {user.id}</p>
          </div>
          
          <Button onClick={handleLogout} variant="destructive" className="w-full">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
