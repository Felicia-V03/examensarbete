import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@bookory-frontend/auth-context';

export const ProtectedRoute = () => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/" replace />;
    return <Outlet />;
};
