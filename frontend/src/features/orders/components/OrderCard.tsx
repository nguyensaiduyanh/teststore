'use client';

import type { Order } from '@/lib/types/models';
import { formatVND } from '@/lib/format';
import { ORDER_STATUS_LABEL } from '@/lib/order';

export default function OrderCard({
  order,
  onViewDetails,
  onCancel,
}: {
  order: Order;
  onViewDetails?: () => void;
  onCancel?: () => void;
}) {
  return (
    <div className="card order-card">
      <div className="order-card-head">
        <span className="muted">{order.orderCode}</span>
        <span className="badge badge-status">{ORDER_STATUS_LABEL[order.status]}</span>
      </div>
      <p className="muted">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
      <div className="order-card-total">{formatVND(order.totalAmount)}</div>
      <div className="card-footer">
        {onViewDetails ? (
          <button className="btn btn-outline" onClick={onViewDetails}>
            Xem chi tiết
          </button>
        ) : null}
        {onCancel && order.status === 'PENDING' ? (
          <button className="btn btn-danger" onClick={onCancel}>
            Hủy đơn
          </button>
        ) : null}
      </div>
    </div>
  );
}