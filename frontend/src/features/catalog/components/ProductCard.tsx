'use client';

import Link from 'next/link';
import type { Product } from '@/lib/types/models';
import { formatVND } from '@/lib/format';

export default function ProductCard({
  product,
  onAddToCart,
}: {
  product: Product;
  onAddToCart?: (productId: number) => void;
}) {
  const available = product.stockQuantity > 0;
  return (
    <div className="card product-card">
      <Link className="product-card-title" href={`/products/${product.id}`}>
        {product.name}
      </Link>
      <span className="product-card-sku">{product.sku}</span>
      <p className="product-card-desc">{product.description || 'Không có mô tả.'}</p>
      <div className="card-footer">
        <span className="price">{formatVND(product.price)}</span>
        <span className={`badge ${available ? 'badge-ok' : 'badge-off'}`}>
          {available ? `Còn ${product.stockQuantity}` : 'Hết hàng'}
        </span>
      </div>
      {onAddToCart ? (
        <button className="btn btn-primary" disabled={!available} onClick={() => onAddToCart(product.id)}>
          Thêm vào giỏ
        </button>
      ) : null}
    </div>
  );
}