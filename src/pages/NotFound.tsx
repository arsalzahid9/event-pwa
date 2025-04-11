import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function NotFound() {
  const navigate = useNavigate();
  const isAdmin = useAuthStore((state) => state.isAdmin);

  const handleNavigate = () => {
    if (isAdmin) {
      navigate('/dashboard');
    } else {
      navigate('/events');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-gray-600">The page you're looking for doesn't exist or has been moved.</p>
        </div>
        <button
          onClick={handleNavigate}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to {isAdmin ? 'Dashboard' : 'Events'}
        </button>
      </div>
    </div>
  );
}