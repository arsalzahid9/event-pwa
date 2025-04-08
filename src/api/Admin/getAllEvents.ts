// src/api/Admin/getAllEvents.ts

export const getEvents = async (page: number, limit: number, search?: string) => {
  const token = localStorage.getItem('authToken');

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) {
    params.append('search', search);
  }

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/admin/event?${params.toString()}`,
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

  return data.data; // Contains both `data` array and `pagination`
};
