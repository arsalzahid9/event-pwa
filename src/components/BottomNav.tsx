import { Calendar, Settings } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2">
      <Link 
        to="/events" 
        className={`flex flex-col items-center ${location.pathname === '/events' ? 'text-blue-700' : 'text-gray-600'}`}
      >
        <Calendar size={24} />
        <span className="text-xs mt-1">Events</span>
      </Link>
      <Link 
        to="/settings" 
        className={`flex flex-col items-center ${location.pathname === '/settings' ? 'text-blue-700' : 'text-gray-600'}`}
      >
        <Settings size={24} />
        <span className="text-xs mt-1">Settings</span>
      </Link>
    </nav>
  );
}