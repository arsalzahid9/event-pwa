export const sendOtp = async (email: string) => {
    const token = localStorage.getItem('authToken'); // optional, in case it's needed by backend
  
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/send-otp`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,  // include if needed
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Failed to send OTP');
    }
  
    return data.data; // return response payload if needed
  };
  