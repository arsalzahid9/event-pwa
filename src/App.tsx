import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import ScrollToTop from './components/ScrollToTop';
import Login from './pages/Login';
import Events from './pages/Events';
import Settings from './pages/Settings';
import EventDetails from './pages/EventDetails';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OtpVerification from './pages/OtpVerification';
import BottomNav from './components/BottomNav';
import AdminBottomNav from './components/AdminBottomNav';
import PrivacySecurity from './pages/PrivacySecurity';
import HelpSupport from './pages/HelpSupport';
import PersonalSettings from './pages/PersonalSettings';
import { Dashboard } from './pages/Admin/Dashboard';
// Change from:
// import { AllEvent } from './pages/Admin/AllEvent';
// To:
import AllEvent from './pages/Admin/AllEvent';
import { Guides } from './pages/Admin/Guides';
import AllEventDetail from './pages/Admin/AllEventDetail';
import NotFound from './pages/NotFound';


function AppRoutes() {
  const location = useLocation();
  const isAdmin = useAuthStore((state) => state.isAdmin);

  // Define paths where bottom navigation should be hidden
  const authPaths = [
    '/login',
    '/forgot-password',
    '/otp-verification',
    '/reset-password',
  ];
  const shouldHideBottomNav = authPaths.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <ScrollToTop />
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
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Admin-only Routes */}
        {isAdmin && (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/all-events" element={<AllEvent />} />
            <Route path="/all-events/:id" element={<AllEventDetail />} />
            <Route path="/guides" element={<Guides />} />
          </>
        )}

        {/* 404 Route - Keep this last */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Render Bottom Navigation if not on an auth page */}
      {!shouldHideBottomNav && (
        isAdmin ? <AdminBottomNav /> : <BottomNav />
      )}
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
