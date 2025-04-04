import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Events from './pages/Events';
import Settings from './pages/Settings';
import EventDetails from './pages/EventDetails';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OtpVerification from './pages/OtpVerification';
import BottomNav from './components/BottomNav';
import { useAuthStore } from './store/authStore';
import PrivacySecurity from './pages/PrivacySecurity';
import HelpSupport from './pages/HelpSupport';
import PersonalSettings from './pages/PersonalSettings';

// Add service worker registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}

function App() {
  const user = useAuthStore((state) => state.user);

  return (
    <Router>
      <div className="min-h-screen bg-grsay-50 pb-16">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OtpVerification />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Static Routes */}
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/privacy-security" element={<PrivacySecurity />} />
          <Route path="/help-support" element={<HelpSupport />} />
          <Route path="/" element={<Navigate to="/events" />} />
          <Route path="/personal-settings" element={<PersonalSettings />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;