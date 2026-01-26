import { apiClient, ApiResponse } from '@/lib/api-client';
import { ReservationDto, CreateReservationDto } from '@/types/api.types';

export const reservationService = {
    async getAll(): Promise<ApiResponse<ReservationDto[]>> {
        return await apiClient.get<ReservationDto[]>('/api/reservations');
    },

    async getById(id: number): Promise<ApiResponse<ReservationDto>> {
        return await apiClient.get<ReservationDto>(`/api/reservations/${id}`);
    },

    async create(dto: CreateReservationDto): Promise<ApiResponse<ReservationDto>> {
        return await apiClient.post<ReservationDto>('/api/reservations', dto);
    },

    async update(id: number, dto: CreateReservationDto): Promise<ApiResponse<ReservationDto>> {
        return await apiClient.put<ReservationDto>(`/api/reservations/${id}`, dto);
    },

    async delete(id: number): Promise<ApiResponse<void>> {
        return await apiClient.delete<void>(`/api/reservations/${id}`);
    },
};