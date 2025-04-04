// src/api/verifyOtp.ts
export const verifyOtp = async (otp: string) => {
    const email = localStorage.getItem('reset_email'); // get email from localStorage
  
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/verify_otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'OTP verification failed');
    }
  
    return data.data; // Optional return
  };
  