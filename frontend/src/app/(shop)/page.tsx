'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/context/auth';
import { getProducts } from '@/features/catalog/api/catalogApi';
import { updateItem } from '@/features/cart/api/cartApi';
import ProductGrid from '@/features/catalog/components/ProductGrid';
import type { Product } from '@/lib/types/models';

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    getProducts('', 0, 8)
      .then((page) => setFeatured(page.items))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = useCallback(
    (productId: number) => {
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }
      updateItem(productId, 1).catch((e: Error) => alert(e.message));
    },
    [isAuthenticated, router],
  );

  function renderBanners() {
    return (
      <div className="hero">
        <h1>Chào mừng đến Single Store</h1>
        <p>Sản phẩm chất lượng, giao nhanh tận nơi.</p>
        <Link className="btn btn-primary" href="/products">
          Xem sản phẩm
        </Link>
      </div>
    );
  }

  function renderFeaturedProducts() {
    if (loading) {
      return <p className="muted">Đang tải…</p>;
    }
    return <ProductGrid products={featured} onAddToCart={handleAddToCart} />;
  }

  return (
    <section>
      {renderBanners()}
      <h2>Sản phẩm nổi bật</h2>
      {renderFeaturedProducts()}
    </section>
  );
}