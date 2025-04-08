import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, Shield, Image } from 'lucide-react';
import Loader from '../components/Loader';
import { getProfile } from '../api/Guide/getProfile';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  image: string | null;
  email_verified_at: string | null;
  otp: string | null;
  is_admin: string;
  created_at: string;
  updated_at: string;
}

export default function PersonalSettings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await getProfile();
        setProfile(profileData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-800">
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center">
          <User className="text-blue-900 mr-2" size={28} />
          <h1 className="text-xl font-semibold text-blue-900">Personal Details</h1>
        </div>
      </div>

      <div className="bg-white p-6 mt-6 space-y-6 mx-4 rounded-lg shadow-sm">
        {/* <div className="flex items-center justify-center mb-8">
          {profile?.image ? (
            <img 
              src={profile.image} 
              alt={profile.name} 
              className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
              <User size={40} className="text-blue-900" />
            </div>
          )}
        </div> */}

        <div className="space-y-4">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <User className="w-5 h-5 text-blue-900 mr-3" />
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <p className="text-lg font-medium">{profile?.name}</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-blue-900 mr-3" />
            <div>
              <label className="text-sm text-gray-600">Email Address</label>
              <p className="text-lg font-medium">{profile?.email}</p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Shield className="w-5 h-5 text-blue-900 mr-3" />
            <div>
              <label className="text-sm text-gray-600">Role</label>
              <p className="text-lg font-medium capitalize">
                {profile?.is_admin === '1' ? 'Admin' : 'Guide'}
              </p>
            </div>
          </div>

          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-900 mr-3" />
            <div>
              <label className="text-sm text-gray-600">Member Since</label>
              <p className="text-lg font-medium">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
