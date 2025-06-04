
// src/app/volunteers/page.tsx
import type { Volunteer } from '@/lib/types';
import { Users } from 'lucide-react';
import VolunteersPageContent from '@/components/volunteers/VolunteersPageContent';
import { readJsonFile } from '@/lib/json-utils'; // Using JSON utils

async function getVolunteers(): Promise<Volunteer[]> {
  // Read from local JSON file
  const volunteersList = readJsonFile<Volunteer>('volunteers.json');
  return volunteersList;
}

export default async function VolunteersPage() {
  const volunteers = await getVolunteers();

  return (
    <div className="space-y-8">
      <section className="text-center py-8 md:py-12 bg-card shadow rounded-lg">
        <Users className="mx-auto h-12 w-12 text-primary mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-primary">Volunteer Directory</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-xl mx-auto">
          Find and connect with dedicated volunteers ready to offer support and share experiences.
        </p>
      </section>
      <VolunteersPageContent initialVolunteers={volunteers} />
    </div>
  );
}
