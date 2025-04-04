export const checkInParticipant = async (participantId: string, status: number) => {
    const token = localStorage.getItem('authToken');
    
    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/event/check-in/${participantId}?status=${status}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Check-in failed');
    }
  
    return data;
  };