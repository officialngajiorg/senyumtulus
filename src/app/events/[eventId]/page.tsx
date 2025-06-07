// src/app/events/[eventId]/page.tsx

export default async function EventPage({ 
  params 
}: { 
  params: Promise<{ eventId: string }> 
}) {
  const { eventId } = await params;

  // Mock event data, replace with real data if available
  const eventDetails = {
    id: eventId,
    title: 'Sample Event',
    description: 'This is a sample event description.',
    date: new Date().toISOString(),
    location: 'Sample Location'
  };

  if (!eventDetails) {
    return <div>Event not found</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{eventDetails.title}</h1>
      <p>Event ID: {eventId}</p>
      <p>{eventDetails.description}</p>
      <p>Date: {new Date(eventDetails.date).toLocaleString()}</p>
      <p>Location: {eventDetails.location}</p>
    </div>
  );
}