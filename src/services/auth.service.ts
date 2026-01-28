import { apiClient, ApiResponse, UserFromToken } from '@/lib/api-client';
import { LoginRequestDto, LoginResponseDto } from '@/types/api.types';

function decodeJwtClaims(token: string): Record<string, any> {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        return {};
    }
}

function extractUserFromToken(token: string): UserFromToken {
    const claims = decodeJwtClaims(token);
    
    const username = claims['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '';

    return {
        username,
    };
}

export const authService = {
    async login(dto: LoginRequestDto): Promise<ApiResponse<UserFromToken>> {
        try {
            const response = await apiClient.post<LoginResponseDto>('/api/auth/login', dto);

            if (response.error) {
                return { error: response.error, status: response.status };
            }

            if (response.data?.token) {
                const user = extractUserFromToken(response.data.token);
                
                if (typeof window !== 'undefined') {
                    localStorage.setItem('accessToken', response.data.token);
                }
                
                return { data: user, status: response.status };
            }

            return { error: 'No token received', status: response.status };
        } catch (error: any) {
            return { error: error.message || 'Login failed', status: 500 };
        }
    },

    async checkAuth(): Promise<ApiResponse<UserFromToken>> {
        try {
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    const user = extractUserFromToken(token);
                    return { data: user, status: 200 };
                }
            }
            return { error: 'No token found', status: 401 };
        } catch (error: any) {
            return { error: error.message || 'Auth check failed', status: 500 };
        }
    },

    async logout(): Promise<void> {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
        }
    },
};