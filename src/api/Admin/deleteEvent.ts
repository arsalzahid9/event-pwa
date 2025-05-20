export const deleteEvent = async (eventIds: number[]) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/admin/event-delete`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ event_id: eventIds })
      }
    );
  
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete event');
    return data;
  };