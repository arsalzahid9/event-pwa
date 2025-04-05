import { useEffect, useState } from 'react';
import EventCard from '../../components/EventCard';
import { Event } from '../../types';
import { getEvents } from '../../api/Admin/getAllEvents';
import Loader from '../../components/Loader';

export default function AllEvent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Since getEvents returns an array, map directly on it
        const eventsArray = await getEvents();
        setEvents(eventsArray.map((apiEvent: any) => ({
          id: apiEvent.id.toString(),
          title: apiEvent.name,
          date: apiEvent.event_date 
            ? new Date(apiEvent.event_date).toLocaleDateString() 
            : 'Date not available',
          location: apiEvent.origin,
          image_url: apiEvent.image || 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd',
          description: 'Explore this amazing event'
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-50 p-4">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Events</h1>
      </div>
      <div className="space-y-4">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}
