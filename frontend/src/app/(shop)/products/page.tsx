'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/features/auth/context/auth';
import { getProducts } from '@/features/catalog/api/catalogApi';
import { updateItem } from '@/features/cart/api/cartApi';
import ProductGrid from '@/features/catalog/components/ProductGrid';
import ProductsSearchBar from '@/features/catalog/components/ProductsSearchBar';
import type { Product } from '@/lib/types/models';

function ProductsView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [results, setResults] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getProducts(query, page, 12)
      .then((data) => {
        setResults(data.items);
        setTotalPages(data.totalPages);
      })
      .catch((e: Error) => {
        setResults([]);
        setTotalPages(0);
        alert(e.message);
      })
      .finally(() => setLoading(false));
  }, [query, page]);

  function handleSearch(query: string) {
    setQuery(query);
    setPage(0);
  }

  function handlePagination(p: number) {
    setPage(p);
  }

  const handleAddToCart = useCallback(
    (productId: number) => {
      if (!isAuthenticated) {
        router.push('/login?next=/products');
        return;
      }
      updateItem(productId, 1).catch((e: Error) => alert(e.message));
    },
    [isAuthenticated, router],
  );

  function renderProducts() {
    if (loading) {
      return <p className="muted">Đang tải…</p>;
    }
    return (
      <>
        <ProductGrid products={results} onAddToCart={handleAddToCart} />
        {totalPages > 1 ? (
          <div className="pagination">
            <button className="btn btn-outline" disabled={page === 0} onClick={() => handlePagination(page - 1)}>
              Trước
            </button>
            <span className="muted">
              Trang {page + 1}/{totalPages}
            </span>
            <button className="btn btn-outline" disabled={page >= totalPages - 1} onClick={() => handlePagination(page + 1)}>
              Sau
            </button>
          </div>
        ) : null}
      </>
    );
  }

  return (
    <section>
      <h1>Sản phẩm</h1>
      <ProductsSearchBar defaultValue={query} onSearch={handleSearch} />
      {renderProducts()}
    </section>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<p className="muted">Đang tải…</p>}>
      <ProductsView />
    </Suspense>
  );
}