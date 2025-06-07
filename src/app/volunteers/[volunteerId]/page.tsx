// src/app/volunteers/[volunteerId]/page.tsx
import UserAvatar from '@/components/shared/UserAvatar';
import type { Volunteer } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Users, Globe, MessageCircle, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { readJsonFile } from '@/lib/json-utils'; // Using JSON utils

async function getVolunteerById(id: string): Promise<Volunteer | undefined> {
  const volunteers = readJsonFile<Volunteer>('volunteers.json');
  return volunteers.find(v => v.id === id);
}

export default async function VolunteerPage({ 
  params 
}: { 
  params: Promise<{ volunteerId: string }> 
}) {
  const { volunteerId } = await params;
  
  const volunteer = await getVolunteerById(volunteerId);

  if (!volunteer) {
    return (
      <div className="text-center py-12">
         <Alert variant="destructive" className="max-w-md mx-auto">
          <AlertTitle className="text-2xl font-semibold">Volunteer Not Found</AlertTitle>
          <AlertDescription>
            The volunteer profile you are looking for does not exist or has been removed.
          </AlertDescription>
        </Alert>
        <Button asChild variant="link" className="mt-6">
          <Link href="/volunteers">Back to Volunteer Directory</Link>
        </Button>
      </div>
    );
  }

  const SocialIcon = ({ platform, url }: { platform: string, url: string }) => {
    let IconComponent;
    switch (platform.toLowerCase()) { // ensure consistent casing
      case 'linkedin': IconComponent = Linkedin; break;
      case 'twitter': IconComponent = Twitter; break;
      case 'facebook': IconComponent = Facebook; break;
      case 'instagram': IconComponent = Instagram; break;
      default: IconComponent = Globe;
    }
    return (
      <Button variant="outline" size="icon" asChild>
        <Link href={url} target="_blank" rel="noopener noreferrer" aria-label={`${platform} profile`}>
          <IconComponent className="h-5 w-5" />
        </Link>
      </Button>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="outline" asChild className="mb-0">
        <Link href="/volunteers">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
        </Link>
      </Button>

      <Card className="shadow-xl overflow-hidden">
        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20">
          <Image 
            src={volunteer.bannerUrl || "https://placehold.co/1200x300.png"} 
            alt={`${volunteer.name}'s banner`} 
            layout="fill" 
            objectFit="cover" 
            data-ai-hint={volunteer.bannerUrl ? "volunteer banner" : "abstract pattern"} 
          />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
            <UserAvatar user={{ name: volunteer.name, avatarUrl: volunteer.avatarUrl, id: volunteer.id }} className="h-32 w-32 border-4 border-background shadow-lg" />
          </div>
        </div>
        
        <CardHeader className="text-center pt-20 pb-6">
          <CardTitle className="text-3xl md:text-4xl font-bold font-headline text-primary">{volunteer.name}</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            <MapPin className="inline-block h-5 w-5 mr-1" /> {volunteer.city}, {volunteer.province}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-4 md:px-8 pb-8">
          <section className="mb-8">
            <h2 className="text-xl font-semibold font-headline mb-3">About Me</h2>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{volunteer.bio || "No biography provided."}</p>
          </section>

          <Separator className="my-6" />

          <section className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold font-headline mb-3 flex items-center"><Briefcase className="mr-2 h-5 w-5 text-primary"/> Experience & Specialization</h3>
              <p className="text-sm text-foreground/80 mb-2 leading-relaxed whitespace-pre-line">{volunteer.experience || "Not specified."}</p>
              {volunteer.specialization && volunteer.specialization.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Specializes in:</h4>
                  <div className="flex flex-wrap gap-2">
                    {volunteer.specialization.map(spec => (
                      <Badge key={spec} variant="default" className="bg-primary/80 text-primary-foreground">{spec}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold font-headline mb-3 flex items-center"><Users className="mr-2 h-5 w-5 text-primary"/> Availability</h3>
              <p className="text-sm text-foreground/80">{volunteer.availability || "Not specified"}</p>
            </div>
          </section>
          
          <Separator className="my-6" />

          <section>
            <h2 className="text-xl font-semibold font-headline mb-4">Contact Information</h2>
            <div className="space-y-3">
              {volunteer.contact?.email && (
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-primary" />
                  <Link href={`mailto:${volunteer.contact.email}`} className="text-foreground hover:text-primary hover:underline">
                    {volunteer.contact.email}
                  </Link>
                </div>
              )}
              {volunteer.contact?.whatsapp && (
                <div className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-3 text-primary" /> 
                  <Link href={`https://wa.me/${volunteer.contact.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary hover:underline">
                    {volunteer.contact.whatsapp} (WhatsApp)
                  </Link>
                </div>
              )}
              {!volunteer.contact?.email && !volunteer.contact?.whatsapp && (
                <p className="text-sm text-muted-foreground">Contact information not publicly available.</p>
              )}
            </div>

            {volunteer.socialMedia && Object.values(volunteer.socialMedia).some(sm => sm) && (
              <div className="mt-6">
                <h3 className="text-md font-semibold text-muted-foreground mb-2">Social Media:</h3>
                <div className="flex space-x-3">
                  {volunteer.socialMedia.linkedin && <SocialIcon platform="linkedin" url={volunteer.socialMedia.linkedin} />}
                  {volunteer.socialMedia.twitter && <SocialIcon platform="twitter" url={volunteer.socialMedia.twitter} />}
                  {volunteer.socialMedia.facebook && <SocialIcon platform="facebook" url={volunteer.socialMedia.facebook} />}
                  {volunteer.socialMedia.instagram && <SocialIcon platform="instagram" url={volunteer.socialMedia.instagram} />}
                </div>
              </div>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
