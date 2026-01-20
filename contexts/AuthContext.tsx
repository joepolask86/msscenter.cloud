'use client';

/**
 * Authentication Context
 * Manages user authentication state across the application
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, setAuthToken, setRefreshToken, removeAuthToken, getAuthToken } from '@/lib/api-client';

interface User {
    id: string;
    username: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Check if user is logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = getAuthToken();

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                // Verify token by fetching user info
                const userData = await api.get<User>('/auth/me');
                setUser(userData);
            } catch (error) {
                // Token is invalid, clear it
                removeAuthToken();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (username: string, password: string) => {
        try {
            const response = await api.post<{
                access_token: string;
                refresh_token: string;
                user: User;
            }>('/auth/login', { username, password });

            // Store tokens
            setAuthToken(response.access_token);
            setRefreshToken(response.refresh_token);

            // Set user
            setUser(response.user);

            // Check for saved redirect path
            const redirectPath = sessionStorage.getItem('redirectAfterLogin');

            if (redirectPath) {
                // Clear saved path
                sessionStorage.removeItem('redirectAfterLogin');
                // Redirect to saved path
                router.push(redirectPath);
            } else {
                // Default redirect to home (dashboard)
                router.push('/');
            }
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        // Clear tokens
        removeAuthToken();

        // Clear user
        setUser(null);

        // Redirect to login
        router.push('/login');
    };

    const value = {
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
