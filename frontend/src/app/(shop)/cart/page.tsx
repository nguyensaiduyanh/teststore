'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import RequireAuth from '@/components/RequireAuth';
import { getCart, updateItem, removeItem, clearCart } from '@/features/cart/api/cartApi';
import CartItem from '@/features/cart/components/CartItem';
import { formatVND } from '@/lib/format';
import type { CartLine } from '@/lib/types/models';

function CartInner() {
  const [items, setItems] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      setItems(await getCart());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  async function handleUpdateQuantity(productId: number, quantity: number) {
    if (quantity < 1) return;
    try {
      setItems(await updateItem(productId, quantity));
      setMsg('');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Cập nhật thất bại.');
    }
  }

  async function handleRemoveItem(productId: number) {
    try {
      await removeItem(productId);
      setMsg('');
      await reload();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Xóa thất bại.');
    }
  }

  const handleClear = useCallback(async () => {
    await clearCart();
    await reload();
  }, [reload]);

  const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  function renderCart() {
    if (loading) {
      return <p className="muted">Đang tải…</p>;
    }
    if (items.length === 0) {
      return (
        <p className="empty">
          Giỏ hàng trống.{' '}
          <Link href="/products">Xem sản phẩm</Link>
        </p>
      );
    }
    return (
      <div>
        {items.map((item) => (
          <CartItem
            key={item.productId}
            item={item}
            onUpdateQuantity={(quantity) => handleUpdateQuantity(item.productId, quantity)}
            onRemove={() => handleRemoveItem(item.productId)}
          />
        ))}
        <div className="cart-total">
          <span>Tổng cộng: {formatVND(total)}</span>
          <button className="btn btn-outline" onClick={handleClear}>
            Xóa toàn bộ
          </button>
          <Link className="btn btn-primary" href="/checkout">
            Thanh toán
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section>
      <h1>Giỏ hàng</h1>
      {msg ? <p className="error">{msg}</p> : null}
      {renderCart()}
    </section>
  );
}

export default function CartPage() {
  return (
    <RequireAuth>
      <CartInner />
    </RequireAuth>
  );
}