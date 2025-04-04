export const logoutUser = async () => {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
  
    if (!response.ok) {
      throw new Error('Logout failed');
    }
    
    return response.json();
  };