import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function OtpVerification() {
  const [otp, setOtp] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add OTP verification logic here
    navigate('/reset-password');
  };

  const resendOtp = async () => {
    setIsResending(true);
    // Add resend logic here
    setTimeout(() => {
      setTimeLeft(60);
      setIsResending(false);
    }, 60000);
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
                Resend OTP
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}