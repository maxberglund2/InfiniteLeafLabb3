import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface ApiResponse<T> {
    data?: T;
    error?: string;
    status: number;
}

export interface UserFromToken {
    username: string;
}

class ApiClient {
    private axiosInstance: AxiosInstance;

    constructor(baseUrl: string) {
        this.axiosInstance = axios.create({
            baseURL: baseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor to add token
        this.axiosInstance.interceptors.request.use(
            (config) => {
                if (typeof window !== 'undefined') {
                    const token = localStorage.getItem('accessToken');
                    if (token) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Response interceptor for error handling
        this.axiosInstance.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {
                if (error.response?.status === 401) {
                    // Token expired or invalid
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('accessToken');
                        window.location.href = '/auth';
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    private handleResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
        return {
            data: response.data,
            status: response.status,
        };
    }

    private handleError(error: any): ApiResponse<never> {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<any>;
            return {
                error: axiosError.response?.data?.message || axiosError.message || 'Request failed',
                status: axiosError.response?.status || 500,
            };
        }
        return {
            error: error.message || 'Unknown error',
            status: 500,
        };
    }

    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.get<T>(endpoint);
            return this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.post<T>(endpoint, body);
            return this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.put<T>(endpoint, body);
            return this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.delete<T>(endpoint);
            return this.handleResponse(response);
        } catch (error) {
            return this.handleError(error);
        }
    }

    // Direct access to axios instance for custom requests
    get axios(): AxiosInstance {
        return this.axiosInstance;
    }
}

export const apiClient = new ApiClient(API_BASE_URL);