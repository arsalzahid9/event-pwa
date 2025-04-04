export const getEventDetails = async (eventId: string) => {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/event/detail/${eventId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch event details');
    }
  
    return data.data; // Returns { event_data, data: participants[] }
  };