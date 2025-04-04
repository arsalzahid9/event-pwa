import { useEffect, useState } from 'react';
import EventCard from '../components/EventCard';
import { Event } from '../types';
import { Users } from 'lucide-react';
import { getEvents } from '../api/Guide/events';

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
          image_url: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd',
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
    return <div className="min-h-screen bg-gray-50 p-4">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-50 p-4">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Events</h1>
        {/* <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
          <Users size={18} className="text-gray-600" />
          <span className="ml-1 text-gray-600">{totalParticipants}</span>
        </div> */}
      </div>
      <div className="space-y-4">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}