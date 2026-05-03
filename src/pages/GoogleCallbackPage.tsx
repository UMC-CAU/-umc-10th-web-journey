import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const GoogleCallbackPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const hasHandled = React.useRef(false);

    useEffect(() => {
        if (hasHandled.current) return;
        hasHandled.current = true;

        const queryParams = new URLSearchParams(location.search);
        const accessToken = queryParams.get('accessToken');
        const refreshToken = queryParams.get('refreshToken');
        const userId = queryParams.get('userId');
        const name = queryParams.get('name');

        if (accessToken && refreshToken) {
            login(accessToken, refreshToken, { id: userId, nickname: name });
            navigate('/', { replace: true });
        } else {
            // Handle error case, perhaps redirect to login with an error message
            navigate('/login', { replace: true, state: { error: '구글 로그인에 실패했습니다.' } });
        }
    }, [location.search, login, navigate]);

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="text-white text-xl font-bold animate-pulse">
                구글 로그인 중...
            </div>
        </div>
    );
};

export default GoogleCallbackPage;
