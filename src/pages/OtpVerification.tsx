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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOtp(otp);
      navigate('/reset-password');
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const resendOtp = async () => {
    setIsResending(true);
    try {
      // You can reuse sendOtp here if needed
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

      alert('OTP resent successfully');
      setTimeLeft(60);
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setIsResending(false);
    }
  };

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
