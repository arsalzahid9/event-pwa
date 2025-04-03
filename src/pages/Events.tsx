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
    },
    // New events added below
    {
      id: '3',
      title: 'Rome Highlights',
      date: '15/04/2025',
      location: 'Eternal City Tours',
      image_url: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd',
      participants_count: 20,
      description: 'Experience the ancient wonders of Rome'
    },
    {
      id: '4',
      title: 'Venice Canals',
      date: '22/05/2025',
      location: 'Venetian Adventures',
      image_url: 'https://images.unsplash.com/photo-1514890547357-a9ee288728e0',
      participants_count: 18,
      description: 'Gondola rides through historic waterways'
    },
    {
      id: '5',
      title: 'Milan Fashion Tour',
      date: '10/06/2025',
      location: 'Lombardy Cultural',
      image_url: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd',
      participants_count: 14,
      description: 'Discover Milan\'s fashion district'
    },
    {
      id: '6',
      title: 'Naples Coast',
      date: '01/07/2025',
      location: 'Southern Italy Tours',
      image_url: 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd',
      participants_count: 16,
      description: 'Explore the Amalfi Coast and Pompeii'
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