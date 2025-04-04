import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { sendOtp } from '../api/Guide/forgotPassword'; // ⬅️ Import the API function

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendOtp(email); // ⬅️ API call to send OTP
      localStorage.setItem('reset_email', email); // ⬅️ Store email in localStorage
      navigate('/otp-verification'); // ⬅️ Navigate on success
    } catch (error: any) {
      console.error('OTP send failed:', error);
      alert(error?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="flex items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold ml-4">Forgot Password</h1>
        </div>
        
        <p className="text-gray-600">
          Enter your email address and we'll send you a verification code to reset your password.
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your guide email"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-800'
            }`}
          >
            {loading ? 'Sending...' : 'Send Code'}
          </button>
        </form>

        <div className="text-center">
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
