export const getEditDetail = async (id: string) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/admin/event/edit/${id}`,
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
    throw new Error(data.message || 'Failed to fetch edit details');
  }

  return data;
};