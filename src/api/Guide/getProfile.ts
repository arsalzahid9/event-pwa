export const getProfile = async () => {
    const token = localStorage.getItem('authToken');
  
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch profile');
    }
  
    return data.data;
  };
  