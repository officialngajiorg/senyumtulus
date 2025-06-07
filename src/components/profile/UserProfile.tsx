import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UserAvatar from '@/components/shared/UserAvatar';
import { format } from 'date-fns';

interface UserProfileProps {
  profile: {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
    joinedAt: string;
    bio?: string;
  };
}

export default function UserProfile({ profile }: UserProfileProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-4">
          <UserAvatar
            user={{
              name: profile.name,
              avatarUrl: profile.avatarUrl,
              id: profile.id
            }}
            className="h-16 w-16"
          />
          <div>
            <CardTitle className="text-2xl">{profile.name}</CardTitle>
            <p className="text-muted-foreground">{profile.email}</p>
            <Badge variant="secondary" className="mt-2">
              Bergabung {format(new Date(profile.joinedAt), 'MMM yyyy')}
            </Badge>
          </div>
        </div>
      </CardHeader>
      {profile.bio && (
        <CardContent>
          <p className="text-sm">{profile.bio}</p>
        </CardContent>
      )}
    </Card>
  );
}
