import React, { createContext, useContext, useEffect, useState } from 'react';
import apiClient from '../api/axios';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface User {
    email?: string;
    nickname?: string;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string, refreshToken: string, userData?: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken, removeToken] = useLocalStorage<string | null>('accessToken', null);
    const [refreshToken, setRefreshToken, removeRefreshToken] = useLocalStorage<string | null>('refreshToken', null);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setUser(null);
                setIsLoading(false);
                return;
            }

            try {
                const response = await apiClient.get('/users/me');
                setUser(response.data?.data || response.data);
            } catch (error) {
                console.error('Failed to fetch user info:', error);
                removeToken();
                removeRefreshToken();
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [token, removeToken, removeRefreshToken]);

    const login = (newToken: string, newRefreshToken: string, userData?: User) => {
        setToken(newToken);
        setRefreshToken(newRefreshToken);
        if (userData) {
            setUser(userData);
        }
    };

    const logout = () => {
        removeToken();
        removeRefreshToken();
        setUser(null);
    };

    const value = {
        user,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
