import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
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
    login: (token: string, userData?: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken, removeToken] = useLocalStorage<string | null>('accessToken', null);
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
                const response = await axios.get('http://localhost:8000/v1/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser(response.data?.data || response.data);
            } catch (error) {
                console.error('Failed to fetch user info:', error);
                removeToken();
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [token, removeToken]);

    const login = (newToken: string, userData?: User) => {
        setToken(newToken);
        if (userData) {
            setUser(userData);
        }
    };

    const logout = () => {
        removeToken();
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
