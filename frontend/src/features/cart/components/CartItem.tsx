'use client';

import type { CartLine } from '@/lib/types/models';
import { formatVND } from '@/lib/format';

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartLine;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}) {
  const max = item.stockQuantity > 0 ? item.stockQuantity : 1;
  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <span className="cart-item-name">{item.name}</span>
        <span className="muted">
          {item.sku} · {formatVND(item.unitPrice)}
        </span>
      </div>
      <div className="cart-item-actions">
        <input
          className="input qty"
          type="number"
          min={1}
          max={max}
          value={item.quantity}
          onChange={(e) => onUpdateQuantity(Number(e.target.value))}
        />
        <span className="cart-item-line">{formatVND(item.unitPrice * item.quantity)}</span>
        <button className="btn btn-ghost" onClick={onRemove}>
          Xóa
        </button>
      </div>
    </div>
  );
}