'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';
import { getCart } from '@/features/cart/api/cartApi';
import { checkout } from '@/features/orders/api/orderApi';
import CheckoutForm from '@/features/checkout/components/CheckoutForm';
import type { CheckoutFormValue } from '@/features/checkout/components/CheckoutForm';
import { formatVND } from '@/lib/format';
import type { CartLine } from '@/lib/types/models';

function CheckoutInner() {
  const [items, setItems] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    getCart()
      .then(setItems)
      .catch((e) => setError(e instanceof Error ? e.message : 'Không tải được giỏ hàng.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmitOrder = useCallback(
    async (data: CheckoutFormValue) => {
      if (items.length === 0) {
        setError('Giỏ hàng trống.');
        return;
      }
      setSubmitting(true);
      setError('');
      try {
        const order = await checkout({
          recipientName: data.recipientName,
          recipientPhone: data.recipientPhone,
          shippingAddress: data.shippingAddress,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        });
        router.push(`/orders/${order.id}`);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Không thể đặt hàng.');
        setSubmitting(false);
      }
    },
    [items, router],
  );

  const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  if (loading) return <p className="muted">Đang tải…</p>;

  function renderCheckout() {
    return (
      <div className="checkout-grid">
        <CheckoutForm onSubmit={handleSubmitOrder} submitting={submitting} />
        <aside className="summary">
          <h3>Đơn hàng ({items.length})</h3>
          <ul>
            {items.map((i) => (
              <li key={i.productId}>
                <span>
                  {i.name} × {i.quantity}
                </span>
                <span>{formatVND(i.unitPrice * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="summary-total">Tổng: {formatVND(total)}</div>
        </aside>
      </div>
    );
  }

  return (
    <section>
      <h1>Thanh toán</h1>
      {renderCheckout()}
      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}

export default function CheckoutPage() {
  return (
    <RequireAuth>
      <CheckoutInner />
    </RequireAuth>
  );
}