import { apiClient, ApiResponse } from '@/lib/api-client';
import { MenuItemDto, CreateMenuItemDto, UpdateMenuItemDto } from '@/types/api.types';

export const menuService = {
    async getAll(): Promise<ApiResponse<MenuItemDto[]>> {
        return await apiClient.get<MenuItemDto[]>('/api/menuitems');
    },

    async getPopular(): Promise<ApiResponse<MenuItemDto[]>> {
        return await apiClient.get<MenuItemDto[]>('/api/menuitems/popular');
    },

    async getById(id: number): Promise<ApiResponse<MenuItemDto>> {
        return await apiClient.get<MenuItemDto>(`/api/menuitems/${id}`);
    },

    async create(dto: CreateMenuItemDto): Promise<ApiResponse<MenuItemDto>> {
        return await apiClient.post<MenuItemDto>('/api/menuitems', dto);
    },

    async update(id: number, dto: UpdateMenuItemDto): Promise<ApiResponse<MenuItemDto>> {
        return await apiClient.put<MenuItemDto>(`/api/menuitems/${id}`, dto);
    },

    async delete(id: number): Promise<ApiResponse<void>> {
        return await apiClient.delete<void>(`/api/menuitems/${id}`);
    },
};