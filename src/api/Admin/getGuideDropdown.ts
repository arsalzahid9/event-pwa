export const getGuideDropdown = async (search?: string) => {
  const token = localStorage.getItem('authToken');
  const searchParam = search ? `?search=${encodeURIComponent(search)}` : '';
  
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/guide-dropdown${searchParam}`,
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
    throw new Error(data.message || 'Failed to fetch guide dropdown options');
  }

  return data;
};