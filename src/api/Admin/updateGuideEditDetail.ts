export const updateGuideEditDetail = async (id: string, data: FormData) => {
    const token = localStorage.getItem('authToken');
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/admin/guide/update/${id}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Remove Content-Type header - let browser set form boundary
        },
        body: data, // Directly pass FormData without JSON.stringify
      }
    );
  
    const responseData = await response.json();
  
    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to update guide');
    }
  
    return responseData;
};