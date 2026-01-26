// Auth DTOs
export interface LoginRequestDto {
    username: string;
    password: string;
}

export interface LoginResponseDto {
    token: string;
    username: string;
    expiresAt: string;
}

// Customer DTOs
export interface CustomerDto {
    id: number;
    name: string;
    phoneNumber: string;
}

export interface CreateCustomerDto {
    name: string;
    phoneNumber: string;
}

// Menu Item DTOs
export interface MenuItemDto {
    id: number;
    name: string;
    price: number;
    description: string;
    isPopular: boolean;
    imageUrl?: string;
}

export interface CreateMenuItemDto {
    name: string;
    price: number;
    description: string;
    isPopular: boolean;
    imageUrl?: string;
}

export interface UpdateMenuItemDto {
    name: string;
    price: number;
    description: string;
    isPopular: boolean;
    imageUrl?: string;
}

// Cafe Table DTOs
export interface CafeTableDto {
    id: number;
    tableNumber: number;
    capacity: number;
}

export interface CreateCafeTableDto {
    tableNumber: number;
    capacity: number;
}

export interface UpdateCafeTableDto {
    tableNumber: number;
    capacity: number;
}

export interface AvailableTableDto {
    id: number;
    tableNumber: number;
    capacity: number;
}

// Reservation DTOs
export interface ReservationDto {
    id: number;
    startTime: string;
    numberOfGuests: number;
    cafeTableId: number;
    cafeTable: CafeTableDto;
    customerId: number;
    customer: CustomerDto;
}

export interface CreateReservationDto {
    startTime: string;
    numberOfGuests: number;
    cafeTableId: number;
    customerId: number;
}

// User from token (decoded JWT)
export interface UserFromToken {
    username: string;
}