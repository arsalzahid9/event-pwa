export const getEvents = async () => {
    const token = localStorage.getItem('authToken'); // This line uses 'authToken' key
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/event`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`, // This sends the auth token
        'Content-Type': 'application/json'
      }
    });
  
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch events');
    }
    
    // Return the events array from the API response
    return data.data;
  };
  