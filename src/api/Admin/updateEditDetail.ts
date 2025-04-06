export const updateEditDetail = async (id: string, data: any) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/admin/event/update/${id}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to update participant');
  }

  return responseData;
};