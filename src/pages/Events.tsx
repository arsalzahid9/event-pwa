import { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';
import { Event } from '../types';
import { Users, Calendar } from 'lucide-react'; // Add Calendar icon
import { getEvents } from '../api/Guide/events';
import Loader from '../components/Loader';

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents();
        setEvents(response.data.map((apiEvent: any) => ({
          id: apiEvent.id.toString(),
          title: apiEvent.name,
          date: apiEvent.date || 'Date not available',
          location: apiEvent.origin,
          image_url: apiEvent.image ||'https://images.unsplash.com/photo-1513581166391-887a96ddeafd',
          participants_count: response.total_participants,
          description: 'Explore this amazing event'
        })));
        setTotalParticipants(response.total_participants);
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
        {/* <h1 className="text-2xl font-bold">All Events</h1> */}
        <h1 className="text-2xl font-bold ml-0 md:ml-8">All Events</h1>

      </div>
      
      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
          <Calendar size={64} className="text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Events Found</h2>
          <p className="text-gray-400">There are currently no events available.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}