// src/app/events/[eventId]/page.tsx
import { getEventDetails } from '@/lib/actions/eventActions';

export default async function EventPage({ 
  params 
}: { 
  params: Promise<{ eventId: string }> 
}) {
  const { eventId } = await params;
  
  const eventDetails = await getEventDetails(eventId);

  if (!eventDetails) {
    return <div>Event not found</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{eventDetails.title}</h1>
      <p>{eventDetails.description}</p>
      <p>Date: {new Date(eventDetails.date).toLocaleString()}</p>
      <p>Location: {eventDetails.location}</p>
    </div>
  );
}