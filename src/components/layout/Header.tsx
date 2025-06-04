"use client";

import React from 'react';
import Link from 'next/link';
import { Menu, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import AuthButtons from '@/components/auth/AuthButtons';

const NavLink = ({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) => (
  <Link href={href} className="text-foreground/80 hover:text-foreground transition-colors block py-2 md:py-0" onClick={onClick}>
    {children}
  </Link>
);

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-lg">
          <Smile className="h-7 w-7 text-primary" />
          <span className="font-headline font-semibold">SenyumTulus</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <NavLink href="/forum">Forum</NavLink>
          <NavLink href="/volunteers">Volunteers</NavLink>
          {/* <NavLink href="/articles">Articles</NavLink> */}
          {/* <NavLink href="/events">Events</NavLink> */}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <AuthButtons />
        </div>

        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[320px]">
              <nav className="grid gap-4 text-base font-medium mt-8">
                <Link href="/" className="flex items-center gap-2 text-lg font-semibold mb-4" onClick={() => setIsMobileMenuOpen(false)}>
                   <Smile className="h-7 w-7 text-primary" />
                   <span className="font-headline">SenyumTulus</span>
                </Link>
                <NavLink href="/forum" onClick={() => setIsMobileMenuOpen(false)}>Forum</NavLink>
                <NavLink href="/volunteers" onClick={() => setIsMobileMenuOpen(false)}>Volunteers</NavLink>
                {/* <NavLink href="/articles" onClick={() => setIsMobileMenuOpen(false)}>Articles</NavLink> */}
                {/* <NavLink href="/events" onClick={() => setIsMobileMenuOpen(false)}>Events</NavLink> */}
                <hr className="my-4 border-border" />
                <AuthButtons mobile />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
