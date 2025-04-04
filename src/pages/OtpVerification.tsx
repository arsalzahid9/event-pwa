import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyOtp } from '../api/Guide/verifyOtp'; // import API

export default function OtpVerification() {
  const [otp, setOtp] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const navigate = useNavigate();

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    }

    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Add new state at the top
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Update handleSubmit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');
    setSuccessMessage('');
    
    try {
      await verifyOtp(otp);
      navigate('/reset-password');
    } catch (error) {
      setError((error as Error).message);
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Update resendOtp
  const resendOtp = async () => {
    setIsResending(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const email = localStorage.getItem('reset_email');
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
  
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }
  
      setSuccessMessage('OTP resent successfully');
      setTimeLeft(60);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsResending(false);
    }
  };
  
  // Add in return statement
  <div className="space-y-4">
    {/* OTP input field */}
  
    {error && (
      <div className="text-red-600 text-sm p-2 bg-red-50 rounded-lg">
        {error}
      </div>
    )}
  
    {successMessage && (
      <div className="text-green-600 text-sm p-2 bg-green-50 rounded-lg">
        {successMessage}
      </div>
    )}
  
    <button
      type="submit"
      disabled={isVerifying}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-75 disabled:cursor-not-allowed"
    >
      {isVerifying ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Verifying...
        </div>
      ) : (
        'Verify'
      )}
    </button>
  
    {/* Resend OTP section */}
  </div>
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Verify OTP</h1>
          <p className="mt-2 text-gray-600">Enter the 6-digit code sent to your email</p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 border rounded-lg"
            placeholder="Enter OTP"
            maxLength={6}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Verify
          </button>

          <div className="text-center text-sm text-gray-600">
            {timeLeft > 0 ? (
              `Resend code in ${timeLeft} seconds`
            ) : (
              <button
                type="button"
                onClick={resendOtp}
                disabled={isResending}
                className="text-blue-600 hover:underline disabled:opacity-50"
              >
                {isResending ? 'Sending...' : 'Resend OTP'}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
