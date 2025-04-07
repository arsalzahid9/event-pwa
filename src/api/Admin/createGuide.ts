export const createGuide = async (formData: FormData) => {
    const token = localStorage.getItem('authToken');
  
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/admin/guide/create`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      }
    );
  
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create guide');
    return data;
  };
  