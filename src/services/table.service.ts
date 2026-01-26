import { apiClient, ApiResponse } from '@/lib/api-client';
import { CafeTableDto, CreateCafeTableDto, UpdateCafeTableDto, AvailableTableDto } from '@/types/api.types';

export const tableService = {
    async getAll(): Promise<ApiResponse<CafeTableDto[]>> {
        return await apiClient.get<CafeTableDto[]>('/api/cafetables');
    },

    async getById(id: number): Promise<ApiResponse<CafeTableDto>> {
        return await apiClient.get<CafeTableDto>(`/api/cafetables/${id}`);
    },

    async getAvailable(dateTime: string, numberOfGuests: number): Promise<ApiResponse<AvailableTableDto[]>> {
        return await apiClient.get<AvailableTableDto[]>(
            `/api/cafetables/available?dateTime=${encodeURIComponent(dateTime)}&numberOfGuests=${numberOfGuests}`
        );
    },

    async create(dto: CreateCafeTableDto): Promise<ApiResponse<CafeTableDto>> {
        return await apiClient.post<CafeTableDto>('/api/cafetables', dto);
    },

    async update(id: number, dto: UpdateCafeTableDto): Promise<ApiResponse<CafeTableDto>> {
        return await apiClient.put<CafeTableDto>(`/api/cafetables/${id}`, dto);
    },

    async delete(id: number): Promise<ApiResponse<void>> {
        return await apiClient.delete<void>(`/api/cafetables/${id}`);
    },
};