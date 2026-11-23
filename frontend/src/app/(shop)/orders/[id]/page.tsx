'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';
import { getOrderById, cancelOrder } from '@/features/orders/api/orderApi';
import { ORDER_STATUS_LABEL } from '@/lib/order';
import { formatVND } from '@/lib/format';
import type { Order } from '@/lib/types/models';

function OrderDetailInner() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof id !== 'string') return;
    getOrderById(Number(id))
      .then(setOrder)
      .catch((e) => setError(e instanceof Error ? e.message : 'Không tải được đơn hàng.'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleCancelOrder(id: number) {
    if (!window.confirm('Hủy đơn hàng này?')) return;
    try {
      const updated = await cancelOrder(id);
      setOrder(updated);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Hủy đơn thất bại.');
    }
  }

  if (loading) return <p className="muted">Đang tải…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!order) return <p className="error">Không tìm thấy đơn hàng.</p>;

  function renderOrder(orderId: number) {
    if (!order || order.id !== orderId) return null;
    return (
      <section>
        <div className="row">
          <h1 style={{ marginBottom: 0 }}>Đơn hàng {order.orderCode}</h1>
          <span className="badge badge-status">{ORDER_STATUS_LABEL[order.status]}</span>
        </div>
        <p className="muted">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>

        <div className="card">
          <h3>Thông tin giao hàng</h3>
          <p>
            {order.recipientName} · {order.recipientPhone}
          </p>
          <p>{order.shippingAddress}</p>
        </div>

        <div className="card">
          <h3>Sản phẩm</h3>
          {order.items.map((it) => (
            <div className="line" key={it.id}>
              <span>
                {it.productName} × {it.quantity}
              </span>
              <span>{formatVND(it.lineTotal)}</span>
            </div>
          ))}
          <div className="summary-total">Tổng: {formatVND(order.totalAmount)}</div>
        </div>

        {order.status === 'PENDING' ? (
          <button className="btn btn-danger" onClick={() => handleCancelOrder(order.id)}>
            Hủy đơn
          </button>
        ) : null}
      </section>
    );
  }

  return renderOrder(Number(id));
}

export default function OrderDetailPage() {
  return (
    <RequireAuth>
      <OrderDetailInner />
    </RequireAuth>
  );
}