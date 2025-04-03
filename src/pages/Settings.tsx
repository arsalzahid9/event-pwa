import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Update imports
import { ArrowLeft, ChevronRight, Lock, HelpCircle, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

export default function Settings() {
  const [user] = useState({
    full_name: 'Arsal Zahid',
    email: 'arsal@example.com',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d'
  });
  
  const navigate = useNavigate();
  const setUser = useAuthStore(state => state.setUser);

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="text-gray-600">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-semibold">Account Settings</h1>
      </div>

      

      <div className="mt-6 bg-white">
        <Link 
          to="/personal-settings"
          className="w-full p-4 flex items-center justify-between text-left border-b hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <User className="text-gray-600" size={20} />
            <span className="font-medium">Personal Settings</span>
          </div>
          <ChevronRight className="text-gray-400" size={20} />
        </Link>

        <Link 
          to="/privacy-security" 
          className="w-full p-4 flex items-center justify-between text-left border-b hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <Lock className="text-gray-600" size={20} />
            <span className="font-medium">Privacy & Security</span>
          </div>
          <ChevronRight className="text-gray-400" size={20} />
        </Link>
        
        <Link 
          to="/help-support" 
          className="w-full p-4 flex items-center justify-between text-left border-b hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="text-gray-600" size={20} />
            <span className="font-medium">Help & Support</span>
          </div>
          <ChevronRight className="text-gray-400" size={20} />
        </Link>

        <button 
          onClick={handleLogout}
          className="w-full p-4 flex items-center gap-3 text-left text-red-600"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}