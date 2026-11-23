import http from '@/lib/http/client';
import type { CartLine } from '@/lib/types/models';

/** Lấy toàn bộ giỏ hàng của khách đang đăng nhập. */
export async function getCart(): Promise<CartLine[]> {
  return http.get<CartLine[]>('/api/cart');
}

/** Cập nhật số lượng một dòng hàng; trả về giỏ mới. */
export async function updateItem(productId: number, quantity: number): Promise<CartLine[]> {
  return http.put<CartLine[]>(`/api/cart/items/${productId}`, { quantity });
}

/** Xóa một dòng hàng khỏi giỏ. */
export async function removeItem(productId: number): Promise<void> {
  return http.delete(`/api/cart/items/${productId}`);
}

/** Xóa toàn bộ giỏ hàng. */
export async function clearCart(): Promise<void> {
  return http.delete('/api/cart');
}