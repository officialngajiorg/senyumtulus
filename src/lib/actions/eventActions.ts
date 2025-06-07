'use server';

export async function getEventDetails(eventId: string) {
  try {
    console.log(`[Event Action] Getting event details for ${eventId}`);
    
    // Mock event data - replace with actual database call
    const eventDetails = {
      id: eventId,
      title: 'Sample Event',
      description: 'This is a sample event description.',
      date: new Date().toISOString(),
      location: 'Sample Location'
    };
    
    return eventDetails;
  } catch (error) {
    console.error(`[Event Action] Error getting event ${eventId}:`, error);
    return null;
  }
}
