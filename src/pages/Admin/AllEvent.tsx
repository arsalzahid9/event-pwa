// src/pages/admin/AllEvent.tsx

import { useEffect, useState } from 'react';
import { Event } from '../../types';
import { getEvents } from '../../api/Admin/getAllEvents';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@mui/material';
import debounce from 'lodash.debounce';
import { Calendar, Plus, Check, X } from 'lucide-react'; // Add Plus, Check, X icons
import { getGuideDropdown } from '../../api/Admin/getGuideDropdown';
import { updateGuideName } from '../../api/Admin/UpdateGuideName';
import { Trash } from 'lucide-react';
import { deleteEvent } from '../../api/Admin/deleteEvent';

export default function AllEvent() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1,
  });

  // Move these hooks to the top, before any logic or return
  const [openDropdownEventId, setOpenDropdownEventId] = useState<string | null>(null);
  const [guideOptions, setGuideOptions] = useState<Array<{ id: number, name: string }>>([]);
  const [guideSearch, setGuideSearch] = useState('');
  const [selectedGuideId, setSelectedGuideId] = useState<number | null>(null);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [dropdownError, setDropdownError] = useState('');
  const [showEventCheckboxes, setShowEventCheckboxes] = useState(false);
const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);

const handleEventCheckboxChange = (eventId: string) => {
  setSelectedEventIds(prev =>
    prev.includes(eventId)
      ? prev.filter(id => id !== eventId)
      : [...prev, eventId]
  );
};

const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);

const handleDeleteSelectedEvents = async () => {
  if (selectedEventIds.length === 0) return;
  setShowDeleteConfirmModal(true);
};

const confirmDeleteEvents = async () => {
  try {
    await deleteEvent(selectedEventIds.map(Number));
    setSelectedEventIds([]);
    setShowEventCheckboxes(false);
    setShowDeleteConfirmModal(false);
    fetchEvents();
  } catch (err) {
    alert('Failed to delete selected events.');
    setShowDeleteConfirmModal(false);
  }
};

