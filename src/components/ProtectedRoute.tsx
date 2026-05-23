import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-80px)]">
                <LoadingSpinner />
            </div>
        );
    }

    if (!isAuthenticated) {
        alert('로그인이 필요한 서비스입니다.');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }


    return <Outlet />;
}
