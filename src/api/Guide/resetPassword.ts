// src/api/Guide/resetPassword.ts

export const resetPassword = async (password: string, confirmPassword: string) => {
    const email = localStorage.getItem('reset_email');
  
    if (!email) {
      throw new Error('Email not found in local storage');
    }
  
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/update-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        password_confirmation: confirmPassword,
      }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      throw new Error(data.message || 'Failed to reset password');
    }
  
    return data;
  };
  