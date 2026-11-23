'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context/auth';
import { getProductById } from '@/features/catalog/api/catalogApi';
import { updateItem } from '@/features/cart/api/cartApi';
import { formatVND } from '@/lib/format';
import type { Product } from '@/lib/types/models';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof id !== 'string') return;
    getProductById(Number(id))
      .then(setProduct)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAddToCart(productId: number, quantity: number) {
    if (!isAuthenticated) {
      router.push(`/login?next=/products/${productId}`);
      return;
    }
    updateItem(productId, quantity)
      .then(() => alert('Đã thêm vào giỏ hàng.'))
      .catch((e: Error) => setError(e.message));
  }

  function renderProduct(id: number) {
    if (!product || product.id !== id) return null;
    const available = product.stockQuantity > 0;
    return (
      <section className="product-detail">
        <div className="product-detail-info">
          <span className="muted">{product.sku}</span>
          <h1>{product.name}</h1>
          <p>{product.description || 'Không có mô tả.'}</p>
          <div className="price big">{formatVND(product.price)}</div>
          <span className={`badge ${available ? 'badge-ok' : 'badge-off'}`}>
            {available ? `Còn ${product.stockQuantity} sản phẩm` : 'Hết hàng'}
          </span>
        </div>

        <div className="cart-total add-to-cart">
          <label>
            Số lượng
            <input
              className="input qty"
              type="number"
              min={1}
              max={available ? product.stockQuantity : 1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </label>
          <button className="btn btn-primary" disabled={!available} onClick={() => handleAddToCart(product.id, quantity)}>
            Thêm vào giỏ
          </button>
        </div>
        {error ? <p className="error">{error}</p> : null}
      </section>
    );
  }

  if (loading) return <p className="muted">Đang tải…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!product) return <p className="error">Không tìm thấy sản phẩm.</p>;

  return renderProduct(Number(id));
}