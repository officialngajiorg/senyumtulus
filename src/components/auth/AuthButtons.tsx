
"use client";
import { Button } from '@/components/ui/button';
import { UserCircle, LogIn, UserPlus, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function AuthButtons({ mobile = false }: { mobile?: boolean }) {
  const { user, logout, loading } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
    } catch (error) {
      toast({ title: "Logout Error", description: "Failed to log out. Please try again.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
       <div className={`flex ${mobile ? "flex-col space-y-3" : "items-center space-x-2"}`}>
        <Button variant="outline" size="sm" className={`w-full ${mobile ? 'justify-start text-base py-3' : ''}`} disabled>
          Loading...
        </Button>
      </div>
    );
  }

  if (user) {
    return (
      <div className={`flex ${mobile ? "flex-col space-y-3" : "items-center space-x-2"}`}>
        <Link href="/profile" passHref>
          <Button variant={mobile ? "ghost" : "outline"} size="sm" className={`w-full ${mobile ? 'justify-start text-base py-3' : ''}`}>
            <UserCircle className="mr-2 h-5 w-5" />
            Profile
          </Button>
        </Link>
        <Button 
          variant={mobile ? "ghost" : "outline"} 
          size="sm" 
          onClick={handleLogout}
          className={`w-full ${mobile ? 'justify-start text-base py-3' : ''}`}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex ${mobile ? "flex-col space-y-3" : "items-center space-x-2"}`}>
      <Link href="/login" passHref>
        <Button variant="outline" size="sm" className={`w-full ${mobile ? 'justify-start text-base py-3' : ''}`}>
          <LogIn className="mr-2 h-5 w-5" />
          Login
        </Button>
      </Link>
      <Link href="/signup" passHref>
        <Button size="sm" className={`w-full ${mobile ? 'bg-primary text-primary-foreground hover:bg-primary/90 justify-start text-base py-3' : ''}`}>
          <UserPlus className="mr-2 h-5 w-5" />
          Sign Up
        </Button>
      </Link>
    </div>
  );
}
