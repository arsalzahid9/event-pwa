import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Update the icon imports
import { ArrowLeft, Calendar, MapPin, Users, Edit } from 'lucide-react';
import { Event, Participant } from '../../types';
import { getAdminEventDetails } from '../../api/Admin/getAllEventDetail';
import Loader from '../../components/Loader';
import { Dialog } from '@headlessui/react';
import { getEditDetail } from '../../api/Admin/getEditDetail';
import { updateEditDetail } from '../../api/Admin/updateEditDetail';

export default function AllEventDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

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

  // Modal handler functions
  const openEditModal = (participant: Participant) => {
    setSelectedParticipant(participant);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedParticipant(null);
  };

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

          {/* Updated table container with overflow-x-auto and consistent styling */}
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Participants ({event?.participants_count})
              </h2>
            </div>
            <table className="min-w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                    Email
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                    Phone
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                    Amount
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant) => (
                  <tr key={participant.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 whitespace-nowrap">{participant.name}</td>
                    <td className="py-3 px-4 whitespace-nowrap text-gray-500">
                      {participant.email}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">{participant.phone}</td>
                    <td className="py-3 px-4 whitespace-nowrap">€{participant.amount}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {participant.checked_in ? (
                        <span className="text-green-600">Checked In</span>
                      ) : (
                        <span className="text-red-600">Pending</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <button
                        onClick={() => openEditModal(participant)}
                        className="flex items-center text-blue-600 hover:text-blue-900 transition-colors"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog
        open={isEditModalOpen}
        onClose={closeEditModal}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded bg-white p-6">
            <Dialog.Title className="text-lg font-medium mb-4">
              Edit Participant Details
            </Dialog.Title>
            {selectedParticipant && (
              <EditParticipantForm 
                participantId={selectedParticipant.id}
                closeModal={closeEditModal}
              />
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

const EditParticipantForm = ({ participantId, closeModal }: { 
  participantId: string,
  closeModal: () => void
}) => {
  const [participantDetails, setParticipantDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await getEditDetail(participantId);
        setParticipantDetails(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetails();
  }, [participantId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError('');
    
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const updateData = {
        participant_name: formData.get('participant_name') as string,
        participant_email: formData.get('participant_email') as string
      };
      
      await updateEditDetail(participantId, updateData);
      closeModal();
    } catch (err) {
      setSubmissionError(err instanceof Error ? err.message : 'Failed to update participant');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Participant Name
          </label>
          <input
            name="participant_name"
            type="text"
            defaultValue={participantDetails?.participant_name || ''}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Participant Email
          </label>
          <input
            name="participant_email"
            type="email"
            defaultValue={participantDetails?.participant_email || ''}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            required
          />
        </div>
      </div>
      {submissionError && (
        <p className="mt-4 text-red-600 text-sm">{submissionError}</p>
      )}
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={closeModal}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};
