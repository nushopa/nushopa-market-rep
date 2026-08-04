import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, isProfileComplete } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!isProfileComplete) return <Navigate to="/profile" replace />;
  return <Outlet />;
}