const cancelDeleteEvents = () => {
  setShowDeleteConfirmModal(false);
};
const handleCancelDelete = () => {
  setShowEventCheckboxes(false);
  setSelectedEventIds([]);
};
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents(pagination.current_page, pagination.per_page, debouncedSearch);

      setEvents(
        response.data.map((apiEvent: any) => ({
          id: apiEvent.id.toString(),
          title: apiEvent.name,
          date: apiEvent.event_date,
            // ? new Date(apiEvent.event_date).toLocaleDateString()
            // : 'N/A',
          location: apiEvent.origin,
          image_url: apiEvent.image || 'https://images.unsplash.com/photo-1513581166391-887a96ddeafd',
          guide_names: apiEvent.guide_names || 'N/A',
        }))
      );

      setPagination({
        current_page: response.pagination.current_page,
        per_page: response.pagination.per_page,
        total: response.pagination.total,
        last_page: response.pagination.last_page,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events');
    } finally {
      setLoading(false);
    }
  };
  

  // Handle debounce for search
  const debouncedSearchHandler = debounce((value: string) => {
    setPagination((prev) => ({ ...prev, current_page: 1 }));
    setDebouncedSearch(value);
  }, 500);
  

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    debouncedSearchHandler(e.target.value);
  };
  

  useEffect(() => {
    fetchEvents();
  }, [pagination.current_page, debouncedSearch]);
  
  useEffect(() => {
    if (openDropdownEventId !== null) {
      setDropdownLoading(true);
      getGuideDropdown(guideSearch)
        .then((response) => setGuideOptions(response.data))
        .catch((err) => setDropdownError(err.message || 'Failed to load guides'))
        .finally(() => setDropdownLoading(false));
    }
  }, [openDropdownEventId, guideSearch]);
  const handleGuideUpdate = async (eventId: string) => {
    if (!selectedGuideId) return;
    setDropdownLoading(true);
    setDropdownError('');
    try {
      await updateGuideName(eventId, selectedGuideId);
      setOpenDropdownEventId(null);
      setSelectedGuideId(null);
      setGuideSearch('');
      fetchEvents(); // Refresh events to show updated guide
    } catch (err) {
      setDropdownError(err instanceof Error ? err.message : 'Failed to update guide');
    } finally {
      setDropdownLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        {showEventCheckboxes ? (
          <div className="flex items-center gap-2 w-full justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                className="bg-red-600 hover:bg-red-700 text-white rounded px-3 py-2 flex items-center"
                onClick={handleDeleteSelectedEvents}
                type="button"
              >
                <Trash className="w-4 h-4 mr-1" /> Delete Selected ({selectedEventIds.length})
              </button>
            </div>
            <button
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded p-2 flex items-center"
              onClick={handleCancelDelete}
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-4 w-full">
            <h1 className="text-2xl font-bold ml-0 md:ml-8">All Events</h1>
            <div className="flex gap-2">
              <button
                className="bg-red-100 hover:bg-red-200 text-red-600 rounded p-2 flex items-center"
                onClick={() => setShowEventCheckboxes(true)}
                type="button"
              >
                <Trash className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
        {!showEventCheckboxes && (
          <input
            type="text"
            placeholder="Search events..."
            value={search}
            onChange={handleSearchChange}
            className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <div className="text-red-500">Error: {error}</div>
      ) : (
        <>
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  {showEventCheckboxes && <th className="px-2 py-3"></th>}
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">NOME EVENTO</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">NOME GUIDA</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">ORIGINE</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">DATA</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">IMMAGINE</th>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {events.length > 0 ? (
                    events.map((event) => (
                      <tr
                        key={event.id}
                        className={
                          showEventCheckboxes && selectedEventIds.includes(event.id)
                            ? "bg-red-50 cursor-pointer"
                            : showEventCheckboxes
                            ? "cursor-pointer"
                            : ""
                        }
                        onClick={() => {
                          if (showEventCheckboxes) handleEventCheckboxChange(event.id);
                        }}
                      >
                        {showEventCheckboxes && (
                          <td onClick={e => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              checked={selectedEventIds.includes(event.id)}
                              onChange={() => handleEventCheckboxChange(event.id)}
                            />
                          </td>
                        )}
                        <td className="px-6 py-4 text-sm font-medium">{event.title}</td>
                        <td className="px-6 py-4 text-sm relative" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <span>{event.guide_names}</span>
                            <button
                              className="text-blue-600 hover:text-blue-800"
                              onClick={() => {
                                setOpenDropdownEventId(event.id);
                                setGuideSearch('');
                                setSelectedGuideId(null);
                                setDropdownError('');
                              }}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          {openDropdownEventId === event.id && (
                            <div className="absolute z-10 mt-2 w-56 bg-white shadow-lg rounded-md p-3 border border-gray-200">
                              <div className="flex items-center mb-2">
                                <input
                                  type="text"
                                  value={guideSearch}
                                  onChange={e => setGuideSearch(e.target.value)}
                                  placeholder="Search guide..."
                                  className="w-full px-2 py-1 border rounded text-sm"
                                />
                                <button
                                  className="ml-2 text-gray-500 hover:text-gray-700"
                                  onClick={() => setOpenDropdownEventId(null)}
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                              {dropdownLoading ? (
                                <div className="text-xs text-gray-500 py-2">Loading...</div>
                              ) : dropdownError ? (
                                <div className="text-xs text-red-500 py-2">{dropdownError}</div>
                              ) : (
                                <div className="max-h-40 overflow-y-auto">
                                  {guideOptions.length > 0 ? (
                                    guideOptions.map(guide => (
                                      <div
                                        key={guide.id}
                                        className={`px-2 py-1 cursor-pointer hover:bg-blue-50 rounded ${selectedGuideId === guide.id ? 'bg-blue-100' : ''}`}
                                        onClick={() => setSelectedGuideId(guide.id)}
                                      >
                                        {guide.name}
                                      </div>
                                    ))
                                  ) : (
                                    <div className="text-xs text-gray-400 py-2">No guides found</div>
                                  )}
                                </div>
                              )}
                              <button
                                className="mt-2 w-full flex items-center justify-center bg-blue-600 text-white py-1 rounded disabled:bg-gray-300"
                                disabled={!selectedGuideId || dropdownLoading}
                                onClick={() => handleGuideUpdate(event.id)}
                              >
                                <Check className="w-4 h-4 mr-1" />
                                Assign Guide
                              </button>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <a
                            href={event.location}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                            onClick={e => e.stopPropagation()}
                          >
                            {event.location}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm">{event.date}</td>
                        <td className="px-6 py-4 text-sm">
                          {event.image_url ? (
                            <img
                              src={event.image_url}
                              alt={event.title}
                              className="h-12 w-12 object-cover rounded"
                            />
                          ) : (
                            <span className="text-gray-400">No image</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center">
                          <Calendar size={48} className="text-gray-300 mb-3" />
                          <p className="text-lg font-medium text-gray-600 mb-1">No Events Found</p>
                          <p className="text-sm text-gray-400">
                            {debouncedSearch 
                              ? "No events match your search criteria" 
                              : "There are no events available at the moment"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <Pagination
              count={pagination.last_page}
              page={pagination.current_page}
              onChange={(_, page) =>
                setPagination((prev) => ({ ...prev, current_page: page }))
              }
              variant="outlined"
              shape="rounded"
              showFirstButton
              showLastButton
              sx={{
                '& .MuiPaginationItem-root': {
                  fontSize: '0.875rem',
                  '&.Mui-selected': {
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    '&:hover': {
                      backgroundColor: '#1d4ed8',
                    },
                  },
                },
              }}
            />
          </div>
        </>
      )}
      
{/* Place this modal just before your closing </div> or at the root of your return */}
{showDeleteConfirmModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
      <h2 className="text-lg font-bold mb-2">Confirm Delete</h2>
      <p className="mb-4">Are you sure you want to delete {selectedEventIds.length} selected event(s)? This action cannot be undone.</p>
      <div className="flex justify-end gap-2">
        <button
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded px-4 py-2"
          onClick={cancelDeleteEvents}
        >
          Cancel
        </button>
        <button
          className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-2"
          onClick={confirmDeleteEvents}
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );

  // Fetch guide options when dropdown is opened or search changes


  // Place handleGuideUpdate here, before return
  // const handleGuideUpdate = async (eventId: string) => {
  //   if (!selectedGuideId) return;
  //   setDropdownLoading(true);
  //   setDropdownError('');
  //   try {
  //     await updateGuideName(eventId, selectedGuideId);
  //     setOpenDropdownEventId(null);
  //     setSelectedGuideId(null);
  //     setGuideSearch('');
  //     fetchEvents(); // Refresh events to show updated guide
  //   } catch (err) {
  //     setDropdownError(err instanceof Error ? err.message : 'Failed to update guide');
  //   } finally {
  //     setDropdownLoading(false);
  //   }
  // };
}

