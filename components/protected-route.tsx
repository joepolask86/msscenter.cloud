'use client';

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 * Saves current path to redirect back after login
 */

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/login'];

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Check if current route is public
    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    useEffect(() => {
        // Skip protection for public routes
        if (isPublicRoute) {
            return;
        }

        if (!loading && !isAuthenticated) {
            // Save current path to redirect back after login
            if (typeof window !== 'undefined') {
                sessionStorage.setItem('redirectAfterLogin', pathname);
            }
            router.push('/login');
        }
    }, [isAuthenticated, loading, router, pathname, isPublicRoute]);

    // Show loading state while checking auth (only for protected routes)
    // if (!isPublicRoute && loading) {
    //     return (
    //         <div className="flex items-center justify-center min-h-screen">
    //             <div className="text-center">
    //                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
    //                 <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
    //             </div>
    //         </div>
    //     );
    // }

    // Don't render protected content if not authenticated (only for protected routes)
    if (!isPublicRoute && !isAuthenticated && !loading) {
        return null;
    }

    return <>{children}</>;
}
