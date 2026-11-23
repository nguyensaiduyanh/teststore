'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RequireAuth from '@/components/RequireAuth';
import { getMyOrders, cancelOrder } from '@/features/orders/api/orderApi';
import OrderCard from '@/features/orders/components/OrderCard';
import { ORDER_STATUS_LABEL } from '@/lib/order';
import type { Order, OrderStatus } from '@/lib/types/models';

function OrdersInner() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<OrderStatus | ''>('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let active = true;
    setLoading(true);
    getMyOrders(0, 50, filter || undefined)
      .then((data) => {
        if (active) setOrders(data.items);
      })
      .catch(() => {
        if (active) setOrders([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [filter]);

  const handleFilter = useCallback((status: OrderStatus | '') => {
    setFilter(status);
  }, []);

  const handleViewDetails = useCallback((id: number) => router.push(`/orders/${id}`), [router]);

  const handleCancel = useCallback(async (id: number) => {
    if (!window.confirm('Bạn có chắc muốn hủy đơn này?')) return;
    try {
      await cancelOrder(id);
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'CANCELLED' as OrderStatus } : o)));
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'Hủy đơn thất bại.');
    }
  }, []);

  function renderOrders() {
    if (loading) {
      return <p className="muted">Đang tải…</p>;
    }
    if (orders.length === 0) {
      return <p className="empty">Chưa có đơn hàng nào.</p>;
    }
    return orders.map((order) => (
      <OrderCard
        key={order.id}
        order={order}
        onViewDetails={() => handleViewDetails(order.id)}
        onCancel={() => handleCancel(order.id)}
      />
    ));
  }

  return (
    <section>
      <h1>Đơn hàng của tôi</h1>

      <div className="row">
        <select className="input" value={filter} onChange={(e) => handleFilter(e.target.value as OrderStatus | '')}>
          <option value="">Tất cả trạng thái</option>
          {(Object.keys(ORDER_STATUS_LABEL) as OrderStatus[]).map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABEL[s]}
            </option>
          ))}
        </select>
      </div>

      {renderOrders()}
    </section>
  );
}

export default function OrdersPage() {
  return (
    <RequireAuth>
      <OrdersInner />
    </RequireAuth>
  );
}