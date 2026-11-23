import http from '@/lib/http/client';
import type { Paged, Product } from '@/lib/types/models';

/** Danh sách sản phẩm theo từ khóa + phân trang. */
export async function getProducts(query: string, page: number, size: number): Promise<Paged<Product>> {
  const qs = new URLSearchParams({ q: query, page: String(page), size: String(size) });
  return http.get<Paged<Product>>(`/api/products/search?${qs.toString()}`);
}

/** Chi tiết một sản phẩm. */
export async function getProductById(id: number): Promise<Product> {
  return http.get<Product>(`/api/products/${id}`);
}