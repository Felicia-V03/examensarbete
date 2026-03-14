import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@bookory-frontend/auth-store';

export const ProtectedRoute = () => {
    const user = useAuthStore((state) => state.user);
    if (!user) return <Navigate to="/" replace />;
    return <Outlet />;
};
