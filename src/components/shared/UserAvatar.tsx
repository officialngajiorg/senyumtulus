
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User as UserType } from '@/lib/types'; // Renamed to avoid conflict

interface UserAvatarProps {
  user?: Pick<UserType, 'name' | 'avatarUrl' | 'id'>; // User can be undefined, id is for key prop if needed
  className?: string;
}

export default function UserAvatar({ user, className }: UserAvatarProps) {
  if (!user || !user.name) {
    return (
      <Avatar className={className}>
        <AvatarFallback>??</AvatarFallback>
      </Avatar>
    );
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean) 
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <Avatar className={cn("h-10 w-10", className)}>
      {user.avatarUrl ? (
        <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person portrait" />
      ) : null}
      <AvatarFallback>{initials || "??"}</AvatarFallback>
    </Avatar>
  );
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
