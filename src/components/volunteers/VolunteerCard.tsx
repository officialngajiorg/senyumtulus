import type { Volunteer } from '@/lib/types';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, Briefcase, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import UserAvatar from '@/components/shared/UserAvatar';

interface VolunteerCardProps {
  volunteer: Volunteer;
}

export default function VolunteerCard({ volunteer }: VolunteerCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out flex flex-col h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start space-x-4">
          <UserAvatar user={{ name: volunteer.name, avatarUrl: volunteer.avatarUrl, id: volunteer.id }} className="h-16 w-16" />
          <div className="flex-1">
            <CardTitle className="text-xl font-headline">
              <Link href={`/volunteers/${volunteer.id}`} className="hover:text-primary transition-colors">
                {volunteer.name}
              </Link>
            </CardTitle>
            <CardDescription className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" /> {volunteer.city}, {volunteer.province}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow pb-4">
        <p className="text-sm text-foreground/80 line-clamp-3 mb-3 leading-relaxed">
          {volunteer.bio || volunteer.experience}
        </p>
        {volunteer.specialization && volunteer.specialization.length > 0 && (
          <div className="space-x-1 space-y-1">
            {volunteer.specialization.slice(0, 3).map(spec => (
              <Badge key={spec} variant="secondary" className="text-xs">{spec}</Badge>
            ))}
            {volunteer.specialization.length > 3 && <Badge variant="outline" className="text-xs">+{volunteer.specialization.length - 3} more</Badge>}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 pb-4 border-t">
        <Button asChild variant="outline" size="sm" className="w-full">
          <Link href={`/volunteers/${volunteer.id}`}>
            View Profile
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
