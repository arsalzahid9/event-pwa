import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Lock, HelpCircle, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

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

      <div className="p-8 flex flex-col items-center">
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.full_name}
            className="w-24 h-24 rounded-full object-cover"
          />
          <button className="mt-4 text-blue-600 font-medium">
            Change Photo
          </button>
        </div>
      </div>

      <div className="bg-white p-4 space-y-4">
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Full Name</label>
          <p className="text-lg font-medium">{user.full_name}</p>
        </div>
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Email Address</label>
          <p className="text-lg font-medium">{user.email}</p>
        </div>
      </div>

      <div className="mt-6 bg-white">
        <button className="w-full p-4 flex items-center justify-between text-left border-b">
          <div className="flex items-center gap-3">
            <Lock className="text-gray-600" size={20} />
            <span className="font-medium">Privacy & Security</span>
          </div>
          <ChevronRight className="text-gray-400" size={20} />
        </button>
        
        <button className="w-full p-4 flex items-center justify-between text-left border-b">
          <div className="flex items-center gap-3">
            <HelpCircle className="text-gray-600" size={20} />
            <span className="font-medium">Help & Support</span>
          </div>
          <ChevronRight className="text-gray-400" size={20} />
        </button>

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