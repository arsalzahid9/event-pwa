import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, UserX, MapPin, Calendar, ExternalLink, Download } from 'lucide-react';
import { Event, Participant } from '../types';
import { getEventDetails } from '../api/Guide/eventDetail';
import { checkInParticipant } from '../api/Guide/eventCheckin';
import Loader from '../components/Loader';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function EventDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = async () => {
    const input = document.getElementById('print-content');
    if (!input) return;
  
    try {
      // Create a temporary style to hide elements we don't want in the PDF
      const style = document.createElement('style');
      style.innerHTML = `
        .no-print {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
  
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        logging: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: input.scrollWidth,
        windowHeight: input.scrollHeight
      });
  
      // Remove the temporary style
      document.head.removeChild(style);
  
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('event-details.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

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
          event_link: response.event_data.event_link || null
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
            guest_origin: apiParticipant.guest_origin
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
    return <Loader />;
  }

  if (error) {
    return <div className="min-h-screen bg-gray-50 p-4">Error: {error}</div>;
  }

  if (!event) {
    return <div className="min-h-screen bg-gray-50 p-4">Event not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative no-print" ref={componentRef}>
        <img
          src={event.image_url}
          alt={event.title}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={() => navigate('/events')}
          className="absolute top-4 left-4 bg-white p-2 rounded-full shadow-md no-print"
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      <div id="print-content" className="p-4">
        <div className="flex flex-col mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center pl-2 gap-3 md:gap-0">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                {event.title}
                {event.event_link && (
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
              <button
                onClick={handlePrint}
                className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-4 no-print"
              >
                <Download className="w-5 h-5 mr-2 no-print" />
                Download PDF
              </button>
            </div>
          </div>
          <div className="flex items-center pl-2 mt-1">
            <MapPin size={16} className="text-gray-600 mr-2" />
            <a
              href={event.location}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
            >
              {event.location}
            </a>
          </div>
          <div className="flex items-center  px-3 py-1 rounded-full self-start md:self-auto">
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
                  NOME
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                TELEFONO
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                BIGLIETTI
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                IMPORTO DA PAGARE
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                PAGAMENTO COMPLETATO
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                ORIGINE
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                STATO DEL CHECK-IN
                </th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 whitespace-nowrap">
                REGISTRAZIONE
                </th>
              </tr>
            </thead>
            <tbody>
              {participants.length > 0 ? (
                participants.map((participant) => (
                  <tr key={participant.id} className="border-b">
                    <td className="py-3 px-4 whitespace-nowrap">
                      {participant.name}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {participant.phone ? (
                        <a href={`tel:${participant.phone}`}>{participant.phone}</a>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {participant.tickets}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {participant.payment_completed?.toLowerCase() === 'paid' ? '****' : `€${participant.amount}`}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {(() => {
                        const status = participant.payment_completed?.toLowerCase();
                        if (status === 'paid') return 'PAGATO';
                        if (status === 'offline_pending') return 'NON_PAGATO';
                        if (status === 'free') return 'GRATIS';
                        return participant.payment_completed;
                      })()}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <a 
                        href={participant.guest_origin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {new URL(participant.guest_origin).hostname}
                      </a>
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
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12">
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
  );
}
