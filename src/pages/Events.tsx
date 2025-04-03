import { useState } from 'react';
import EventCard from '../components/EventCard';
import { Event } from '../types';
import { Users } from 'lucide-react';

export default function Events() {
  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'Florence Tour',
      date: '02/03/2025',
      location: 'Italia in Tour',
      image_url: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c',
      participants_count: 15,
      description: 'Explore the beautiful city of Florence'
    },
    {
      id: '2',
      title: 'Bologna Tour',
      date: '05/03/2025',
      location: 'Italia in Tour',
      image_url: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd',
      participants_count: 12,
      description: 'Discover the rich history of Bologna'
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Events</h1>
        <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
          <Users size={18} className="text-gray-600" />
          <span className="ml-1 text-gray-600">63</span>
        </div>
      </div>
      <div className="space-y-4">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}