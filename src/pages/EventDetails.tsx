import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { Event, Participant } from '../types';
import { getEventDetails } from '../api/Guide/eventDetail';
import { checkInParticipant } from '../api/Guide/eventCheckin';

export default function EventDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        if (!id) return;

        const response = await getEventDetails(id);
        setEvent({
          id: response.event_data.id.toString(),
          title: response.event_data.name,
          date: response.event_data.event_date || 'N/A',
          location: response.event_data.origin,
          image_url:
            response.event_data.image ||
            'https://images.unsplash.com/photo-1513581166391-887a96ddeafd',
          participants_count: response.data.length,
          description: 'Event description',
        });

        setParticipants(
          response.data.map((apiParticipant: any) => ({
            id: apiParticipant.id.toString(),
            event_id: apiParticipant.event_id.toString(),
            name: apiParticipant.participant_name,
            phone: apiParticipant.phone_number,
            tickets: apiParticipant.quantity || 0,
            amount: parseFloat(apiParticipant.amount),
            payment_completed: apiParticipant.payment_status,
            checked_in: apiParticipant.is_checked_in === 1,
          }))
        );
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load event details'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  const handleCheckIn = async (participantId: string, currentStatus: boolean) => {
    try {
      const newStatus = currentStatus ? 0 : 1;
      await checkInParticipant(participantId, newStatus);

      setParticipants((prev) =>
        prev.map((participant) =>
          participant.id === participantId
            ? { ...participant, checked_in: newStatus === 1 }
            : participant
        )
      );
    } catch (error) {
      console.error('Check-in failed:', error);
      alert('Failed to update check-in status. Please try again.');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-4">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-50 p-4">Error: {error}</div>;
  }

  if (!event) {
    return <div className="min-h-screen bg-gray-50 p-4">Event not found</div>;
  }

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
            <span className="ml-1 text-gray-600">
              {event.participants_count}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                  Name
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                  Phone
                </th>
                {/* <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                  Date
                </th> */}
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                  Tickets
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                  Amount to Pay
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                  Payment Completed
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                  Check-in Status
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                  Check-in
                </th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant) => (
                <tr key={participant.id} className="border-b">
                  <td className="py-3 px-4 whitespace-nowrap">
                    {participant.name}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {participant.phone}
                  </td>
                  {/* <td className="py-3 px-4 whitespace-nowrap">
                    {event.date}
                  </td> */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    {participant.tickets}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    ${participant.amount}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    {participant.payment_completed ? (
                      <span className="text-green-600">Paid</span>
                    ) : (
                      <span className="text-red-600">Not Paid</span>
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
                        onChange={() =>
                          handleCheckIn(participant.id, participant.checked_in)
                        }
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
