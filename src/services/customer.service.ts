import { apiClient, ApiResponse } from '@/lib/api-client';
import { CustomerDto, CreateCustomerDto } from '@/types/api.types';

export const customerService = {
    async getAll(): Promise<ApiResponse<CustomerDto[]>> {
        return await apiClient.get<CustomerDto[]>('/api/customers');
    },

    async getById(id: number): Promise<ApiResponse<CustomerDto>> {
        return await apiClient.get<CustomerDto>(`/api/customers/${id}`);
    },

    async create(dto: CreateCustomerDto): Promise<ApiResponse<CustomerDto>> {
        return await apiClient.post<CustomerDto>('/api/customers', dto);
    },

    async update(id: number, dto: CreateCustomerDto): Promise<ApiResponse<CustomerDto>> {
        return await apiClient.put<CustomerDto>(`/api/customers/${id}`, dto);
    },

    async delete(id: number): Promise<ApiResponse<void>> {
        return await apiClient.delete<void>(`/api/customers/${id}`);
    },
};