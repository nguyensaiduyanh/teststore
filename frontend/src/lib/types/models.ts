// Các kiểu dữ liệu khớp với response của backend Spring Boot (vn.edu.sales).

export type Role = 'ADMIN' | 'CUSTOMER';

export type ProductStatus = "ACTIVE" | "INACTIVE";

export interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  status: string;
  version: number;
}

export interface Paged<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CartLine {
  productId: number;
  sku: string;
  name: string;
  unitPrice: number;
  stockQuantity: number;
  productStatus: string;
  quantity: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
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

export interface PagedOrders {
  items: Order[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface AuthResult {
  accessToken: string;
  tokenType: string;
  email: string;
  role: Role;
}

export interface CurrentUser {
  id: number;
  email: string;
  fullName: string;
  roles: string[];
}

/** Dữ liệu gửi khi đặt hàng trực tiếp (POST /api/orders). */
export interface CheckoutPayload {
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  items: { productId: number; quantity: number }[];
}
export type InventoryMovementType = "OPENING_BALANCE" | "PURCHASE" |
    "SALE" | "SALE_REVERSAL" | "ADJUSTMENT_IN" | "ADJUSTMENT_OUT";

export interface InventoryMovement {
  id: number;
  productId: number;
  orderId: number | null;
  type: InventoryMovementType;
  quantityChange: number;
  stockBefore: number;
  stockAfter: number;
  referenceCode: string | null;
  note: string | null;
  actorUserId: number | null;
  createdAt: string;
}