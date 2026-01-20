/**
 * API Client Configuration
 * Handles all HTTP requests to the Flask backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_VERSION = process.env.NEXT_PUBLIC_API_VERSION || 'v1';

export const API_URL = `${API_BASE_URL}/api/${API_VERSION}`;

/**
 * Get auth token from localStorage
 */
export function getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
}

/**
 * Set auth token in localStorage
 */
export function setAuthToken(token: string): void {
    localStorage.setItem('access_token', token);
}

/**
 * Remove auth token from localStorage
 */
export function removeAuthToken(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
}

/**
 * Get refresh token from localStorage
 */
export function getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
}

/**
 * Set refresh token in localStorage
 */
export function setRefreshToken(token: string): void {
    localStorage.setItem('refresh_token', token);
}

/**
 * API Client class with interceptors
 */
class APIClient {
    private baseURL: string;

    constructor(baseURL: string) {
        this.baseURL = baseURL;
    }

    /**
     * Make HTTP request with automatic token injection
     */
    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const token = getAuthToken();

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        // Add auth token if available
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const url = `${this.baseURL}${endpoint}`;

        try {
            const response = await fetch(url, {
                ...options,
                headers,
            });

            // Handle 401 Unauthorized - try to refresh token
            if (response.status === 401 && token) {
                const refreshed = await this.refreshToken();
                if (refreshed) {
                    // Retry the original request with new token
                    return this.request(endpoint, options);
                } else {
                    // Refresh failed, redirect to login
                    removeAuthToken();
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                    throw new Error('Session expired. Please login again.');
                }
            }

            // Parse response
            const data = await response.json();

            // Handle error responses
            if (!response.ok) {
                const error = new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
                (error as any).status = response.status;
                (error as any).statusText = response.statusText;
                (error as any).response = response; // Include raw response if needed
                throw error;
            }

            return data as T;
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Network error occurred');
        }
    }

    /**
     * Refresh access token using refresh token
     */
    private async refreshToken(): Promise<boolean> {
        const refreshToken = getRefreshToken();

        if (!refreshToken) {
            return false;
        }

        try {
            const response = await fetch(`${this.baseURL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${refreshToken}`,
                },
            });

            if (!response.ok) {
                return false;
            }

            const data = await response.json();
            setAuthToken(data.access_token);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * GET request
     */
    async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    /**
     * POST request
     */
    async post<T>(endpoint: string, body?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    /**
     * PUT request
     */
    async put<T>(endpoint: string, body?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
        });
    }

    /**
     * DELETE request
     */
    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

// Export singleton instance
export const apiClient = new APIClient(API_URL);

// Export convenience methods
export const api = {
    get: <T>(endpoint: string) => apiClient.get<T>(endpoint),
    post: <T>(endpoint: string, body?: any) => apiClient.post<T>(endpoint, body),
    put: <T>(endpoint: string, body?: any) => apiClient.put<T>(endpoint, body),
    delete: <T>(endpoint: string) => apiClient.delete<T>(endpoint),
};
