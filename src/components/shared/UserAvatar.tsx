import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  user: {
    name: string;
    avatarUrl?: string;
    id: string;
  };
  className?: string;
}

export default function UserAvatar({ user, className }: UserAvatarProps) {
  const initials = user.name
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Avatar className={cn('h-8 w-8', className)}>
      {user.avatarUrl ? (
        <AvatarImage src={user.avatarUrl} alt={user.name} />
      ) : null}
      <AvatarFallback className="text-xs">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
