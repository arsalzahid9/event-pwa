import { useEffect, useState } from 'react';
import EventCard from '../../components/EventCard';
import { Event } from '../../types';
import { getEvents } from '../../api/Admin/getAllEvents';
import Loader from '../../components/Loader';
import { Users } from 'lucide-react';  // Add this import

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
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Event Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Location</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Description</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Image</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {events.map(event => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium">{event.title}</td>
                  <td className="px-6 py-4 text-sm">{event.location}</td>
                  <td className="px-6 py-4 text-sm">{event.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{event.description}</td>
                  <td className="px-6 py-4 text-sm">
                    {event.image_url ? (
                      <img 
                        src={event.image_url} 
                        alt={event.title}
                        className="h-12 w-12 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
