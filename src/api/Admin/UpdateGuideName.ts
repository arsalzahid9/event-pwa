export const updateGuideName = async (id: string, guideId: number) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/admin/event/guide/update/${id}`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ guide_id: guideId }),
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Failed to update guide');
  return data;
};