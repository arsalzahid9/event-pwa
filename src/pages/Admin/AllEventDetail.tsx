// AllEventDetail.tsx
import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// First, import the X icon from lucide-react
import { ArrowLeft, Calendar, MapPin, Users, Edit, Plus, Check, X, UserX, ExternalLink, Download, Trash } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import { Event, Participant } from '../../types';
import { getAdminEventDetails } from '../../api/Admin/getAllEventDetail';
import Loader from '../../components/Loader';
import { Dialog } from '@headlessui/react';
import { getEditDetail } from '../../api/Admin/getEditDetail';
import { updateEditDetail } from '../../api/Admin/updateEditDetail';
import { getGuideDropdown } from '../../api/Admin/getGuideDropdown';
import { getEventDropdown } from '../../api/Admin/getEventDropdown';
import { updateGuideName } from '../../api/Admin/UpdateGuideName';
import { deleteParticipant } from '../../api/Admin/deleteParticipant';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function AllEventDetail() {
  // Add this ref near other state declarations
  const componentRef = useRef<HTMLDivElement>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState<Participant | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  // Add this handler function
  const handlePrint = () => {
    const printContent = componentRef.current;
    if (!printContent) return;

    // Show loading state on button
    const button = document.activeElement;
    const originalButtonText = button instanceof HTMLElement ? button.innerHTML : '';
    if (button instanceof HTMLElement) {
      button.innerHTML = '<span class="animate-spin h-4 w-4 mr-2 border-t-2 border-white rounded-full"></span> Generating PDF...';
      button.disabled = true;
    }

    // Save original styles and modify for capturing
    const originalStyle = printContent.style.cssText;
    const originalOverflow = document.body.style.overflow;
    
    // Temporarily modify styles to ensure all content is rendered
    printContent.style.overflow = 'visible';
    printContent.style.height = 'auto';
    printContent.style.position = 'absolute';
    printContent.style.top = '0';
    printContent.style.left = '0';
    printContent.style.width = '1200px'; // Fixed width for better rendering
    document.body.style.overflow = 'visible';
    
    // Hide elements with no-print class
    const noPrintElements = printContent.querySelectorAll('.no-print');
    noPrintElements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.display = 'none';
      }
    });

    // Use html2canvas with improved settings
    html2canvas(printContent, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // Enable CORS for images
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
      windowHeight: 1600,
      scrollX: 0,
      scrollY: 0,
      width: printContent.scrollWidth,
      height: printContent.scrollHeight,
      onclone: (clonedDoc) => {
        // Further modifications to the cloned document if needed
        const clonedContent = clonedDoc.querySelector('[ref="componentRef"]');
        if (clonedContent instanceof HTMLElement) {
          clonedContent.style.width = '1200px';
        }
      }
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      
      // Initialize jsPDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculate dimensions to fit content properly
      const imgWidth = 210; // A4 width in mm (210mm)
      const pageHeight = 297; // A4 height in mm (297mm)
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // If content is taller than one page, add additional pages
      let heightLeft = imgHeight - pageHeight;
      let position = -pageHeight;
      
      while (heightLeft > 0) {
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        position -= pageHeight;
      }
      
      // Save the PDF with a meaningful filename
      pdf.save(`${event?.title || 'Event'}_Details.pdf`);
      
      // Reset button state
      if (button instanceof HTMLElement) {
        button.innerHTML = originalButtonText;
        button.disabled = false;
      }
      
      // Restore original styles
      printContent.style.cssText = originalStyle;
      document.body.style.overflow = originalOverflow;
      
      // Show elements with no-print class again
      noPrintElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.display = '';
        }
      });
    }).catch(error => {
      console.error('Error generating PDF:', error);
      
      // Reset button state on error
      if (button instanceof HTMLElement) {
        button.innerHTML = originalButtonText;
        button.disabled = false;
      }
      
      // Restore original styles on error
      printContent.style.cssText = originalStyle;
      document.body.style.overflow = originalOverflow;
      
      // Show elements with no-print class again on error
      noPrintElements.forEach((el) => {
        if (el instanceof HTMLElement) {
          el.style.display = '';
        }
      });
    });
  };
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Add this effect to handle click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsEditingGuide(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [isEditingGuide, setIsEditingGuide] = useState(false);
  const [guideOptions, setGuideOptions] = useState<Array<{ id: number, name: string }>>([]);
  const [guideSearch, setGuideSearch] = useState(''); // Add guide search state here
  const [selectedGuideId, setSelectedGuideId] = useState<number | null>(null);
  const [updateGuideLoading, setUpdateGuideLoading] = useState(false);
  const [updateGuideError, setUpdateGuideError] = useState('');

  // Add the missing handleGuideUpdate function
  const handleGuideUpdate = async () => {
    if (!id || !selectedGuideId) return;

    setUpdateGuideLoading(true);
    setUpdateGuideError('');

    try {
      await updateGuideName(id, selectedGuideId);
      setIsEditingGuide(false);
      fetchEventData(); // Refresh data after update
    } catch (err) {
      setUpdateGuideError(err instanceof Error ? err.message : 'Failed to update guide');
      console.error('Error updating guide:', err);
    } finally {
      setUpdateGuideLoading(false);
    }
  };

  // Update the useEffect hook to include search parameter
  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await getGuideDropdown(guideSearch);
        setGuideOptions(response.data);
      } catch (err) {
        console.error('Error fetching guides:', err);
      }
    };

    // Add debounce to prevent too many API calls
    const timeoutId = setTimeout(() => {
      fetchGuides();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [guideSearch]);

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
        date: response.data.event_data.event_date,
        location: response.data.event_data.origin,
        image_url:
          response.data.event_data.image ||
          'https://images.unsplash.com/photo-1513581166391-887a96ddeafd',
        participants_count: response.data.total,
        guide: response.data.guideEvent || 'N/A',
        event_link: response.data.event_data.event_link || null // Add this line
      });

      // Map participants from the API response.
      // In the fetchEventData function, update the participant mapping
      setParticipants(
        response.data.data.map((apiParticipant: any) => ({
          id: apiParticipant.id.toString(),
          name: apiParticipant.participant_name,
          email: apiParticipant.participant_email,
          phone: apiParticipant.phone_number?.startsWith('#')
            ? 'Invalid Number'
            : apiParticipant.phone_number || 'N/A',
          quantity: apiParticipant.quantity ?? 0,
          amount: apiParticipant.amount.replace(/\.(?=.*\.)/g, ''),
          payment_status: apiParticipant.payment_status,
          checked_in: apiParticipant.is_checked_in === 1,
          guest_origin: apiParticipant.guest_origin || 'N/A', // Add this line
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
  const openDeleteModal = (participant: Participant) => {
    setParticipantToDelete(participant);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setParticipantToDelete(null);
    setDeleteError('');
  };

  const handleDeleteParticipant = async () => {
    if (!participantToDelete) return;

    setDeleteLoading(true);
    setDeleteError('');

    try {
      await deleteParticipant(participantToDelete.id);
      closeDeleteModal();
      fetchEventData(); // Refresh data after deletion
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete participant');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="bg-white rounded-xl shadow-sm p-6" ref={componentRef}>
        <div className="flex justify-between items-center mb-6 no-print">
          <button
            onClick={() => navigate('/all-events')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            Back to Events
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            <Download className="w-5 h-5 mr-2" />
            Download PDF
          </button>
        </div>

        {/* Single column layout with full width */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              {event?.title}
              {event?.event_link && (
                <a
                  href={event.event_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                  title="View event page"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </h1>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              <a
                href={event?.location}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              >
                {event?.location}
              </a>
            </div>
            <div className="flex items-center text-gray-600">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Event Starting Date: {event?.date}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="w-5 h-5 mr-2" />
              {isEditingGuide ? (
                <div className="flex flex-col gap-2 w-full" ref={dropdownRef}>
                  <div className="relative w-full">
                    <input
                      type="text"
                      value={guideSearch}
                      onChange={(e) => setGuideSearch(e.target.value)}
                      placeholder="Search for a guide..."
                      className="rounded border-gray-300 shadow-sm py-1 px-2 text-sm w-full pr-8"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <button
                        onClick={handleGuideUpdate}
                        disabled={updateGuideLoading || !selectedGuideId}
                        className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
                      >
                        {updateGuideLoading ? (
                          <span className="animate-spin h-4 w-4 border-t-2 border-gray-500 rounded-full" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {updateGuideError && (
                      <p className="text-red-500 text-xs mt-1">{updateGuideError}</p>
                    )}
                    {guideOptions.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
                        {guideOptions.map(guide => (
                          <div
                            key={guide.id}
                            onClick={() => {
                              setEvent(prev => prev ? { ...prev, guide: guide.name } : prev);
                              setGuideSearch(guide.name);
                              setSelectedGuideId(guide.id);
                            }}
                            className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100"
                          >
                            {guide.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Guida: {event?.guide || 'N/A'}</span>
                  <button
                    onClick={() => {
                      setIsEditingGuide(true);
                      setSelectedGuideId(null);
                      setGuideSearch('');
                      setUpdateGuideError('');
                    }}
                    className="text-blue-600 hover:text-blue-800 no-print"
                  >
                    <Edit className="w-4 h-4 no-print" />
                  </button>
                </div>
              )}
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
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">NOME</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">E-MAIL</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">TELEFONO</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">QUANTITà</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">IMPORTO</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">STATO</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">ORIGINE</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">REGISTRAZIONE</th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {participants.length > 0 ? (
                  participants.map((participant) => (
                    <tr key={participant.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">{participant.name}</td>
                      <td className="py-3 px-4 whitespace-nowrap text-gray-500">{participant.email}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {participant.phone.startsWith('Invalid') || participant.phone === 'N/A' ? (
                          participant.phone
                        ) : (
                          <a href={`tel:${participant.phone}`} className="font-bold underline">{participant.phone}</a>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">{participant.quantity ?? 0}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {participant.payment_status?.toLowerCase() === 'paid' ? '****' : `€${participant.amount}`}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {(() => {
                          const status = participant.payment_status?.toLowerCase();
                          if (status === 'paid') return 'PAGATO';
                          if (status === 'offline_pending') return 'NON_PAGATO';
                          if (status === 'free') return 'GRATIS';
                          return participant.payment_status;
                        })()}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {participant.guest_origin && participant.guest_origin.startsWith('http') ? (
                          <a
                            href={participant.guest_origin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {(() => {
                              try {
                                return new URL(participant.guest_origin).hostname;
                              } catch {
                                return participant.guest_origin;
                              }
                            })()}
                          </a>
                        ) : (
                          participant.guest_origin || 'N/A'
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {participant.checked_in ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <X className="w-4 h-4 text-red-500" />
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openDeleteModal(participant)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center">
                        <UserX size={48} className="text-gray-300 mb-3" />
                        <p className="text-lg font-medium text-gray-600 mb-1">No Participants Found</p>
                        <p className="text-sm text-gray-400">
                          There are no participants registered for this event yet
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
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
      {/* Delete Confirmation Modal */}
      <Dialog
        open={isDeleteModalOpen}
        onClose={closeDeleteModal}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-2 rounded-full">
                <Trash className="w-6 h-6 text-red-600" />
              </div>
              <Dialog.Title className="text-xl font-medium text-gray-900">
                Delete Participant
              </Dialog.Title>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">
                Are you sure you want to delete participant <span className="font-semibold text-gray-900">{participantToDelete?.name}</span>?
                This action cannot be undone.
              </p>

              {deleteError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{deleteError}</p>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  disabled={deleteLoading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteParticipant}
                  disabled={deleteLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  {deleteLoading ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-t-2 border-white rounded-full" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash className="w-4 h-4" />
                      Delete Participant
                    </>
                  )}
                </button>
              </div>
            </div>
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
  const [eventOptions, setEventOptions] = useState<Array<{ id: number, name: string }>>([]);
  const [guideOptions, setGuideOptions] = useState<Array<{ id: number, name: string }>>([]);

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
        {/* <div>
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
        </div> */}

        {/* Dropdown for Guide */}
        {/* <div>
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
        </div> */}

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
            pattern="[0-9+\s-]{8,}"  // Modified pattern to be more flexible
            title="Please enter a valid phone number (minimum 8 digits, can include +, spaces, and hyphens)"
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
            defaultValue={participantDetails?.payment_status}
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

