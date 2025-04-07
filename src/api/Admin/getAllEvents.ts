// src/api/Admin/getAllEvents.ts

export const getEvents = async (page: number, limit: number) => {
  const token = localStorage.getItem('authToken');

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/admin/event?page=${page}&limit=${limit}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch events');
  }

  // Return only the nested `data` and `pagination` from response
  return data.data;
};
