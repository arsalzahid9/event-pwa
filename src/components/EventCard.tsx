import { Users } from 'lucide-react';
import { Event } from '../types';
import { Link } from 'react-router-dom';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    // In the return statement of EventCard, wrap content with Link:
    <Link to={`/events/${event.id}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-md mb-4">
        <img 
          src={event.image_url} 
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="text-xl font-semibold">{event.title}</h3>
          <p className="text-gray-600 mt-1">{event.date}</p>
          <a 
            href={event.location}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-blue-600 hover:text-blue-800 hover:underline mt-1 block"
          >
            {event.location}
          </a>
          <div className="flex items-center mt-2">
            <Users size={18} className="text-gray-500" />
            <span className="ml-1 text-gray-600">{event.participants_count}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}