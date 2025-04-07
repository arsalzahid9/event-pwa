// AllEventDetail.tsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Edit } from 'lucide-react';
import { Event, Participant } from '../../types';
import { getAdminEventDetails } from '../../api/Admin/getAllEventDetail';
import Loader from '../../components/Loader';
import { Dialog } from '@headlessui/react';
import { getEditDetail } from '../../api/Admin/getEditDetail';
import { updateEditDetail } from '../../api/Admin/updateEditDetail';
import { getGuideDropdown } from '../../api/Admin/getGuideDropdown';
import { getEventDropdown } from '../../api/Admin/getEventDropdown';

export default function AllEventDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);

  // Define fetchEventData as a function to be called on mount and after updates.
  const fetchEventData = useCallback(async () => {
    try {
      if (!id) return;
      setLoading(true);
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
  }, [id]);

  useEffect(() => {
    fetchEventData();
  }, [fetchEventData]);

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
                      {participant.payment_status === 'Paid' ? (
                        <span className="text-green-600">Paid</span>
                      ) : participant.payment_status === 'Failed' ? (
                        <span className="text-red-600">Failed</span>
                      ) : (
                        <span className="text-yellow-600">Pending</span>
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
                onUpdate={fetchEventData}  // callback to refresh details after update
              />  
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

interface EditParticipantFormProps {
  participantId: string;
  closeModal: () => void;
  onUpdate: () => void;
}

const EditParticipantForm = ({ participantId, closeModal, onUpdate }: EditParticipantFormProps) => {
  const [participantDetails, setParticipantDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [eventOptions, setEventOptions] = useState<Array<{id: number, name: string}>>([]);
  const [guideOptions, setGuideOptions] = useState<Array<{id: number, name: string}>>([]);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [participantRes, eventsRes, guidesRes] = await Promise.all([
          getEditDetail(participantId),
          getEventDropdown(),
          getGuideDropdown()
        ]);
        
        setParticipantDetails(participantRes.data);
        setEventOptions(eventsRes.data);
        setGuideOptions(guidesRes.data);
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
        event_id: parseInt(formData.get('event_id') as string),
        user_id: parseInt(formData.get('guide_id') as string),
        participant_name: formData.get('participant_name') as string,
        participant_email: formData.get('participant_email') as string,
        phone_number: formData.get('phone_number') as string,
        amount: parseFloat(formData.get('amount') as string),
        quantity: parseInt(formData.get('quantity') as string),
        payment_status: formData.get('payment_status') as string,
        is_checked_in: formData.get('is_checked_in') ? 1 : 0
      };
      
      await updateEditDetail(participantId, updateData);
      // After successful update, refresh parent data
      onUpdate();
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
        {/* Dropdown for Event */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Event
          </label>
          <select
            name="event_id"
            defaultValue={participantDetails?.event_id}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          >
            {eventOptions.map(event => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown for Guide */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Guide
          </label>
          <select
            name="guide_id"
            defaultValue={participantDetails?.user_id}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          >
            {guideOptions.map(guide => (
              <option key={guide.id} value={guide.id}>
                {guide.name}
              </option>
            ))}
          </select>
        </div>

        {/* Existing fields */}
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

        {/* New fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            name="phone_number"
            type="tel"
            defaultValue={participantDetails?.phone_number || ''}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            pattern="[0-9]{10}"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            name="amount"
            type="number"
            defaultValue={participantDetails?.amount.replace(/\.(?=.*\.)/g, '') || ''}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
            step="0.01"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            name="quantity"
            type="number"
            defaultValue={participantDetails?.quantity || 0}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Payment Status
          </label>
          <select
            name="payment_status"
            defaultValue={participantDetails?.payment_status || 'Pending'}
            className="mt-1 block w-full rounded border-gray-300 shadow-sm"
          >
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            name="is_checked_in"
            defaultChecked={participantDetails?.is_checked_in === 1}
            className="rounded border-gray-300 text-blue-600 shadow-sm"
          />
          <label className="text-sm font-medium text-gray-700">
            Checked In
          </label>
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
