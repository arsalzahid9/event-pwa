export const deleteParticipant = async (id: string) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/participants/delete/${id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );
  
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete guide');
    return data;
  };