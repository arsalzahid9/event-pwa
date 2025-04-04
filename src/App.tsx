import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useAuthStore } from './store/authStore';

import Login from './pages/Login';
import Events from './pages/Events';
import Settings from './pages/Settings';
import EventDetails from './pages/EventDetails';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OtpVerification from './pages/OtpVerification';
import BottomNav from './components/BottomNav';
import PrivacySecurity from './pages/PrivacySecurity';
import HelpSupport from './pages/HelpSupport';
import PersonalSettings from './pages/PersonalSettings';
import { Dashboard } from './pages/Admin/Dashboard';
import { AllEvent } from './pages/Admin/AllEvent';
import { Guides } from './pages/Admin/Guides';

// Add service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}

// Inner App component with access to hooks
function AppRoutes() {
  const location = useLocation();
  const isAdmin = useAuthStore((state) => state.isAdmin);

  const authPaths = [
    '/login',
    '/forgot-password',
    '/otp-verification',
    '/reset-password',
  ];

  const shouldHideBottomNav = authPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Common Routes */}
        <Route path="/events" element={<Events />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/privacy-security" element={<PrivacySecurity />} />
        <Route path="/help-support" element={<HelpSupport />} />
        <Route path="/personal-settings" element={<PersonalSettings />} />
        <Route path="/" element={<Navigate to="/events" />} />

        {/* Admin-only routes */}
        {isAdmin && (
          <>
            <Route path="/admin-dashboard" element={<Dashboard/>} />
            <Route path="/all-events" element={<AllEvent/>} />
            <Route path="/guides" element={<Guides/>} />
            {/* Add other admin routes here */}
          </>
        )}
      </Routes>

      {!shouldHideBottomNav && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
