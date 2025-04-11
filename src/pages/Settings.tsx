import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Update imports
import { ArrowLeft, ChevronRight, Lock, HelpCircle, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { logoutUser } from '../api/Guide/logout'; // Add this import
import { Link } from 'react-router-dom';

export default function Settings() {
  const [user] = useState({
    full_name: 'Arsal Zahid',
    email: 'arsal@example.com',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d'
  });
  
  const navigate = useNavigate();
  const setUser = useAuthStore(state => state.setUser);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-800">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center">
          <User className="text-blue-900 mr-2" size={28} />
          <h1 className="text-xl font-semibold text-blue-900">Account Settings</h1>
        </div>
      </div>

      <div className="bg-white p-6 mt-6 space-y-4 mx-4 rounded-lg shadow-sm">
        <Link 
          to="/personal-settings"
          className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <User className="w-5 h-5 text-blue-900 mr-3" />
          <div className="flex-1">
            <span className="font-medium">Personal Details</span>
            <p className="text-sm text-gray-600">Manage your personal information</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>

        <Link 
          to="/privacy-security"
          className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Lock className="w-5 h-5 text-blue-900 mr-3" />
          <div className="flex-1">
            <span className="font-medium">Privacy & Security</span>
            <p className="text-sm text-gray-600">Manage your account security</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>

        <Link 
          to="/help-support"
          className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <HelpCircle className="w-5 h-5 text-blue-900 mr-3" />
          <div className="flex-1">
            <span className="font-medium">Help & Support</span>
            <p className="text-sm text-gray-600">Get help and contact support</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </Link>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
        >
          <LogOut className="w-5 h-5 text-red-600 mr-3" />
          <div className="flex-1 text-left">
            <span className="font-medium text-red-600">Logout</span>
            <p className="text-sm text-red-500">Sign out of your account</p>
          </div>
        </button>
      </div>
    </div>
  );
}