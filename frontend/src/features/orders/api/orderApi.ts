import http from '@/lib/http/client';
import type { CheckoutPayload, Order, PagedOrders } from '@/lib/types/models';

/** Đặt hàng trực tiếp. Có thể truyền idempotency key để chống đặt trùng (chưa dùng phía backend). */
export async function checkout(data: CheckoutPayload, idempotencyKey?: string): Promise<Order> {
  return http.post<Order>('/api/orders', data, {
    headers: idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : undefined,
  });
}

/** Danh sách đơn của khách, lọc theo trạng thái (nếu có). */
export async function getMyOrders(page = 0, size = 20, status?: string): Promise<PagedOrders> {
  if (status) {
    return http.get<PagedOrders>(`/api/orders/me/search?status=${status}&page=${page}&size=${size}`);
  }
  return http.get<PagedOrders>(`/api/orders/me?page=${page}&size=${size}`);
}

/** Chi tiết một đơn của khách. */
export async function getOrderById(id: number): Promise<Order> {
  return http.get<Order>(`/api/orders/${id}`);
}

/** Hủy đơn còn ở trạng thái PENDING. */
export async function cancelOrder(id: number): Promise<Order> {
  return http.patch<Order>(`/api/orders/${id}/cancel`);
}