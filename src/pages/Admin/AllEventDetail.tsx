import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { Event, Participant } from '../../types';
import { getAdminEventDetails } from '../../api/Admin/getAllEventDetail';
import Loader from '../../components/Loader';

export default function AllEventDetail() {
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
        const response = await getAdminEventDetails(id);

        // Map event data from the API response to our local event object.
        setEvent({
          id: response.data.event_data.id.toString(),
          title: response.data.event_data.name,
          date: response.data.event_data.created_at
            ? new Date(response.data.event_data.created_at).toLocaleDateString()
            : 'N/A',
          location: response.data.event_data.origin,
          image_url:
            response.data.event_data.image ||
            'https://images.unsplash.com/photo-1513581166391-887a96ddeafd',
          participants_count: response.data.total,
        });

        // Map participants from the API response.
        setParticipants(
          response.data.data.map((apiParticipant: any) => ({
            id: apiParticipant.id.toString(),
            name: apiParticipant.participant_name,
            email: apiParticipant.participant_email,
            phone: apiParticipant.phone_number?.startsWith('#')
              ? 'Invalid Number'
              : apiParticipant.phone_number || 'N/A',
            amount: apiParticipant.amount.replace(/\.(?=.*\.)/g, ''),
            payment_status: apiParticipant.payment_status || 'N/A',
            checked_in: apiParticipant.is_checked_in === 1,
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <button
          onClick={() => navigate('/all-events')}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Events
        </button>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{event?.title}</h1>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{event?.location}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Created at: {event?.date}</span>
            </div>
          </div>

          <div>
            <div className="bg-gray-100 rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">
                Participants ({event?.participants_count})
              </h2>
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="bg-white p-3 rounded-lg shadow-xs">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{participant.name}</p>
                        <p className="text-sm text-gray-500">{participant.email}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-sm rounded-full ${
                          participant.checked_in
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {participant.checked_in ? 'Checked In' : 'Pending'}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <span className="ml-2">{participant.phone}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Amount:</span>
                        <span className="ml-2">€{participant.amount}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Payment:</span>
                        <span className="ml-2">{participant.payment_status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
