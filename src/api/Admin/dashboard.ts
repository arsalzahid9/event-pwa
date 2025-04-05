export const getDashboardData = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/admin/dashboard`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch dashboard data');
  }

  return data;
};