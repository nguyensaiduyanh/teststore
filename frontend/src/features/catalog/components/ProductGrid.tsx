'use client';

import ProductCard from './ProductCard';
import type { Product } from '@/lib/types/models';

export default function ProductGrid({
  products,
  onAddToCart,
}: {
  products: Product[];
  onAddToCart?: (productId: number) => void;
}) {
  function renderProducts() {
    if (products.length === 0) {
      return <p className="empty">Không có sản phẩm nào.</p>;
    }
    return products.map((product) => (
      <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
    ));
  }

  return <div className="grid">{renderProducts()}</div>;
}