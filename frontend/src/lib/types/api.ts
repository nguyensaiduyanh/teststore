import type {Order, Product, Role, OrderStatus, ProductStatus, OrderItem} from "@/lib/types/models";

export type TokenType = "Bearer";

export interface AuthResult {
    accessToken: string;
    tokenType: TokenType;
    email: string;
    role: Role;
}

export interface ApiError {
    timestamp: string;
    status: number;
    code: string;
    message: string;
    path: string;
    fields?: Record<string, string> | null;
}

export interface PagedProducts {
    items: Product[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface PagedOrders {
    items: Order[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

export interface CreateProductRequest {
    sku: string;
    name: string;
    description?: string | null;
    price: number;
    stockQuantity: number;
}

export interface UpdateProductRequest {
    name: string;
    description?: string | null;
    price: number;
    stockQuantity: number;
}

export interface UpdateOrderStatusRequest {
    status: OrderStatus;
}

export interface AdjustmentRequest {
    quantityChange: number;
    note?: string | null;
}

export interface UpdateStockRequest {
    stockQuantity: number;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
}

export interface ProductResponse {
    id: number;
    sku: string;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    status: ProductStatus;
    version: number
}

export interface OrderResponse {
    id: number;
    orderCode: string;
    userId: number;
    recipientName: string;
    recipientPhone: string;
    shippingAddress: string;
    status: OrderStatus;
    totalAmount: number;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
}
export interface PagedProducts {
    items: Product[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}



