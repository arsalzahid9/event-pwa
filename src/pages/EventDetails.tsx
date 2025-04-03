import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { Event, Participant } from '../types';

export default function EventDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [event] = useState<Event>({
    id: '1',
    title: 'Florence Tour',
    date: '02/03/2025',
    location: 'Italia in Tour',
    image_url: 'https://images.unsplash.com/photo-1534445867742-43195f401b6c',
    participants_count: 15,
    description: 'Explore the beautiful city of Florence'
  });

  // Update the useState for participants
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: '1',
      event_id: '1',
      name: 'John Doe',
      phone: '+1 234-567-8900',
      tickets: 2,
      amount: 150,
      payment_completed: true,
      checked_in: false
    },
    {
      id: '2',
      event_id: '1',
      name: 'Jane Smith',
      phone: '+1 234-567-8901',
      tickets: 3,
      amount: 150,
      payment_completed: false,
      checked_in: true
    }
  ]);
  
  // Update the handleCheckIn function
  const handleCheckIn = (participantId: string) => {
    setParticipants(prev => prev.map(participant => 
      participant.id === participantId 
        ? { ...participant, checked_in: !participant.checked_in }
        : participant
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative">
        <img 
          src={event.image_url}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{event.title}</h1>
          <div className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
            <Users size={18} className="text-gray-600" />
            <span className="ml-1 text-gray-600">{event.participants_count}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Name</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Phone</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Date</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Tickets</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Amount</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Payment</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Status</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Check-in</th>
              </tr>
            </thead>
            <tbody>
              {participants.map(participant => (
                <tr key={participant.id} className="border-b">
                  <td className="py-3 px-4 whitespace-nowrap">{participant.name}</td>
                  <td className="py-3 px-4">
                    <div className="text-xs text-gray-500">Phone</div>
                    <div className="whitespace-nowrap">{participant.phone}</div>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">{event.date}</td>
                  <td className="py-3 px-4 whitespace-nowrap">{participant.tickets}</td>
                  <td className="py-3 px-4 whitespace-nowrap">${participant.amount}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {participant.payment_completed ? (
                      <span className="text-green-600">Yes</span>
                    ) : (
                      <span className="text-red-600">No</span>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {participant.checked_in ? (
                      <span className="text-green-600">Checked In</span>
                    ) : (
                      <span className="text-red-600">Pending</span>
                    )}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={participant.checked_in}
                        onChange={() => handleCheckIn(participant.id)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
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