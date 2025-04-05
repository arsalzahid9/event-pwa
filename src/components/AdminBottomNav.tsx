import { LayoutDashboard, CalendarDays, Users, Settings} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function AdminBottomNav() {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2">
      <Link 
        to="/dashboard" 
        className={`flex flex-col items-center ${location.pathname === '/dashboard' ? 'text-blue-700' : 'text-gray-600'}`}
      >
        <LayoutDashboard size={24} />
        <span className="text-xs mt-1">Dashboard</span>
      </Link>
      <Link 
        to="/all-events" 
        className={`flex flex-col items-center ${location.pathname.startsWith('/all-events') ? 'text-blue-700' : 'text-gray-600'}`}
      >
        <CalendarDays size={24} />
        <span className="text-xs mt-1">Events</span>
      </Link>
      <Link 
        to="/guides" 
        className={`flex flex-col items-center ${location.pathname.startsWith('/guides') ? 'text-blue-700' : 'text-gray-600'}`}
      >
        <Users size={24} />
        <span className="text-xs mt-1">Guides</span>
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