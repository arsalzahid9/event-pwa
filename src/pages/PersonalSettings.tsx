// Remove auth store import
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';

export default function PersonalSettings() {
  const navigate = useNavigate();

  // Static user data
  const user = {
    full_name: 'Arsal Zahid',
    email: 'arsal@example.com',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="text-gray-600">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center">
          <User className="text-blue-900 mr-2" size={28} />
          <h1 className="text-xl font-semibold text-blue-900">Personal Settings</h1>
        </div>
      </div>

      <div className="p-8 flex flex-col items-center">
        <div className="relative">
          <img
            src={user.avatar}
            alt="Arsal Zahid"
            className="w-24 h-24 rounded-full object-cover"
          />
          <button className="mt-4 text-blue-600 font-medium">
            Change Photo
          </button>
        </div>
      </div>

      <div className="bg-white p-4 space-y-4 mx-4 rounded-lg shadow-sm">
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Full Name</label>
          <p className="text-lg font-medium">{user.full_name}</p>
        </div>
        <div className="space-y-1">
          <label className="text-sm text-gray-600">Email Address</label>
          <p className="text-lg font-medium">{user.email}</p>
        </div>
      </div>
    </div>
  );
}