// src/pages/admin/AllEvent.tsx

import { useEffect, useState } from 'react';
import { Event } from '../../types';
import { getEvents } from '../../api/Admin/getAllEvents';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';
import { Pagination } from '@mui/material';
import debounce from 'lodash.debounce';
import { Calendar } from 'lucide-react'; // Add this import

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

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getEvents(pagination.current_page, pagination.per_page, debouncedSearch);

      setEvents(
        response.data.map((apiEvent: any) => ({
          id: apiEvent.id.toString(),
          title: apiEvent.name,
          date: apiEvent.event_date
            ? new Date(apiEvent.event_date).toLocaleDateString()
            : 'N/A',
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

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold ml-0 md:ml-8">All Events</h1>
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={handleSearchChange}
          className="w-full sm:w-80 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Event Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Guide Name</th>

                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Origin</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Image</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {events.length > 0 ? (
                    events.map((event) => (
                      <tr
                        key={event.id}
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/all-events/${event.id}`)}
                      >
                        <td className="px-6 py-4 text-sm font-medium">{event.title}</td>
                        <td className="px-6 py-4 text-sm">{event.guide_names}</td>

                        <td className="px-6 py-4 text-sm">{event.location}</td>
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
    </div>
  );
}