import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface Props {
  children: JSX.Element;
  adminOnly?: boolean;
}

export default function ProtectedRoute({ children, adminOnly = false }: Props) {
  const { user, isAdmin } = useAuthStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/events" replace />;
  }

  if (!adminOnly && isAdmin && location.pathname.startsWith('/events')) {
    return <Navigate to="/admin-dashboard" replace />;
  }

  return children;
}
