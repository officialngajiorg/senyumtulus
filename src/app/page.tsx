import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="text-center py-12 md:py-16 rounded-xl bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tight text-primary">
            Welcome to SenyumTulus Connect
          </h1>
          <p className="mt-4 text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto">
            A supportive community for individuals and families affected by Cleft Lip and Palate (CBL). Share experiences, find resources, and connect with volunteers.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
              <Link href="/forum">
                Join the Discussion <MessageSquare className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
              <Link href="/volunteers">
                Find Volunteers <Users className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-3xl font-headline font-semibold text-primary mb-4">Our Mission</h2>
          <p className="text-foreground/80 mb-3 leading-relaxed">
            SenyumTulus Connect aims to create a safe and informative space where parents, individuals with CBL, and volunteers can connect, share knowledge, and support one another through the journey of CBL.
          </p>
          <p className="text-foreground/80 leading-relaxed">
            Whether you're seeking advice on surgical stages, therapy options, psychological support, or simply want to share your story, you've come to the right place.
          </p>
        </div>
        <div className="rounded-lg overflow-hidden shadow-xl">
           <Image 
            src="https://placehold.co/600x400.png" 
            alt="Supportive community" 
            width={600} 
            height={400} 
            className="w-full h-auto object-cover"
            data-ai-hint="community support" 
          />
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-headline">
              <MessageSquare className="mr-3 h-7 w-7 text-primary" />
              Discussion Forum
            </CardTitle>
            <CardDescription>
              Engage in meaningful conversations, ask questions, and share your experiences with CBL.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-foreground/80">
              Our forum is a place for open dialogue. Discuss treatment stages, therapy, emotional well-being, and more. Upload relevant photos or documents to support your discussions.
            </p>
            <Button asChild variant="link" className="text-primary p-0 h-auto">
              <Link href="/forum">
                Explore Forum <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-headline">
              <Users className="mr-3 h-7 w-7 text-primary" />
              Volunteer Directory
            </CardTitle>
            <CardDescription>
              Connect with dedicated volunteers across various regions for guidance and support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-foreground/80">
              Find volunteers based on their location, expertise, and experience. Our directory helps you connect with individuals ready to offer their help.
            </p>
            <Button asChild variant="link" className="text-primary p-0 h-auto">
              <Link href="/volunteers">
                Browse Volunteers <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
